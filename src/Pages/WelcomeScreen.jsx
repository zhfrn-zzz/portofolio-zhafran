import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Github, Globe, User } from 'lucide-react';

// Previous memoized components remain the same...
const TypewriterEffect = memo(({ text }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 150);
    
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
});

const BackgroundEffect = memo(() => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-3xl animate-pulse" />
    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-transparent to-purple-600/10 blur-2xl animate-float" />
  </div>
));

const IconButton = memo(({ Icon }) => (
  <motion.div
    className="relative group"
    whileHover={{ scale: 1.1 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
  >
    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-300" />
    <div className="relative p-3 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
      <Icon className="w-6 h-6 text-white sm:w-8 sm:h-8" />
    </div>
  </motion.div>
));

const WelcomeScreen = memo(({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 1000);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  const containerVariants = {
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(10px)",
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-[#030014] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit="exit"
          variants={containerVariants}
        >
          <BackgroundEffect />

          <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-4xl mx-auto py-4 sm:py-8">
              <motion.div 
                className="flex justify-center gap-4 sm:gap-8 mb-8 sm:mb-12"
                variants={childVariants}
              >
                {[Code2, User, Github].map((Icon, index) => (
                  <IconButton key={index} Icon={Icon} />
                ))}
              </motion.div>

              <motion.div 
                className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12"
                variants={childVariants}
              >
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
                  <span className="relative inline-block px-2">
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 blur-xl opacity-20" />
                    <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                      Welcome To My
                    </span>
                  </span>
                </h1>

                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
                  <span className="relative inline-block px-2">
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 blur-xl opacity-20" />
                    <span className="relative bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Portfolio Website
                    </span>
                  </span>
                </h1>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={childVariants}
              >
                <a
                  href="https://www.eki.my.id"
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full relative group hover:scale-105 transition-transform duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
                  <div className="relative flex items-center gap-2 text-xl sm:text-2xl">
                    <Globe className="w-5 h-5 text-indigo-600" />
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      <TypewriterEffect text="www.eki.my.id" />
                    </span>
                  </div>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default WelcomeScreen;