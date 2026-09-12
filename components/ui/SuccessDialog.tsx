"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, X } from "lucide-react";

interface DialogOptions {
  title?: string;
  body?: string;
}

interface SuccessDialogContextValue {
  open: (options?: DialogOptions) => void;
}

const SuccessDialogContext = createContext<SuccessDialogContextValue | null>(null);

/**
 * Shared success/confirmation modal, mirroring the reference's reusable
 * `components/successDialog/index.vue`. Any form calls `useSuccessDialog()`
 * to show it without prop-drilling -- and it's the one obvious place a
 * Phase 2 implementation would add real submit/error handling.
 */
export function SuccessDialogProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("successDialog");
  const tCommon = useTranslations("common");
  const [options, setOptions] = useState<DialogOptions | null>(null);

  const open = useCallback((opts?: DialogOptions) => setOptions(opts ?? {}), []);
  const close = useCallback(() => setOptions(null), []);

  return (
    <SuccessDialogContext.Provider value={{ open }}>
      {children}
      {options && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={close}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 text-charcoal-500 hover:text-ink"
            >
              <X size={20} />
            </button>
            <CheckCircle2 className="mx-auto mb-4 text-brand-blue" size={48} />
            <h2 className="font-display text-xl font-semibold">{options.title ?? t("title")}</h2>
            <p className="mt-2 text-sm text-charcoal-600">{options.body ?? t("body")}</p>
            <button type="button" onClick={close} className="btn mt-6 w-full justify-center">
              {tCommon("buttons.close")}
            </button>
          </div>
        </div>
      )}
    </SuccessDialogContext.Provider>
  );
}

export function useSuccessDialog(): SuccessDialogContextValue {
  const ctx = useContext(SuccessDialogContext);
  if (!ctx) {
    throw new Error("useSuccessDialog must be used within SuccessDialogProvider");
  }
  return ctx;
}
