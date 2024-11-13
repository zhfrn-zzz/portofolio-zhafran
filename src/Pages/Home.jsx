import React, { useState, useEffect } from "react"
import { Github, Linkedin, Mail, ExternalLink, Globe2, Sparkles } from "lucide-react"
import Spline from "@splinetool/react-spline"

const Home = () => {
	const [text, setText] = useState("")
	const [isTyping, setIsTyping] = useState(true)
	const words = ["Front-End Developer", "Student in Computer Network Engineering"]
	const [wordIndex, setWordIndex] = useState(0)
	const [charIndex, setCharIndex] = useState(0)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		setIsLoaded(true)
	}, [])

	useEffect(() => {
		const handleMouseMove = (e) => {
			const x = (e.clientX / window.innerWidth - 0.5) * 20
			const y = (e.clientY / window.innerHeight - 0.5) * 20
			setMousePosition({ x, y })
		}

		window.addEventListener("mousemove", handleMouseMove)
		return () => window.removeEventListener("mousemove", handleMouseMove)
	}, [])

	useEffect(() => {
		if (isTyping) {
			if (charIndex < words[wordIndex].length) {
				const timeout = setTimeout(() => {
					setText((prev) => prev + words[wordIndex][charIndex])
					setCharIndex((prev) => prev + 1)
				}, 100)
				return () => clearTimeout(timeout)
			} else {
				setTimeout(() => setIsTyping(false), 2000)
			}
		} else {
			if (charIndex > 0) {
				const timeout = setTimeout(() => {
					setText((prev) => prev.slice(0, -1))
					setCharIndex((prev) => prev - 1)
				}, 50)
				return () => clearTimeout(timeout)
			} else {
				setWordIndex((prev) => (prev + 1) % words.length)
				setIsTyping(true)
			}
		}
	}, [charIndex, isTyping, wordIndex])

	return (
		<div className="min-h-screen bg-[#030014] overflow-hidden ">
			<div
				className={`relative z-10 transition-all duration-1000 ${
					isLoaded ? "opacity-100" : "opacity-0"
				}`}>
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 min-h-screen">
					<div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
						{/* Left Column */}
						<div className="w-full lg:w-1/2 space-y-8">
							<div
								className="space-y-6 transform transition-all duration-500"
								style={{
									transform: `perspective(1000px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${
										mousePosition.x * 0.1
									}deg)`,
								}}>
								{/* Status Badge */}
								<div className="inline-block animate-float">
									<div className="relative group">
										<div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
										<div className="relative px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
											<span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text text-sm font-medium flex items-center">
												<Sparkles className="w-4 h-4 mr-2 text-blue-400" />
												Open to Work
											</span>
										</div>
									</div>
								</div>

								{/* Main Title */}
								<div className="space-y-2">
									<h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
										<span className="relative inline-block">
											<span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
											<span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
												Creative
											</span>
										</span>
										<br />
										<span className="relative inline-block mt-2">
											<span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
											<span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
												Developer
											</span>
										</span>
									</h1>
								</div>

								{/* Typing Effect */}
								<div className="h-8 flex items-center">
									<span className="text-xl sm:text-2xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
										{text}
									</span>
									<span className="w-[3px] h-6 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink"></span>
								</div>

								{/* Description */}
								<p className="text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed font-light">
									Creating Innovative Websites that are Attractive, Functional, and Easy to Use to
									Provide Solutions in Every Digital Aspect.
								</p>

								{/* Tech Stack */}
								<div className="flex flex-wrap gap-3">
									{["React", "Javascript", "Node.js", "Tailwind"].map((tech, index) => (
										<div
											key={index}
											className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
											{tech}
										</div>
									))}
								</div>

								{/* CTA Buttons */}
								<div className="flex flex-wrap gap-4">
									<button className="group relative">
										<div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
										<div className="relative px-6 py-3 bg-black rounded-lg leading-none flex items-center">
											<span className="text-white font-medium flex items-center gap-2">
												View Projects
												<ExternalLink className="w-4 h-4" />
											</span>
										</div>
									</button>

									<button className="px-6 py-3 rounded-lg border border-white/10 text-gray-300 font-medium transition-all duration-300 hover:bg-white/5 flex items-center gap-2">
										Contact
										<Mail className="w-4 h-4" />
									</button>
								</div>

								{/* Social Links */}
								<div className="flex gap-4">
									{[
										{ icon: Github, label: "GitHub" },
										{ icon: Linkedin, label: "LinkedIn" },
										{ icon: Globe2, label: "Website" },
									].map((social, index) => (
										<button key={index} className="group relative p-3">
											<div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
											<div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
												<social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
											</div>
										</button>
									))}
								</div>
							</div>
						</div>

						{/* Right Column - Spline 3D Scene */}
						<div className="w-full h-[600px] lg:h-[750px] xl:h-[800px] relative">
							{/* Spline Container with Enhanced Positioning */}
							<div className="relative w-full h-full flex items-end justify-end">
								<Spline
									scene="https://prod.spline.design/O7sWMm8KOBxBAXqR/scene.splinecode"
									className="w-full h-full object-contain md:relative block md:left-[5%]"
									style={{
										clipPath: "inset(0 10% 8% 0)", // Crop bottom-right corner
										transform: "scale(1.05)", // Optional slight scale to adjust the view
									}}
								/>
							</div>

							{/* Interactive Light Effects */}
							<div className="absolute inset-0 pointer-events-none">
								{/* Center floating light */}
								<div className="opacity-90 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] delay-500"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home
