import React, { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20)
		}

		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	const navItems = [
		{ href: "#", label: "Home" },
		{ href: "#AboutUs", label: "About" },
		{ href: "#Services", label: "Project" },
		{ href: "#Contact", label: "Contact" },
	]

	return (
		<nav
			className={`fixed w-full top-0 z-50 transition-all duration-500 ${
				scrolled ? "bg-[rgba(4, 0, 11, 0.75)] backdrop-blur-lg saturate-100 " : "bg-transparent"
			}`}
			style={{
				WebkitBackdropFilter: scrolled ? "blur(16px) saturate(100%)" : "none",
				backdropFilter: scrolled ? "blur(16px) saturate(100%)" : "none",
			}}>
			<div className="mx-auto px-4 sm:px-6 lg:px-[11%]">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<div className="flex-shrink-0">
						<a href="#Home" className="flex items-center space-x-3">
							{/* <img src="/Logo/Logo.png" className="h-8 w-auto" alt="Logo" /> */}
							<span className="text-xl font-bold text-[#e2d3fd] transition-colors duration-300">
								Ekizr
							</span>
						</a>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:block">
						<div className="ml-8 flex items-center space-x-8">
							{navItems.map((item) => (
								<a
									key={item.label}
									href={item.href}
									className="relative px-1 py-2 text-sm font-medium text-[#e2d3fd] transition-colors duration-300 hover:text-purple-600 group">
									{item.label}
									<span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
								</a>
							))}
						</div>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="p-2 rounded-md text-[#e2d3fd] hover:text-purple-600 hover:bg-gray-100 transition-colors duration-300">
							<div className="relative w-6 h-6">
								<span
									className={`absolute top-1/2 left-0 block w-6 h-0.5 bg-current transform transition-all duration-300 ${
										isOpen ? "rotate-45" : "-translate-y-2"
									}`}
								/>
								<span
									className={`absolute top-1/2 left-0 block w-6 h-0.5 bg-current transform transition-all duration-300 ${
										isOpen ? "opacity-0" : "opacity-100"
									}`}
								/>
								<span
									className={`absolute top-1/2 left-0 block w-6 h-0.5 bg-current transform transition-all duration-300 ${
										isOpen ? "-rotate-45" : "translate-y-2"
									}`}
								/>
							</div>
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				<div
					className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
						isOpen ? "max-h-64" : "max-h-0"
					}`}>
					<div className="bg-white border-t px-2 py-3 space-y-1">
						{navItems.map((item, index) => (
							<a
								key={item.label}
								href={item.href}
								style={{
									transitionDelay: `${index * 50}ms`,
								}}
								className={`block px-3 py-2 text-base font-medium text-[#e2d3fd] rounded-lg hover:text-purple-600 hover:bg-purple-50 transform transition-all duration-300 ${
									isOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
								}`}
								onClick={() => setIsOpen(false)}>
								{item.label}
							</a>
						))}
					</div>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
