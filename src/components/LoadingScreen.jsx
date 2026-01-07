import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100%",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white"
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
            HARUME
          </h2>
        </motion.div>

        <div className="w-48 h-[2px] bg-white/10 overflow-hidden rounded-full mb-4">
          <motion.div
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>

        <div className="flex items-center gap-2 overflow-hidden h-6">
          <motion.span 
            className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40"
          >
            INITIALIZING
          </motion.span>
          <span className="text-[10px] font-black w-8 tabular-nums">
            {Math.min(percent, 100)}%
          </span>
        </div>
      </div>

      {/* Decorative lines expanding */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="absolute bottom-12 left-12 right-12 h-px bg-white/5 origin-left" 
      />
    </motion.div>
  );
};

export default LoadingScreen;
