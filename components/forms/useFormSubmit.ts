"use client";

import { useState } from "react";
import { useSuccessDialog } from "@/components/ui/SuccessDialog";

/**
 * Shared "submit" behavior for form-UI-only pages (currently just Contact):
 * there is no backend to call yet. This simulates a short delay, then opens
 * the shared success dialog. In Phase 2, the `submit` callback below is the
 * one place a real `fetch`/server action call would go.
 */
export function useFormSubmit() {
  const { open } = useSuccessDialog();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(onDone?: () => void) {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      open();
      onDone?.();
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting };
}
