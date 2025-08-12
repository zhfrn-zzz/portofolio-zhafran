import AOS from 'aos';

// Mobile-optimized AOS configuration
export const initializeAOS = (options = {}) => {
  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Disable AOS if user prefers reduced motion
  if (prefersReducedMotion) {
    return;
  }

  const defaultConfig = {
    duration: isMobile ? 400 : 600, // Shorter animations on mobile
    delay: isMobile ? 50 : 100,     // Reduced delay on mobile
    easing: 'ease-out-cubic',
    once: true,                     // Don't repeat animations for better performance
    offset: isMobile ? 50 : 120,    // Trigger animations earlier on mobile
    disable: false,                 // Don't disable, but use lighter config
    ...options
  };

  AOS.init(defaultConfig);
};

// Lightweight AOS refresh for dynamic content
export const refreshAOS = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && window.AOS) {
    AOS.refresh();
  }
};

// Clean up AOS when component unmounts
export const cleanupAOS = () => {
  if (window.AOS) {
    AOS.refresh();
  }
};
