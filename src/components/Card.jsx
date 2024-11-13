import React from "react"
import { Eye, ArrowRight, ExternalLink } from "lucide-react"

const CardProject = ({ Img, Title, Description, Link }) => {
	return (
		<div className="group relative w-full">
			<div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-purple-500/20">
				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

				{/* Main Content */}
				<div className="relative p-5 z-10">
					{/* Image Container with Hover Effect */}
					<div className="relative overflow-hidden rounded-lg">
						<div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
							<div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center space-x-2 text-white/90">
								{/* <Eye className="w-5 h-5" />
                <span className="font-medium">View Details</span> */}
							</div>
						</div>
						<img
							src={Img}
							alt={Title}
							className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
						/>
					</div>

					{/* Content Section */}
					<div className="mt-4 space-y-3">
						{/* Title with Gradient */}
						<h3 className="text-xl font-semibold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
							{Title}
						</h3>

						{/* Description */}
						<p className="text-gray-300/80 text-sm leading-relaxed line-clamp-2">{Description}</p>

						{/* Action Buttons */}
						<div className="pt-4 flex items-center justify-between">
							<a
								href={Link}
								className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200">
								<span className="text-sm font-medium">Live Demo</span>
								<ExternalLink className="w-4 h-4" />
							</a>

							<a
								href={`/project/${Title.toLowerCase().replace(/\s+/g, "-")}`}
								className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 transition-colors duration-200">
								<span className="text-sm">Details</span>
								<ArrowRight className="w-4 h-4" />
							</a>
						</div>
					</div>
				</div>

				{/* Hover Border Effect */}
				<div className="absolute inset-0 border border-white/0 group-hover:border-purple-500/50 rounded-xl transition-colors duration-300"></div>
			</div>
		</div>
	)
}

export default CardProject
