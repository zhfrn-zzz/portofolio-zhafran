import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Award, Boxes, ExternalLink, Github } from "lucide-react";
import { db, collection } from "../firebase";
import { getDocs } from "firebase/firestore";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";

const ModernTabs = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAll, setShowAll] = useState({
    projects: false,
    certificates: false,
  });

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data dari koleksi Firestore
        const projectCollection = collection(db, "projects");
        const certificateCollection = collection(db, "certificates");

        const projectQuerySnapshot = await getDocs(projectCollection);
        const certificateQuerySnapshot = await getDocs(certificateCollection);

        // Format data untuk Projects
        const projectData = projectQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Format data untuk Certificates
        const certificateData = certificateQuerySnapshot.docs.map((doc) => doc.data());

        // Simpan data ke state
        setProjects(projectData);
        setCertificates(certificateData);

        // Simpan data ke localStorage
        localStorage.setItem("projects", JSON.stringify(projectData));
        localStorage.setItem("certificates", JSON.stringify(certificateData));

        console.log("Data berhasil di-fetch dan disimpan ke localStorage!");
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { icon: Code, label: "Projects" },
    { icon: Award, label: "Certificates" },
    { icon: Boxes, label: "Tech Stack" },
  ];

  const technologies = [
    { icon: "html.svg", name: "HTML" },
    { icon: "css.svg", name: "CSS" },
    { icon: "javascript.svg", name: "JavaScript" },
    { icon: "tailwind.svg", name: "Tailwind CSS" },
    { icon: "reactjs.svg", name: "ReactJS" },
    { icon: "vite.svg", name: "Vite" },
    { icon: "nodejs.svg", name: "Node JS" },
    { icon: "bootstrap.svg", name: "Bootstrap" },
    { icon: "firebase.svg", name: "Firebase" },
    { icon: "MUI.svg", name: "Material UI" },
  ];

  const handleShowMore = (type) => {
    setShowAll((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const renderProjects = () => {
    const displayedProjects = showAll.projects ? projects : projects.slice(0, 6);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {displayedProjects.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-1"
          >
            <div className="h-full bg-[#0a0a1f] rounded-lg p-4">
              <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                <img
                  src={project.Img}
                  alt={project.Title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{project.Title}</h3>
              <p className="text-slate-400 mb-4 line-clamp-2">{project.Description}</p>
              <div className="flex gap-3">
                {project.Link?.demo && (
                  <a
                    href={project.Link.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Demo</span>
                  </a>
                )}
                {project.Link?.github && (
                  <a
                    href={project.Link.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-white"
                  >
                    <Github className="w-4 h-4" />
                    <span>Code</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderCertificates = () => {
    const displayedCerts = showAll.certificates ? certificates : certificates.slice(0, 6);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {displayedCerts.map((cert, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={cert.Img}
                alt="Certificate"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="px-6 py-3 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white">
                  View Certificate
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderTechStack = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
    >
      {technologies.map((tech) => (
        <motion.div
          key={tech.name}
          whileHover={{ y: -5 }}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-1"
        >
          <div className="bg-[#0a0a1f] rounded-lg p-4 flex flex-col items-center gap-3">
            <div className="w-16 h-16">
              <img
                src={tech.icon}
                alt={tech.name}
                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-white font-medium">{tech.name}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="w-full min-h-screen bg-[#030014] px-4 md:px-[10%] py-8" id="Portfolio">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-4 mb-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10"
      >
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(index)}
                className={`
                  relative flex items-center gap-2 px-6 py-3 rounded-lg
                  transition-all duration-300 
                  ${activeTab === index
                    ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white"
                    : "text-slate-400 hover:text-slate-200"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
                {activeTab === index && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeTab}
        onChangeIndex={setActiveTab}
      >
        <div className="min-h-[400px]">
          {renderProjects()}
          {projects.length > 6 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShowMore("projects")}
              className="mt-8 mx-auto block px-6 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white/80 hover:text-white transition-all"
            >
              {showAll.projects ? "Show Less" : "Show More"}
            </motion.button>
          )}
        </div>

        <div className="min-h-[400px]">
          {renderCertificates()}
          {certificates.length > 6 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShowMore("certificates")}
              className="mt-8 mx-auto block px-6 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white/80 hover:text-white transition-all"
            >
              {showAll.certificates ? "Show Less" : "Show More"}
            </motion.button>
          )}
        </div>

        <div className="min-h-[400px]">{renderTechStack()}</div>
      </SwipeableViews>
    </div>
  );
};

export default ModernTabs;