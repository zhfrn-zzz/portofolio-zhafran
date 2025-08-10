import React from 'react';

// Mount children only when near viewport (or after an optional timeout)
export default function DeferMount({ children, rootMargin = '600px', mountAfterMs = 0 }) {
  const [mounted, setMounted] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (mounted) return;
    let observer;
    let timerId;

    const onIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setMounted(true);
        }
      });
    };

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(onIntersect, { rootMargin });
      if (ref.current) observer.observe(ref.current);
    } else {
      // Fallback: mount immediately on very old browsers
      setMounted(true);
    }

    if (mountAfterMs && mountAfterMs > 0) {
      timerId = setTimeout(() => setMounted(true), mountAfterMs);
    }

    return () => {
      if (observer && ref.current) observer.unobserve(ref.current);
      if (observer) observer.disconnect();
      if (timerId) clearTimeout(timerId);
    };
  }, [mounted, rootMargin, mountAfterMs]);

  if (mounted) return children;

  // Placeholder shim so observer can trigger; minimal layout impact
  return <div ref={ref} aria-hidden="true" />;
}
