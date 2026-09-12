import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation primitives. Use these everywhere instead of the
 * plain `next/link` / `next/navigation` equivalents so links automatically
 * carry the current locale (and the language switcher can swap it).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
