import React, { Suspense } from 'react';

const PerformanceMonitorWrapper = React.lazy(() => import('./AdvancedPerformanceMonitor'));

class PerformanceErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Performance monitoring error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Silent fail for performance monitoring
    }

    return this.props.children;
  }
}

const SafePerformanceMonitor = () => {
  return (
    <PerformanceErrorBoundary>
      <Suspense fallback={null}>
        <PerformanceMonitorWrapper />
      </Suspense>
    </PerformanceErrorBoundary>
  );
};

export default SafePerformanceMonitor;
