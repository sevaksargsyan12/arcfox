"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Locale } from "@/lib/data/types";

interface ModelTranslations {
  /** The model's slug in the currently-viewed locale (so we only apply this
   *  when it still matches the page actually on screen). */
  currentSlug: string;
  translations: { locale: Locale; slug: string }[];
}

interface ModelTranslationsContextValue {
  value: ModelTranslations | null;
  setValue: (value: ModelTranslations | null) => void;
}

const ModelTranslationsContext = createContext<ModelTranslationsContextValue | null>(null);

/**
 * Lets the model detail page (a descendant of Header in the tree) inform the
 * shared header `LanguageSwitcher` (Header's sibling's child, not its own
 * descendant) how to resolve the *other* locale's slug for the model
 * currently on screen -- without hardcoding any slug-naming pattern. Provided
 * once in app/[locale]/layout.tsx around Header + page content together.
 */
export function ModelTranslationsProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<ModelTranslations | null>(null);
  return (
    <ModelTranslationsContext.Provider value={{ value, setValue }}>
      {children}
    </ModelTranslationsContext.Provider>
  );
}

export function useModelTranslations(): ModelTranslations | null {
  const ctx = useContext(ModelTranslationsContext);
  return ctx?.value ?? null;
}

/**
 * Rendered by the model detail page only. Registers this model's
 * translations while mounted, clears them on unmount/navigation-away.
 */
export function ModelTranslationsRegistrar({
  currentSlug,
  translations,
}: ModelTranslations) {
  const ctx = useContext(ModelTranslationsContext);

  useEffect(() => {
    ctx?.setValue({ currentSlug, translations });
    return () => ctx?.setValue(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlug, JSON.stringify(translations)]);

  return null;
}
