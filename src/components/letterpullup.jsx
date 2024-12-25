// LetterPullUp.jsx
"use client";
import clsx from "clsx";
import { motion } from "framer-motion";

export const LetterPullUp = ({ text = "", className = "" }) => {
  const letters = text.split("");

  const pullupVariant = {
    initial: { y: 100, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05 + 1, // Added base delay of 1 second
        duration: 0.8, // Increased duration slightly
        ease: "easeOut"
      },
    }),
  };

  return (
    <div className={clsx("flex justify-center", className)}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          variants={pullupVariant}
          initial="initial"
          animate="animate"
          custom={i}
          className="text-6xl font-bold inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
};