import React, { useEffect, useState, useRef } from 'react';
import { usePerformance } from './PerformanceOptimizer';

const AdvancedPerformanceMonitor = () => {
  const { metrics, performanceMode, setPerformanceMode, isLowEndDevice } = usePerformance();
  const [isVisible, setIsVisible] = useState(false);
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    domNodes: 0,
    layoutShifts: 0,
    longTasks: 0,
    resourceCount: 0,
    bundleSize: 0
  });
  const performanceObserverRef = useRef(null);
  const layoutShiftRef = useRef(0);
  const longTaskCountRef = useRef(0);

  // Monitor DOM complexity
  useEffect(() => {
    const updateDOMComplexity = () => {
      const domNodes = document.querySelectorAll('*').length;
      const resources = performance.getEntriesByType('resource').length;
      
      setRealtimeMetrics(prev => ({
        ...prev,
        domNodes,
        resourceCount: resources
      }));
    };

    updateDOMComplexity();
    const interval = setInterval(updateDOMComplexity, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Monitor Layout Shifts and Long Tasks
  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;

    const observers = [];

    // Layout Shift Observer
    if ('layoutShift' in PerformanceObserver.supportedEntryTypes) {
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            layoutShiftRef.current += entry.value;
          }
        }
        setRealtimeMetrics(prev => ({
          ...prev,
          layoutShifts: Math.round(layoutShiftRef.current * 1000) / 1000
        }));
      });
      
      try {
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        observers.push(layoutShiftObserver);
      } catch (e) {
        console.warn('Layout shift monitoring not supported');
      }
    }

    // Long Task Observer
    if ('longtask' in PerformanceObserver.supportedEntryTypes) {
      const longTaskObserver = new PerformanceObserver((list) => {
        longTaskCountRef.current += list.getEntries().length;
        setRealtimeMetrics(prev => ({
          ...prev,
          longTasks: longTaskCountRef.current
        }));
      });
      
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        observers.push(longTaskObserver);
      } catch (e) {
        console.warn('Long task monitoring not supported');
      }
    }

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  // Calculate estimated bundle size
  useEffect(() => {
    const resources = performance.getEntriesByType('resource');
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') || resource.name.includes('javascript')
    );
    
    const totalSize = jsResources.reduce((total, resource) => {
      return total + (resource.transferSize || resource.encodedBodySize || 0);
    }, 0);
    
    setRealtimeMetrics(prev => ({
      ...prev,
      bundleSize: Math.round(totalSize / 1024) // KB
    }));
  }, []);

  const getPerformanceScore = () => {
    let score = 100;
    
    // FPS penalty
    if (metrics.fps < 60) score -= (60 - metrics.fps) * 0.5;
    if (metrics.fps < 30) score -= 20; // Heavy penalty for very low FPS
    
    // Memory penalty
    if (metrics.memory > 100) score -= (metrics.memory - 100) * 0.1;
    if (metrics.memory > 200) score -= 15; // Heavy penalty for high memory
    
    // Layout shift penalty
    if (realtimeMetrics.layoutShifts > 0.1) score -= realtimeMetrics.layoutShifts * 50;
    
    // Long task penalty
    if (realtimeMetrics.longTasks > 5) score -= (realtimeMetrics.longTasks - 5) * 2;
    
    // DOM complexity penalty
    if (realtimeMetrics.domNodes > 3000) score -= (realtimeMetrics.domNodes - 3000) * 0.01;
    
    return Math.max(0, Math.round(score));
  };

  const getPerformanceGrade = (score) => {
    if (score >= 90) return { grade: 'A', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score >= 80) return { grade: 'B', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (score >= 60) return { grade: 'D', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    return { grade: 'F', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (metrics.fps < 30) {
      recommendations.push('⚠️ Very low FPS detected. Consider switching to power-saver mode.');
    }
    
    if (metrics.memory > 150) {
      recommendations.push('🧠 High memory usage. Close unused tabs or restart browser.');
    }
    
    if (realtimeMetrics.layoutShifts > 0.1) {
      recommendations.push('📐 Layout shifts detected. Images may be loading without dimensions.');
    }
    
    if (realtimeMetrics.longTasks > 10) {
      recommendations.push('⏱️ Long tasks blocking main thread. Heavy JavaScript execution detected.');
    }
    
    if (realtimeMetrics.domNodes > 5000) {
      recommendations.push('🌳 High DOM complexity. Consider virtualizing long lists.');
    }
    
    if (realtimeMetrics.bundleSize > 1000) {
      recommendations.push('📦 Large bundle size. Consider code splitting.');
    }
    
    return recommendations;
  };

  const performanceScore = getPerformanceScore();
  const performanceGrade = getPerformanceGrade(performanceScore);
  const recommendations = getRecommendations();

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50 px-3 py-2 bg-black/80 text-white text-xs rounded-lg border border-white/20 backdrop-blur-sm hover:bg-black/90 transition-colors"
      >
        📊 Performance Monitor
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 max-h-96 overflow-y-auto">
      <div className="bg-black/95 text-white text-xs p-4 rounded-lg backdrop-blur-xl border border-white/10">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-green-400 flex items-center">
            📊 Advanced Performance Monitor
          </h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Performance Score */}
        <div className={`mb-3 p-2 rounded ${performanceGrade.bg}`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Performance Score</span>
            <div className="flex items-center space-x-2">
              <span className={`text-lg font-bold ${performanceGrade.color}`}>
                {performanceGrade.grade}
              </span>
              <span className="text-xs text-gray-300">({performanceScore}/100)</span>
            </div>
          </div>
        </div>

        {/* Current Mode with Quick Switch */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-blue-300 font-semibold">Performance Mode</span>
            <span className={`text-xs px-2 py-1 rounded ${
              performanceMode === 'power-saver' ? 'bg-green-500/20 text-green-400' :
              performanceMode === 'balanced' ? 'bg-yellow-500/20 text-yellow-400' :
              performanceMode === 'performance' ? 'bg-blue-500/20 text-blue-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {performanceMode}
            </span>
          </div>
          
          {/* Quick mode switcher */}
          <div className="flex space-x-1">
            {['power-saver', 'balanced', 'performance'].map(mode => (
              <button
                key={mode}
                onClick={() => setPerformanceMode(mode)}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  performanceMode === mode
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {mode.split('-')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="mb-3">
          <div className="text-blue-300 font-semibold mb-1">Real-time Metrics</div>
          <div className="grid grid-cols-2 gap-1">
            <div>FPS: <span className={metrics.fps < 30 ? 'text-red-400' : metrics.fps < 50 ? 'text-yellow-400' : 'text-green-400'}>{metrics.fps}</span></div>
            <div>Memory: <span className={metrics.memory > 150 ? 'text-red-400' : metrics.memory > 100 ? 'text-yellow-400' : 'text-green-400'}>{metrics.memory}MB</span></div>
            <div>DOM Nodes: <span className={realtimeMetrics.domNodes > 5000 ? 'text-red-400' : realtimeMetrics.domNodes > 3000 ? 'text-yellow-400' : 'text-green-400'}>{realtimeMetrics.domNodes}</span></div>
            <div>Bundle: <span className={realtimeMetrics.bundleSize > 1000 ? 'text-red-400' : realtimeMetrics.bundleSize > 500 ? 'text-yellow-400' : 'text-green-400'}>{realtimeMetrics.bundleSize}KB</span></div>
            <div>CLS: <span className={realtimeMetrics.layoutShifts > 0.1 ? 'text-red-400' : realtimeMetrics.layoutShifts > 0.05 ? 'text-yellow-400' : 'text-green-400'}>{realtimeMetrics.layoutShifts}</span></div>
            <div>Long Tasks: <span className={realtimeMetrics.longTasks > 10 ? 'text-red-400' : realtimeMetrics.longTasks > 5 ? 'text-yellow-400' : 'text-green-400'}>{realtimeMetrics.longTasks}</span></div>
          </div>
        </div>

        {/* Device Info */}
        {isLowEndDevice && (
          <div className="mb-3 p-2 bg-yellow-500/20 rounded">
            <span className="text-yellow-400 text-xs">
              🔋 Low-end device detected - optimizations active
            </span>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-3">
            <div className="text-yellow-300 font-semibold mb-1">Recommendations</div>
            <div className="space-y-1">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <div key={idx} className="text-xs text-gray-300">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
          >
            🔄 Reload
          </button>
          <button
            onClick={() => {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                  registrations.forEach(registration => registration.unregister());
                });
              }
              localStorage.clear();
              sessionStorage.clear();
            }}
            className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
          >
            🧹 Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPerformanceMonitor;
