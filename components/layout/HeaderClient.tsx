"use client";

import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NavLink } from "@/lib/data/nav";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderClientProps {
  nav: NavLink[];
  siteName: string;
}

/** Pages that render a full-bleed hero directly under the header. */
function isHeroPage(pathname: string): boolean {
  return pathname === "/" || /^\/models\/[^/]+$/.test(pathname);
}

export function HeaderClient({ nav, siteName }: HeaderClientProps) {
  const t = useTranslations("header");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Close the mobile menu when the route changes. Adjusted during render
  // (React's recommended pattern for "reset state when a prop changes")
  // rather than in an effect, which would cause an extra cascading render.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  const transparent = isHeroPage(pathname) && !scrolled && !mobileOpen;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        transparent ? "bg-transparent text-white" : "bg-white text-ink shadow-sm"
      }`}
    >
      <div className="container-wide flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-wide">
          {siteName.toUpperCase()}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <div key={item.href} className="group relative py-2">
              <Link href={item.href} className="flex items-center gap-1 text-sm font-medium">
                {item.label}
                {item.children && <ChevronDown size={14} />}
              </Link>
              {item.children && (
                <div className="invisible absolute left-0 top-full min-w-[220px] rounded-xl bg-white py-2 text-ink opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm hover:bg-form-bg"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher label={t("languageSwitcher.label")} />
        </div>

        <button
          type="button"
          aria-label="Menu"
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto bg-white text-ink md:hidden">
          <nav className="container-max flex flex-col gap-1 py-4">
            {nav.map((item, i) => (
              <div key={item.href} className="border-b border-charcoal-500/10 py-2">
                <div className="flex items-center justify-between">
                  <Link href={item.href} className="py-2 text-sm font-medium">
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      aria-label="Toggle submenu"
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      className="p-2"
                    >
                      <ChevronDown
                        size={16}
                        className={openIndex === i ? "rotate-180 transition-transform" : "transition-transform"}
                      />
                    </button>
                  )}
                </div>
                {item.children && openIndex === i && (
                  <div className="flex flex-col gap-1 pb-2 pl-4">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="py-2 text-sm text-charcoal-600">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3">
              <LanguageSwitcher label={t("languageSwitcher.label")} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
