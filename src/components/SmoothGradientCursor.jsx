import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SmoothGradientCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ 
        x: e.clientX, 
        y: e.clientY 
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 pointer-events-none z-50"
        style={{ zIndex: 9999 }}
      >
        {/* Layer 1: Large Soft Gradient */}
        <motion.div
          animate={{
            x: position.x,
            y: position.y,
            scale: isHovering ? 1.2 : 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }}
          style={{
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.1) 100%)',
            borderRadius: '50%',
            filter: 'blur(100px)',
            pointerEvents: 'none'
          }}
        />

        {/* Layer 2: Smaller Intense Gradient */}
        <motion.div
          animate={{
            x: position.x,
            y: position.y,
            rotate: isHovering ? 45 : 0,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 20
            }
          }}
          style={{
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            width: 200,
            height: 200,
            background: 'conic-gradient(from 90deg, #6366f1, #a855f7, #6366f1)',
            borderRadius: '50%',
            filter: 'blur(50px)',
            opacity: 0.4,
            pointerEvents: 'none'
          }}
        />

        {/* Layer 3: Small Concentrated Gradient */}
        <motion.div
          animate={{
            x: position.x,
            y: position.y,
            scale: isHovering ? 1.5 : 1,
            transition: {
              type: "spring",
              stiffness: 500,
              damping: 20
            }
          }}
          style={{
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            width: 100,
            height: 100,
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            opacity: 0.6,
            pointerEvents: 'none'
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default SmoothGradientCursor;