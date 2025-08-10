import React, { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "../supabase";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AOS from "aos";
import "aos/dist/aos.css";
import { Image as ImageIcon, RectangleVertical, Square, X } from "lucide-react";

const TABS = [
  { key: "9_16", label: "9:16", icon: RectangleVertical },
  { key: "16_9", label: "16:9", icon: ImageIcon },
  { key: "1_1", label: "1:1", icon: Square },
];

function a11yProps(index) {
  return {
    id: `gallery-tab-${index}`,
    "aria-controls": `gallery-tabpanel-${index}`,
  };
}

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`gallery-tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

const ratioClass = (key) => {
  switch (key) {
    case "9_16":
      return "aspect-[9/16]"; // portrait
    case "16_9":
      return "aspect-video"; // 16:9
    case "1_1":
      return "aspect-square"; // 1:1
    default:
      return "aspect-video";
  }
};

export default function Gallery() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // for preview { ...item, _key }
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : true;
  const initialItems = isMobile ? 1 : 3;
  const [showAll, setShowAll] = useState(false);
  // Premium glow intensity (0.0 - 0.8). Lower on Save-Data or reduced motion
  const computeGlow = () => {
    let v = 0.4;
    try {
      const m = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (m) v = 0.25;
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn?.saveData) v = 0.2;
    } catch {}
    return v;
  };
  const [glowOpacity, setGlowOpacity] = useState(computeGlow());

  useEffect(() => {
    AOS.init({ once: false, offset: 0, mirror: true });
    // Ensure initial positions are computed after layout
    const t = setTimeout(() => {
      try { AOS.refreshHard(); } catch {}
    }, 100);
    return () => clearTimeout(t);
  }, []);

  // Modal UX: close on Escape, lock scroll while open
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => { if (e.key === 'Escape') setSelected(null); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  // Refresh AOS when items arrive or when tab changes
  useEffect(() => {
    const t = setTimeout(() => {
      try { AOS.refresh(); } catch {}
    }, 50);
    return () => clearTimeout(t);
  }, [items, value]);

  useEffect(() => {
    try { AOS.refresh(); } catch {}
  }, [showAll]);

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("id,image_url,description,aspect_ratio,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setItems(data || []);
      localStorage.setItem("gallery_photos", JSON.stringify(data || []));
    } catch (err) {
      // Fallback to cache
      const cached = localStorage.getItem("gallery_photos");
      if (cached) setItems(JSON.parse(cached));
      console.error("Error fetching gallery:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem("gallery_photos");
    if (cached) setItems(JSON.parse(cached));
    fetchGallery();
  }, [fetchGallery]);

  const grouped = useMemo(() => {
    const byKey = { "9_16": [], "16_9": [], "1_1": [] };
    for (const it of items) {
      const k = it.aspect_ratio || "16_9";
      if (!byKey[k]) byKey[k] = [];
      byKey[k].push(it);
    }
    return byKey;
  }, [items]);

  const handleChange = (_e, newValue) => setValue(newValue);

  return (
  <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] overflow-hidden" id="Gallery">
      <div className="text-center pb-8" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-gradient-to-r from-[var(--text)] via-[var(--muted)] to-[var(--accent)]">
          Gallery
        </h2>
        <p className="dark:text-slate-400 text-lighttext/80 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Koleksi foto dengan ratio 9:16, 16:9, dan 1:1. Klik untuk preview dan lihat deskripsi.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <Box className="portfolio-tabs relative border dark:border-white/10 border-lightaccent/30 rounded-[20px] overflow-hidden md:px-4">
          <Box className="absolute inset-0 rounded-[20px] pointer-events-none bg-gradient-to-b from-[var(--accent)]/[0.12] to-[var(--muted)]/[0.10] dark:from-[#6366f1]/10 dark:to-[#a855f7]/10 backdrop-blur-md" sx={{ zIndex: 0 }} />
          <AppBar position="static" elevation={0} sx={{ bgcolor: "transparent", boxShadow: "none" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="fullWidth"
              sx={{
                minHeight: "70px",
                "& .MuiTab-root": {
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  fontWeight: 600,
                  color: "#94a3b8",
                  textTransform: "none",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  padding: "20px 0",
                  zIndex: 1,
                  margin: "8px",
                  borderRadius: "12px",
                  "&:hover": {
                    color: "#ffffff",
                    backgroundColor: "var(--tab-hover-bg)",
                    transform: "translateY(-2px)",
                    "& .lucide": { transform: "scale(1.1) rotate(5deg)" },
                  },
                  "&.Mui-selected": {
                    color: "#fff",
                    background: "var(--tab-selected-bg)",
                    boxShadow: "var(--tab-selected-shadow)",
                    "& .lucide": { color: "var(--tab-icon-selected)" },
                  },
                },
                "& .MuiTabs-indicator": { height: 0 },
                "& .MuiTabs-flexContainer": { gap: "8px" },
              }}
            >
              {TABS.map((t, idx) => (
                <Tab key={t.key} icon={<t.icon className="mb-2 w-5 h-5 transition-all duration-300" />} label={t.label} {...a11yProps(idx)} />
              ))}
            </Tabs>
          </AppBar>
        </Box>

          {TABS.map((t, idx) => (
            <TabPanel key={t.key} value={value} index={idx} dir={theme.direction}>
              <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                        <div className={`${ratioClass(t.key)} bg-white/60 dark:bg-white/10`} />
                      </div>
                    ))}
                  </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                  {(() => {
                    const list = grouped[t.key] || [];
                    const displayed = showAll ? list : list.slice(0, initialItems);
                    if (list.length === 0) {
                      return (
                        <div className="py-10 text-center w-full">
                          <p className="text-lg md:text-xl dark:text-gray-300 text-lighttext/80">Coming soon</p>
                        </div>
                      );
                    }
                    return displayed.map((item, i) => (
                    <div
                      key={item.id || i}
                      data-aos={i % 3 === 0 ? "fade-up-right" : i % 3 === 1 ? "fade-up" : "fade-up-left"}
                      data-aos-duration={i % 3 === 1 ? "1200" : "1000"}
                      data-aos-offset="0"
                    >
                      <button
                        onClick={() => setSelected({ ...item, _key: item.id ?? i })}
                        className={`group relative w-full overflow-hidden rounded-2xl border dark:border-white/10 border-lightaccent/30 dark:bg-white/5 bg-white/60 hover:dark:border-white/20 hover:border-lightaccent/50 transition-all duration-500 hover:scale-[1.01] ${ratioClass(
                          t.key
                        )}`}
                      >
                        {(() => {
                          const ratio = item.aspect_ratio || t.key;
                          // pick intrinsic size pair according to aspect
                          let w = 900, h = 506; // ~16:9 default
                          if (ratio === '9_16') { w = 540; h = 960; }
                          if (ratio === '1_1') { w = 800; h = 800; }
                          return (
                            <motion.img
                              layoutId={`photo-${item.id ?? i}`}
                              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                              src={item.image_url}
                              alt={item.description || "Gallery image"}
                              className="h-full w-full object-cover"
                              loading={i < initialItems ? "eager" : "lazy"}
                              decoding="async"
                              {...(i < initialItems ? { fetchPriority: 'high' } : {})}
                              width={w}
                              height={h}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          );
                        })()}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {item.description && (
                          <div className="absolute bottom-0 left-0 right-0 p-3 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-xs md:text-sm font-medium text-white/90 line-clamp-2">{item.description}</p>
                          </div>
                        )}
                      </button>
                    </div>
                    ));
                  })()}
                </div>
                )}
              </div>
              {(() => {
                const list = grouped[t.key] || [];
                return list.length > initialItems ? (
                  <div className="mt-6 w-full flex justify-start px-[5%]">
                    <button
                      onClick={() => setShowAll((s) => !s)}
                      className="px-3 py-1.5 dark:text-slate-300 text-lighttext dark:hover:text-white hover:text-lighttext text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 dark:bg-white/5 bg-lightaccent/10 dark:hover:bg-white/10 hover:bg-lightaccent/15 rounded-md border dark:border-white/10 border-lightaccent/30 dark:hover:border-white/20 hover:border-lightaccent/50 backdrop-blur-sm group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {showAll ? 'See Less' : 'See more...'}
                      </span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full dark:bg-purple-500/50 bg-[var(--accent)]/60"></span>
                    </button>
                  </div>
                ) : null;
              })()}
            </TabPanel>
          ))}
  {/* End TabPanels without swipe */}
      </Box>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden border dark:border-white/10 border-lightaccent/30 backdrop-blur-sm max-w-[92vw] md:max-w-[85vw] lg:max-w-[75vw]"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.98, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
              <button
                className="absolute top-3 right-3 z-10 rounded-full p-2 dark:bg-white/10 bg-black/10 hover:scale-105 transition-all"
                onClick={() => setSelected(null)}
                aria-label="Close preview"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              {/* Ambient glow behind the expanded image (theme-aware) */}
              <div aria-hidden className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center" style={{ opacity: glowOpacity }}>
                {/* Dark theme glow: indigo/purple */}
                <div
                  className="hidden dark:block w-[70vw] max-w-[900px] h-[50vh] max-h-[520px] rounded-full blur-3xl"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.42), rgba(168,85,247,0.22), rgba(0,0,0,0) 60%)',
                  }}
                />
                {/* Light theme glow: use accent/muted-like hues */}
                <div
                  className="block dark:hidden w-[70vw] max-w-[900px] h-[50vh] max-h-[520px] rounded-full blur-3xl"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(255,184,35,0.28), rgba(112,138,88,0.16), rgba(0,0,0,0) 60%)',
                  }}
                />
              </div>
              <motion.img
                layoutId={`photo-${selected._key}`}
                src={selected.image_url}
                alt={selected.description || "Selected image"}
                className="relative z-[1] block w-auto h-auto max-w-[92vw] max-h-[75vh] mx-auto shadow-2xl drop-shadow-[0_25px_80px_rgba(99,102,241,0.35)] ring-1 ring-black/10 dark:ring-white/10 rounded-xl"
                loading="eager"
                decoding="async"
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              />
              {selected.description && (
                <div className="px-4 py-3 text-sm md:text-base dark:text-gray-200 text-white bg-black/40 border-t dark:border-white/10 border-lightaccent/30">
                  {selected.description}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
