"use client";

import Link from "next/link";
import { useEffect } from "react";
import { lacak } from "@/lib/analytics";

/** Mengirim satu event saat halaman dibuka. */
export function LacakTampil({ event, data }: { event: string; data?: Record<string, string> }) {
  const kunci = JSON.stringify(data ?? {});
  useEffect(() => {
    lacak(event, JSON.parse(kunci));
  }, [event, kunci]);
  return null;
}

/** Link yang mencatat event saat diklik. */
export function LinkLacak({
  event,
  data,
  ...props
}: React.ComponentProps<typeof Link> & { event: string; data?: Record<string, string> }) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        lacak(event, data);
        props.onClick?.(e);
      }}
    />
  );
}
