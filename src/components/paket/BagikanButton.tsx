"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export function BagikanButton({ judul }: { judul: string }) {
  const [tersalin, setTersalin] = useState(false);
  const bagikan = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: judul, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 1600);
    } catch {
      /* dibatalkan pengguna */
    }
  };
  return (
    <button
      type="button"
      onClick={bagikan}
      className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium hover:bg-surface"
    >
      {tersalin ? <Check className="size-4 text-ok" /> : <Share2 className="size-4" />}
      {tersalin ? "Tautan disalin" : "Bagikan"}
    </button>
  );
}
