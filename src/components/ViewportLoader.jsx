import React, { useEffect, useRef, useState } from 'react';

// Intersection Observer hook untuk memastikan komponen di-render saat masuk viewport
const useInViewport = (options = {}) => {
    const [inViewport, setInViewport] = useState(false);
    const [hasBeenViewed, setHasBeenViewed] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setInViewport(true);
                        setHasBeenViewed(true);
                    } else {
                        setInViewport(false);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
                ...options
            }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, []);

    return { elementRef, inViewport, hasBeenViewed };
};

// Komponen untuk memastikan komentar load saat masuk viewport
const ViewportLoader = ({ children, fallback = null, loadOnce = true }) => {
    const { elementRef, inViewport, hasBeenViewed } = useInViewport();

    const shouldRender = loadOnce ? hasBeenViewed : inViewport;

    return (
        <div ref={elementRef} className="viewport-loader">
            {shouldRender ? children : fallback}
        </div>
    );
};

export default ViewportLoader;
export { useInViewport };
