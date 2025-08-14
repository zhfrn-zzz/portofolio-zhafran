import React, { useEffect, useRef, useState, useMemo } from "react"
import { usePerformance } from './PerformanceOptimizer'

const OptimizedBackground = () => {
	const { settings, shouldReduceMotion, shouldUseGPU } = usePerformance()
	const blobRefs = useRef([])
	const [isMobile, setIsMobile] = useState(false)
	const animationRef = useRef(null)
	const lastScrollRef = useRef(0)
	const throttleRef = useRef(false)
	
	const initialPositions = useMemo(() => [
		{ x: -4, y: 0 },
		{ x: -4, y: 0 },
		{ x: 20, y: -8 },
		{ x: 20, y: -8 },
	], [])

	// Detect mobile dan performance preferences
	useEffect(() => {
		const checkDevice = () => {
			const mobile = window.innerWidth < 768
			setIsMobile(mobile)
		}

		checkDevice()
		window.addEventListener('resize', checkDevice)
		return () => window.removeEventListener('resize', checkDevice)
	}, [])

	useEffect(() => {
		// Don't animate if disabled or reduced motion preferred
		if (!settings.enableAnimations || shouldReduceMotion()) return

		let currentScroll = 0
		let requestId
		
		const handleScroll = () => {
			// Throttle scroll events based on performance mode
			if (throttleRef.current) return
			
			throttleRef.current = true
			const throttleDelay = settings.maxFPS < 45 ? 32 : 16 // ~30fps vs 60fps
			
			setTimeout(() => {
				throttleRef.current = false
			}, throttleDelay)

			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current)
			}

			animationRef.current = requestAnimationFrame(() => {
				const newScroll = window.pageYOffset
				const scrollDelta = Math.abs(newScroll - lastScrollRef.current)
				
				// Skip animation if scroll delta is too small (performance optimization)
				if (scrollDelta < 2) return
				
				lastScrollRef.current = newScroll
				currentScroll = newScroll

				blobRefs.current.forEach((blob, index) => {
					if (!blob) return
					
					const initialPos = initialPositions[index]
					
					// Reduced animation intensity based on performance mode
					let intensity = 1
					if (settings.maxFPS < 45) intensity = 0.5
					if (isMobile) intensity *= 0.7
					
					// Simplified calculation for low-end devices
					const useSimpleAnimation = settings.maxFPS < 30
					
					let x, y
					if (useSimpleAnimation) {
						// Simple linear movement for low-end devices
						x = initialPos.x + (Math.sin(newScroll / 200) * 100 * intensity)
						y = initialPos.y + (Math.cos(newScroll / 200) * 20 * intensity)
					} else {
						// Full trigonometric movement for better devices
						const xOffset = Math.sin(newScroll / 100 + index * 0.5) * (340 * intensity)
						const yOffset = Math.cos(newScroll / 100 + index * 0.5) * (40 * intensity)
						x = initialPos.x + xOffset
						y = initialPos.y + yOffset
					}

					// Use appropriate transform based on GPU support
					if (shouldUseGPU()) {
						blob.style.transform = `translate3d(${x}px, ${y}px, 0)`
					} else {
						blob.style.transform = `translate(${x}px, ${y}px)`
					}
					
					// Adjust transition based on performance
					const transitionDuration = settings.maxFPS < 30 ? '1.2s' : 
											   settings.maxFPS < 45 ? '1.0s' : 
											   isMobile ? '0.8s' : '1.4s'
											   
					blob.style.transition = `transform ${transitionDuration} ease-out`
				})
			})
		}

		// Use passive listener for better performance
		window.addEventListener("scroll", handleScroll, { passive: true })
		return () => {
			window.removeEventListener("scroll", handleScroll)
			if (animationRef.current) cancelAnimationFrame(animationRef.current)
		}
	}, [settings, shouldReduceMotion, shouldUseGPU, isMobile, initialPositions])

	// Static version for power-saver mode
	if (!settings.enableAnimations || shouldReduceMotion()) {
		return (
			<div className="fixed inset-0 pointer-events-none -z-10" data-testid="background-static">
				<div className="absolute inset-0">
					<div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[64px] opacity-10"></div>
					<div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[64px] opacity-10"></div>
				</div>
			</div>
		)
	}

	// Get appropriate sizes based on performance settings
	const getBlobSize = () => {
		if (settings.maxFPS < 30) return isMobile ? 'w-32 h-32' : 'w-48 h-48'
		if (settings.maxFPS < 45) return isMobile ? 'w-40 h-40' : 'w-60 h-60'
		return isMobile ? 'w-48 h-48' : 'md:w-96 md:h-96 w-72 h-72'
	}

	const getBlurAmount = () => {
		if (!settings.enableBlur) return ''
		if (settings.maxFPS < 30) return 'blur-[32px]'
		if (settings.maxFPS < 45) return 'blur-[48px]'
		return isMobile ? 'blur-[64px]' : 'blur-[128px]'
	}

	const getOpacity = () => {
		if (settings.maxFPS < 30) return 'opacity-10'
		if (settings.maxFPS < 45) return 'opacity-15'
		return 'opacity-40 md:opacity-20'
	}

	return (
		<div className="fixed inset-0 pointer-events-none -z-10" data-testid="background-animated">
			<div className="absolute inset-0">
				{/* First blob */}
				<div
					ref={(ref) => (blobRefs.current[0] = ref)}
					className={`absolute top-0 -left-4 ${getBlobSize()} bg-purple-500 rounded-full mix-blend-multiply filter ${getBlurAmount()} ${getOpacity()} will-change-transform`}
				></div>
				
				{/* Second blob */}
				<div
					ref={(ref) => (blobRefs.current[1] = ref)}
					className={`absolute top-0 -right-4 ${getBlobSize()} bg-cyan-500 rounded-full mix-blend-multiply filter ${getBlurAmount()} ${getOpacity()} will-change-transform`}
				></div>
				
				{/* Third blob */}
				<div
					ref={(ref) => (blobRefs.current[2] = ref)}
					className={`absolute -bottom-8 left-20 ${getBlobSize()} bg-blue-500 rounded-full mix-blend-multiply filter ${getBlurAmount()} ${getOpacity()} will-change-transform`}
				></div>
				
				{/* Fourth blob */}
				<div
					ref={(ref) => (blobRefs.current[3] = ref)}
					className={`absolute -bottom-8 -right-20 ${getBlobSize()} bg-indigo-500 rounded-full mix-blend-multiply filter ${getBlurAmount()} ${getOpacity()} will-change-transform`}
				></div>
			</div>
		</div>
	)
}

export default OptimizedBackground
