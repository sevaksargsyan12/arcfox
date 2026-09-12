"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FooterColumn } from "@/lib/data/nav";

/** Expanded columns on desktop (hover/static), accordion rows on mobile. */
export function FooterAccordion({ columns }: { columns: FooterColumn[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 gap-8 md:flex md:flex-1 md:justify-end md:gap-16">
      {columns.map((column, i) => (
        <div key={column.heading} className="md:min-w-[140px]">
          <button
            type="button"
            className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wide md:pointer-events-none"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            {column.heading}
            <ChevronDown
              size={14}
              className={`md:hidden ${openIndex === i ? "rotate-180" : ""} transition-transform`}
            />
          </button>
          <ul className={`mt-3 flex flex-col gap-2 ${openIndex === i ? "block" : "hidden"} md:block`}>
            {column.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/70 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
