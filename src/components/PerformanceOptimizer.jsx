import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const PerformanceContext = createContext();

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

export const PerformanceProvider = ({ children }) => {
  const [performanceMode, setPerformanceMode] = useState('auto');
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    isThrottling: false,
    lastFrameTime: 0
  });
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef([]);
  const memoryCheckIntervalRef = useRef(null);

  // Detect low-end device capabilities
  useEffect(() => {
    const detectLowEndDevice = () => {
      const checks = {
        // CPU cores
        cores: navigator.hardwareConcurrency < 4,
        // Available memory
        memory: navigator.deviceMemory && navigator.deviceMemory < 4,
        // GPU capability (basic WebGL test)
        gpu: !checkWebGLPerformance(),
        // Connection speed
        connection: navigator.connection && 
                   (navigator.connection.effectiveType === '3g' || 
                    navigator.connection.effectiveType === 'slow-2g'),
        // Device pixel ratio (high DPR can impact performance)
        pixelRatio: window.devicePixelRatio > 2
      };

      const lowEndScore = Object.values(checks).filter(Boolean).length;
      const isLowEnd = lowEndScore >= 2; // If 2 or more indicators suggest low-end
      
      setIsLowEndDevice(isLowEnd);
      
      if (isLowEnd) {
        setPerformanceMode('power-saver');
      }
    };

    detectLowEndDevice();
  }, []);

  // Real-time FPS monitoring
  useEffect(() => {
    let animationId;
    
    const measureFPS = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      
      if (delta >= 1000) { // Calculate FPS every second
        const fps = Math.round((frameCountRef.current * 1000) / delta);
        
        // Keep FPS history for trend analysis
        fpsHistoryRef.current.push(fps);
        if (fpsHistoryRef.current.length > 10) {
          fpsHistoryRef.current.shift();
        }
        
        // Calculate average FPS
        const avgFPS = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
        
        // Detect if device is struggling
        const isThrottling = avgFPS < 30;
        
        setMetrics(prev => ({
          ...prev,
          fps: fps,
          isThrottling,
          lastFrameTime: delta
        }));
        
        // Auto-adjust performance mode based on FPS
        if (performanceMode === 'auto') {
          if (avgFPS < 24) {
            setPerformanceMode('power-saver');
          } else if (avgFPS < 45) {
            setPerformanceMode('balanced');
          } else {
            setPerformanceMode('performance');
          }
        }
        
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      
      frameCountRef.current++;
      animationId = requestAnimationFrame(measureFPS);
    };
    
    animationId = requestAnimationFrame(measureFPS);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [performanceMode]);

  // Memory monitoring
  useEffect(() => {
    const checkMemory = () => {
      if (performance.memory) {
        const usedMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        const totalMB = Math.round(performance.memory.totalJSHeapSize / 1024 / 1024);
        const limitMB = Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024);
        
        setMetrics(prev => ({
          ...prev,
          memory: usedMB,
          memoryPressure: usedMB / limitMB > 0.8 // High memory pressure
        }));
        
        // Auto-adjust if memory pressure is high
        if (performanceMode === 'auto' && usedMB / limitMB > 0.9) {
          setPerformanceMode('power-saver');
        }
      }
    };
    
    checkMemory();
    memoryCheckIntervalRef.current = setInterval(checkMemory, 5000);
    
    return () => {
      if (memoryCheckIntervalRef.current) {
        clearInterval(memoryCheckIntervalRef.current);
      }
    };
  }, [performanceMode]);

  // WebGL performance check
  function checkWebGLPerformance() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return false;
      
      // Test if we can create a reasonable number of textures
      const maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
      const maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
      
      return maxTextures >= 8 && maxVertexTextures >= 4;
    } catch (e) {
      return false;
    }
  }

  // Get optimized settings based on performance mode
  const getOptimizedSettings = () => {
    switch (performanceMode) {
      case 'power-saver':
        return {
          // Animation settings
          enableAnimations: false,
          enableParallax: false,
          enableBlur: false,
          enableGradients: false,
          enableShadows: false,
          
          // Image settings
          imageQuality: 'low',
          lazyLoadThreshold: '100px',
          
          // Rendering settings
          renderScale: 0.75,
          maxFPS: 30,
          
          // Feature flags
          enable3D: false,
          enableIntersectionObserver: true,
          enableVirtualization: true
        };
        
      case 'balanced':
        return {
          enableAnimations: true,
          enableParallax: false,
          enableBlur: true,
          enableGradients: true,
          enableShadows: false,
          
          imageQuality: 'medium',
          lazyLoadThreshold: '50px',
          
          renderScale: 0.9,
          maxFPS: 45,
          
          enable3D: false,
          enableIntersectionObserver: true,
          enableVirtualization: true
        };
        
      case 'performance':
      default:
        return {
          enableAnimations: true,
          enableParallax: true,
          enableBlur: true,
          enableGradients: true,
          enableShadows: true,
          
          imageQuality: 'high',
          lazyLoadThreshold: '20px',
          
          renderScale: 1.0,
          maxFPS: 60,
          
          enable3D: true,
          enableIntersectionObserver: true,
          enableVirtualization: false
        };
    }
  };

  const value = {
    performanceMode,
    setPerformanceMode,
    isLowEndDevice,
    metrics,
    settings: getOptimizedSettings(),
    
    // Utility functions
    shouldReduceMotion: () => {
      return performanceMode === 'power-saver' || 
             window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    
    shouldUseGPU: () => {
      return performanceMode !== 'power-saver' && !isLowEndDevice;
    },
    
    getImageSrcSet: (baseUrl, sizes = [400, 800, 1200]) => {
      const quality = getOptimizedSettings().imageQuality;
      const scaleFactor = quality === 'low' ? 0.7 : quality === 'medium' ? 0.85 : 1.0;
      
      return sizes.map(size => {
        const scaledSize = Math.round(size * scaleFactor);
        return `${baseUrl}?w=${scaledSize}&q=${quality === 'low' ? 60 : quality === 'medium' ? 75 : 90} ${scaledSize}w`;
      }).join(', ');
    }
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

export default PerformanceProvider;
