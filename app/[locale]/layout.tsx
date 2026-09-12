import type { Metadata } from "next";
import { Inter, Noto_Sans_Armenian, Oswald } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SuccessDialogProvider } from "@/components/ui/SuccessDialog";
import "../globals.css";

// English display/body pairing -- a condensed technical face for hero
// headings, a clean grotesk for body copy. Reference used licensed
// EurostileNextW1G-*/DINNextW1G-* fonts; these are free lookalikes.
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-inter",
});

// Armenian body/heading text uses a single dedicated family (varying only
// by weight) rather than pairing two Latin-oriented families, since most
// display/condensed Google Fonts do not ship Armenian glyphs. This
// guarantees correct rendering for `hy` content instead of silently
// falling back to a system font.
const notoArmenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-noto-armenian",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    title: {
      default: t("title"),
      template: `%s | ${t("name")}`,
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const fontVars: Record<string, string> =
    locale === "hy"
      ? {
          "--font-locale-display": "var(--font-noto-armenian)",
          "--font-locale-body": "var(--font-noto-armenian)",
        }
      : {
          "--font-locale-display": "var(--font-oswald)",
          "--font-locale-body": "var(--font-inter)",
        };

  return (
    <html
      lang={locale}
      className={`${oswald.variable} ${inter.variable} ${notoArmenian.variable} h-full`}
      style={fontVars as React.CSSProperties}
    >
      <body className="flex min-h-full flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <SuccessDialogProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </SuccessDialogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
