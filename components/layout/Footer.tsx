import { getLocale, getTranslations } from "next-intl/server";
import { getFooterLinkColumns } from "@/lib/data/nav";
import { getSiteConfig } from "@/lib/data/site-config";
import { Locale } from "@/lib/data/types";
import { FooterAccordion } from "./FooterAccordion";
import { SocialIcon } from "./SocialIcon";

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "footer" });
  const [columns, site] = await Promise.all([getFooterLinkColumns(locale), getSiteConfig(locale)]);

  return (
    <footer className="bg-charcoal-900 text-white">
      <div className="container-wide py-12">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <span className="font-display text-xl font-bold tracking-wide">{site.siteName.toUpperCase()}</span>
            <p className="mt-3 text-sm text-white/60">{t("tagline")}</p>
            <div className="mt-5 flex gap-3">
              {site.socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  aria-label={social.platform}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          </div>

          <FooterAccordion columns={columns} />
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>{site.legalLine}</p>
          <p>{site.address}</p>
        </div>
      </div>
    </footer>
  );
}
