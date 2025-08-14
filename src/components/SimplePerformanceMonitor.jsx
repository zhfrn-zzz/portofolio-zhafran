import React, { useEffect, useState, useRef } from 'react';

const SimplePerformanceMonitor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    domNodes: 0,
    bundleSize: 0
  });

  // Simple FPS monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      const now = performance.now();
      const delta = now - lastTime;
      
      if (delta >= 1000) {
        const fps = Math.round((frameCount * 1000) / delta);
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = now;
      }
      
      frameCount++;
      requestAnimationFrame(measureFPS);
    };
    
    const animationId = requestAnimationFrame(measureFPS);
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Memory monitoring
  useEffect(() => {
    const updateMetrics = () => {
      const memory = performance.memory ? 
        Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 0;
      const domNodes = document.querySelectorAll('*').length;
      
      setMetrics(prev => ({
        ...prev,
        memory,
        domNodes
      }));
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 3000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50 px-3 py-2 bg-black/80 text-white text-xs rounded-lg border border-white/20 backdrop-blur-sm hover:bg-black/90 transition-colors"
      >
        📊 Performance
      </button>
    );
  }

  const getPerformanceColor = (fps) => {
    if (fps >= 50) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 w-64">
      <div className="bg-black/95 text-white text-xs p-3 rounded-lg backdrop-blur-xl border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-green-400">📊 Performance</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className={getPerformanceColor(metrics.fps)}>
              {metrics.fps}
            </span>
          </div>
          
          {metrics.memory > 0 && (
            <div className="flex justify-between">
              <span>Memory:</span>
              <span className={metrics.memory > 100 ? 'text-yellow-400' : 'text-green-400'}>
                {metrics.memory}MB
              </span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span>DOM:</span>
            <span className={metrics.domNodes > 3000 ? 'text-yellow-400' : 'text-green-400'}>
              {metrics.domNodes}
            </span>
          </div>
        </div>

        {metrics.fps < 30 && (
          <div className="mt-2 p-2 bg-yellow-500/20 rounded text-yellow-400 text-xs">
            ⚠️ Low FPS detected. Consider using power-saver mode.
          </div>
        )}

        <div className="mt-2 flex space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
          >
            🔄 Reload
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
            }}
            className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
          >
            🧹 Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimplePerformanceMonitor;
