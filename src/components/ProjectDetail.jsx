import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, ExternalLink, Github, Code2, Star, 
  ChevronRight, Clock, Layout, Globe, Terminal,
  GitBranch, Package, Shield, Cpu
} from "lucide-react";

// Enhanced Tech Badge with hover effects and icon support
const TechBadge = ({ tech, icon: Icon }) => (
  <div className="group relative overflow-hidden px-4 py-2.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_70%)]" />
    <div className="relative flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />}
      <span className="text-sm font-medium text-blue-300/90 group-hover:text-blue-200 transition-colors">{tech}</span>
    </div>
  </div>
);

// Enhanced Feature Item with improved hover effects
const FeatureItem = ({ feature, icon: Icon }) => (
  <li className="group flex items-center space-x-3 p-3.5 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10">
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
      <div className="relative w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 group-hover:scale-125 transition-transform duration-300" />
    </div>
    {Icon && <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />}
    <span className="text-gray-300 group-hover:text-white transition-colors">{feature}</span>
  </li>
);

// Stats Component
const ProjectStats = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/[0.02] rounded-xl border border-white/10">
    {stats.map((stat, index) => (
      <div key={index} className="text-center space-y-2">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {stat.value}
        </div>
        <div className="text-sm text-gray-400">{stat.label}</div>
      </div>
    ))}
  </div>
);

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    window.scrollTo(0, 0);

    useEffect(() => {
        const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
        const selectedProject = storedProjects.find(p => String(p.id) === id);
        
        if (selectedProject) {
            const enhancedProject = {
                ...selectedProject,
                Github: selectedProject.Github || "https://github.com/yourusername/project",
                technologies: selectedProject.technologies || [
                    { name: "React", icon: Globe },
                    { name: "TailwindCSS", icon: Layout },
                    { name: "Node.js", icon: Terminal },
                    { name: "MongoDB", icon: Package },
                    { name: "Express", icon: Cpu }
                ],
                features: selectedProject.features || [
                    { text: "Advanced Architecture", icon: Shield },
                    { text: "Modern UI/UX Design", icon: Layout },
                    { text: "Real-time Updates", icon: Clock },
                    { text: "Git Integration", icon: GitBranch }
                ],
                stats: [
                    { value: "99%", label: "Uptime" },
                    { value: "2.1s", label: "Load Time" },
                    { value: "150+", label: "Components" },
                    { value: "4.9", label: "Rating" }
                ]
            };
            setProject(enhancedProject);
        }
    }, [id]);

    if (!project) {
        return (
            <div className="min-h-screen bg-[#030014] flex items-center justify-center">
                <div className="text-center space-y-6 animate-fadeIn">
                    <div className="w-24 h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <h2 className="text-3xl font-bold text-white">Loading Project...</h2>
                </div>
            </div>
        );
    }
    

    return (
        <div className="min-h-screen bg-[#030014] relative overflow-hidden">

            {/* Enhanced Animated Background */}
            <div className="fixed inset-0">
                <div className="absolute -inset-[10px] opacity-20">
                    <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            <div className="relative">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    {/* Navigation */}
                    <div className="flex items-center space-x-4 mb-12 animate-fadeIn">
                        <button
                            onClick={() => navigate(-1)}
                            className="group inline-flex items-center space-x-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Back</span>
                        </button>
                        <div className="flex items-center space-x-2 text-white/50">
                            <span>Projects</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-white/90">{project.Title}</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Left Column - Project Details */}
                        <div className="space-y-10 animate-slideInLeft">
                            <div className="space-y-6">
                                <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                                    {project.Title}
                                </h1>
                                <div className="relative h-1 w-24">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm" />
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300/90 leading-relaxed text-lg">
                                    {project.Description}
                                </p>
                            </div>

                            <ProjectStats stats={project.stats} />

                            <div className="flex flex-wrap gap-4">
                                <a
                                    href={project.Link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 text-blue-300 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 backdrop-blur-xl overflow-hidden"
                                >
                                    <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-blue-600/10 to-purple-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                                    <ExternalLink className="relative w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span className="relative font-medium">Live Demo</span>
                                </a>
                                
                                <a
                                    href={project.Github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 text-purple-300 rounded-xl transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40 backdrop-blur-xl overflow-hidden"
                                >
                                    <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-purple-600/10 to-pink-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                                    <Github className="relative w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span className="relative font-medium">Source Code</span>
                                </a>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
                                    <Code2 className="w-5 h-5 text-blue-400" />
                                    Technologies Used
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {project.technologies.map((tech, index) => (
                                        <TechBadge key={index} tech={tech.name} icon={tech.icon} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Image & Features */}
                        <div className="space-y-10 animate-slideInRight">
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img
                                    src={project.Img}
                                    alt={project.Title}
                                    className="w-full aspect-[16/10] object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
                                    onLoad={() => setIsImageLoaded(true)}
                                />
                                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-2xl" />
                            </div>

                            <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300 group">
                                <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
                                    <Star className="w-5 h-5 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                                    Key Features
                                </h3>
                                <ul className="list-none space-y-2">
                                    {project.features.map((feature, index) => (
                                        <FeatureItem key={index} feature={feature.text} icon={feature.icon} />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 10s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.7s ease-out;
                }
                .animate-slideInLeft {
                    animation: slideInLeft 0.7s ease-out;
                }
                .animate-slideInRight {
                    animation: slideInRight 0.7s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default ProjectDetails;