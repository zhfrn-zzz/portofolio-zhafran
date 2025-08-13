import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  loading = 'lazy',
  priority = false,
  sizes,
  placeholder = true,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!loading || loading === 'eager');
  const imgRef = useRef(null);

  // Intersection Observer untuk lazy loading yang lebih efisien
  useEffect(() => {
    if (!imgRef.current || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [isInView]);

  // Generate responsive srcSet untuk mobile optimization
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc) return '';
    
    // Untuk Supabase atau CDN images, bisa tambahkan parameter resize
    const formats = [
      `${baseSrc}?width=400 400w`,
      `${baseSrc}?width=800 800w`,
      `${baseSrc}?width=1200 1200w`
    ];
    
    return formats.join(', ');
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder blur effect */}
      {placeholder && !isLoaded && (
        <div 
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          srcSet={generateSrcSet(src)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } w-full h-full object-cover`}
          onLoad={handleLoad}
          {...(priority ? { fetchpriority: 'high' } : {})}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
