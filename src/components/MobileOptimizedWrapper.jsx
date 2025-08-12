import React, { useState, useEffect, useMemo } from 'react';

const MobileOptimizedWrapper = ({ 
  children, 
  fallback = null,
  mobileBreakpoint = 768,
  disableOnMobile = false,
  reduceAnimations = true,
  reducedVersion = null
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  // Detect mobile dan low-power mode
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < mobileBreakpoint;
      setIsMobile(mobile);

      // Check for battery API dan performance hints
      const checkLowPower = () => {
        try {
          // Check battery level
          if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
              setIsLowPower(battery.level < 0.2 || !battery.charging);
            });
          }

          // Check connection quality
          const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
          if (connection) {
            const slowConnection = ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
            const saveData = connection.saveData;
            if (slowConnection || saveData) {
              setIsLowPower(true);
            }
          }

          // Check reduced motion preference
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (prefersReducedMotion && reduceAnimations) {
            setIsLowPower(true);
          }
        } catch (error) {
          console.warn('Error checking device capabilities:', error);
        }
      };

      checkLowPower();
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, [mobileBreakpoint, reduceAnimations]);

  // Memoize decision untuk avoid re-renders
  const shouldRenderReduced = useMemo(() => {
    return (isMobile && disableOnMobile) || isLowPower;
  }, [isMobile, isLowPower, disableOnMobile]);

  if (shouldRenderReduced) {
    return reducedVersion || fallback;
  }

  return children;
};

export default MobileOptimizedWrapper;
