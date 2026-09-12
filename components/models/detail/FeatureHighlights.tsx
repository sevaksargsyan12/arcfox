import {
  Battery,
  Boxes,
  Gauge,
  ShieldCheck,
  Sparkles,
  VolumeX,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { FeatureIconKey, ModelFeatureHighlight } from "@/lib/data/models";

const ICONS: Record<FeatureIconKey, LucideIcon> = {
  battery: Battery,
  zap: Zap,
  "shield-check": ShieldCheck,
  wind: Wind,
  "volume-x": VolumeX,
  boxes: Boxes,
  gauge: Gauge,
  sparkles: Sparkles,
};

export function FeatureHighlights({
  features,
  title,
}: {
  features: ModelFeatureHighlight[];
  title: string;
}) {
  return (
    <div>
      <h2 className="text-center font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = ICONS[feature.icon];
          return (
            <div key={feature.title} className="rounded-2xl bg-form-bg p-6">
              <Icon className="text-brand-blue" size={28} />
              <h3 className="mt-3 font-display text-lg font-semibold">{feature.title}</h3>
              <p className="mt-1 text-sm text-charcoal-600">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
