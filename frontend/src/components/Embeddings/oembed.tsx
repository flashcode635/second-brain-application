import { useEffect, useRef, useState } from "react";

// ---------- Types ----------
type OEmbedResponse = {
  html?: string;
  width?: number;
  height?: number;
  title?: string;
  author_name?: string;
  provider_name?: string;
  thumbnail_url?: string;
  error?: string;
};

// ---------- Endpoints (no tokens!) ----------
const INSTAGRAM_OEMBED = "https://graph.facebook.com/v25.0/instagram_oembed"; // tokenless since June 2026
const REDDIT_OEMBED = "https://www.reddit.com/oembed";
const NOEMBED_FALLBACK = "https://noembed.com/embed"; // CORS-friendly proxy, supports both

// ---------- Fetch logic with fallback ----------
async function fetchOEmbed(url: string, endpoint: string): Promise<string> {
  try {
    const res = await fetch(`${endpoint}?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: OEmbedResponse = await res.json();
    if (data.html) return data.html;
    throw new Error(data.error ?? "No embed HTML returned");
  } catch {
    // Fallback: noembed.com (also bypasses CORS issues)
    const res = await fetch(`${NOEMBED_FALLBACK}?url=${encodeURIComponent(url)}`);
    const data: OEmbedResponse = await res.json();
    if (data.html) return data.html;
    throw new Error(data.error ?? "Embed not available for this URL");
  }
}

// ---------- Hook ----------
function useEmbed(url: string, endpoint: string) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setHtml(null);
    setError(null);
    fetchOEmbed(url, endpoint)
      .then((h) => !cancelled && setHtml(h))
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => { cancelled = true; };
  }, [url, endpoint]);

  return { html, error, loading: !html && !error };
}

// ---------- Renderer (iframe srcdoc so scripts run safely) ----------
const RESIZE_SCRIPT = `
<script>
  const report = () => parent.postMessage(
    { type: "embed-resize", h: document.body.scrollHeight }, "*"
  );
  new ResizeObserver(report).observe(document.body);
  window.addEventListener("load", report);
</script>`;

function EmbedFrame({ html, title, initialHeight = 450 }: {
  html: string; title: string; initialHeight?: number;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(initialHeight);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (ref.current && e.source === ref.current.contentWindow
          && e.data?.type === "embed-resize") {
        setHeight(Math.max(e.data.h, 150));
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={html + RESIZE_SCRIPT}
      sandbox="allow-scripts allow-same-origin allow-popups"
      style={{ width: "100%", height, border: 0 }}
      loading="lazy"
    />
  );
}

function EmbedSkeleton() {
  return <div style={{ background: "#f0f0f0", height: 400, borderRadius: 8 }} />;
}

function EmbedError({ message }: { message: string }) {
  return <p style={{ color: "#c00", fontSize: 14 }}> {message}</p>;
}

// ---------- Public components ----------
export function InstagramEmbed({ url }: { url: string }) {
  const { html, error, loading } = useEmbed(url, INSTAGRAM_OEMBED);
  if (loading) return <EmbedSkeleton />;
  if (error) return <EmbedError message={error} />;
  return <EmbedFrame html={html!} title="Instagram post" initialHeight={550} />;
}

export function RedditEmbed({ url }: { url: string }) {
  const { html, error, loading } = useEmbed(url, REDDIT_OEMBED);
  if (loading) return <EmbedSkeleton />;
  if (error) return <EmbedError message={error} />;
  return <EmbedFrame html={html!} title="Reddit post" initialHeight={400} />;
}