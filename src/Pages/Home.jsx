import React, { useState, useEffect, useCallback, memo, lazy, Suspense } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Github, Mail, ExternalLink, Instagram, Sparkles, Linkedin } from "lucide-react"
import PropTypes from 'prop-types'
const Lanyard3D = lazy(() => import("../components/Lanyard3D"));
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useI18n } from '../components/I18nProvider'
import TransText from '../components/TransText'
import { 
  TYPING_SPEED, 
  ERASING_SPEED, 
  PAUSE_DURATION, 
  TECH_STACK, 
  SOCIAL_LINKS, 
  WORDS_EN, 
  WORDS_ID 
} from '../constants'

// Memoized Components
const StatusBadge = memo(() => {
  const { t } = useI18n();
  return (
  <div className="inline-block animate-float lg:mx-0" data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group">
  <div className="absolute -inset-0.5 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000 dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-lightaccent"></div>
  <div className="relative px-3 sm:px-4 py-2 rounded-full dark:bg-black/40 bg-lightaccent/15 backdrop-blur-xl border dark:border-white/10 border-lightaccent/30">
    <span className="sm:text-sm text-[0.7rem] font-medium flex items-center">
          <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-400" />
          <TransText
            k="home.status"
            fallback="Siap Berinovasi"
            className="bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-gradient-to-r from-lighttext to-lightmuted"
          />
        </span>
      </div>
    </div>
  </div>
);
});

const MainTitle = memo(() => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
      <span className="relative inline-block">
  <span className="absolute -inset-2 blur-2xl opacity-20 bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] from-[var(--text)] via-[var(--muted)] to-[var(--accent)]"></span>
  <span className="relative bg-clip-text dark:text-transparent text-black bg-gradient-to-r dark:from-white dark:via-blue-100 dark:to-purple-200">
          Frontend
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-2">
  <span className="absolute -inset-2 blur-2xl opacity-20 bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] from-[var(--text)] via-[var(--muted)] to-[var(--accent)]"></span>
  <span className="relative bg-clip-text text-transparent bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] from-[var(--text)] via-[var(--muted)] to-[var(--accent)]">
          Developer
        </span>
      </span>
    </h1>
  </div>
));

const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 hidden sm:block rounded-full dark:bg-white/5 bg-lightaccent/15 backdrop-blur-sm border dark:border-white/10 border-lightaccent/30 text-sm dark:text-gray-300 text-lighttext hover:dark:bg-white/10 hover:bg-lightaccent/25 transition-colors">
    {tech}
  </div>
));

TechStack.propTypes = {
  tech: PropTypes.string.isRequired,
};

