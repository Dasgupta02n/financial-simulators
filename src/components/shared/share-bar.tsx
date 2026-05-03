"use client";

interface Props {
  title: string;
  url?: string;
  className?: string;
}

const SHARE_PLATFORMS = [
  {
    name: "X",
    color: "#000000",
    getUrl: (url: string, text: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    color: "#1877F2",
    getUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    color: "#25D366",
    getUrl: (url: string, text: string) => `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    color: "#0A66C2",
    getUrl: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Reddit",
    color: "#FF4500",
    getUrl: (url: string, text: string) => `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.698-.547-.8 3.745c1.612.08 3.078.608 4.11 1.42a1.746 1.746 0 0 1 2.226-.194 1.746 1.746 0 0 1 .094 2.339 1.746 1.746 0 0 1-.836 2.94c.05.398.082.8.082 1.211 0 3.417-3.329 6.193-7.433 6.193-4.104 0-7.432-2.776-7.432-6.193 0-.413.032-.816.082-1.212a1.746 1.746 0 0 1-.837-2.94 1.746 1.746 0 0 1 .095-2.338 1.746 1.746 0 0 1 2.226.194c1.032-.812 2.498-1.34 4.11-1.42l-.8-3.745-2.7.547a1.25 1.25 0 0 1-2.497-.056 1.25 1.25 0 0 1 1.25-1.25 1.25 1.25 0 0 1 1.194.885l2.958.655.687-3.221a.625.625 0 0 1 1.225 0l.687 3.221 2.959-.655a1.25 1.25 0 0 1 1.193-.885zM8.25 12a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm7.5 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm-3.75 5.645c1.576 0 3.063-.747 3.686-1.779a.625.625 0 0 0-1.072-.644c-.374.622-1.393 1.173-2.614 1.173s-2.24-.551-2.614-1.173a.625.625 0 1 0-1.072.644c.623 1.032 2.11 1.779 3.686 1.779z" />
      </svg>
    ),
  },
] as const;

export function ShareBar({ title, url: urlProp, className = "" }: Props) {
  const url = urlProp || (typeof window !== "undefined" ? window.location.href : "");
  const text = `${title} — Calculate your real returns at c7xai.in`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {SHARE_PLATFORMS.map((platform) => (
        <a
          key={platform.name}
          href={platform.getUrl(url, text)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-border hover:border-sienna/30 hover:text-sienna text-text-secondary transition-colors"
          title={`Share on ${platform.name}`}
        >
          {platform.icon}
        </a>
      ))}
    </div>
  );
}