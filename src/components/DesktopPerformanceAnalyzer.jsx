import React, { useEffect, useState } from 'react';

const DesktopPerformanceAnalyzer = () => {
  const [analysis, setAnalysis] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const desktop = window.innerWidth >= 1024;
    setIsDesktop(desktop);

    if (!desktop) return;

    const analyzeDesktopPerformance = () => {
      const analysis = {
        // Device capabilities for desktop
        hardware: {
          cores: navigator.hardwareConcurrency || 'Unknown',
          memory: navigator.deviceMemory || 'Unknown',
          pixelRatio: window.devicePixelRatio,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          viewportSize: `${window.innerWidth}x${window.innerHeight}`,
          webGL: checkWebGLSupport(),
          gpu: getGPUInfo()
        },

        // Performance metrics
        performance: {
          jsHeapSize: window.performance.memory ? 
            Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024) : 'Unknown',
          totalHeapSize: window.performance.memory ? 
            Math.round(window.performance.memory.totalJSHeapSize / 1024 / 1024) : 'Unknown',
          heapLimit: window.performance.memory ? 
            Math.round(window.performance.memory.jsHeapSizeLimit / 1024 / 1024) : 'Unknown'
        },

        // Network capabilities
        network: {
          connection: navigator.connection ? {
            type: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink + ' Mbps',
            rtt: navigator.connection.rtt + ' ms',
            saveData: navigator.connection.saveData
          } : 'Unknown',
          onlineStatus: navigator.onLine
        },

        // Feature support
        features: {
          webGL2: checkWebGL2Support(),
          intersectionObserver: 'IntersectionObserver' in window,
          requestIdleCallback: 'requestIdleCallback' in window,
          webWorkers: 'Worker' in window,
          serviceWorkers: 'serviceWorker' in navigator,
          webAssembly: 'WebAssembly' in window,
          es6Modules: checkES6ModuleSupport(),
          css3DTransforms: checkCSS3DSupport()
        },

        // Battery status (if available)
        battery: null,

        // Performance recommendations
        recommendations: []
      };

      // Get battery info if available
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
          analysis.battery = {
            level: Math.round(battery.level * 100) + '%',
            charging: battery.charging,
            chargingTime: battery.chargingTime === Infinity ? 'Unknown' : battery.chargingTime + 's',
            dischargingTime: battery.dischargingTime === Infinity ? 'Unknown' : battery.dischargingTime + 's'
          };
          generateRecommendations(analysis);
          setAnalysis({ ...analysis });
        });
      } else {
        generateRecommendations(analysis);
        setAnalysis(analysis);
      }
    };

    // Helper functions
    function checkWebGLSupport() {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch (e) {
        return false;
      }
    }

    function checkWebGL2Support() {
      try {
        const canvas = document.createElement('canvas');
        return !!canvas.getContext('webgl2');
      } catch (e) {
        return false;
      }
    }

    function getGPUInfo() {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            return {
              vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
              renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            };
          }
        }
        return 'Not available';
      } catch (e) {
        return 'Not available';
      }
    }

    function checkES6ModuleSupport() {
      try {
        return typeof Symbol !== 'undefined' && 
               typeof Map !== 'undefined' && 
               typeof Set !== 'undefined';
      } catch (e) {
        return false;
      }
    }

    function checkCSS3DSupport() {
      const testElement = document.createElement('div');
      testElement.style.transform = 'translate3d(0,0,0)';
      return testElement.style.transform !== '';
    }

    function generateRecommendations(analysis) {
      const recs = [];

      // Memory recommendations
      if (analysis.performance.jsHeapSize > 100) {
        recs.push({
          type: 'warning',
          message: 'High memory usage detected. Consider code splitting for better performance.'
        });
      }

      // Hardware recommendations
      if (analysis.hardware.cores < 4) {
        recs.push({
          type: 'info',
          message: 'Limited CPU cores. Heavy animations and 3D rendering may impact performance.'
        });
      }

      // WebGL recommendations
      if (!analysis.features.webGL2) {
        recs.push({
          type: 'info',
          message: 'WebGL2 not supported. Using WebGL1 fallback for 3D features.'
        });
      }

      // Network recommendations
      if (analysis.network.connection && analysis.network.connection.type === '3g') {
        recs.push({
          type: 'warning',
          message: 'Slow network detected. Consider enabling data-saving features.'
        });
      }

      // Battery recommendations
      if (analysis.battery && analysis.battery.level < 20 && !analysis.battery.charging) {
        recs.push({
          type: 'warning',
          message: 'Low battery detected. Reducing animation intensity for power saving.'
        });
      }

      analysis.recommendations = recs;
    }

    analyzeDesktopPerformance();
  }, []);

  if (!isDesktop) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-500/20 text-blue-300 p-3 rounded-lg text-sm">
        📱 Mobile Device Detected
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-500/20 text-gray-300 p-3 rounded-lg text-sm animate-pulse">
        🔍 Analyzing Desktop Performance...
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-black/90 text-white text-xs p-4 rounded-lg backdrop-blur-lg border border-white/10 max-h-96 overflow-y-auto">
        <h3 className="font-bold mb-3 text-green-400 flex items-center">
          🖥️ Desktop Performance Analysis
        </h3>
        
        {/* Hardware Info */}
        <div className="mb-3">
          <div className="text-blue-300 font-semibold mb-1">Hardware</div>
          <div>CPU Cores: {analysis.hardware.cores}</div>
          <div>Memory: {analysis.hardware.memory}GB</div>
          <div>Resolution: {analysis.hardware.screenResolution}</div>
          <div>Viewport: {analysis.hardware.viewportSize}</div>
          <div>Pixel Ratio: {analysis.hardware.pixelRatio}x</div>
        </div>

        {/* GPU Info */}
        {analysis.hardware.gpu !== 'Not available' && (
          <div className="mb-3">
            <div className="text-blue-300 font-semibold mb-1">Graphics</div>
            <div className="text-xs break-words">
              {typeof analysis.hardware.gpu === 'object' ? 
                `${analysis.hardware.gpu.vendor} ${analysis.hardware.gpu.renderer}` : 
                analysis.hardware.gpu}
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="mb-3">
          <div className="text-blue-300 font-semibold mb-1">Memory Usage</div>
          <div>JS Heap: {analysis.performance.jsHeapSize}MB</div>
          <div>Total: {analysis.performance.totalHeapSize}MB</div>
          <div>Limit: {analysis.performance.heapLimit}MB</div>
        </div>

        {/* Network */}
        {analysis.network.connection !== 'Unknown' && (
          <div className="mb-3">
            <div className="text-blue-300 font-semibold mb-1">Network</div>
            <div>Type: {analysis.network.connection.type}</div>
            <div>Speed: {analysis.network.connection.downlink}</div>
            <div>RTT: {analysis.network.connection.rtt}</div>
            {analysis.network.connection.saveData && (
              <div className="text-yellow-400">Data Saver: ON</div>
            )}
          </div>
        )}

        {/* Feature Support */}
        <div className="mb-3">
          <div className="text-blue-300 font-semibold mb-1">Features</div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div>WebGL: {analysis.features.webGL2 ? '✅ v2' : analysis.features.webGL ? '✅ v1' : '❌'}</div>
            <div>3D CSS: {analysis.features.css3DTransforms ? '✅' : '❌'}</div>
            <div>Workers: {analysis.features.webWorkers ? '✅' : '❌'}</div>
            <div>WASM: {analysis.features.webAssembly ? '✅' : '❌'}</div>
          </div>
        </div>

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div className="mb-3">
            <div className="text-yellow-300 font-semibold mb-1">Recommendations</div>
            {analysis.recommendations.map((rec, idx) => (
              <div key={idx} className={`text-xs mb-1 ${
                rec.type === 'warning' ? 'text-yellow-300' : 'text-blue-300'
              }`}>
                {rec.type === 'warning' ? '⚠️' : 'ℹ️'} {rec.message}
              </div>
            ))}
          </div>
        )}

        {/* Battery (if available) */}
        {analysis.battery && (
          <div>
            <div className="text-blue-300 font-semibold mb-1">Battery</div>
            <div>Level: {analysis.battery.level}</div>
            <div>Status: {analysis.battery.charging ? 'Charging' : 'Discharging'}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopPerformanceAnalyzer;
