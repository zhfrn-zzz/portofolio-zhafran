import React, { useState, useEffect, useRef } from 'react';
import { usePerformance } from './PerformanceOptimizer';

const SmartDeferMount = ({
  children,
  rootMargin = '100px',
  mountAfterMs = 0,
  threshold = 0.1,
  fallback = null,
  priority = false
}) => {
  const { settings, metrics } = usePerformance();
  const [shouldMount, setShouldMount] = useState(priority);
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);
  const timeoutRef = useRef(null);
  const observerRef = useRef(null);

  // Adjust thresholds based on performance
  const getOptimizedSettings = () => {
    const baseDelay = mountAfterMs;
    const performanceMultiplier = settings.maxFPS < 30 ? 2 : 
                                 settings.maxFPS < 45 ? 1.5 : 1;
    
    return {
      delay: Math.round(baseDelay * performanceMultiplier),
      margin: settings.maxFPS < 30 ? '200px' : 
              settings.maxFPS < 45 ? '150px' : rootMargin,
      threshold: settings.maxFPS < 30 ? 0.05 : threshold
    };
  };

  useEffect(() => {
    if (shouldMount || priority) return;

    const optimizedSettings = getOptimizedSettings();

    // Skip intersection observer if device is struggling
    if (metrics.isThrottling && settings.maxFPS < 20) {
      const timeout = setTimeout(() => {
        setShouldMount(true);
      }, optimizedSettings.delay + 2000); // Extra delay for struggling devices
      
      return () => clearTimeout(timeout);
    }

    // Standard intersection observer
    if (elementRef.current && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            
            if (optimizedSettings.delay > 0) {
              timeoutRef.current = setTimeout(() => {
                setShouldMount(true);
              }, optimizedSettings.delay);
            } else {
              setShouldMount(true);
            }
            
            observer.disconnect();
          }
        },
        {
          rootMargin: optimizedSettings.margin,
          threshold: optimizedSettings.threshold,
        }
      );

      observer.observe(elementRef.current);
      observerRef.current = observer;

      return () => {
        observer.disconnect();
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else {
      // Fallback for browsers without IntersectionObserver
      const timeout = setTimeout(() => {
        setShouldMount(true);
      }, optimizedSettings.delay);
      
      return () => clearTimeout(timeout);
    }
  }, [shouldMount, priority, rootMargin, mountAfterMs, threshold, settings, metrics]);

  // For low-end devices, show simplified placeholder
  const getPlaceholder = () => {
    if (settings.maxFPS < 30) {
      return <div className="h-20 w-full" />; // Simple spacer
    }
    return fallback;
  };

  if (shouldMount) {
    return <>{children}</>;
  }

  return (
    <div ref={elementRef} className="min-h-[1px]">
      {isInView && getPlaceholder()}
    </div>
  );
};

export default SmartDeferMount;
