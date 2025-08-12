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
const ComingSoon = lazy(() => import("./Pages/ComingSoon"));
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './components/ThemeProvider';
import { AudioProvider, useAudio } from './components/AudioProvider';
import AudioPrompt from './components/AudioPrompt';
const NotFoundPage = lazy(() => import("./Pages/404"));
import DeferMount from './components/DeferMount';
import { I18nProvider } from './components/I18nProvider';

// Track welcome display per page load (resets on full reload)
let __welcomeShownThisLoad = false;

// Show Welcome on fresh loads; allow skipping exactly once via a flag when navigating from sub-routes.
function shouldShowWelcome() {
  try {
    if (sessionStorage.getItem('skip_welcome_once') === '1') {
      sessionStorage.removeItem('skip_welcome_once');
      return false;
    }
  } catch {}
  return !__welcomeShownThisLoad;
}

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  // If a one-time skip flag is present (set by internal navigations), hide welcome immediately
  React.useEffect(() => {
    try {
      if (sessionStorage.getItem('skip_welcome_once') === '1') {
        sessionStorage.removeItem('skip_welcome_once');
        if (showWelcome) setShowWelcome(false);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Failsafe: ensure welcome cannot block the app longer than 7s total
  React.useEffect(() => {
    if (!showWelcome) return;
    const id = setTimeout(() => {
      try { setShowWelcome(false); } catch {}
      __welcomeShownThisLoad = true;
    }, 7000);
    return () => clearTimeout(id);
  }, [showWelcome, setShowWelcome]);
  return (
    <>
  <AnimatePresence mode="wait">
        {showWelcome && (
          <Suspense fallback={null}>
            <WelcomeScreen onLoadingComplete={() => {
              setShowWelcome(false);
              __welcomeShownThisLoad = true;
              try {
                // Try to start audio when welcome completes
                // We call via a microtask to ensure provider is mounted
                setTimeout(() => {
                  try {
                    const acked = (()=>{ try { return localStorage.getItem('audio_ack') === '1'; } catch { return false; }})();
                    if (!acked) return; // show prompt; wait for first click
                    const ua = navigator.userAgent || '';
                    const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);
                    if (!isMobile && window.__audioUnmuteHook) window.__audioUnmuteHook();
                    if (window.__audioPlayHook) window.__audioPlayHook();
                  } catch {}
                }, 0);
              } catch {}
            }} />
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
          <DeferMount rootMargin="1100px" mountAfterMs={800}>
            <Suspense fallback={null}>
              <ContactPage />
            </Suspense>
          </DeferMount>
          <IdlePreloader />
          <footer>
            <center>
              <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
              <span className="block text-sm text-gray-500 text-center dark:text-gray-400">
                © 2025{" "}
                <a href="https://flowbite.com/" className="hover:underline">
                  Zhafran™
                </a>
                . All Rights Reserved.
              </span>
              <div className="text-sm text-gray-500 dark:text-gray-400 pb-6">
                <p>Special Thanks and Credits To:</p>
                <p>
                  <a href="https://www.tiktok.com/@eki_zulfar" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    @EkiZr (Website Framework)
                  </a>
                </p>
                <p>
                  <a href="https://www.tiktok.com/@sora.tune" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    @sora.tune (Music)
                  </a>
                </p>
              </div>
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
  <span className="block text-sm text-gray-500 text-center dark:text-gray-400">
          © 2023{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            zhafran™
          </a>
          . All Rights Reserved.
        </span>
        <div className="text-sm text-gray-500 dark:text-gray-400 pb-6">
          <p>Special Thanks and Credits To:</p>
          <p>
            <a href="https://www.tiktok.com/@eki_zulfar" target="_blank" rel="noopener noreferrer" className="hover:underline">
              @EkiZr (Website Framework)
            </a>
          </p>
          <p>
            <a href="https://www.tiktok.com/@sora.tune" target="_blank" rel="noopener noreferrer" className="hover:underline">
              @sora.tune (Music)
            </a>
          </p>
        </div>
      </center>
    </footer>
  </>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(() => shouldShowWelcome());

  return (
    <BrowserRouter>
      <I18nProvider>
      <ThemeProvider>
  <AudioProvider>
  <AudioPrompt />
    <Routes>
  <Route path="/" element={<LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />} />
        <Route path="/project/:id" element={<ProjectPageLayout />} />
  <Route path="/coming-soon" element={<Suspense fallback={null}><ComingSoon /></Suspense>} />
        <Route path="*" element={<Suspense fallback={null}><NotFoundPage /></Suspense>} /> {/* Ini route 404 */}
      </Routes>
      </AudioProvider>
      </ThemeProvider>
      </I18nProvider>
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