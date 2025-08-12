import React, { useEffect, useState } from 'react';

const PerformanceMonitor = ({ enabled = false }) => {
  const [metrics, setMetrics] = useState({});
  const [deviceInfo, setDeviceInfo] = useState({});

  useEffect(() => {
    if (!enabled) return;

    const collectMetrics = () => {
      // Device capabilities
      const device = {
        isMobile: window.innerWidth < 768,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        hardwareConcurrency: navigator.hardwareConcurrency,
        maxTouchPoints: navigator.maxTouchPoints,
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
          saveData: navigator.connection.saveData
        } : null,
        battery: null
      };

      // Battery API (if available)
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
          device.battery = {
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          };
          setDeviceInfo(device);
        });
      } else {
        setDeviceInfo(device);
      }

      // Performance metrics
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        const paintMetrics = performance.getEntriesByType('paint');
        
        const metrics = {
          // Core Web Vitals approximations
          loading: {
            domContentLoaded: perfData?.domContentLoadedEventEnd - perfData?.fetchStart,
            firstPaint: paintMetrics.find(p => p.name === 'first-paint')?.startTime,
            firstContentfulPaint: paintMetrics.find(p => p.name === 'first-contentful-paint')?.startTime,
            loadComplete: perfData?.loadEventEnd - perfData?.fetchStart
          },
          // Resource timing
          resources: performance.getEntriesByType('resource').length,
          // Memory usage (if available)
          memory: window.performance.memory ? {
            used: window.performance.memory.usedJSHeapSize,
            total: window.performance.memory.totalJSHeapSize,
            limit: window.performance.memory.jsHeapSizeLimit
          } : null
        };

        setMetrics(metrics);
      }
    };

    // Collect initial metrics
    collectMetrics();

    // Collect metrics after page load
    if (document.readyState === 'loading') {
      window.addEventListener('load', collectMetrics);
      return () => window.removeEventListener('load', collectMetrics);
    }
  }, [enabled]);

  if (!enabled || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs">
      <div className="bg-black/90 text-white text-xs p-4 rounded-lg backdrop-blur-lg border border-white/10">
        <h3 className="font-bold mb-2 text-green-400">Performance Monitor</h3>
        
        {deviceInfo.isMobile !== undefined && (
          <div className="mb-2">
            <div className="text-blue-300 font-semibold">Device</div>
            <div>Mobile: {deviceInfo.isMobile ? 'Yes' : 'No'}</div>
            <div>Screen: {deviceInfo.screenWidth}x{deviceInfo.screenHeight}</div>
            <div>DPR: {deviceInfo.devicePixelRatio}</div>
            {deviceInfo.hardwareConcurrency && (
              <div>CPU Cores: {deviceInfo.hardwareConcurrency}</div>
            )}
          </div>
        )}

        {deviceInfo.connection && (
          <div className="mb-2">
            <div className="text-blue-300 font-semibold">Network</div>
            <div>Type: {deviceInfo.connection.effectiveType}</div>
            <div>Speed: {deviceInfo.connection.downlink} Mbps</div>
            <div>RTT: {deviceInfo.connection.rtt}ms</div>
            {deviceInfo.connection.saveData && (
              <div className="text-yellow-400">Data Saver: ON</div>
            )}
          </div>
        )}

        {deviceInfo.battery && (
          <div className="mb-2">
            <div className="text-blue-300 font-semibold">Battery</div>
            <div>Level: {Math.round(deviceInfo.battery.level * 100)}%</div>
            <div>Status: {deviceInfo.battery.charging ? 'Charging' : 'Discharging'}</div>
          </div>
        )}

        {metrics.loading && (
          <div className="mb-2">
            <div className="text-blue-300 font-semibold">Performance</div>
            <div>FCP: {Math.round(metrics.loading.firstContentfulPaint || 0)}ms</div>
            <div>DCL: {Math.round(metrics.loading.domContentLoaded || 0)}ms</div>
            <div>Load: {Math.round(metrics.loading.loadComplete || 0)}ms</div>
            <div>Resources: {metrics.resources}</div>
          </div>
        )}

        {metrics.memory && (
          <div>
            <div className="text-blue-300 font-semibold">Memory</div>
            <div>Used: {Math.round(metrics.memory.used / 1024 / 1024)}MB</div>
            <div>Total: {Math.round(metrics.memory.total / 1024 / 1024)}MB</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMonitor;
