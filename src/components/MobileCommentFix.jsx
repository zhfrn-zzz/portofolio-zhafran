import React, { useEffect } from 'react';
import AOS from 'aos';

// Mobile-specific wrapper for comment section to ensure proper rendering
const MobileCommentFix = ({ children, isMobile = false }) => {
    useEffect(() => {
        if (isMobile) {
            // Mobile-specific AOS refresh
            const refreshAOS = () => {
                setTimeout(() => {
                    AOS.refresh();
                }, 100);
            };

            // Multiple refresh attempts for mobile
            refreshAOS();
            
            // Refresh on scroll events
            const handleScroll = () => {
                clearTimeout(window.aosRefreshTimer);
                window.aosRefreshTimer = setTimeout(() => {
                    AOS.refresh();
                }, 150);
            };

            // Refresh on resize events
            const handleResize = () => {
                clearTimeout(window.aosRefreshTimer);
                window.aosRefreshTimer = setTimeout(() => {
                    AOS.refresh();
                }, 200);
            };

            // Refresh on orientation change
            const handleOrientationChange = () => {
                setTimeout(() => {
                    AOS.refresh();
                }, 300);
            };

            if (isMobile) {
                window.addEventListener('scroll', handleScroll, { passive: true });
                window.addEventListener('resize', handleResize);
                window.addEventListener('orientationchange', handleOrientationChange);

                return () => {
                    window.removeEventListener('scroll', handleScroll);
                    window.removeEventListener('resize', handleResize);
                    window.removeEventListener('orientationchange', handleOrientationChange);
                    if (window.aosRefreshTimer) {
                        clearTimeout(window.aosRefreshTimer);
                    }
                };
            }
        }
    }, [isMobile]);

    return (
        <div className={`mobile-comment-wrapper ${isMobile ? 'mobile-optimized' : ''}`}>
            {children}
            <style jsx>{`
                .mobile-optimized {
                    /* Ensure proper rendering on mobile */
                    transform: translateZ(0);
                    backface-visibility: hidden;
                    -webkit-font-smoothing: antialiased;
                }
            `}</style>
        </div>
    );
};

export default MobileCommentFix;
