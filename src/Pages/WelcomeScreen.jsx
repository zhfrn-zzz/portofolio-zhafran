import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Github,Globe, User } from 'lucide-react';
import TypewriterComponent from 'typewriter-effect';


const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 1500);
    }, 4500);
    
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-[#030014] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "blur(20px)",
            transition: { duration: 1.5, ease: "easeOut" }
          }}
        >
          {/* Improved animated background with multiple layers */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-tr from-[#6366f1]/10 via-transparent to-[#a855f7]/10 blur-2xl"
              animate={{
                rotate: [0, 5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>

          <div className="container relative mx-auto px-4 min-h-screen flex items-center justify-center">
            <motion.div
              className="w-full max-w-4xl mx-auto py-8"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {/* Icons section */}
              <motion.div 
                className="flex justify-center gap-8 mb-12"
                variants={itemVariants}
              >
                {[Code2, User, Github].map((Icon, index) => (
                  <motion.div
                    key={index}
                    className="relative group"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-75 transition duration-500" />
                    <div className="relative p-3 bg-black/50 backdrop-blur-xl rounded-full border border-white/10">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Welcome Text */}
              <motion.div 
                className="text-center space-y-6 mb-12"
                variants={itemVariants}
              >
                <h1 className="text-6xl font-bold tracking-tight">
                  <span className="relative inline-block">
                    <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20" />
                    <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                      Welcome To My
                    </span>
                  </span>
                </h1>

                <h1 className="text-6xl font-bold tracking-tight">
                  <span className="relative inline-block">
                    <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20" />
                    <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                      Portfolio Website
                    </span>
                  </span>
                </h1>
              </motion.div>

              {/* Website URL with improved Typewriter Effect */}
              <motion.div 
                variants={itemVariants}
                className="text-center"
              >
                <motion.a
                  href="https://www.eki.my.id"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
                  <div className="relative flex items-center gap-2 text-2xl">
                    <Globe className="w-5 h-5 text-[#6366f1]" />
                    <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                      <TypewriterComponent
                        onInit={(typewriter) => {
                          typewriter
                            .typeString('www.eki.my.id')
                            .start();
                        }}
                        options={{
                          delay: 255,
                          cursor: '|',
                          cursorClassName: 'text-[#6366f1]',
                          wrapperClassName: 'text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]',
                          autoStart: true,
                        }}
                      />
                    </span>
                  </div>
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;