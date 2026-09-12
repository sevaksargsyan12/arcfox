"use client";

import { useRef } from "react";
import { SelectOption } from "@/lib/data/types";

interface JobFilterFormProps {
  categories: SelectOption[];
  areas: SelectOption[];
  categoryValue?: string;
  areaValue?: string;
  categoryAllLabel: string;
  areaAllLabel: string;
}

/**
 * Plain GET form -- works without JavaScript (native browser navigation on
 * submit) and auto-submits on change for a nicer experience when JS is
 * available.
 */
export function JobFilterForm({
  categories,
  areas,
  categoryValue,
  areaValue,
  categoryAllLabel,
  areaAllLabel,
}: JobFilterFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} method="get" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <select
        name="category"
        defaultValue={categoryValue ?? ""}
        onChange={() => formRef.current?.requestSubmit()}
        className="field-input"
      >
        <option value="">{categoryAllLabel}</option>
        {categories.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <select
        name="area"
        defaultValue={areaValue ?? ""}
        onChange={() => formRef.current?.requestSubmit()}
        className="field-input"
      >
        <option value="">{areaAllLabel}</option>
        {areas.map((a) => (
          <option key={a.value} value={a.value}>
            {a.label}
          </option>
        ))}
      </select>
    </form>
  );
}
