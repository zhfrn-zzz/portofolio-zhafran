import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggle: () => {} });

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });
  const transitionRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const startThemeTransition = () => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    if (transitionRef.current) clearTimeout(transitionRef.current);
  transitionRef.current = setTimeout(() => {
      root.classList.remove('theme-transition');
      transitionRef.current = null;
  }, 700);
  };

  const toggle = () => {
    startThemeTransition();
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => () => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
