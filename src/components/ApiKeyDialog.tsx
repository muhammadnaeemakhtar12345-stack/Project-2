"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  Link as LinkIcon,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  PROVIDERS,
  PROVIDER_LIST,
  type ProviderConfig,
  type ProviderId,
} from "@/lib/providers";

export interface ProviderSelection {
  providerId: ProviderId;
  model: string;
  apiKey: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (selection: ProviderSelection) => void;
  initial?: ProviderSelection;
}

const accentMap: Record<ProviderConfig["accent"], string> = {
  violet: "var(--violet)",
  fuchsia: "var(--fuchsia)",
  sky: "var(--sky)",
  emerald: "var(--emerald)",
  amber: "var(--amber)",
  rose: "var(--rose)",
};

export function ApiKeyDialog({ open, onClose, onSave, initial }: Props) {
  const reduced = useReducedMotion();

  const [providerId, setProviderId] = useState<ProviderId>(
    initial?.providerId ?? "groq",
  );
  const provider = PROVIDERS[providerId];

  const [model, setModel] = useState<string>(
    initial?.model ?? PROVIDERS[initial?.providerId ?? "groq"].defaultModel,
  );
  const [customModel, setCustomModel] = useState<string>("");
  const [useCustom, setUseCustom] = useState(false);
  const [apiKey, setApiKey] = useState<string>(initial?.apiKey ?? "");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);

  // Reset internal state whenever the drawer is opened.
  useEffect(() => {
    if (!open) return;
    const p = initial?.providerId ?? "groq";
    setProviderId(p);
    const initialModel = initial?.model ?? PROVIDERS[p].defaultModel;
    const isInList = PROVIDERS[p].models.some((m) => m.id === initialModel);
    if (isInList) {
      setModel(initialModel);
      setCustomModel("");
      setUseCustom(false);
    } else {
      setModel(initialModel);
      setCustomModel(initialModel);
      setUseCustom(true);
    }
    setApiKey(initial?.apiKey ?? "");
    setShow(false);
    setTouched(false);
  }, [open, initial]);

  // Keep model in valid state when provider changes mid-flow.
  function selectProvider(id: ProviderId) {
    setProviderId(id);
    setModel(PROVIDERS[id].defaultModel);
    setCustomModel("");
    setUseCustom(false);
    setTouched(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const finalModel = useCustom ? customModel.trim() : model;
  const keyValid = useMemo(
    () => provider.keyPattern.test(apiKey.trim()),
    [provider, apiKey],
  );
  const modelValid = finalModel.length > 0;
  const formValid = keyValid && modelValid;

  const showKeyError = touched && apiKey.length > 0 && !keyValid;

  function save() {
    if (!formValid) {
      setTouched(true);
      return;
    }
    onSave({ providerId, model: finalModel, apiKey: apiKey.trim() });
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Connect AI provider"
            className="fixed inset-0 z-50 grid place-items-center px-4 py-6 overflow-y-auto"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="card w-full max-w-3xl p-6 sm:p-7 relative shadow-2xl">
              <button
                aria-label="Close"
                onClick={onClose}
                className="absolute top-3.5 right-3.5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header */}
              <div className="flex items-start gap-3 mb-5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--violet)_18%,var(--surface))] text-[var(--violet)]">
                  <KeyRound className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                    Connect an AI provider
                  </h2>
                  <p className="text-sm text-[var(--text-muted)] mt-0.5">
                    Pick a provider, choose a model, and paste your key. Used
                    only in your browser session.
                  </p>
                </div>
              </div>

              {/* Step 1 — provider grid */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="step-pill">1</span>
                  <span className="text-xs font-semibold tracking-wide uppercase text-[var(--text-soft)]">
                    Choose a provider
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PROVIDER_LIST.map((p) => {
                    const active = p.id === providerId;
                    const accent = accentMap[p.accent];
                    return (
                      <button
                        key={p.id}
                        onClick={() => selectProvider(p.id)}
                        className={`group relative flex items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-all ${
                          active
                            ? "border-[color-mix(in_oklab,var(--violet)_55%,var(--border))] bg-[color-mix(in_oklab,var(--violet)_10%,var(--surface))] shadow-sm"
                            : "border-[var(--border)] bg-[var(--surface)] hover:border-[color-mix(in_oklab,var(--violet)_30%,var(--border))] hover:bg-[var(--surface-soft)]"
                        }`}
                        aria-pressed={active}
                      >
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold tracking-wide"
                          style={{
                            background: `color-mix(in oklab, ${accent} 16%, var(--surface))`,
                            color: accent,
                          }}
                        >
                          {p.initials}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-[var(--text)] truncate">
                            {p.label}
                          </span>
                          <span className="block text-[11.5px] text-[var(--text-muted)] mt-0.5 line-clamp-2">
                            {p.description}
                          </span>
                        </span>
                        {active && (
                          <CheckCircle2
                            className="h-4 w-4 shrink-0"
                            style={{ color: accent }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 — model */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="step-pill">2</span>
                    <span className="text-xs font-semibold tracking-wide uppercase text-[var(--text-soft)]">
                      Pick a model
                    </span>
                  </div>
                  {provider.allowCustomModel && (
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustom((v) => {
                          const next = !v;
                          if (next && !customModel) setCustomModel(model);
                          return next;
                        });
                      }}
                      className="text-[11.5px] text-[var(--text-muted)] hover:text-[var(--violet)] transition-colors"
                    >
                      {useCustom ? "Use preset model" : "Use custom model id"}
                    </button>
                  )}
                </div>

                {!useCustom ? (
                  <div className="relative">
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 pr-10 text-sm font-medium outline-none transition-colors focus:border-[color-mix(in_oklab,var(--violet)_60%,var(--border))]"
                    >
                      {provider.models.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                          {m.hint ? ` — ${m.hint}` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder={`e.g. ${provider.defaultModel}`}
                    spellCheck={false}
                    autoComplete="off"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-mono outline-none transition-colors focus:border-[color-mix(in_oklab,var(--violet)_60%,var(--border))]"
                  />
                )}
                <p className="mt-1.5 text-[11.5px] text-[var(--text-muted)]">
                  {provider.shortLabel} streams structured analysis back to
                  Quilix in JSON mode.
                </p>
              </div>

              {/* Step 3 — api key */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="step-pill">3</span>
                    <span className="text-xs font-semibold tracking-wide uppercase text-[var(--text-soft)]">
                      Paste your API key
                    </span>
                  </div>
                  <a
                    href={provider.consoleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11.5px] text-[var(--text-muted)] hover:text-[var(--violet)] transition-colors"
                  >
                    <LinkIcon className="h-3 w-3" />
                    Open key console
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder={provider.keyPlaceholder}
                    spellCheck={false}
                    autoComplete="off"
                    className={`w-full rounded-lg border bg-[var(--surface)] px-3.5 py-2.5 text-sm font-mono outline-none transition-colors pr-11 ${
                      showKeyError
                        ? "border-[var(--rose)]"
                        : "border-[var(--border)] focus:border-[color-mix(in_oklab,var(--violet)_60%,var(--border))]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide key" : "Show key"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] p-1.5"
                  >
                    {show ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {showKeyError && (
                  <p className="text-xs text-[var(--rose)] mt-1.5">
                    This doesn&apos;t look like a valid {provider.shortLabel}{" "}
                    key. Expected format:{" "}
                    <code className="font-mono">{provider.keyPlaceholder}</code>
                  </p>
                )}
                <p className="mt-1.5 text-[11.5px] text-[var(--text-muted)]">
                  {provider.keyHelp}
                </p>
              </div>

              {/* Privacy note */}
              <div className="mb-5 rounded-lg bg-[var(--surface-soft)] border border-[var(--border)] p-3.5 text-xs text-[var(--text-soft)] flex gap-3">
                <ShieldCheck className="h-4 w-4 mt-0.5 text-[var(--emerald)] shrink-0" />
                <div className="space-y-1">
                  <div className="font-medium text-[var(--text)]">
                    Your key never leaves the request flow.
                  </div>
                  <div>
                    Stored in your browser only. Forwarded over HTTPS to the
                    selected provider for the current document. Never logged,
                    never persisted server-side.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button onClick={onClose} className="btn-ghost text-sm">
                  Cancel
                </button>
                <button
                  className="btn-primary text-sm"
                  disabled={!formValid}
                  onClick={save}
                >
                  <Sparkles className="h-4 w-4" />
                  Save &amp; continue
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
