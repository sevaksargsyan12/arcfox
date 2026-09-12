"use client";

import { useId } from "react";
import { UploadCloud } from "lucide-react";

interface FileUploadFieldProps {
  label: string;
  hint?: string;
  chooseLabel: string;
  emptyLabel: string;
  error?: string;
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
}

/**
 * Resume/CV upload -- UI only. Accepts a file and shows its name; there is
 * no upload endpoint in Phase 1 (per brief, all three forms are form-UI
 * only, no backend submission).
 */
export function FileUploadField({
  label,
  hint,
  chooseLabel,
  emptyLabel,
  error,
  file,
  onChange,
  accept = ".pdf,.doc,.docx",
}: FileUploadFieldProps) {
  const id = useId();

  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-lg bg-form-bg p-3">
        <label
          htmlFor={id}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-charcoal-500/30 bg-white px-4 py-2 text-sm font-medium hover:border-brand-blue"
        >
          <UploadCloud size={16} />
          {chooseLabel}
        </label>
        <input
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        <span className="truncate text-sm text-charcoal-600">{file ? file.name : emptyLabel}</span>
      </div>
      {hint && <p className="mt-1 text-xs text-charcoal-500">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
