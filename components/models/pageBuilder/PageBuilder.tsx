import { PageBuilderSection } from "@/lib/data/models";
import { Hero } from "./Hero";
import { ColorsSpecs } from "./ColorsSpecs";
import { Video } from "./Video";
import { Exterior } from "./Exterior";
import { AppearanceSlider } from "./AppearanceSlider";
import { Interior } from "./Interior";
import { AdditionalCharacteristics } from "./AdditionalCharacteristics";
import { AdditionalCharacteristics2 } from "./AdditionalCharacteristics2";
import { MetricsSlider } from "./MetricsSlider";

/**
 * Renders WordPress's flexible-content `pageBuilder[]` array, one component
 * per section `type` (each already null-checked/normalized in
 * lib/data/models.ts). Unrecognized types are skipped rather than guessed.
 */
export function PageBuilder({ sections }: { sections: PageBuilderSection[] }) {
  return (
    <>
      {sections.map((section, i) => {
        switch (section.type) {
          case "hero":
            return <Hero key={i} {...section} />;
          case "colorsSpecs":
            return <ColorsSpecs key={i} {...section} />;
          case "video":
            return <Video key={i} {...section} />;
          case "exterior":
            return <Exterior key={i} {...section} />;
          case "appearanceSlider":
            return <AppearanceSlider key={i} {...section} />;
          case "interior":
            return <Interior key={i} {...section} />;
          case "additionalCharacteristics":
            return <AdditionalCharacteristics key={i} {...section} />;
          case "additionalCharacteristics2":
            return <AdditionalCharacteristics2 key={i} {...section} />;
          case "metricsSlider":
            return <MetricsSlider key={i} {...section} />;
          default:
            return null;
        }
      })}
    </>
  );
}
