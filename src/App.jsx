import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, lazy, Suspense } from 'react';
import "./index.css";
import Home from "./Pages/Home";
import Navbar from "./components/Navbar";
import Preconnect from "./components/Preconnect";
// PreloadAssets will be loaded lazily after idle to avoid competing with LCP
import GallerySkeleton from "./components/GallerySkeleton";
const AnimatedBackground = lazy(() => import("./components/Background"));
const About = lazy(() => import("./Pages/About"));
const Portofolio = lazy(() => import("./Pages/Portofolio"));
const Gallery = lazy(() => import("./Pages/Gallery"));
const ContactPage = lazy(() => import("./Pages/Contact"));
const ProjectDetails = lazy(() => import("./components/ProjectDetail"));
const WelcomeScreen = lazy(() => import("./Pages/WelcomeScreen"));
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './components/ThemeProvider';
const NotFoundPage = lazy(() => import("./Pages/404"));
import DeferMount from './components/DeferMount';

function shouldShowWelcome() {
  try {
    const nav = navigator;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    const saveData = conn?.saveData || false;
    const effective = conn?.effectiveType || '4g';
    const downlink = conn?.downlink || 10;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const seen = localStorage.getItem('seen_welcome') === '1';
    if (seen) return false;
    if (saveData || prefersReduced) return false;
    if (['slow-2g', '2g', '3g'].includes(effective)) return false;
    if (downlink < 1.5) return false;
    return true;
  } catch {
    return true;
  }
}

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <Suspense fallback={null}>
            <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {!showWelcome && (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] dark:bg-[#030014] dark:text-gray-100 transition-colors duration-500">
          <Preconnect />
          <Navbar />
          <Home />
          <DeferMount rootMargin="800px" mountAfterMs={2000}>
            <Suspense fallback={null}>
              <AnimatedBackground />
            </Suspense>
          </DeferMount>
          <DeferMount rootMargin="800px">
            <Suspense fallback={null}>
              <About />
            </Suspense>
          </DeferMount>
          <DeferMount rootMargin="900px">
            <Suspense fallback={null}>
              <Portofolio />
            </Suspense>
          </DeferMount>
          <Suspense fallback={<GallerySkeleton />}> 
            <Gallery />
          </Suspense>
          <DeferMount rootMargin="1100px">
            <Suspense fallback={null}>
              <ContactPage />
            </Suspense>
          </DeferMount>
          <IdlePreloader />
          <footer>
            <center>
              <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
              <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
                © 2025{" "}
                <a href="https://flowbite.com/" className="hover:underline">
                  EkiZR™
                </a>
                . All Rights Reserved.
              </span>
            </center>
          </footer>
        </div>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <>
    <Suspense fallback={null}>
      <ProjectDetails />
    </Suspense>
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
          © 2023{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            EkiZR™
          </a>
          . All Rights Reserved.
        </span>
      </center>
    </footer>
  </>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(() => shouldShowWelcome());

  React.useEffect(() => {
    if (!showWelcome) return;
    const t = setTimeout(() => setShowWelcome(false), 1800);
    return () => clearTimeout(t);
  }, [showWelcome]);

  return (
    <BrowserRouter>
      <ThemeProvider>
      <Routes>
  <Route path="/" element={<LandingPage showWelcome={showWelcome} setShowWelcome={(v)=>{ if(!v){ try{ localStorage.setItem('seen_welcome','1'); }catch{} } setShowWelcome(v); }} />} />
        <Route path="/project/:id" element={<ProjectPageLayout />} />
        <Route path="*" element={<Suspense fallback={null}><NotFoundPage /></Suspense>} /> {/* Ini route 404 */}
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

function IdlePreloader(){
  React.useEffect(()=>{
    const mount = ()=>{
      import('./components/PreloadAssets').then(()=>{});
    };
    const idleId = ('requestIdleCallback' in window)
      ? requestIdleCallback(mount, { timeout: 4000 })
      : setTimeout(mount, 2500);
    return () => {
      if ('cancelIdleCallback' in window) try { cancelIdleCallback(idleId) } catch {} else clearTimeout(idleId);
    };
  },[]);
  return null;
}