const CTAButton = memo(({ href, text, icon: Icon }) => {
  const navigate = useNavigate();
  const onClick = (e) => {
    if (!href) return;
    if (href.startsWith('#')) {
      e.preventDefault();
      const selector = href;
      const doScroll = () => {
        const start = Date.now();
        const tryScroll = () => {
          const el = document.querySelector(selector);
          if (el) {
            const rect = el.getBoundingClientRect();
            const top = rect.top + window.scrollY - 100;
            window.scrollTo({ top, behavior: 'smooth' });
            return;
          }
          if (Date.now() - start < 3500) requestAnimationFrame(tryScroll);
        };
        tryScroll();
      };
      const isHome = typeof window !== 'undefined' && window.location && window.location.pathname === '/';
      if (!document.querySelector(selector)) {
        if (!isHome) {
          navigate('/');
          setTimeout(doScroll, 100);
        } else {
          // Nudge viewport near the bottom to trigger deferred mount
          try {
            const targetY = Math.max(0, document.body.scrollHeight - window.innerHeight * 0.8);
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          } catch {}
          setTimeout(doScroll, 150);
        }
      } else {
        doScroll();
      }
      return;
    }
    // Internal route
    if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
      return;
    }
    // External links: let default behavior occur
  };
  return (
    <button type="button" className="group relative w-[160px]" onClick={onClick}>
      <div className="absolute -inset-0.5 rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700 dark:bg-gradient-to-r dark:from-[#4f52c9] dark:to-[#8644c5] bg-lightaccent/40"></div>
      <div className="relative h-11 dark:bg-[#030014] bg-[var(--bg)] backdrop-blur-xl rounded-lg border dark:border-white/10 border-lightaccent/30 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 dark:bg-gradient-to-r dark:from-[#4f52c9]/20 dark:to-[#8644c5]/20 bg-lightaccent/15"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="font-medium z-10">
            <TransText
              text={text}
              className="dark:bg-gradient-to-r dark:from-gray-200 dark:to-white dark:bg-clip-text dark:text-transparent text-lighttext"
            />
          </span>
          <Icon className={`w-4 h-4 dark:text-gray-200 text-lighttext ${href === '#Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
        </span>
      </div>
    </button>
  );
});

CTAButton.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
};

const SocialLink = memo(({ icon: Icon, link }) => {
  const isExternal = /^https?:/i.test(link) || link.startsWith('mailto:');
  const isInternal = link.startsWith('/');
  const content = (
    <button className="group relative p-3">
  <div className="absolute inset-0 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300 bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] from-[var(--text)] via-[var(--muted)] to-[var(--accent)]"></div>
      <div className="relative rounded-xl dark:bg-black/50 bg-lightaccent/15 backdrop-blur-xl p-2 flex items-center justify-center border dark:border-white/10 border-lightaccent/30 group-hover:dark:border-white/20 group-hover:border-lightaccent/50 transition-all duration-300">
        <Icon className="w-5 h-5 dark:text-gray-400 text-lighttext group-hover:dark:text-white group-hover:text-lighttext transition-colors" />
      </div>
    </button>
  );
  if (isInternal) return <Link to={link}>{content}</Link>;
  return (
    <a href={link} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
      {content}
    </a>
  );
});

SocialLink.propTypes = {
  icon: PropTypes.elementType.isRequired,
  link: PropTypes.string.isRequired,
};

// Use imported constants from ../constants/index.js

const Home = () => {
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const { t, lang } = useI18n();

  const WORDS = React.useMemo(() => (
    lang === 'en' ? WORDS_EN : WORDS_ID
  ), [lang]);

  // Restore previous scroll if saved
  useEffect(() => {
    try {
      const y = sessionStorage.getItem('prev_scrollY');
      if (y) {
        sessionStorage.removeItem('prev_scrollY');
        setTimeout(() => {
          window.scrollTo({ top: Number(y), behavior: 'instant' });
        }, 0);
      }
    } catch {}
  }, []);

  // Optimize AOS initialization: defer to idle so it doesn't block LCP
  useEffect(() => {
    const initAOS = () => {
      AOS.init({ once: true, offset: 10 });
    };
    const idle = (cb) => ('requestIdleCallback' in window) ? requestIdleCallback(cb, { timeout: 1200 }) : setTimeout(cb, 300);
    const idleId = idle(initAOS);
    const onResize = () => idle(initAOS);
    window.addEventListener('resize', onResize);
    return () => {
      if ('cancelIdleCallback' in window) try { cancelIdleCallback(idleId); } catch {}
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // Prefetch lanyard textures only on desktop to avoid mobile cost
  useEffect(() => {
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches; // tailwind lg
    if (!isDesktop) return;
    const urls = ["/depan.png", "/belakang.png"];
    const imgs = urls.map((u) => {
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = u;
      return img;
    });
    return () => imgs.forEach((img) => { img.src = ""; });
  }, []);

  // Optimize typing effect
  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  // Use user-provided images from public folder
  const frontUrl = "/depan.png";
  const backUrl = "/belakang.png";

  return (
  <div className="min-h-screen dark:bg-[#030014] bg-[var(--bg)] overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] " id="Home">
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto  min-h-screen ">
          <div className="flex flex-col lg:flex-row items-center justify-center h-screen md:justify-between gap-0 sm:gap-12 lg:gap-20">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-left lg:text-left order-1 lg:order-1 lg:mt-0"
              data-aos="fade-right"
              data-aos-delay="200">
              <div className="space-y-4 sm:space-y-6">
                <StatusBadge />
                <MainTitle />

                {/* Typing Effect */}
                <div className="h-8 flex items-center" data-aos="fade-up" data-aos-delay="800">
                  <span className="text-xl md:text-2xl dark:bg-gradient-to-r dark:from-gray-100 dark:to-gray-300 bg-clip-text dark:text-transparent text-lighttext font-light">
                    {text}
                  </span>
                  <span className="w-[3px] h-6 ml-1 animate-blink bg-gradient-to-t dark:from-[#6366f1] dark:to-[#a855f7] from-[var(--text)] to-[var(--accent)]"></span>
                </div>

                {/* Description */}
                <p className="text-base md:text-lg dark:text-gray-400 text-lighttext/80 max-w-[38ch] sm:max-w-xl leading-relaxed font-light" style={{ containIntrinsicSize: '120px', contentVisibility: 'auto' }}>
                  {t('home.description', 'Menciptakan perangkat IoT yang inovatif dan menarik menggunakan ESP32.')}
                </p>

                {/* Tech Stack */}
        <div className="flex flex-wrap gap-3 justify-start" data-aos="fade-up" data-aos-delay="1200">
                  {TECH_STACK.map((tech, index) => (
          <div key={index} className="px-4 py-2 hidden sm:block rounded-full dark:bg-white/5 bg-lightaccent/15 backdrop-blur-sm border border-white/10 text-sm dark:text-gray-300 text-lighttext hover:dark:bg-white/10 hover:bg-lightaccent/25 transition-colors">{tech}</div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-row gap-3 w-full justify-start" data-aos="fade-up" data-aos-delay="1400">
                  <CTAButton href="#Portofolio" text={t('home.ctaProjects', 'Proyek')} icon={ExternalLink} />
                  <CTAButton href="#Contact" text={t('home.ctaContact', 'Kontak')} icon={Mail} />
                </div>

                {/* Social Links */}
                <div className="hidden sm:flex gap-4 justify-start" data-aos="fade-up" data-aos-delay="1600">
                  {SOCIAL_LINKS.map((social, index) => (
                    <SocialLink key={index} {...social} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - 3D Lanyard */}
            <div className="w-full py-[10%] sm:py-0 lg:w-1/2 h-auto lg:h-[600px] xl:h-[750px] relative hidden lg:flex items-center justify-center order-2 lg:order-2 mt-8 lg:mt-0"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              data-aos="fade-left"
              data-aos-delay="600">
              <div className="relative w-full opacity-90">
                {/* Subtle ambient glow; in light mode, prefer neutral to avoid yellow cast */}
                <div className={`absolute inset-0 rounded-3xl blur-3xl transition-all duration-700 ease-in-out ${
                  isHovering ? "opacity-30 scale-105" : "opacity-20 scale-100"
                }`}
                  style={{
                    background: 'radial-gradient(60% 60% at 50% 50%, rgba(120,120,120,0.08), rgba(0,0,0,0))'
                  }}
                />

        <div className={`relative lg:left-12 z-10 w-full h-[420px] sm:h-[520px] md:h-[560px] lg:h-[600px] opacity-90 transform transition-transform duration-500 ${isHovering ? "scale-105" : "scale-100"}`}>
                  <Suspense fallback={
                    <div className="w-full h-full rounded-2xl border dark:border-white/10 border-lightaccent/30 bg-gradient-to-b from-black/10 to-black/5 dark:from-white/5 dark:to-white/0 animate-pulse" aria-label="Loading 3D preview" />
                  }>
                    <Lanyard3D frontUrl={frontUrl} backUrl={backUrl} strapColor="#1f1f1f" showGloss={true} />
                  </Suspense>
                </div>

                <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
                  isHovering ? "opacity-30" : "opacity-20"
                }`}>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-700 ${
                    isHovering ? "scale-110" : "scale-100"
                  }`}
                    style={{
                      background: 'radial-gradient(40% 40% at 50% 50%, rgba(120,120,120,0.10), rgba(0,0,0,0))'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);