import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useI18n } from './I18nProvider';
import PropTypes from 'prop-types';
import OptimizedImage from './OptimizedImage';

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const { t } = useI18n();
  // Handle kasus ketika ProjectLink kosong
  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      console.log("ProjectLink kosong");
      e.preventDefault();
      alert(t('project.demoUnavailable', 'Tautan demo langsung tidak tersedia'));
    }
  };
  
  const handleDetails = (e) => {
    if (!id) {
      console.log("ID kosong");
      e.preventDefault();
      alert(t('project.detailsUnavailable', 'Detail proyek tidak tersedia'));
    }
  };
  

  return (
    <div className="group relative w-full">
            
      <div className="relative overflow-hidden rounded-xl dark:bg-gradient-to-br dark:from-slate-900/90 dark:to-slate-800/90 bg-lightaccent/10 backdrop-blur-lg border dark:border-white/10 border-lightaccent/30 shadow-2xl transition-all duration-300 hover:shadow-[#FFB823]/20">
        <div className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-300 dark:bg-gradient-to-br dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 bg-gradient-to-br from-lightaccent/15 via-transparent to-lightmuted/15"></div>
    
        <div className="relative p-5 z-10">
          <div className="relative overflow-hidden rounded-lg">
            <OptimizedImage
              src={Img}
              alt={Title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="mt-4 space-y-3">
            <h3 className="text-xl font-semibold bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-blue-200 dark:via-purple-200 dark:to-pink-200 bg-gradient-to-r from-lighttext to-lightmuted">
              {Title}
            </h3>
            
            <p className="dark:text-gray-300/80 text-lighttext/80 text-sm leading-relaxed line-clamp-2">
              {Description}
            </p>
            
            <div className="pt-4 flex items-center justify-between">
              {ProjectLink ? (
                <a
                href={ProjectLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveDemo}
                  className="inline-flex items-center space-x-2 dark:text-blue-400 text-lighttext hover:dark:text-blue-300 hover:text-lighttext transition-colors duration-200"
                >
                  <span className="text-sm font-medium">{t('project.liveDemo', 'Demo Langsung')}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span className="text-gray-500 text-sm">{t('project.demoUnavailable', 'Demo Tidak Tersedia')}</span>
              )}
              
     

              {id ? (
                <Link
                  to={`/project/${id}`}
                  onClick={handleDetails}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg dark:bg-white/5 bg-lightaccent/15 hover:dark:bg-white/10 hover:bg-lightaccent/25 dark:text-white/90 text-lighttext transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FFB823]/30"
                >
                  <span className="text-sm font-medium">{t('common.details', 'Detail')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="text-gray-500 text-sm">{t('project.detailsUnavailable', 'Detail Tidak Tersedia')}</span>
              )}
            </div>
          </div>
          
          <div className="absolute inset-0 border border-white/0 group-hover:dark:border-purple-500/50 group-hover:border-lightaccent/50 rounded-xl transition-colors duration-300 -z-50"></div>
        </div>
      </div>
    </div>
  );
};

CardProject.propTypes = {
  Img: PropTypes.string.isRequired,
  Title: PropTypes.string.isRequired,
  Description: PropTypes.string.isRequired,
  Link: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CardProject;