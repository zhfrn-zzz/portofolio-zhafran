import React from "react"
import { UserCircle, FileText, FolderPlus, Award } from "lucide-react"

const AboutPage = () => {
	// Sample data
	const totalProjects = 25
	const totalCertificates = 12

	return (
		<div className="overflow-hidden bg-[#030014] text-white py-20">
			{/* Animated Shapes */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-0 left-0 w-96 h-96 bg-[#6366f1] rounded-full blur-[128px] opacity-30 animate-pulse"></div>
				<div className="absolute bottom-0 right-0 w-96 h-96 bg-[#a855f7] rounded-full blur-[128px] opacity-30 animate-pulse"></div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					{/* About Section */}
					<div>
						<h2 className="text-5xl lg:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] animate-text">
							<span className="text-white">Hello,</span> <span>I'm Eki Zulfar Rachman</span>
						</h2>
						<p className="text-lg lg:text-xl text-gray-400 mb-8">
							<div className="absolute inset-0 pointer-events-none">
								<div className="opacity-10 absolute top-[15%] left-[10%] -translate-x-1/2 -translate-y-1/2 rounded-full w-[150px] h-[150px] bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl delay-500"></div>
							</div>
							I'm a passionate Front-End Developer with a strong background in JavaScript, React,
							and modern web technologies. I'm always striving to create innovative and
							user-friendly websites that push the boundaries of what's possible on the web.
						</p>
						<button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2">
							<FileText className="w-4 h-4" /> View CV
						</button>
					</div>
					{/* Photo Section */}
					<div className="flex justify-center items-center">
						<div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 group">
							{/* Interactive Light Effects */}
							<div className="absolute inset-0 pointer-events-none">
								{/* Center floating light */}
								<div className="opacity-90 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] delay-500"></div>
							</div>
							<img
								src="/Photo.png"
								alt="Profile"
								className="rounded-full w-full h-full object-cover shadow-lg transition-all duration-300 group-hover:scale-105"
							/>
							<div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] p-3 rounded-full shadow-lg animate-pulse group-hover:scale-110 transition-all duration-300">
								<UserCircle className="w-10 h-10 text-white" />
							</div>
						</div>
					</div>
				</div>
				{/* Stats Section */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 lg:mt-20">
					<div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fadeInUp backdrop-blur-lg bg-opacity-40 group hover:bg-opacity-60 transition-all duration-300">
						<div className="flex items-center gap-4 mb-4">
							<FolderPlus className="w-8 h-8 text-[#6366f1] transition-transform duration-300 group-hover:rotate-12 animate-spin-slow" />
							<span className="text-2xl font-bold">{totalProjects}</span>
						</div>
						<span className="text-gray-400 transition-transform duration-300 group-hover:translate-x-2 animate-slideInLeft">
							Total Projects
						</span>
					</div>
					<div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fadeInUp delay-100 backdrop-blur-lg bg-opacity-40 group hover:bg-opacity-60 transition-all duration-300">
						<div className="flex items-center gap-4 mb-4">
							<Award className="w-8 h-8 text-[#a855f7] transition-transform duration-300 group-hover:-rotate-12 animate-spin-slow" />
							<span className="text-2xl font-bold">{totalCertificates}</span>
						</div>
						<span className="text-gray-400 transition-transform duration-300 group-hover:-translate-x-2 animate-slideInRight">
							Certificates
						</span>
					</div>
					<div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fadeInUp delay-200 backdrop-blur-lg bg-opacity-40 group hover:bg-opacity-60 transition-all duration-300">
						<div className="flex items-center gap-4 mb-4">
							<FolderPlus className="w-8 h-8 text-[#6366f1] transition-transform duration-300 group-hover:rotate-12 animate-spin-slow" />
							<span className="text-2xl font-bold">10+</span>
						</div>
						<span className="text-gray-400 transition-transform duration-300 group-hover:translate-x-2 animate-slideInLeft">
							Years of Experience
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AboutPage
