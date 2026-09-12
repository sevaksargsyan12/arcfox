import { ModelSpecs } from "@/lib/data/models";

interface SpecsGridProps {
  specs: ModelSpecs;
  title: string;
  labels: { length: string; width: string; height: string; wheelbase: string };
}

export function SpecsGrid({ specs, title, labels }: SpecsGridProps) {
  const rows = [
    { label: labels.length, value: specs.lengthMm },
    { label: labels.width, value: specs.widthMm },
    { label: labels.height, value: specs.heightMm },
    { label: labels.wheelbase, value: specs.wheelbaseMm },
  ];

  return (
    <div id="specs" className="scroll-mt-24">
      <h2 className="text-center font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
        {rows.map((row) => (
          <div key={row.label} className="rounded-xl bg-form-bg p-6 text-center">
            <p className="font-display text-2xl font-bold text-brand-blue">
              {row.value.toLocaleString()}
              <span className="ml-1 text-sm font-normal text-charcoal-500">mm</span>
            </p>
            <p className="mt-1 text-sm text-charcoal-600">{row.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
