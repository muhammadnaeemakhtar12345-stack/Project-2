export type ProviderId =
  | "openai"
  | "groq"
  | "gemini"
  | "deepseek"
  | "anthropic"
  | "openrouter";

export interface ProviderModel {
  id: string;
  label: string;
  hint?: string;
}

export interface ProviderConfig {
  id: ProviderId;
  label: string;
  shortLabel: string;
  description: string;
  endpoint: string;
  /** Anthropic uses its own format; everyone else uses OpenAI-compat. */
  format: "openai" | "anthropic";
  /** Loose key pattern just to catch obvious typos. */
  keyPattern: RegExp;
  keyPlaceholder: string;
  keyHelp: string;
  consoleUrl: string;
  models: ProviderModel[];
  /** Whether the user can type a free-form model id. */
  allowCustomModel: boolean;
  defaultModel: string;
  /** Tailwind-friendly accent for cards. */
  accent: "violet" | "fuchsia" | "sky" | "emerald" | "amber" | "rose";
  initials: string;
}

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  openai: {
    id: "openai",
    label: "OpenAI · ChatGPT",
    shortLabel: "OpenAI",
    description: "GPT-4o, GPT-4.1 family.",
    endpoint: "https://api.openai.com/v1/chat/completions",
    format: "openai",
    keyPattern: /^sk-[A-Za-z0-9_-]{20,}$/,
    keyPlaceholder: "sk-...",
    keyHelp: "Create at https://platform.openai.com/api-keys",
    consoleUrl: "https://platform.openai.com/api-keys",
    models: [
      { id: "gpt-4o", label: "GPT-4o", hint: "Recommended · balanced" },
      { id: "gpt-4o-mini", label: "GPT-4o mini", hint: "Faster · cheaper" },
      { id: "gpt-4.1", label: "GPT-4.1" },
      { id: "gpt-4.1-mini", label: "GPT-4.1 mini" },
    ],
    allowCustomModel: true,
    defaultModel: "gpt-4o-mini",
    accent: "emerald",
    initials: "OA",
  },
  groq: {
    id: "groq",
    label: "Groq",
    shortLabel: "Groq",
    description: "Ultra-fast Llama 3.3 / Mixtral inference.",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    format: "openai",
    keyPattern: /^gsk_[A-Za-z0-9]{20,}$/,
    keyPlaceholder: "gsk_...",
    keyHelp: "Create at https://console.groq.com/keys",
    consoleUrl: "https://console.groq.com/keys",
    models: [
      {
        id: "llama-3.3-70b-versatile",
        label: "Llama 3.3 70B",
        hint: "Recommended",
      },
      { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B", hint: "Fastest" },
      { id: "gemma2-9b-it", label: "Gemma 2 9B" },
      { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B" },
    ],
    allowCustomModel: true,
    defaultModel: "llama-3.3-70b-versatile",
    accent: "violet",
    initials: "GQ",
  },
  gemini: {
    id: "gemini",
    label: "Google Gemini",
    shortLabel: "Gemini",
    description: "Gemini 2.0 / 1.5 family.",
    endpoint:
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    format: "openai",
    keyPattern: /^AIza[A-Za-z0-9_-]{30,}$/,
    keyPlaceholder: "AIza...",
    keyHelp: "Create at https://aistudio.google.com/apikey",
    consoleUrl: "https://aistudio.google.com/apikey",
    models: [
      { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash", hint: "Recommended" },
      { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
      { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    ],
    allowCustomModel: true,
    defaultModel: "gemini-2.0-flash",
    accent: "sky",
    initials: "GM",
  },
  deepseek: {
    id: "deepseek",
    label: "DeepSeek",
    shortLabel: "DeepSeek",
    description: "deepseek-chat & deepseek-reasoner.",
    endpoint: "https://api.deepseek.com/chat/completions",
    format: "openai",
    keyPattern: /^sk-[A-Za-z0-9]{20,}$/,
    keyPlaceholder: "sk-...",
    keyHelp: "Create at https://platform.deepseek.com/api_keys",
    consoleUrl: "https://platform.deepseek.com/api_keys",
    models: [
      { id: "deepseek-chat", label: "DeepSeek Chat", hint: "Recommended" },
      { id: "deepseek-reasoner", label: "DeepSeek Reasoner" },
    ],
    allowCustomModel: true,
    defaultModel: "deepseek-chat",
    accent: "fuchsia",
    initials: "DS",
  },
  anthropic: {
    id: "anthropic",
    label: "Anthropic · Claude",
    shortLabel: "Claude",
    description: "Claude Sonnet & Haiku.",
    endpoint: "https://api.anthropic.com/v1/messages",
    format: "anthropic",
    keyPattern: /^sk-ant-[A-Za-z0-9_-]{20,}$/,
    keyPlaceholder: "sk-ant-...",
    keyHelp: "Create at https://console.anthropic.com/settings/keys",
    consoleUrl: "https://console.anthropic.com/settings/keys",
    models: [
      {
        id: "claude-3-5-sonnet-latest",
        label: "Claude 3.5 Sonnet",
        hint: "Recommended",
      },
      { id: "claude-3-5-haiku-latest", label: "Claude 3.5 Haiku", hint: "Fastest" },
      { id: "claude-sonnet-4-5", label: "Claude Sonnet 4.5" },
      { id: "claude-opus-4-1", label: "Claude Opus 4.1" },
    ],
    allowCustomModel: true,
    defaultModel: "claude-3-5-sonnet-latest",
    accent: "amber",
    initials: "AN",
  },
  openrouter: {
    id: "openrouter",
    label: "OpenRouter",
    shortLabel: "OpenRouter",
    description: "Any model on OpenRouter.",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    format: "openai",
    keyPattern: /^sk-or-[A-Za-z0-9_-]{20,}$/,
    keyPlaceholder: "sk-or-...",
    keyHelp: "Create at https://openrouter.ai/keys",
    consoleUrl: "https://openrouter.ai/keys",
    models: [
      { id: "openai/gpt-4o", label: "openai/gpt-4o" },
      { id: "anthropic/claude-3.5-sonnet", label: "anthropic/claude-3.5-sonnet" },
      { id: "google/gemini-2.0-flash-001", label: "google/gemini-2.0-flash-001" },
      { id: "meta-llama/llama-3.3-70b-instruct", label: "meta-llama/llama-3.3-70b-instruct" },
      { id: "deepseek/deepseek-chat", label: "deepseek/deepseek-chat" },
    ],
    allowCustomModel: true,
    defaultModel: "openai/gpt-4o",
    accent: "rose",
    initials: "OR",
  },
};

export const PROVIDER_LIST: ProviderConfig[] = [
  PROVIDERS.openai,
  PROVIDERS.groq,
  PROVIDERS.gemini,
  PROVIDERS.deepseek,
  PROVIDERS.anthropic,
  PROVIDERS.openrouter,
];

export function isProviderId(v: unknown): v is ProviderId {
  return (
    typeof v === "string" &&
    (
      [
        "openai",
        "groq",
        "gemini",
        "deepseek",
        "anthropic",
        "openrouter",
      ] as const
    ).includes(v as ProviderId)
  );
}
