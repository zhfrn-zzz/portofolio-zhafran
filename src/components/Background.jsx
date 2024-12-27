/* import React, { useEffect, useRef } from "react"

const AnimatedBackground = () => {
	const blobRefs = useRef([])
	const initialPositions = [
		{ x: -4, y: 0 },
		{ x: -4, y: 0 },
		{ x: 20, y: -8 },
		{ x: 20, y: -8 },
	]

	useEffect(() => {
		let currentScroll = 0
		let requestId

		const handleScroll = () => {
			const newScroll = window.pageYOffset
			const scrollDelta = newScroll - currentScroll
			currentScroll = newScroll

			blobRefs.current.forEach((blob, index) => {
				const initialPos = initialPositions[index]

				// Calculating movement in both X and Y direction
				const xOffset = Math.sin(newScroll / 100 + index * 0.5) * 340 // Horizontal movement
				const yOffset = Math.cos(newScroll / 100 + index * 0.5) * 40 // Vertical movement

				const x = initialPos.x + xOffset
				const y = initialPos.y + yOffset

				// Apply transformation with smooth transition
				blob.style.transform = `translate(${x}px, ${y}px)`
				blob.style.transition = "transform 1.4s ease-out"
			})

			requestId = requestAnimationFrame(handleScroll)
		}

		window.addEventListener("scroll", handleScroll)
		return () => {
			window.removeEventListener("scroll", handleScroll)
			cancelAnimationFrame(requestId)
		}
	}, [])

	return (
		<div className="fixed inset-0 ">
			<div className="absolute inset-0">
				<div
					ref={(ref) => (blobRefs.current[0] = ref)}
					className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
				<div
					ref={(ref) => (blobRefs.current[1] = ref)}
					className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
				<div
					ref={(ref) => (blobRefs.current[2] = ref)}
					className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
					<div
					ref={(ref) => (blobRefs.current[3] = ref)}
					className="absolute -bottom-10 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
			</div>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:24px_24px]"></div>
		</div>
	)
}

export default AnimatedBackground
 */
import React, { useEffect, useRef, useState } from "react"

const AnimatedBackground = () => {
  const blobRefs = useRef([])
  const [isMobile, setIsMobile] = useState(false)
  const animationFrameRef = useRef()
  
  const config = {
    mobile: {
      blurAmount: '96px',
      moveAmount: 30, // Sangat minimal untuk mobile
      verticalAmount: 10,
      blobSize: 'w-72 h-72',
      transitionDuration: '3s', // Lebih lambat di mobile untuk efek subtle
      updateInterval: 100 // Update lebih jarang di mobile
    },
    desktop: {
      blurAmount: '128px',
      moveAmount: 340,
      verticalAmount: 40,
      blobSize: 'w-96 h-96',
      transitionDuration: '1.4s',
      updateInterval: 16 // Smooth 60fps di desktop
    }
  }

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  useEffect(() => {
    const settings = isMobile ? config.mobile : config.desktop
    let lastUpdate = 0

    const updatePositions = (timestamp) => {
      if (timestamp - lastUpdate < settings.updateInterval) {
        animationFrameRef.current = requestAnimationFrame(updatePositions)
        return
      }

      lastUpdate = timestamp
      const scrollPosition = window.pageYOffset

      blobRefs.current.forEach((blob, index) => {
        if (!blob) return

        let xOffset, yOffset

        if (isMobile) {
          // Mobile: Gerakan minimal dan lambat
          xOffset = Math.sin(scrollPosition / 200 + timestamp * 0.0002) * settings.moveAmount
          yOffset = Math.cos(scrollPosition / 200 + timestamp * 0.0002) * settings.verticalAmount
        } else {
          // Desktop: Gerakan lebih dinamis
          const time = timestamp * 0.001
          xOffset = Math.sin(scrollPosition / 100 + time * 0.5 + index * 0.5) * settings.moveAmount
          yOffset = Math.cos(scrollPosition / 100 + time * 0.5 + index * 0.5) * settings.verticalAmount
        }

        blob.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`
        blob.style.transition = `transform ${settings.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1)`
      })

      animationFrameRef.current = requestAnimationFrame(updatePositions)
    }

    animationFrameRef.current = requestAnimationFrame(updatePositions)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isMobile])

  const blobClass = `${isMobile ? config.mobile.blobSize : config.desktop.blobSize} absolute rounded-full mix-blend-multiply filter opacity-20`
  const blurClass = `blur-[${isMobile ? config.mobile.blurAmount : config.desktop.blurAmount}]`

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0">
        <div
          ref={el => blobRefs.current[0] = el}
          className={`${blobClass} ${blurClass} top-0 -left-4 bg-purple-500 will-change-transform`}
        />
        <div
          ref={el => blobRefs.current[1] = el}
          className={`${blobClass} ${blurClass} top-0 -right-4 bg-cyan-500 will-change-transform`}
        />
        <div
          ref={el => blobRefs.current[2] = el}
          className={`${blobClass} ${blurClass} -bottom-8 left-20 bg-blue-500 will-change-transform`}
        />
        <div
          ref={el => blobRefs.current[3] = el}
          className={`${blobClass} ${blurClass} -bottom-10 right-20 bg-blue-500 opacity-10 will-change-transform`}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  )
}

export default AnimatedBackground