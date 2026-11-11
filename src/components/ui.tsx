import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px]">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {it.href && !last ? (
                <Link href={it.href} className={`hover:underline ${i >= 2 ? "text-link" : ""}`}>
                  {it.label}
                </Link>
              ) : (
                <span className={last ? "font-medium text-ink" : ""} aria-current={last ? "page" : undefined}>
                  {it.label}
                </span>
              )}
              {!last && <ChevronRight className="size-3.5" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function SectionHead({
  eyebrow,
  judul,
  aksi,
  deskripsi,
}: {
  eyebrow?: string;
  judul: string;
  aksi?: React.ReactNode;
  deskripsi?: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-ink sm:text-4xl">{judul}</h2>
      </div>
      {deskripsi && <p className="max-w-sm text-[15px] leading-relaxed text-muted">{deskripsi}</p>}
      {aksi}
    </div>
  );
}

export function TombolGaris({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 self-start rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-laut-800 hover:bg-surface md:self-auto ${className}`}
    >
      {children}
    </Link>
  );
}
