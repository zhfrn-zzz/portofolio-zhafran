import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import en from '../i18n/en.json';
import id from '../i18n/id.json';

const dictionaries = { en, id };

const I18nContext = createContext({
  lang: 'en',
  t: (key, fallback) => fallback ?? key,
  setLang: () => {},
});

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = (next) => {
    setLangState(next);
    try { localStorage.setItem('lang', next); } catch {}
  };

  const t = useMemo(() => {
  const dict = dictionaries[lang] || dictionaries.en;
  const fallbackDict = dictionaries.en;
    return (key, fallback) => {
      const parts = String(key).split('.');
      let node = dict;
      for (const p of parts) {
        node = node && Object.prototype.hasOwnProperty.call(node, p) ? node[p] : undefined;
      }
      if (typeof node === 'string') return node;
      // fallback to Indonesian
      let fb = fallbackDict;
      for (const p of parts) {
        fb = fb && Object.prototype.hasOwnProperty.call(fb, p) ? fb[p] : undefined;
      }
      if (typeof fb === 'string') return fb;
      return fallback ?? key;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  // Optional: honor browser language on first visit
  useEffect(() => {
    try {
      const already = localStorage.getItem('lang');
      if (!already) {
        const nav = navigator.language || navigator.userLanguage || 'en';
        if (/^id/i.test(nav)) setLang('id');
        else setLang('en');
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

I18nProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
