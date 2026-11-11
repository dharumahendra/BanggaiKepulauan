// Ikon merek (lucide v1 tidak lagi menyertakan ikon brand).
type P = { className?: string };

export const InstagramIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </svg>
);

export const FacebookIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" strokeLinejoin="round" />
  </svg>
);

export const YoutubeIcon = ({ className = "size-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" />
  </svg>
);

/** QR dekoratif seperti di desain. QR sungguhan dibuat backend dari kode reservasi. */
export const QrPlaceholder = ({ className = "size-24", warna = "currentColor" }: P & { warna?: string }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill={warna}>
    <path d="M8 8h30v30H8zM16 16v14h14V16z" fillRule="evenodd" />
    <path d="M62 8h30v30H62zM70 16v14h14V16z" fillRule="evenodd" />
    <path d="M8 62h30v30H8zM16 70v14h14V70z" fillRule="evenodd" />
    <circle cx="50" cy="12" r="5" />
    <rect x="45" y="24" width="10" height="20" rx="5" />
    <rect x="22" y="46" width="34" height="10" rx="5" />
    <circle cx="12" cy="51" r="5" />
    <circle cx="70" cy="51" r="5" />
    <circle cx="87" cy="51" r="5" />
    <circle cx="50" cy="72" r="5" />
    <circle cx="50" cy="88" r="5" />
    <path d="M64 92V72a10 10 0 0 1 10-10h18v10H74v20z" />
    <circle cx="87" cy="87" r="5" />
  </svg>
);
