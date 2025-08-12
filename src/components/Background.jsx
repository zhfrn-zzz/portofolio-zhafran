import React, { useEffect, useRef, useState } from "react"

const AnimatedBackground = () => {
	const blobRefs = useRef([])
	const [isMobile, setIsMobile] = useState(false)
	const [shouldAnimate, setShouldAnimate] = useState(true)
	
	const initialPositions = [
		{ x: -4, y: 0 },
		{ x: -4, y: 0 },
		{ x: 20, y: -8 },
		{ x: 20, y: -8 },
	]

	// Detect mobile dan performance preferences
	useEffect(() => {
		const checkDevice = () => {
			const mobile = window.innerWidth < 768
			setIsMobile(mobile)
			
			// Check reduced motion preference
			const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
			setShouldAnimate(!prefersReducedMotion)
		}

		checkDevice()
		window.addEventListener('resize', checkDevice)
		return () => window.removeEventListener('resize', checkDevice)
	}, [])

	useEffect(() => {
		if (!shouldAnimate) return

		let currentScroll = 0
		let requestId
		let ticking = false

		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					const newScroll = window.pageYOffset
					const scrollDelta = newScroll - currentScroll
					currentScroll = newScroll

					blobRefs.current.forEach((blob, index) => {
						if (!blob) return
						
						const initialPos = initialPositions[index]
						
						// Reduced animation intensity on mobile
						const intensity = isMobile ? 0.5 : 1
						
						// Calculating movement in both X and Y direction
						const xOffset = Math.sin(newScroll / 100 + index * 0.5) * (340 * intensity)
						const yOffset = Math.cos(newScroll / 100 + index * 0.5) * (40 * intensity)

						const x = initialPos.x + xOffset
						const y = initialPos.y + yOffset

						// Use transform3d untuk hardware acceleration
						blob.style.transform = `translate3d(${x}px, ${y}px, 0)`
						blob.style.transition = isMobile ? "transform 0.8s ease-out" : "transform 1.4s ease-out"
					})
					
					ticking = false
				})
				ticking = true
			}
		}

		// Use passive listener untuk better performance
		window.addEventListener("scroll", handleScroll, { passive: true })
		return () => {
			window.removeEventListener("scroll", handleScroll)
			if (requestId) cancelAnimationFrame(requestId)
		}
	}, [shouldAnimate, isMobile])

	// Simplified version untuk low-power mode
	if (!shouldAnimate) {
		return (
			<div className="fixed inset-0 pointer-events-none -z-10" data-testid="background-animation">
				<div className="absolute inset-0">
					<div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
					<div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
				</div>
			</div>
		)
	}

	return (
		<div className="fixed inset-0 pointer-events-none -z-10" data-testid="background-animation">
			<div className="absolute inset-0">
				<div
					ref={(ref) => (blobRefs.current[0] = ref)}
					className={`absolute top-0 -left-4 ${
						isMobile ? 'w-48 h-48' : 'md:w-96 md:h-96 w-72 h-72'
					} bg-purple-500 rounded-full mix-blend-multiply filter ${
						isMobile ? 'blur-[64px]' : 'blur-[128px]'
					} opacity-40 md:opacity-20 will-change-transform`}></div>
				<div
					ref={(ref) => (blobRefs.current[1] = ref)}
					className={`absolute top-0 -right-4 ${
						isMobile ? 'w-48 h-48' : 'w-96 h-96'
					} bg-cyan-500 rounded-full mix-blend-multiply filter ${
						isMobile ? 'blur-[64px]' : 'blur-[128px]'
					} opacity-40 md:opacity-20 ${isMobile ? 'block' : 'hidden sm:block'} will-change-transform`}></div>
				<div
					ref={(ref) => (blobRefs.current[2] = ref)}
					className={`absolute -bottom-8 left-[-40%] md:left-20 ${
						isMobile ? 'w-48 h-48' : 'w-96 h-96'
					} bg-blue-500 rounded-full mix-blend-multiply filter ${
						isMobile ? 'blur-[64px]' : 'blur-[128px]'
					} opacity-40 md:opacity-20 will-change-transform`}></div>
				<div
					ref={(ref) => (blobRefs.current[3] = ref)}
					className={`absolute -bottom-10 right-20 ${
						isMobile ? 'w-48 h-48' : 'w-96 h-96'
					} bg-blue-500 rounded-full mix-blend-multiply filter ${
						isMobile ? 'blur-[64px]' : 'blur-[128px]'
					} opacity-20 md:opacity-10 ${isMobile ? 'hidden' : 'hidden sm:block'} will-change-transform`}></div>
			</div>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:24px_24px]"></div>
		</div>
	)
}

export default AnimatedBackground

