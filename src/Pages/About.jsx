import React from "react";
import { FileText, Code, Award, Globe, ArrowUpRight,Sparkles  } from "lucide-react";

const AboutPage = () => {
  const storedProjects = JSON.parse(localStorage.getItem("projects"));
  const storedCertificates = JSON.parse(localStorage.getItem("certificates"));

  const totalProjects = storedProjects ? storedProjects.length : 0;
  const totalCertificates = storedCertificates ? storedCertificates.length : 0;

  const startDate = new Date("2021-11-06");
  const today = new Date();

  const YearExperience =
    today.getFullYear() -
    startDate.getFullYear() -
    (today <
    new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate())
      ? 1
      : 0);

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-4 sm:px-[5%] lg:px-[10%]"
      id="About"
    >
    
     {/* Modern Header */}
     <div className="text-center lg:mb-8 mb-2 px-[5%]">
          <div className="inline-block relative group">
            <h2 className="text-4xl md:text-5xl font-bold  text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] ">
              About Me
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </h2>
          </div>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Transforming ideas into digital experiences
            <Sparkles className="w-5 h-5 text-purple-400" />
          </p>
        </div>

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* About Section */}
          <div className="space-y-6 text-center lg:text-left transform transition-all duration-700 animate-fade-in-left ">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                Hello, I'm
              </span>{" "}
              <span className="block mt-2 animate-pulse-slow">
                Eki Zulfar Rachman
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed animate-fade-in-up delay-200">
              seorang siswa Teknik Jaringan Komputer dan Telekomunikasi yang
              tertarik dalam pengembangan Front-End. Saya berfokus pada
              menciptakan pengalaman digital yang menarik dan selalu berusaha
              memberikan solusi terbaik dalam setiap proyek.
            </p>
            <div className="flex justify-center lg:justify-start space-x-4 animate-fade-in-up delay-400">
              <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl animate-bounce-slow">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> Download CV
              </button>
              <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-[#a855f7]/50 text-[#a855f7] font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 hover:bg-[#a855f7]/10 animate-bounce-slow delay-200">
                <Code className="w-4 h-4 sm:w-5 sm:h-5" /> View Projects
              </button>
            </div>
          </div>

          {/* Enhanced Photo Section */}
          <div className="flex justify-center items-center">
  <div className="relative group animate-fade-in-right">
    <div className="absolute -inset-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl opacity-30 blur-2xl animate-pulse-slow z-0"></div>
    <div className="relative">
      <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl md:rounded-3xl overflow-hidden border-4 border-[#6366f1]/30 shadow-2xl transform transition-all duration-300 group-hover:scale-110">
        <img
          src="/Photo.png"
          alt="Profile"
          className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 transition-all duration-300"
        />
      </div>
    </div>
  </div>
</div>
        </div>

        {/* Stats Section */}
        <a href="#Portofolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {[
              {
                icon: Code,
                color: "from-[#6366f1] to-[#a855f7]",
                value: totalProjects,
                label: "Total Projects",
                description: "Innovative web solutions crafted",
              },
              {
                icon: Award,
                color: "from-[#a855f7] to-[#6366f1]",
                value: totalCertificates,
                label: "Certificates",
                description: "Professional skills validated",
              },
              {
                icon: Globe,
                color: "from-[#6366f1] to-[#a855f7]",
                value: YearExperience,
                label: "Years of Experience",
                description: "Continuous learning journey",
              },
            ].map((stat) => (
              <div key={stat.label} className="relative group">
                <div
                  className={`
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
                  `}
                >
                  {/* Gradient Background */}
                  <div
                    className={`
                      absolute 
                      -z-10 
                      inset-0 
                      bg-gradient-to-br 
                      ${stat.color} 
                      opacity-10 
                      group-hover:opacity-20 
                      transition-opacity 
                      duration-300
                    `}
                  ></div>

                  {/* Top Section: Icon and Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`
                        w-16 h-16 
                        rounded-full 
                        flex 
                        items-center 
                        justify-center 
                        bg-white/10 
                        transition-transform 
                        group-hover:rotate-6
                      `}
                    >
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
                      <p className="text-xs text-gray-400">{stat.description}</p>
                      <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </a>
      </div>
    </div>
  );
};

export default AboutPage;