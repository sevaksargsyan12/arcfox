import { getTranslations } from "next-intl/server";
import { Locale } from "./types";
import { getModelsByLocale } from "./models";

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

/**
 * Header nav structure, including the models mega-menu (populated from the
 * live model list) and the Global R&D / About submenus. Labels come from
 * `messages/*.json` (UI chrome) -- this file only owns the URL structure
 * and the dynamic merge with model data.
 */
export async function getHeaderNav(locale: Locale): Promise<NavLink[]> {
  const t = await getTranslations({ locale, namespace: "header" });
  const models = await getModelsByLocale(locale);

  return [
    {
      label: t("nav.models"),
      href: "/models",
      children: models.map((m) => ({ label: m.name, href: `/models/${m.slug}` })),
    },
    {
      label: t("nav.about"),
      href: "/about",
      children: [
        { label: t("nav.aboutOverview"), href: "/about" },
        { label: t("nav.partners"), href: "/about/partners" },
      ],
    },
    {
      label: t("nav.globalRd"),
      href: "/global-rd",
      children: [
        { label: t("nav.design"), href: "/global-rd/design" },
        { label: t("nav.capability"), href: "/global-rd/capability" },
        { label: t("nav.battery"), href: "/global-rd/battery" },
      ],
    },
    { label: t("nav.news"), href: "/news" },
    { label: t("nav.contact"), href: "/contact" },
  ];
}

export async function getFooterLinkColumns(locale: Locale): Promise<FooterColumn[]> {
  const t = await getTranslations({ locale, namespace: "footer" });
  const models = await getModelsByLocale(locale);

  return [
    {
      heading: t("columns.vehicles"),
      links: [
        { label: t("columns.allModels"), href: "/models" },
        ...models.map((m) => ({ label: m.name, href: `/models/${m.slug}` })),
      ],
    },
    {
      heading: t("columns.company"),
      links: [
        { label: t("columns.about"), href: "/about" },
        { label: t("columns.partners"), href: "/about/partners" },
        { label: t("columns.globalRd"), href: "/global-rd" },
        { label: t("columns.news"), href: "/news" },
      ],
    },
    {
      heading: t("columns.support"),
      links: [{ label: t("columns.contact"), href: "/contact" }],
    },
    {
      heading: t("columns.legal"),
      links: [
        { label: t("columns.privacy"), href: "/legal/privacy" },
        { label: t("columns.official"), href: "/legal/official" },
      ],
    },
  ];
}
