import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from './ThemeProvider';
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { useAudio } from './AudioProvider';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const { theme, toggle } = useTheme();
    const [animating, setAnimating] = useState(false);
    const [goingRight, setGoingRight] = useState(true);
    const audio = useAudio();
    const navigate = useNavigate();
    
    const navItems = [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "About" },
        { href: "#Portofolio", label: "Portofolio" },
    { href: "#Gallery", label: "Gallery" },
        { href: "#Contact", label: "Contact" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            const viewportH = window.innerHeight || document.documentElement.clientHeight;
            const entries = navItems.map(item => {
                const el = document.querySelector(item.href);
                if (!el) return null;
                const rect = el.getBoundingClientRect();
                const visible = Math.max(0, Math.min(rect.bottom, viewportH) - Math.max(rect.top, 0));
                const centerDistance = Math.abs((rect.top + rect.bottom) / 2 - viewportH / 2);
                return { id: item.href.substring(1), visible, centerDistance };
            }).filter(Boolean);

            // Near bottom: prefer Contact if it exists; otherwise last visible
            const atBottom = window.innerHeight + window.scrollY >= (document.body.scrollHeight - 2);
            if (atBottom) {
                const contactExists = !!document.querySelector('#Contact');
                if (contactExists) {
                    setActiveSection('Contact');
                    return;
                }
                if (entries.length) {
                    setActiveSection(entries[entries.length - 1].id);
                    return;
                }
            }

            if (entries.length) {
                let best = entries[0];
                for (const e of entries) {
                    if (e.visible > best.visible + 5 || (Math.abs(e.visible - best.visible) <= 5 && e.centerDistance < best.centerDistance)) {
                        best = e;
                    }
                }
                if (best.visible > 1) setActiveSection(best.id);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const id = href.replace('#','');
        // Highlight immediately for better UX
        setActiveSection(id);

        const doScroll = () => {
            const start = Date.now();
            const tryScroll = () => {
                const el = document.querySelector(href);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const top = rect.top + window.scrollY - 100;
                    window.scrollTo({ top, behavior: 'smooth' });
                    return;
                }
                if (Date.now() - start < 4000) setTimeout(tryScroll, 100);
            };
            tryScroll();
        };

        const isHome = typeof window !== 'undefined' && window.location && window.location.pathname === '/';
        const present = !!document.querySelector(href);
        if (!present) {
            if (!isHome) {
                navigate('/');
                try { history.replaceState(null, '', '#' + id); } catch {}
                setTimeout(doScroll, 120);
            } else {
                // Nudge scroll to encourage deferred mount
                try {
                    const targetY = Math.max(0, document.body.scrollHeight - window.innerHeight * 0.8);
                    window.scrollTo({ top: targetY, behavior: 'smooth' });
                } catch {}
                setTimeout(doScroll, 150);
            }
        } else {
            doScroll();
        }
        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                isOpen
                    ? "dark:bg-[#030014] bg-lightbg"
                    : scrolled
                    ? "dark:bg-[#030014]/50 bg-lightbg/60 backdrop-blur-xl"
                    : "bg-transparent"
            }`}
        >
            <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%]">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="text-xl font-bold bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-[#a855f7] dark:to-[#6366f1] bg-gradient-to-r from-[var(--text)] via-[var(--muted)] to-[var(--accent)]"
                        >
                            Zhafran
                        </a>
                    </div>
        
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="ml-8 flex items-center space-x-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className="group relative px-1 py-2 text-sm font-medium"
                                >
                                    <span
                                        className={`relative z-10 transition-colors duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? "dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] dark:bg-clip-text dark:text-transparent font-semibold text-lighttext"
                                                : "dark:text-[#e2d3fd] dark:group-hover:text-white text-lighttext group-hover:text-[var(--text)]"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                    <span
                                        className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ${
                                            activeSection === item.href.substring(1)
                                                ? "scale-x-100 dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-lightaccent"
                                                : "scale-x-0 group-hover:scale-x-100 dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-lightaccent/60"
                                        }`}
                                    />
                                </a>
                            ))}
                                                </div>
                                                {/* Theme Toggle */}
                                                <button
                                                    onClick={() => { setGoingRight(theme==='dark'); setAnimating(true); toggle(); }}
                                                    aria-label="Toggle theme"
                                                    className={`relative w-14 h-8 rounded-full transition-colors duration-700 ease-out
                                                        ${theme === 'dark' ? 'bg-[#111827]' : 'bg-lightaccent/60'}
                                                        border border-white/10 dark:border-white/10 overflow-hidden`}
                                                >
                                                    {/* sun/moon hints */}
                                                    <span className={`absolute left-2 top-1/2 -translate-y-1/2 text-[10px] select-none transition-opacity duration-500 ${theme==='dark'?'opacity-0':'opacity-70'}`}>☀️</span>
                                                    <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] select-none transition-opacity duration-500 ${theme==='dark'?'opacity-70':'opacity-0'}`}>🌙</span>

                                                    {/* knob */}
                                                    <span
                                                        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md ${theme==='dark' ? 'translate-x-0' : 'translate-x-6'}`}
                                                        style={{
                                                            animation: animating ? 'knob-move 700ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
                                                            ['--from']: goingRight ? '0' : '24px',
                                                            ['--to']: goingRight ? '24px' : '0',
                                                            willChange: 'transform'
                                                        }}
                                                        onAnimationEnd={() => setAnimating(false)}
                                                    />
                                                    {/* subtle glow */}
                                                    <span className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-700 ${theme === 'dark' ? 'opacity-20' : 'opacity-40'} bg-white`} style={{filter:'blur(10px)'}} />
                                                </button>
                                                {/* Audio Toggle */}
                                                <button
                                                    onClick={audio.toggleMute}
                                                    aria-label={audio.muted ? 'Unmute music' : 'Mute music'}
                                                    className="p-2 rounded-full border border-white/10 dark:text-[#e2d3fd] text-lighttext hover:text-white hover:bg-white/5 transition"
                                                >
                                                    {audio.muted ? <VolumeX className="w-5 h-5"/> : <Volume2 className="w-5 h-5"/>}
                                                </button>
                    </div>
        
                    {/* Mobile Menu Button */}
                                        <div className="md:hidden flex items-center gap-3">
                                                {/* Theme toggle mobile */}
                                                <button
                                                    onClick={() => { setGoingRight(theme==='dark'); setAnimating(true); toggle(); }}
                                                    aria-label="Toggle theme"
                                                    className={`relative w-12 h-7 rounded-full transition-colors duration-700 ease-out
                                                        ${theme === 'dark' ? 'bg-[#111827]' : 'bg-lightaccent/60'}
                                                        border border-white/10 dark:border-white/10 overflow-hidden`}
                                                >
                                                    <span className={`absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] select-none transition-opacity duration-500 ${theme==='dark'?'opacity-0':'opacity-70'}`}>☀️</span>
                                                    <span className={`absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] select-none transition-opacity duration-500 ${theme==='dark'?'opacity-70':'opacity-0'}`}>🌙</span>
                                                    <span
                                                        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md ${theme==='dark' ? 'translate-x-0' : 'translate-x-5'}`}
                                                        style={{
                                                            animation: animating ? 'knob-move 700ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
                                                            ['--from']: goingRight ? '0' : '20px',
                                                            ['--to']: goingRight ? '20px' : '0',
                                                            willChange: 'transform'
                                                        }}
                                                        onAnimationEnd={() => setAnimating(false)}
                                                    />
                                                </button>
                                                {/* Audio toggle mobile */}
                                                <button
                                                    onClick={audio.toggleMute}
                                                    aria-label={audio.muted ? 'Unmute music' : 'Mute music'}
                                                    className="p-2 rounded-full border border-white/10 dark:text-[#e2d3fd] text-lighttext hover:text-white hover:bg-white/5 transition"
                                                >
                                                    {audio.muted ? <VolumeX className="w-5 h-5"/> : <Volume2 className="w-5 h-5"/>}
                                                </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`relative p-2 dark:text-[#e2d3fd] text-lighttext hover:text-white transition-transform duration-300 ease-in-out transform ${
                                isOpen ? "rotate-90 scale-125" : "rotate-0 scale-100"
                            }`}
                        >
                            {isOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        
            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out ${
                    isOpen
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <div className="px-4 py-6 space-y-4">
                    {navItems.map((item, index) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className={`block px-4 py-3 text-lg font-medium transition-all duration-300 ease ${
                                activeSection === item.href.substring(1)
                                    ? "dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-gradient-to-r from-[var(--text)] via-[var(--muted)] to-[var(--accent)] bg-clip-text text-transparent font-semibold"
                                    : "dark:text-[#e2d3fd] text-lighttext hover:dark:text-white hover:text-[var(--text)]"
                            }`}
                            style={{
                                transitionDelay: `${index * 100}ms`,
                                transform: isOpen ? "translateX(0)" : "translateX(50px)",
                                opacity: isOpen ? 1 : 0,
                            }}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;