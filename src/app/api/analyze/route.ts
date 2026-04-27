import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, userPrompt } from "@/lib/groqPrompt";
import { normalizeAnalysis, safeJsonParse } from "@/lib/normalize";
import { PROVIDERS, isProviderId, type ProviderConfig } from "@/lib/providers";
import type { AnalyzeRequestBody } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEMPERATURE = 0.25;
const MAX_TOKENS = 2400;
// Cap input chars so a single request stays under provider per-minute token
// limits on free tiers (e.g. Groq 8B free tier is 6000 TPM). ~3.6 chars per
// token gives ~3300 input tokens + 2400 output + ~300 system = ~6000.
const MAX_TEXT_CHARS = 12000;

export async function POST(req: NextRequest) {
  let body: AnalyzeRequestBody;
  try {
    body = (await req.json()) as AnalyzeRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawText = (body?.text ?? "").trim();
  const text =
    rawText.length > MAX_TEXT_CHARS
      ? smartSample(rawText, MAX_TEXT_CHARS)
      : rawText;
  const filename = (body?.filename ?? "document.pdf").trim();
  const voice = body?.voice ?? "academic";

  if (text.length < 200) {
    return NextResponse.json(
      {
        error:
          "Document text is too short to analyze. Please upload a longer paper.",
      },
      { status: 400 },
    );
  }

  const providerHeader = req.headers.get("x-quilix-provider") ?? "";
  if (!isProviderId(providerHeader)) {
    return NextResponse.json(
      {
        error:
          "Please choose an AI provider in the key drawer before analyzing.",
      },
      { status: 400 },
    );
  }
  const provider = PROVIDERS[providerHeader];

  const model = (req.headers.get("x-quilix-model") ?? provider.defaultModel)
    .trim();
  if (!model) {
    return NextResponse.json(
      { error: "Please choose a model before analyzing." },
      { status: 400 },
    );
  }

  const auth = req.headers.get("x-quilix-key") ?? req.headers.get("authorization");
  const key = auth?.startsWith("Bearer ")
    ? auth.slice(7).trim()
    : (auth ?? "").trim();

  if (!key) {
    return NextResponse.json(
      {
        error:
          "Missing API key. Open the key drawer and paste a valid key for the selected provider.",
      },
      { status: 401 },
    );
  }

  let upstream: Response;
  try {
    upstream =
      provider.format === "anthropic"
        ? await callAnthropic(provider, key, model, text, voice)
        : await callOpenAICompatible(provider, key, model, text, voice);
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "Network error reaching the analysis service. Please try again.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    let detail = "";
    try {
      const e = (await upstream.json()) as {
        error?: { message?: string } | string;
      };
      detail =
        typeof e?.error === "string"
          ? e.error
          : (e?.error?.message ?? JSON.stringify(e));
    } catch {
      detail = await upstream.text().catch(() => "");
    }
    if (upstream.status === 401 || upstream.status === 403) {
      return NextResponse.json(
        {
          error:
            "Your API key was rejected by the provider. Please replace it and try again.",
          detail,
        },
        { status: 401 },
      );
    }
    if (upstream.status === 404) {
      return NextResponse.json(
        {
          error:
            "The selected model was not found for this provider. Pick a different model.",
          detail,
        },
        { status: 404 },
      );
    }
    if (upstream.status === 429) {
      return NextResponse.json(
        {
          error: "Rate limit reached. Please wait a moment and try again.",
          detail,
        },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: "The analysis service returned an error.", detail },
      { status: 502 },
    );
  }

  const content = await readUpstreamContent(provider, upstream);

  const parsed = safeJsonParse(content);
  if (!parsed || typeof parsed !== "object") {
    return NextResponse.json(
      { error: "The analysis response could not be parsed. Please retry." },
      { status: 502 },
    );
  }

  const result = normalizeAnalysis(parsed);
  return NextResponse.json({ result, filename });
}

async function callOpenAICompatible(
  provider: ProviderConfig,
  key: string,
  model: string,
  text: string,
  voice: string,
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  };
  if (provider.id === "openrouter") {
    headers["HTTP-Referer"] = "https://quilix.app";
    headers["X-Title"] = "Quilix";
  }
  return fetch(provider.endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt(text, voice) },
      ],
    }),
  });
}

async function callAnthropic(
  provider: ProviderConfig,
  key: string,
  model: string,
  text: string,
  voice: string,
): Promise<Response> {
  return fetch(provider.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      system: `${SYSTEM_PROMPT}\n\nReturn ONLY valid JSON. No prose, no markdown fences.`,
      messages: [{ role: "user", content: userPrompt(text, voice) }],
    }),
  });
}

function smartSample(text: string, max: number): string {
  if (text.length <= max) return text;
  // Take 60% from the start (abstract / intro / methods) and 40% from the end
  // (results / conclusion / references) to preserve scholarly structure.
  const headLen = Math.floor(max * 0.6);
  const tailLen = max - headLen - 32;
  const head = text.slice(0, headLen);
  const tail = text.slice(text.length - tailLen);
  return `${head}\n\n[…content trimmed…]\n\n${tail}`;
}

async function readUpstreamContent(
  provider: ProviderConfig,
  upstream: Response,
): Promise<string> {
  if (provider.format === "anthropic") {
    const data = (await upstream.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };
    return (
      data?.content
        ?.filter((b) => b?.type === "text")
        .map((b) => b?.text ?? "")
        .join("") ?? ""
    );
  }
  const data = (await upstream.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data?.choices?.[0]?.message?.content ?? "";
}
