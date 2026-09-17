import { setRequestLocale } from "next-intl/server";
import { getAboutPage } from "@/lib/data/about";
import { Locale } from "@/lib/data/types";
import { AboutHero } from "@/components/about/AboutHero";
import { BrandInspired } from "@/components/about/BrandInspired";
import { BrandPhilosophy } from "@/components/about/BrandPhilosophy";
import { GlobalPlan } from "@/components/about/GlobalPlan";
import { AboutFooterBlock } from "@/components/about/AboutFooterBlock";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const aboutPage = await getAboutPage(locale as Locale);

  if (!aboutPage) return null;

  return (
    <>
      <AboutHero
        imageUrl={aboutPage.heroImageUrl}
        imageMobileUrl={aboutPage.heroImageMobileUrl}
        heroText={aboutPage.heroText}
      />
      <BrandInspired
        title={aboutPage.biTitle}
        subtitle={aboutPage.biSubtitle}
        text={aboutPage.biText}
        imageUrl={aboutPage.biImageUrl}
      />
      <BrandPhilosophy title={aboutPage.bpTitle} items={aboutPage.bpItems} />
      <GlobalPlan
        title={aboutPage.gpTitle}
        subtitle={aboutPage.gpSubtitle}
        content={aboutPage.gpContent}
        imageUrl={aboutPage.gpImageUrl}
        metrics={aboutPage.metrics}
      />
      <AboutFooterBlock
        title={aboutPage.footerTitle}
        contentHtml={aboutPage.footerContentHtml}
        imageUrl={aboutPage.footerImageUrl}
        imageMobileUrl={aboutPage.footerImageMobileUrl}
      />
    </>
  );
}
