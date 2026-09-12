import { setRequestLocale } from "next-intl/server";
import { getGlobalRdSection } from "@/lib/data/global-rd";
import { Locale } from "@/lib/data/types";
import { GlobalRdSectionBody } from "@/components/global-rd/GlobalRdSectionBody";

export default async function BatteryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const section = await getGlobalRdSection("battery", locale as Locale);
  return <GlobalRdSectionBody section={section} />;
}
