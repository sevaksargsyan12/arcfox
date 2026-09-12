import { getLocale } from "next-intl/server";
import { getHeaderNav } from "@/lib/data/nav";
import { getSiteConfig } from "@/lib/data/site-config";
import { Locale } from "@/lib/data/types";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const locale = (await getLocale()) as Locale;
  const [nav, site] = await Promise.all([getHeaderNav(locale), getSiteConfig(locale)]);

  return <HeaderClient nav={nav} siteName={site.siteName} />;
}
