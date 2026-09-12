"use client";

import { useState } from "react";
import { ModelColor } from "@/lib/data/models";
import { SpinViewer } from "./SpinViewer/SpinViewer";

interface ColorPickerProps {
  colors: ModelColor[];
  modelName: string;
  colorsTitle: string;
  spinHint: string;
}

export function ColorPicker({ colors, modelName, colorsTitle, spinHint }: ColorPickerProps) {
  const [selectedKey, setSelectedKey] = useState(colors[0].key);
  const selected = colors.find((c) => c.key === selectedKey) ?? colors[0];

  return (
    <div>
      <SpinViewer frames={selected.spinFrames} alt={`${modelName} - ${selected.label}`} hint={spinHint} />

      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-sm font-medium text-charcoal-600">{colorsTitle}</p>
        <div className="flex items-center gap-3">
          {colors.map((color) => (
            <button
              key={color.key}
              type="button"
              aria-label={color.label}
              aria-pressed={color.key === selectedKey}
              onClick={() => setSelectedKey(color.key)}
              className={`h-9 w-9 rounded-full border-2 transition-transform ${
                color.key === selectedKey ? "scale-110 border-brand-blue" : "border-transparent"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
        <p className="text-sm text-charcoal-500">{selected.label}</p>
      </div>
    </div>
  );
}
