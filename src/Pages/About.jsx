import React, { useEffect, memo, useMemo } from "react"
import { FileText, Code, Award, Globe, ArrowUpRight, Sparkles, UserCheck } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'

// Memoized Components
const Header = memo(() => (
  <div className="text-center lg:mb-8 mb-2 px-[5%]">
    <div className="inline-block relative group">
      <h2 
        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-gradient-to-r from-[var(--text)] via-[var(--muted)] to-[var(--accent)]" 
        data-aos="zoom-in-up"
        data-aos-duration="600"
      >
  Tentang Saya
      </h2>
    </div>
    <p 
      className="mt-2 dark:text-gray-400 text-lighttext/80 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      <Sparkles className="w-5 h-5 dark:text-purple-400 text-lightaccent" />
  Mengubah ide menjadi pengalaman digital
      <Sparkles className="w-5 h-5 dark:text-purple-400 text-lightaccent" />
    </p>
  </div>
));

const ProfileImage = memo(() => (
  <div className="flex justify-end items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
    <div 
      className="relative group" 
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      {/* Optimized gradient backgrounds with reduced complexity for mobile */}
      <div className="absolute -inset-6 dark:opacity-[25%] opacity-50 z-0 hidden sm:block">
        <div className="absolute inset-0 rounded-full blur-2xl animate-spin-slower dark:bg-gradient-to-r dark:from-violet-600 dark:via-indigo-500 dark:to-purple-600 bg-gradient-to-r from-[var(--accent)]/35 via-[var(--muted)]/20 to-[var(--accent)]/35" />
        <div className="absolute inset-0 rounded-full blur-2xl animate-pulse-slow opacity-70 dark:bg-gradient-to-l dark:from-fuchsia-500 dark:via-rose-500 dark:to-pink-600 bg-gradient-to-l from-[var(--muted)]/25 via-transparent to-[var(--accent)]/25" />
        <div className="absolute inset-0 rounded-full blur-2xl animate-float opacity-70 dark:bg-gradient-to-t dark:from-blue-600 dark:via-cyan-500 dark:to-teal-400 bg-gradient-to-t from-[var(--accent)]/25 via-transparent to-[var(--muted)]/25" />
        <div className="absolute inset-8 rounded-full ring-4 dark:ring-[#a855f7]/20 ring-[var(--accent)]/25" />
      </div>

      <div className="relative">
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_0_40px_rgba(120,119,198,0.3)] transform transition-all duration-700 group-hover:scale-105">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full z-20 transition-all duration-700 group-hover:border-white/40 group-hover:scale-105" />
          
          {/* Optimized overlay effects - disabled on mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0 hidden sm:block" />
          <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block bg-gradient-to-t dark:from-purple-500/20 dark:via-transparent dark:to-blue-500/20 from-[var(--accent)]/25 via-transparent to-[var(--muted)]/25" />
          
          <img
            src="/Photo.jpg"
            alt="Profile"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            width="320"
            height="320"
            sizes="(max-width: 640px) 18rem, (max-width: 768px) 20rem, 20rem"
          />

          {/* Advanced hover effects - desktop only */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/10 to-transparent transform translate-y-full group-hover:-translate-y-full transition-transform duration-1000 delay-100" />
            <div className="absolute inset-0 rounded-full border-8 border-white/10 scale-0 group-hover:scale-100 transition-transform duration-700 animate-pulse-slow" />
          </div>
        </div>
      </div>
    </div>
  </div>
));

