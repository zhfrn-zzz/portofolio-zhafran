import React, { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { usePerformance } from './PerformanceOptimizer'

const SuperOptimizedImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  onLoad,
  onError,
  placeholder = 'blur',
  quality = 80,
  sizes,
  priority = false,
  ...props
}) => {
  const { settings, getImageSrcSet } = usePerformance()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority || loading === 'eager')
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  // Intersection Observer untuk lazy loading
  useEffect(() => {
    if (priority || loading === 'eager' || !imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: settings.lazyLoadThreshold || '50px',
        threshold: 0.1,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [priority, loading, settings.lazyLoadThreshold])

  const handleLoad = useCallback((e) => {
    setIsLoaded(true)
    setIsLoading(false)
    onLoad?.(e)
  }, [onLoad])

  const handleError = useCallback((e) => {
    setHasError(true)
    setIsLoading(false)
    onError?.(e)
  }, [onError])

  const generateSrcSet = (baseSrc, quality) => {
    if (!baseSrc) return ''
    
    // Use performance-optimized srcset
    if (getImageSrcSet) {
      return getImageSrcSet(baseSrc)
    }
    
    // Fallback for standard generation with performance considerations
    const widths = settings.imageQuality === 'low' ? [320, 640, 1024] : 
                   settings.imageQuality === 'medium' ? [320, 640, 1024, 1280] :
                   [320, 640, 1024, 1280, 1920]
                   
    const adjustedQuality = settings.imageQuality === 'low' ? 60 :
                           settings.imageQuality === 'medium' ? 75 : quality
                           
    return widths
      .map(width => `${baseSrc}?w=${width}&q=${adjustedQuality} ${width}w`)
      .join(', ')
  }

  const getSrc = (baseSrc, quality) => {
    if (!baseSrc) return ''
    
    const adjustedQuality = settings.imageQuality === 'low' ? 60 :
                           settings.imageQuality === 'medium' ? 75 : quality
                           
    return `${baseSrc}?q=${adjustedQuality}`
  }

  // Placeholder blur effect - disabled in power-saver mode
  const getPlaceholderStyle = () => {
    if (placeholder === 'blur' && !isLoaded && settings.enableBlur) {
      return {
        filter: 'blur(10px)',
        transform: 'scale(1.1)',
        transition: settings.enableAnimations ? 'filter 0.3s ease, transform 0.3s ease' : 'none',
      }
    }
    return {}
  }

  const getLoadedStyle = () => {
    if (isLoaded) {
      return {
        filter: 'blur(0)',
        transform: 'scale(1)',
        transition: settings.enableAnimations ? 'filter 0.3s ease, transform 0.3s ease' : 'none',
      }
    }
    return {}
  }

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Loading skeleton - simplified for low-end devices */}
      {isLoading && !hasError && (
        <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded ${
          settings.enableAnimations ? 'animate-pulse' : ''
        }`} />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center rounded">
          <span className="text-gray-400 text-sm">Failed to load image</span>
        </div>
      )}

      {/* Actual image - only render when in view */}
      {isInView && !hasError && (
        <img
          src={getSrc(src, quality)}
          srcSet={generateSrcSet(src, quality)}
          sizes={sizes || '100vw'}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover ${
            settings.enableAnimations ? 'transition-opacity duration-300' : ''
          } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            ...getPlaceholderStyle(),
            ...getLoadedStyle(),
          }}
          // Disable decode attribute for low-end devices
          {...(settings.imageQuality !== 'low' && { decoding: 'async' })}
        />
      )}
    </div>
  )
}

SuperOptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  placeholder: PropTypes.oneOf(['blur', 'empty']),
  quality: PropTypes.number,
  sizes: PropTypes.string,
  priority: PropTypes.bool,
}

export default SuperOptimizedImage
