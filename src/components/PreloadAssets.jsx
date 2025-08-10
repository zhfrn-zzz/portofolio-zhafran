import { useEffect } from "react";
import { supabase } from "../supabase";

// Heuristics to avoid preloading on very slow connections or Data Saver
function shouldPreload() {
  try {
    const nav = navigator;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    const saveData = conn?.saveData || false;
    const downlink = conn?.downlink || 10; // Mbps
    const effective = conn?.effectiveType || '4g';
    if (saveData) return false;
    if (['slow-2g', '2g'].includes(effective)) return false;
    if (downlink < 1.2) return false;
    return true;
  } catch {
    return true;
  }
}

export default function PreloadAssets() {
  useEffect(() => {
    const isTabletUp = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
    if (!shouldPreload() || !isTabletUp) return;
    const href = "/Photo.jpg";
    const existing = document.head.querySelector(`link[rel="preload"][as="image"][href="${href}"]`);
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      link.fetchPriority = "low"; // do not compete with LCP
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    // Prefetch minimal gallery data and warm up first thumbnails
    let aborted = false;
    if (!shouldPreload()) return;

    (async () => {
      try {
        const { data, error } = await supabase
          .from("gallery_photos")
          .select("id,image_url,description,aspect_ratio,created_at")
          .order("created_at", { ascending: false })
          .limit(12);
        if (error) throw error;
        if (aborted) return;

        // Merge with any cached items to keep local cache fresh
        try {
          const cachedRaw = localStorage.getItem("gallery_photos");
          const cached = cachedRaw ? JSON.parse(cachedRaw) : [];
          const merged = Array.isArray(cached) && cached.length > 0 ? cached : data || [];
          localStorage.setItem("gallery_photos", JSON.stringify(merged));
        } catch {}

        // Warm the browser image cache for the first few items
        (data || []).slice(0, 12).forEach((item) => {
          if (!item?.image_url) return;
          const img = new Image();
          img.decoding = "async";
          // Use low priority; we only want background warming
          try { img.fetchPriority = "low"; } catch {}
          img.src = item.image_url;
        });
      } catch {
        // Ignore prefetch failures silently
      }
    })();

    return () => {
      aborted = true;
    };
  }, []);

  return null;
}
