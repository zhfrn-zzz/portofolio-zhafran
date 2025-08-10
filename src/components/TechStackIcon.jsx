import React from 'react';

const TechStackIcon = ({ TechStackIcon, Language }) => {
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
  return (
    <div className="group p-6 rounded-2xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 ease-in-out flex flex-col items-center justify-center gap-3 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-50 blur transition duration-300"></div>
        <img
          src={candidates[idx]}
          onError={handleError}
          alt={`${Language} icon`}
          title={Language}
          className="relative h-16 w-16 md:h-20 md:w-20 transform transition-transform duration-300 object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
      <span className="text-slate-300 font-semibold text-sm md:text-base tracking-wide group-hover:text-white transition-colors duration-300">
        {Language}
      </span>
    </div>
  );
};

export default TechStackIcon; 