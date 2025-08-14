import { useEffect, useRef, useCallback } from 'react';
import { usePerformance } from './PerformanceOptimizer';

// Hook untuk throttled scroll events
export const useThrottledScroll = (callback, deps = []) => {
  const { settings } = usePerformance();
  const throttleRef = useRef(false);
  const callbackRef = useRef(callback);
  
  // Update callback reference
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const throttleDelay = settings.maxFPS < 30 ? 50 : 
                         settings.maxFPS < 45 ? 33 : 16; // 20fps, 30fps, 60fps
    
    const handleScroll = () => {
      if (throttleRef.current) return;
      
      throttleRef.current = true;
      
      if (settings.shouldUseGPU && settings.shouldUseGPU()) {
        requestAnimationFrame(() => {
          callbackRef.current();
          setTimeout(() => {
            throttleRef.current = false;
          }, throttleDelay);
        });
      } else {
        setTimeout(() => {
          callbackRef.current();
          throttleRef.current = false;
        }, throttleDelay);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [settings, ...deps]);
};

// Hook untuk optimized resize events
export const useThrottledResize = (callback, deps = []) => {
  const { settings } = usePerformance();
  const throttleRef = useRef(false);
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const throttleDelay = settings.maxFPS < 30 ? 100 : 
                         settings.maxFPS < 45 ? 66 : 33;
    
    const handleResize = () => {
      if (throttleRef.current) return;
      
      throttleRef.current = true;
      setTimeout(() => {
        callbackRef.current();
        throttleRef.current = false;
      }, throttleDelay);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [settings, ...deps]);
};

// Hook untuk frame-optimized animations
export const useOptimizedAnimation = (animationFn, deps = []) => {
  const { settings, shouldReduceMotion } = usePerformance();
  const animationRef = useRef();
  const lastFrameTimeRef = useRef(0);
  
  const animate = useCallback((currentTime) => {
    if (shouldReduceMotion()) return;
    
    const deltaTime = currentTime - lastFrameTimeRef.current;
    const targetFrameTime = 1000 / (settings.maxFPS || 60);
    
    if (deltaTime >= targetFrameTime) {
      animationFn(currentTime, deltaTime);
      lastFrameTimeRef.current = currentTime;
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [animationFn, settings, shouldReduceMotion, ...deps]);

  useEffect(() => {
    if (!shouldReduceMotion()) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, shouldReduceMotion]);

  const startAnimation = useCallback(() => {
    if (!animationRef.current && !shouldReduceMotion()) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [animate, shouldReduceMotion]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  return { startAnimation, stopAnimation };
};

// Hook untuk memory management
export const useMemoryOptimization = () => {
  const { metrics, settings } = usePerformance();
  
  const cleanupMemory = useCallback(() => {
    // Force garbage collection if available (mainly in development)
    if (window.gc && typeof window.gc === 'function') {
      window.gc();
    }
    
    // Clear any cached data if memory pressure is high
    if (metrics.memoryPressure) {
      // Clear image caches
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.complete && !img.getBoundingClientRect().width) {
          img.src = '';
        }
      });
      
      // Clear any cached API responses (if you have any)
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('api-cache')) {
              caches.delete(name);
            }
          });
        });
      }
    }
  }, [metrics]);

  useEffect(() => {
    if (metrics.memoryPressure) {
      const timeout = setTimeout(cleanupMemory, 1000);
      return () => clearTimeout(timeout);
    }
  }, [metrics.memoryPressure, cleanupMemory]);

  return { cleanupMemory };
};

// Hook untuk adaptive quality
export const useAdaptiveQuality = () => {
  const { settings, metrics } = usePerformance();
  
  const getImageQuality = useCallback(() => {
    if (metrics.isThrottling) return 40;
    if (settings.imageQuality === 'low') return 50;
    if (settings.imageQuality === 'medium') return 70;
    return 85;
  }, [settings, metrics]);

  const getAnimationDuration = useCallback((baseDuration) => {
    if (!settings.enableAnimations) return 0;
    if (metrics.isThrottling) return baseDuration * 0.5;
    if (settings.maxFPS < 30) return baseDuration * 0.7;
    return baseDuration;
  }, [settings, metrics]);

  const shouldSkipAnimation = useCallback(() => {
    return !settings.enableAnimations || metrics.fps < 15;
  }, [settings, metrics]);

  return {
    getImageQuality,
    getAnimationDuration,
    shouldSkipAnimation
  };
};

export default {
  useThrottledScroll,
  useThrottledResize,
  useOptimizedAnimation,
  useMemoryOptimization,
  useAdaptiveQuality
};