const StatCard = memo(({ icon: Icon, color, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration={1300} className="relative group">
  <div className="relative z-10 dark:bg-gray-900/50 bg-lightaccent/10 backdrop-blur-lg rounded-2xl p-6 border dark:border-white/10 border-lightaccent/30 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col justify-between">
      <div className="absolute -z-10 inset-0 bg-gradient-to-br dark:from-[#6366f1] dark:to-[#a855f7] from-[var(--accent)] to-[var(--muted)] opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
      
  <div className="flex items-center justify-between mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 transition-transform group-hover:rotate-6">
          <Icon className="w-8 h-8 dark:text-white text-lighttext" />
        </div>
        <span 
          className="text-4xl font-bold dark:text-white text-lighttext"
          data-aos="fade-up-left"
          data-aos-duration="1500"
          data-aos-anchor-placement="top-bottom"
        >
          {value}
        </span>
      </div>

      <div>
        <p 
          className="text-sm uppercase tracking-wider text-gray-300 mb-2"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-anchor-placement="top-bottom"
        >
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p 
            className="text-xs dark:text-gray-400 text-lighttext/70"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-anchor-placement="top-bottom"
          >
            {description}
          </p>
          <ArrowUpRight className="w-4 h-4 dark:text-white/50 text-lighttext/60 group-hover:dark:text-white group-hover:text-lighttext transition-colors" />
        </div>
      </div>
    </div>
  </div>
));

const AboutPage = () => {
  // Static stats (requested): totalProjects=1, totalCertificates=0, YearExperience=1
  const { totalProjects, totalCertificates, YearExperience } = useMemo(() => ({
    totalProjects: 1,
    totalCertificates: 0,
    YearExperience: 1,
  }), []);

  // Optimized AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: false,
        mirror: true,
        offset: 0,
      });
    };

    initAOS();
    
    // Debounced resize handler
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initAOS, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Memoized stats data
  const statsData = useMemo(() => [
    {
      icon: Code,
      color: "from-[#6366f1] to-[#a855f7]",
      value: totalProjects,
  label: "Total Proyek",
  description: "Solusi web inovatif yang dibuat",
      animation: "fade-right",
    },
    {
      icon: Award,
      color: "from-[#a855f7] to-[#6366f1]",
      value: totalCertificates,
  label: "Sertifikat",
  description: "Keahlian profesional terverifikasi",
      animation: "fade-up",
    },
    {
      icon: Globe,
      color: "from-[#6366f1] to-[#a855f7]",
      value: YearExperience,
  label: "Tahun Pengalaman",
  description: "Perjalanan belajar yang berkelanjutan",
      animation: "fade-left",
    },
  ], [totalProjects, totalCertificates, YearExperience]);

  return (
    <div
      className="h-auto pb-[10%] dark:text-white text-lighttext overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm-mt-0" 
      id="About"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1200px' }}
    >
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-transparent bg-clip-text dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-gradient-to-r from-[var(--text)] via-[var(--muted)] to-[var(--accent)]">
                Halo, Saya
              </span>
              <span 
                className="block mt-2 bg-clip-text dark:text-transparent text-black dark:bg-gradient-to-r dark:from-white dark:to-white"
                data-aos="fade-right"
                data-aos-duration="1300"
              >
                Zhafran Anindhito Nur Tsaqib
              </span>
            </h2>
            
            <p 
              className="text-base sm:text-lg lg:text-xl dark:text-gray-400 text-lighttext/80 leading-relaxed text-justify pb-4 sm:pb-0"
              data-aos="fade-right"
              data-aos-duration="1500"
            > 
             Seorang siswa Teknik Jaringan Komputer dan Telekomunikasi yang memiliki rasa ingin tahu yang besar. Seperti di bidang Coding, Film Maker, 3D Generalist, Fotography, Cyber Security, Ai, dan IoT. Saya selalu berusaha untuk belajar dan mengembangkan diri dalam bidang-bidang tersebut.
            </p>

               {/* Quote Section */}
      <div 
  className="relative dark:bg-gradient-to-br dark:from-[#6366f1]/5 dark:via-transparent dark:to-[#a855f7]/5 bg-gradient-to-br from-lightaccent/10 via-transparent to-lightmuted/10 border dark:border-[#6366f1]/30 border-lightaccent/30 rounded-2xl p-4 my-6 backdrop-blur-md shadow-2xl overflow-hidden"
        data-aos="fade-up"
        data-aos-duration="1700"
      >
        {/* Floating orbs background */}
        <div className="absolute top-2 right-4 w-16 h-16 rounded-full blur-xl bg-gradient-to-r dark:from-[#6366f1]/20 dark:to-[#a855f7]/20 from-[var(--accent)]/20 to-[var(--muted)]/20"></div>
        <div className="absolute -bottom-4 -left-2 w-12 h-12 rounded-full blur-lg bg-gradient-to-r dark:from-[#a855f7]/20 dark:to-[#6366f1]/20 from-[var(--muted)]/20 to-[var(--accent)]/20"></div>
        
        {/* Quote icon */}
        <div className="absolute top-3 left-4 dark:text-[#6366f1] text-[var(--accent)] opacity-30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
          </svg>
        </div>
        
  <blockquote className="dark:text-gray-300 text-lighttext/80 text-center lg:text-left italic font-medium text-sm relative z-10 pl-6">
          "Leveraging AI as a professional tool, not a replacement."
        </blockquote>
      </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-4 lg:px-0 w-full">
              <a href="/coming-soon" className="w-full lg:w-auto">
              <button 
                data-aos="fade-up"
                data-aos-duration="800"
                className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-lightaccent text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 shadow-lg hover:shadow-xl "
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> Unduh CV
              </button>
              </a>
              <a href="#Portofolio" className="w-full lg:w-auto">
              <button 
                data-aos="fade-up"
                data-aos-duration="1000"
                className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg border dark:border-[#a855f7]/50 border-lightaccent text-lighttext dark:text-[#a855f7] font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 dark:hover:bg-[#a855f7]/10 hover:bg-lightaccent/15 "
              >
                <Code className="w-4 h-4 sm:w-5 sm:h-5" /> Lihat Proyek
              </button>
              </a>
            </div>
          </div>

          <ProfileImage />
        </div>

        <a href="#Portofolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </a>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slower {
          to { transform: rotate(360deg); }
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        .animate-spin-slower {
          animation: spin-slower 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(AboutPage);