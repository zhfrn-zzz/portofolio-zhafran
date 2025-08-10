import { useEffect } from "react";
import { supabase } from "../supabase";

export default function Preconnect() {
  useEffect(() => {
    try {
      const url = new URL(supabase.restUrl || import.meta.env.VITE_SUPABASE_URL);
      const origin = url.origin;

      const addLink = (rel, href, crossOrigin = true) => {
        const link = document.createElement("link");
        link.rel = rel;
        link.href = href;
        if (crossOrigin) link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      };

      addLink("dns-prefetch", origin, false);
      addLink("preconnect", origin, true);
    } catch (e) {
      console.warn("Preconnect setup skipped:", e?.message);
    }
  }, []);

  return null;
}
