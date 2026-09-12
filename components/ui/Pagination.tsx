import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
  extraQuery?: Record<string, string | undefined>;
  prevLabel: string;
  nextLabel: string;
}

function buildHref(basePath: string, page: number, extraQuery?: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (extraQuery) {
    for (const [key, value] of Object.entries(extraQuery)) {
      if (value) params.set(key, value);
    }
  }
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function Pagination({ page, totalPages, basePath, extraQuery, prevLabel, nextLabel }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={buildHref(basePath, Math.max(1, page - 1), extraQuery)}
        aria-disabled={page === 1}
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          page === 1 ? "pointer-events-none opacity-30" : "hover:bg-form-bg"
        }`}
        aria-label={prevLabel}
      >
        <ChevronLeft size={16} />
      </Link>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildHref(basePath, p, extraQuery)}
          aria-current={p === page}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${
            p === page ? "bg-brand-blue text-white" : "hover:bg-form-bg"
          }`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={buildHref(basePath, Math.min(totalPages, page + 1), extraQuery)}
        aria-disabled={page === totalPages}
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          page === totalPages ? "pointer-events-none opacity-30" : "hover:bg-form-bg"
        }`}
        aria-label={nextLabel}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}
