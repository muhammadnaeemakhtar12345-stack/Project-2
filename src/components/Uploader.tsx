"use client";

import {
  AlertCircle,
  CheckCircle2,
  Cpu,
  FileText,
  Hourglass,
  KeyRound,
  Lock,
  Loader2,
  RotateCcw,
  Sparkles,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { extractPdfText, type ExtractedPdf } from "@/lib/extractPdf";
import { PROVIDERS, isProviderId, type ProviderId } from "@/lib/providers";
import type { AnalysisResult } from "@/lib/types";
import { ApiKeyDialog, type ProviderSelection } from "./ApiKeyDialog";
import { Results } from "./Results";

type Stage =
  | { kind: "idle" }
  | { kind: "extracting"; filename: string }
  | { kind: "extracted"; data: ExtractedPdf }
  | { kind: "analyzing"; data: ExtractedPdf }
  | { kind: "done"; data: ExtractedPdf; result: AnalysisResult }
  | {
      kind: "error";
      message: string;
      data?: ExtractedPdf;
      detail?: string;
      provider?: string;
      status?: number;
      retryAt?: number; // epoch ms when the rate-limit window should be clear
    };

const PROVIDER_STORAGE = "quilix.provider.v1";
const MODEL_STORAGE = "quilix.model.v1";
const KEY_STORAGE = "quilix.apikey.v1";
const VOICE_STORAGE = "quilix.voice.v1";

export function Uploader() {
  const reduced = useReducedMotion();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [drag, setDrag] = useState(false);
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const { isLoaded: authLoaded, isSignedIn } = useAuth();

  const [providerId, setProviderId] = useState<ProviderId>("groq");
  const [model, setModel] = useState<string>(PROVIDERS.groq.defaultModel);
  const [apiKey, setApiKey] = useState("");
  const [voice, setVoice] = useState<"academic" | "concise" | "neutral">(
    "academic",
  );
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    try {
      const storedProvider = localStorage.getItem(PROVIDER_STORAGE);
      const storedModel = localStorage.getItem(MODEL_STORAGE);
      const storedKey = localStorage.getItem(KEY_STORAGE) ?? "";
      const storedVoice = (localStorage.getItem(VOICE_STORAGE) ??
        "academic") as typeof voice;

      if (isProviderId(storedProvider)) {
        setProviderId(storedProvider);
        setModel(storedModel ?? PROVIDERS[storedProvider].defaultModel);
      } else if (storedModel) {
        setModel(storedModel);
      }
      if (storedKey) setApiKey(storedKey);
      if (
        storedVoice === "academic" ||
        storedVoice === "concise" ||
        storedVoice === "neutral"
      ) {
        setVoice(storedVoice);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function persistProviderSelection(sel: ProviderSelection) {
    setProviderId(sel.providerId);
    setModel(sel.model);
    setApiKey(sel.apiKey);
    try {
      localStorage.setItem(PROVIDER_STORAGE, sel.providerId);
      localStorage.setItem(MODEL_STORAGE, sel.model);
      localStorage.setItem(KEY_STORAGE, sel.apiKey);
    } catch {
      /* ignore */
    }
  }

  function persistVoice(v: typeof voice) {
    setVoice(v);
    try {
      localStorage.setItem(VOICE_STORAGE, v);
    } catch {
      /* ignore */
    }
  }

  async function handleFile(file: File) {
    if (!file) return;
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setStage({ kind: "error", message: "Only PDF files are supported." });
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setStage({
        kind: "error",
        message: "PDF is over 25 MB. Please trim it down before upload.",
      });
      return;
    }
    setStage({ kind: "extracting", filename: file.name });
    try {
      const data = await extractPdfText(file);
      if (data.text.trim().length < 200) {
        setStage({
          kind: "error",
          message:
            "Couldn't read enough text from this PDF. It may be a scanned image — try an OCR'd version.",
        });
        return;
      }
      setStage({ kind: "extracted", data });
    } catch (err) {
      setStage({
        kind: "error",
        message:
          err instanceof Error
            ? `Could not parse this PDF: ${err.message}`
            : "Could not parse this PDF.",
      });
    }
  }

  async function runAnalysis(data: ExtractedPdf) {
    if (!apiKey) {
      setShowKey(true);
      return;
    }
    setStage({ kind: "analyzing", data });
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-quilix-provider": providerId,
          "x-quilix-model": model,
          "x-quilix-key": apiKey,
        },
        body: JSON.stringify({
          text: data.text,
          filename: data.filename,
          voice,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        result?: AnalysisResult;
        error?: string;
        detail?: string;
        provider?: string;
        retryAfterMs?: number;
      };
      if (!res.ok) {
        setStage({
          kind: "error",
          data,
          message: payload.error ?? "Analysis failed. Please try again.",
          detail: payload.detail,
          provider: payload.provider,
          status: res.status,
          retryAt:
            res.status === 429
              ? Date.now() + (payload.retryAfterMs ?? 60_000)
              : undefined,
        });
        return;
      }
      if (!payload.result) {
        setStage({
          kind: "error",
          data,
          message: "Empty analysis response. Please retry.",
        });
        return;
      }
      setStage({ kind: "done", data, result: payload.result });
    } catch (err) {
      setStage({
        kind: "error",
        data,
        message:
          err instanceof Error
            ? `Network error: ${err.message}`
            : "Network error. Please try again.",
      });
    }
  }

  function reset() {
    setStage({ kind: "idle" });
    if (fileRef.current) fileRef.current.value = "";
  }

  const provider = PROVIDERS[providerId];
  const hasKey = apiKey.length > 0;
  const summaryLabel = hasKey
    ? `${provider.shortLabel} · ${model}`
    : "Connect AI provider";

  return (
    <section id="analyze" className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
      <div className="max-w-2xl">
        <div className="ornament mb-12">
          <span className="ornament__diamond" />
        </div>
        <div className="cap-pill">The reading desk</div>
        <h2 className="headline-serif mt-6 text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.04] text-[var(--ink)]">
          Upload, paraphrase, cite — in one <em>calm</em> sitting.
        </h2>
        <p className="mt-5 text-[var(--text-soft)] leading-[1.7] max-w-xl">
          Drop a research PDF, pick a rewrite tone, connect any AI provider
          with your own key, and Quilix returns a section-by-section synthesis
          with paraphrases and ready-to-paste citations.
        </p>
      </div>

      {authLoaded && !isSignedIn && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 card card-lift relative overflow-hidden p-8 sm:p-10"
        >
          <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[color-mix(in_oklab,var(--violet)_18%,transparent)] blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row gap-6 sm:items-center">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--violet)_14%,var(--surface))] text-[var(--violet)]">
              <Lock className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[0.62rem] tracking-[0.22em] uppercase text-[var(--text-muted)] font-medium">
                Member workspace
              </div>
              <h3 className="mt-1.5 font-serif text-[1.6rem] leading-tight tracking-tight text-[var(--ink)]">
                Sign in to analyse a paper
              </h3>
              <p className="mt-2 text-sm text-[var(--text-soft)] leading-relaxed max-w-xl">
                Quilix keeps each analysis tied to your account so you can come
                back to your reports. Create a free account or sign in — it
                takes a few seconds, and you can use any AI provider key after
                that.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <SignInButton mode="modal">
                <button className="btn-ghost text-sm">Sign in</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-primary text-sm">Create account</button>
              </SignUpButton>
            </div>
          </div>
        </motion.div>
      )}

      {authLoaded && isSignedIn && (
        <>

      {/* Toolbar */}
      <div className="mt-8 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[0.62rem] tracking-[0.22em] uppercase text-[var(--text-muted)] font-medium">
            Rewrite tone
          </span>
          <div className="card flex items-center divide-x divide-[var(--border)] overflow-hidden text-sm">
            {(
              [
                {
                  id: "academic",
                  label: "Academic",
                  hint: "Formal, scholarly phrasing",
                },
                {
                  id: "concise",
                  label: "Concise",
                  hint: "Short, direct sentences",
                },
                {
                  id: "neutral",
                  label: "Neutral",
                  hint: "Plain, balanced prose",
                },
              ] as const
            ).map((v) => (
              <button
                key={v.id}
                onClick={() => persistVoice(v.id)}
                title={v.hint}
                className={`px-3.5 py-2 transition-colors ${
                  voice === v.id
                    ? "bg-[color-mix(in_oklab,var(--violet)_14%,var(--surface))] text-[var(--violet)] font-semibold"
                    : "hover:bg-[var(--surface-soft)] text-[var(--text-soft)]"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setShowKey(true)}
          className="btn-ghost text-sm group"
          aria-label="Manage AI provider and key"
          title="Choose AI provider, model, and key"
        >
          {hasKey ? (
            <Cpu className="h-4 w-4" />
          ) : (
            <KeyRound className="h-4 w-4" />
          )}
          <span className="font-medium">{summaryLabel}</span>
          {hasKey && (
            <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--emerald)]" />
          )}
        </button>
      </div>

      {/* Dropzone or status */}
      {stage.kind === "idle" || stage.kind === "error" ? (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`mt-6 dropzone ${drag ? "dropzone--active" : ""} p-8 sm:p-12 text-center`}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
        >
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--violet)_14%,var(--surface))] text-[var(--violet)]">
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-xl font-semibold tracking-tight">
            Drop a PDF, or click to browse
          </h3>
          <p className="mt-1.5 text-sm text-[var(--text-muted)]">
            Up to 25&nbsp;MB. Text is extracted in your browser before any
            analysis.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => fileRef.current?.click()}
              className="btn-primary text-sm"
            >
              <Upload className="h-4 w-4" />
              Choose PDF
            </button>
            <span className="text-xs text-[var(--text-muted)]">
              or drag &amp; drop here
            </span>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          {stage.kind === "error" && (
            <ErrorCard
              message={stage.message}
              detail={stage.detail}
              provider={stage.provider}
              status={stage.status}
              retryAt={stage.retryAt}
              currentProvider={providerId}
              canRetry={Boolean(stage.data)}
              onSwitchProvider={(id) => {
                const next = PROVIDERS[id];
                setProviderId(id);
                setModel(next.defaultModel);
                setApiKey("");
              }}
              onRetry={() => stage.data && runAnalysis(stage.data)}
              onPickAnother={() => fileRef.current?.click()}
            />
          )}
        </motion.div>
      ) : null}

      {/* Extraction running */}
      {stage.kind === "extracting" && (
        <StatusCard
          icon={<Loader2 className="h-5 w-5 animate-spin" />}
          title="Reading your PDF"
          body={`Parsing "${stage.filename}" locally — no upload to any server yet.`}
        />
      )}

      {/* Extracted, ready to analyse */}
      {stage.kind === "extracted" && (
        <ExtractedCard
          data={stage.data}
          onAnalyze={() => runAnalysis(stage.data)}
          onReset={reset}
          hasKey={hasKey}
          providerLabel={provider.shortLabel}
          model={model}
        />
      )}

      {/* Analyzing */}
      {stage.kind === "analyzing" && (
        <StatusCard
          icon={<Hourglass className="h-5 w-5" />}
          title="Synthesising and rewriting"
          body={`Analyzing "${stage.data.filename}" — section detection, paraphrase, and citation extraction usually take 10–30 seconds.`}
        />
      )}

      {/* Done */}
      {stage.kind === "done" && (
        <Results data={stage.data} result={stage.result} onReset={reset} />
      )}

        </>
      )}

      <ApiKeyDialog
        open={showKey}
        onClose={() => setShowKey(false)}
        onSave={persistProviderSelection}
        initial={{ providerId, model, apiKey }}
      />
    </section>
  );
}

function StatusCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="mt-6 card p-6 flex items-start gap-4">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--violet)_14%,var(--surface))] text-[var(--violet)]">
        {icon}
      </div>
      <div>
        <div className="font-semibold tracking-tight">{title}</div>
        <p className="text-sm text-[var(--text-soft)] mt-1 leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  );
}

function ExtractedCard({
  data,
  onAnalyze,
  onReset,
  hasKey,
  providerLabel,
  model,
}: {
  data: ExtractedPdf;
  onAnalyze: () => void;
  onReset: () => void;
  hasKey: boolean;
  providerLabel: string;
  model: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6 card card-lift p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--emerald)_14%,var(--surface))] text-[var(--emerald)]">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[var(--text)] font-semibold tracking-tight">
            <FileText className="h-4 w-4 text-[var(--violet)] shrink-0" />
            <span className="truncate">{data.filename}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
            <span>
              <strong className="text-[var(--text-soft)]">{data.pages}</strong>{" "}
              pages
            </span>
            <span>
              <strong className="text-[var(--text-soft)]">
                {data.text.length.toLocaleString()}
              </strong>{" "}
              characters extracted
            </span>
            {data.truncated && (
              <span className="badge badge-amber">Trimmed for analysis</span>
            )}
            {hasKey && (
              <span className="inline-flex items-center gap-1.5 text-[var(--text-soft)]">
                <Cpu className="h-3 w-3" />
                {providerLabel} · {model}
              </span>
            )}
            {data.meta.title && (
              <span className="truncate max-w-[24ch]">
                Title: {data.meta.title}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={onReset} className="btn-ghost text-sm">
            <RotateCcw className="h-4 w-4" />
            Replace
          </button>
          <button onClick={onAnalyze} className="btn-primary text-sm">
            {hasKey ? (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze paper
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                Connect provider &amp; analyze
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ErrorCard({
  message,
  detail,
  provider,
  status,
  retryAt,
  currentProvider,
  canRetry,
  onSwitchProvider,
  onRetry,
  onPickAnother,
}: {
  message: string;
  detail?: string;
  provider?: string;
  status?: number;
  retryAt?: number;
  currentProvider: ProviderId;
  canRetry: boolean;
  onSwitchProvider: (id: ProviderId) => void;
  onRetry: () => void;
  onPickAnother: () => void;
}) {
  const isRateLimit = status === 429 || /rate limit/i.test(message);
  // Lazy initializer keeps state impurity inside the React-permitted slot
  // and avoids the one-frame "resets in 1.7 billion seconds" flash that a
  // plain `useState(0)` would cause when retryAt is already set.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!retryAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [retryAt]);
  const secondsLeft = retryAt ? Math.max(0, Math.ceil((retryAt - now) / 1000)) : 0;
  const ready = !retryAt || secondsLeft === 0;

  // Suggest the most generous free tier the user is NOT already on.
  const suggestion: { id: ProviderId; label: string; why: string } | null =
    isRateLimit && currentProvider !== "gemini"
      ? {
          id: "gemini",
          label: "Gemini 2.0 Flash",
          why: "1 M tokens/min free · 15 req/min · most generous tier.",
        }
      : isRateLimit && currentProvider === "gemini"
      ? {
          id: "openrouter",
          label: "OpenRouter free pool",
          why: "Llama 3.3 70B & DeepSeek free models routed through one key.",
        }
      : null;

  return (
    <div className="mt-6 mx-auto max-w-2xl text-left rounded-2xl border border-[var(--rose)]/40 bg-[color-mix(in_oklab,var(--rose)_6%,var(--surface))] px-5 py-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-[var(--rose)] mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold tracking-tight text-[var(--ink)]">
            {isRateLimit ? "Rate limit reached" : "Something went wrong"}
          </div>
          <div className="mt-1 text-sm text-[var(--text-soft)] leading-relaxed">
            {message}
          </div>
          {provider && (
            <div className="mt-2 text-[0.7rem] tracking-[0.18em] uppercase text-[var(--text-muted)]">
              Reported by {provider}
              {status ? ` · HTTP ${status}` : ""}
            </div>
          )}
          {detail && (
            <details className="mt-2 text-xs text-[var(--text-muted)]">
              <summary className="cursor-pointer select-none">
                Provider response
              </summary>
              <div className="mt-1.5 rounded-md bg-[var(--surface-soft)] border border-[var(--border)] px-2.5 py-1.5 font-mono whitespace-pre-wrap break-words">
                {detail}
              </div>
            </details>
          )}
          {retryAt && !ready && (
            <div className="mt-3 text-xs text-[var(--text-muted)]">
              Window resets in <strong className="text-[var(--text-soft)]">{secondsLeft}s</strong>. You can retry now or wait for the counter.
            </div>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {canRetry ? (
              <button onClick={onRetry} className="btn-primary text-sm">
                <RotateCcw className="h-3.5 w-3.5" />
                Retry now
              </button>
            ) : (
              <button onClick={onPickAnother} className="btn-primary text-sm">
                <Upload className="h-3.5 w-3.5" />
                Choose another PDF
              </button>
            )}
            {suggestion && canRetry && (
              <button
                onClick={() => onSwitchProvider(suggestion.id)}
                className="btn-ghost text-sm"
                title={suggestion.why}
              >
                Switch to {suggestion.label}
              </button>
            )}
          </div>
          {suggestion && (
            <div className="mt-2 text-[0.7rem] text-[var(--text-muted)]">
              Tip · {suggestion.why}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
