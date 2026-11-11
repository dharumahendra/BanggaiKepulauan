import Link from "next/link";
import { SITE } from "@/lib/site";

export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M19.5 3 9 15.5h6.2L12.5 29 23 15.8h-6.1L19.5 3Z" fill="#f5c518" />
      <path d="M19.5 3 13.4 10.3h5.4L19.5 3Z" fill="#d6453d" />
      <path d="M12.5 29l5.2-6.6h-4L12.5 29Z" fill="#2e8b3e" />
      <path d="M9 15.5h6.2l-1.1 4.9L9 15.5Z" fill="#d6453d" />
      <path d="M23 15.8h-6.1l.9-4.6L23 15.8Z" fill="#2e8b3e" />
    </svg>
  );
}

export function Logo({ sub, tile = false, inverse = false }: { sub?: string; tile?: boolean; inverse?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label={`${SITE.nama} — Beranda`}>
      {tile ? (
        <span className="grid size-8 place-items-center rounded-[3px] bg-white">
          <LogoMark className="size-6" />
        </span>
      ) : (
        <LogoMark />
      )}
      <span className="leading-tight">
        <span className={`block text-lg font-semibold tracking-tight sm:text-xl ${inverse ? "text-white" : "text-laut-700"}`}>{SITE.nama}</span>
        {sub && <span className="block text-xs text-muted">{sub}</span>}
      </span>
    </Link>
  );
}
