import React from "react"
import { UserCircle, FileText, Code, Download, Award, Globe, ArrowRight, ArrowUpRight } from "lucide-react"

const AboutPage = () => {
	const totalProjects = 25
	const totalCertificates = 12

	return (
		<div className="min-h-screen  text-white overflow-hidden mx-[10%]">
			<div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					{/* About Section */}
					<div className="space-y-6 transform transition-all duration-700 animate-fade-in-left">
						<h2 className="text-5xl lg:text-6xl font-bold">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] animate-text">
								Hello, I'm
							</span>
							{" "}
							<span className="block mt-2 animate-pulse-slow">Eki Zulfar Rachman</span>
						</h2>
						<p className="text-lg lg:text-xl text-gray-300 leading-relaxed animate-fade-in-up delay-200">
							A passionate Front-End Developer creating immersive digital experiences 
							with cutting-edge JavaScript, React, and modern web technologies.
						</p>
						<div className="flex space-x-4 animate-fade-in-up delay-400">
							<button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl animate-bounce-slow">
								<FileText className="w-5 h-5" /> Download CV
							</button>
							<button className="px-6 py-3 rounded-lg border border-[#a855f7]/50 text-[#a855f7] font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 hover:bg-[#a855f7]/10 animate-bounce-slow delay-200">
								<Code className="w-5 h-5" /> View Projects
							</button>
						</div>
					</div>

					{/* Enhanced Photo Section */}
					<div className="flex justify-center items-center">
						<div className="relative group animate-fade-in-right">
							<div className="absolute -inset-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full opacity-30 blur-2xl animate-pulse-slow"></div>
							<div className="relative">
								<div className="w-80 h-80 rounded-full overflow-hidden border-4 border-[#6366f1]/30 shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
									<img
										src="/Photo.png"
										alt="Profile"
										className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Stats Section */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    {[
                        {
                            icon: Code,
                            color: 'from-[#6366f1] to-[#a855f7]',
                            value: totalProjects,
                            label: 'Total Projects',
                            description: 'Innovative web solutions crafted'
                        },
                        {
                            icon: Award,
                            color: 'from-[#a855f7] to-[#6366f1]',
                            value: totalCertificates,
                            label: 'Certificates',
                            description: 'Professional skills validated'
                        },
                        {
                            icon: Globe,
                            color: 'from-[#6366f1] to-[#a855f7]',
                            value: '10+',
                            label: 'Years of Experience',
                            description: 'Continuous learning journey'
                        }
                    ].map((stat, index) => (
                        <div 
                            key={stat.label} 
                            className="relative group"
                        >
                            <div className={`
                                relative z-10 
                                bg-gray-900/50 
                                backdrop-blur-lg 
                                rounded-2xl 
                                p-6 
                                border 
                                border-white/10 
                                overflow-hidden 
                                transition-all 
                                duration-300 
                                hover:scale-105 
                                hover:shadow-2xl
                                h-full
                                flex 
                                flex-col 
                                justify-between
                            `}>
                                {/* Gradient Background */}
                                <div className={`
                                    absolute 
                                    -z-10 
                                    inset-0 
                                    bg-gradient-to-br 
                                    ${stat.color} 
                                    opacity-10 
                                    group-hover:opacity-20 
                                    transition-opacity 
                                    duration-300
                                `}></div>

                                {/* Top Section: Icon and Stats */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`
                                        w-16 h-16 
                                        rounded-full 
                                        flex 
                                        items-center 
                                        justify-center 
                                        bg-white/10 
                                        transition-transform 
                                        group-hover:rotate-6
                                    `}>
                                        <stat.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="text-4xl font-bold text-white">
                                        {stat.value}
                                    </span>
                                </div>

                                {/* Bottom Section: Label and Description */}
                                <div>
                                    <p className="text-sm uppercase tracking-wider text-gray-300 mb-2">
                                        {stat.label}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-400">
                                            {stat.description}
                                        </p>
                                        <ArrowUpRight 
                                            className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
			</div>
		</div>
	)
}

export default AboutPage