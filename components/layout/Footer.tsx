import { Mail, MapPin, Phone } from "lucide-react";
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
    <footer className="site-footer bg-charcoal-900 text-white">
      <div className="container-wide py-12">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.webp" alt={site.siteName} className="h-7 w-auto" />
            <p className="mt-3 text-sm text-white/60">{t("tagline")}</p>
            <p className="mt-5 text-sm text-white/60">{t("followUs")}</p>
            <div className="mt-3 flex gap-3">
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

          <div className="max-w-xs">
            <p className="text-sm font-semibold uppercase tracking-wide text-white">
              {t("contactTitle")}
            </p>
            <div className="mt-4 flex items-start gap-2 text-sm text-white/70">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <p>{site.address}</p>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
              <Mail size={16} className="shrink-0" />
              <a href={`mailto:${site.contactEmail}`} className="hover:text-white">
                {site.contactEmail}
              </a>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
              <Phone size={16} className="shrink-0" />
              <div className="flex flex-col">
                {site.phones.map((phone) => (
                  <a key={phone} href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-white">
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <FooterAccordion columns={columns} />
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>{site.legalLine}</p>
        </div>
      </div>
    </footer>
  );
}
