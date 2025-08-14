import React from 'react';
import { useTheme } from './ThemeProvider';

const TechStackIcon = ({ TechStackIcon, Language }) => {
  const { theme } = useTheme();
  
  // support both svg and png; if 404, try swapping extension
  const original = `/${TechStackIcon}`;
  const candidates = React.useMemo(() => {
    const base = original.replace(/\.(svg|png|webp)$/i, '');
    // Try provided ext first, then common fallbacks
    const ext = (original.match(/\.(svg|png|webp)$/i) || [,''])[1];
    const list = [];
    if (ext) list.push(original);
    ['webp','png','svg'].forEach(e => { const path = `${base}.${e}`; if (!list.includes(path)) list.push(path); });
    return list;
  }, [original]);
  const [idx, setIdx] = React.useState(0);
  const handleError = () => {
    setIdx(i => (i + 1 < candidates.length ? i + 1 : i));
  };

  // List of dark logos that need special treatment in dark mode
  const darkLogos = ['davinci.svg', 'sony.svg', 'mikrotik.svg', 'cisco.svg', 'blender.svg'];
  const isDarkLogo = darkLogos.some(logo => TechStackIcon.includes(logo.split('.')[0]));
  const isDarkMode = theme === 'dark';

  return (
    <div className="group p-6 rounded-2xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 ease-in-out flex flex-col items-center justify-center gap-3 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-50 blur transition duration-300"></div>
        
        {/* Enhanced background for dark logos in dark mode */}
        {isDarkLogo && isDarkMode && (
          <>
            {/* Main white background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/98 to-gray-50/95 rounded-xl backdrop-blur-sm transition-all duration-300 group-hover:from-white group-hover:to-gray-50 shadow-inner border border-white/20"></div>
            
            {/* Subtle inner glow */}
            <div className="absolute inset-1 bg-gradient-to-br from-blue-50/30 to-purple-50/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        )}
        
        <img
          src={candidates[idx]}
          onError={handleError}
          alt={`${Language} icon`}
          title={Language}
          className={`relative h-16 w-16 md:h-20 md:w-20 transform transition-all duration-300 object-contain z-10 ${
            isDarkLogo && isDarkMode
              ? 'filter drop-shadow-md group-hover:drop-shadow-lg p-2' 
              : 'group-hover:filter group-hover:brightness-110 group-hover:drop-shadow-md'
          }`}
          loading="lazy"
          decoding="async"
        />
        
        {/* Additional outer glow for dark logos on hover */}
        {isDarkLogo && isDarkMode && (
          <div className="absolute -inset-2 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
        )}
      </div>
      <span className="text-slate-300 font-semibold text-sm md:text-base tracking-wide group-hover:text-white transition-colors duration-300">
        {Language}
      </span>
    </div>
  );
};

export default TechStackIcon; 