                                                                                                                                                                                import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes } from "lucide-react";

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
  px-3 py-1.5
  dark:text-slate-300 text-lighttext 
  dark:hover:text-white hover:text-lighttext 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
  dark:bg-white/5 bg-lightaccent/10 
  dark:hover:bg-white/10 hover:bg-lightaccent/15
      rounded-md
      border 
  dark:border-white/10 border-lightaccent/30
  dark:hover:border-white/20 hover:border-lightaccent/50
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full dark:bg-purple-500/50 bg-[var(--accent)]/60"></span>
  </button>
);

ToggleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isShowingMore: PropTypes.bool.isRequired,
};


function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// Tech Stack grouped for a cleaner layout
const techGroups = [
  {
    label: 'Web Core',
    items: [
      { icon: 'html.svg', language: 'HTML' },
      { icon: 'css.svg', language: 'CSS' },
      { icon: 'javascript.svg', language: 'JavaScript' },
      { icon: 'tailwind.svg', language: 'Tailwind CSS' },
      { icon: 'reactjs.svg', language: 'ReactJS' },
      { icon: 'vite.svg', language: 'Vite' },
      { icon: 'vercel.svg', language: 'Vercel' },
    ],
  },
  {
    label: 'Editing',
    items: [
  { icon: 'davinci.svg', language: 'DaVinci' },
  { icon: 'photoshop.png', language: 'Photoshop' },
      { icon: 'sony.svg', language: 'Sony' },
    ],
  },
  {
    label: 'Networking',
    items: [
  { icon: 'mikrotik.svg', language: 'Mikrotik' },
  { icon: 'cisco.svg', language: 'Cisco' },
  { icon: 'ruijie.webp', language: 'Ruijie' },
    ],
  },
  {
    label: '3D & Graphics',
    items: [
      { icon: 'blender.svg', language: 'Blender' },
    ],
  },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({ once: false, offset: 0, mirror: true });
    const t = setTimeout(() => {
      try { AOS.refreshHard(); } catch {}
    }, 100);
    return () => clearTimeout(t);
  }, []);


  const fetchData = useCallback(async () => {
    try {
      // Mengambil data dari Supabase secara paralel
      const [projectsResponse, certificatesResponse] = await Promise.all([
        supabase.from("projects").select("*").order('id', { ascending: true }),
        supabase.from("certificates").select("*").order('id', { ascending: true }), 
      ]);

      // Error handling untuk setiap request
      if (projectsResponse.error) throw projectsResponse.error;
      if (certificatesResponse.error) throw certificatesResponse.error;

      // Supabase mengembalikan data dalam properti 'data'
      const projectData = projectsResponse.data || [];
      const certificateData = certificatesResponse.data || [];

      setProjects(projectData);
      setCertificates(certificateData);

      // Store in localStorage (fungsionalitas ini tetap dipertahankan)
      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(certificateData));
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    }
  }, []);



  useEffect(() => {
    // Coba ambil dari localStorage dulu untuk laod lebih cepat
    const cachedProjects = localStorage.getItem('projects');
    const cachedCertificates = localStorage.getItem('certificates');

    if (cachedProjects && cachedCertificates) {
        setProjects(JSON.parse(cachedProjects));
        setCertificates(JSON.parse(cachedCertificates));
    }
    
    fetchData(); // Tetap panggil fetchData untuk sinkronisasi data terbaru
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllCertificates(prev => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  // Sisa dari komponen (return statement) tidak ada perubahan
  return (
  <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] overflow-hidden" id="Portofolio" style={{ contentVisibility: 'auto', containIntrinsicSize: '1200px' }}>
      {/* Header section - unchanged */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-gradient-to-r from-[var(--text)] via-[var(--muted)] to-[var(--accent)]">
          Portfolio Showcase
        </h2>
  <p className="dark:text-slate-400 text-lighttext/80 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects, certifications, and technical expertise. 
          Each section represents a milestone in my continuous learning path.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        {/* Themed wrapper: move gradient/background to container so it doesn't sit above content */}
        <Box
          className="portfolio-tabs relative border dark:border-white/10 border-lightaccent/30 rounded-[20px] overflow-hidden md:px-4 bg-gradient-to-b from-[var(--accent)]/[0.12] to-[var(--muted)]/[0.10] dark:from-[#6366f1]/10 dark:to-[#a855f7]/10 backdrop-blur-md"
        >
          <AppBar
            position="static"
            elevation={0}
            sx={{
              bgcolor: "transparent",
              boxShadow: "none",
              backgroundColor: "transparent",
            }}
          >
            {/* Tabs remain unchanged */}
            <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "var(--tab-hover-bg)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "var(--tab-selected-bg)",
                  boxShadow: "var(--tab-selected-shadow)",
                  "& .lucide": {
                    color: "var(--tab-icon-selected)",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Projects"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Certificates"
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Tech Stack"
              {...a11yProps(2)}
            />
            </Tabs>
          </AppBar>
        </Box>

          {/* Render TabPanels directly without swipeable-views */}
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              {projects.length === 0 ? (
                <div className="py-10 text-center w-full">
                  <p className="text-lg md:text-xl dark:text-gray-300 text-lighttext/80">Coming soon</p>
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <CardProject
                      Img={project.Img}
                      Title={project.Title}
                      Description={project.Description}
                      Link={project.Link}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
              )}
            </div>
            {projects.length > 0 && projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              {certificates.length === 0 ? (
                <div className="py-10 text-center w-full">
                  <p className="text-lg md:text-xl dark:text-gray-300 text-lighttext/80">Coming soon</p>
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                {displayedCertificates.map((certificate, index) => (
                  <div
                    key={certificate.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <Certificate ImgSertif={certificate.Img} />
                  </div>
                ))}
              </div>
              )}
            </div>
            {certificates.length > 0 && certificates.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('certificates')}
                  isShowingMore={showAllCertificates}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto overflow-hidden pb-[5%] space-y-8">
              {techGroups.map((group, gIdx) => (
                <section key={group.label}>
                  <h3 className="text-base md:text-lg font-semibold mb-4 dark:text-gray-200 text-lighttext flex items-center gap-2" data-aos="fade-up" data-aos-delay={100 + gIdx*50}>
                    <span className="inline-block w-2 h-2 rounded-full dark:bg-[#6366f1] bg-[var(--accent)]"></span>
                    {group.label}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                    {group.items.map((stack, index) => (
                      <div
                        key={`${group.label}-${stack.language}`}
                        data-aos={index % 3 === 0 ? 'fade-up-right' : index % 3 === 1 ? 'fade-up' : 'fade-up-left'}
                        data-aos-duration={index % 3 === 0 ? '1000' : index % 3 === 1 ? '1200' : '1000'}
                      >
                        <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </TabPanel>
        {/* End TabPanels */}
      </Box>
    </div>
  );
}