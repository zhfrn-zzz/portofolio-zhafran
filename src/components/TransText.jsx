import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from './I18nProvider';

function useMedia(query, defaultState = false) {
  const [state, setState] = React.useState(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return defaultState;
    return window.matchMedia(query).matches;
  });
  React.useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return;
    const m = window.matchMedia(query);
    const handler = () => setState(m.matches);
    if (m.addEventListener) m.addEventListener('change', handler);
    else m.addListener(handler);
    return () => {
      if (m.removeEventListener) m.removeEventListener('change', handler);
      else m.removeListener(handler);
    };
  }, [query]);
  return state;
}

export default function TransText({ k: keyPath, fallback, text: explicitText, as: Tag = 'span', className, fancyDesktop = true }) {
  const { t, lang } = useI18n();
  const prefersReduced = useMedia('(prefers-reduced-motion: reduce)');
  const isMobile = useMedia('(max-width: 767px)');

  const text = keyPath ? t(keyPath, fallback) : (explicitText ?? '');
  const idKey = `${keyPath || text}-${lang}`;

  const fancyEnabled = fancyDesktop && !prefersReduced && !isMobile;

  const words = useMemo(() => (typeof text === 'string' ? text.split(/(\s+)/) : [text]), [text]);
  const tooLong = typeof text === 'string' ? text.length > 56 || words.filter(w => w.trim()).length > 8 : false;

  // Variants for fancy word-by-word fly-in/out
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.035 } },
    exit: { transition: { staggerChildren: 0.025, staggerDirection: -1 } }
  };
  const wordVar = {
    hidden: (i) => ({
      opacity: 0,
      y: 28 + (i % 5) * 4,
      x: (i % 2 ? -1 : 1) * (8 + (i % 7) * 3),
      rotate: (i % 3 ? -1 : 1) * (2 + (i % 5)),
      filter: 'blur(2px)'
    }),
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      rotate: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 420, damping: 30, mass: 0.6 }
    },
    exit: (i) => ({
      opacity: 0,
      y: -24 - (i % 5) * 4,
      x: (i % 2 ? 1 : -1) * (6 + (i % 7) * 2),
      rotate: (i % 3 ? 1 : -1) * (2 + (i % 5)),
      filter: 'blur(2px)',
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
    })
  };

  // Simple slide/fade for mobile or long text
  const simpleProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    style: { willChange: 'transform, opacity' }
  };

  if (!fancyEnabled || tooLong) {
    return (
      <AnimatePresence mode="wait">
        <motion.span key={idKey} {...simpleProps} className={className}>
          {text}
        </motion.span>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {/* In fancy mode, apply visual text classes on each word span to ensure bg-clip works */}
      <motion.span key={idKey} variants={container} initial="hidden" animate="show" exit="exit" style={{ display: 'inline-block', willChange: 'transform, opacity' }}>
        {words.map((w, i) => {
          if (w.trim() === '') return <span key={`ws-${i}`}>{w}</span>;
          return (
            <motion.span
              key={`w-${i}`}
              custom={i}
              variants={wordVar}
              className={className}
              style={{ display: 'inline-block', willChange: 'transform, opacity' }}
            >
              {w}
            </motion.span>
          );
        })}
      </motion.span>
    </AnimatePresence>
  );
}

TransText.propTypes = {
  k: PropTypes.string,
  fallback: PropTypes.string,
  text: PropTypes.string,
  as: PropTypes.string,
  className: PropTypes.string,
  fancyDesktop: PropTypes.bool,
};
