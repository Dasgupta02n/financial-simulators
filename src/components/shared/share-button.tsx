"use client";

import { useCallback } from "react";

interface Props {
  title: string;
  className?: string;
}

export function ShareButton({ title, className = "" }: Props) {
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const text = `${title} — Calculate your real returns at c7xai.in`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  }, [title]);

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-sienna transition-colors ${className}`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      Share
    </button>
  );
}