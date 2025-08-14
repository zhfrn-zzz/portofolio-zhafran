import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWelcome } from '../hooks/useWelcomeContext.jsx';

const AnimatedElements = ({ children, delay = 0 }) => {
  const { isWelcomeActive } = useWelcome();

  return (
    <AnimatePresence>
      {!isWelcomeActive && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.6, 
            delay: delay,
            ease: "easeOut" 
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedElements;
