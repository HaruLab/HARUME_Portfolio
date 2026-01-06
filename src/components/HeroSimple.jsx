import React from 'react';
import { motion } from 'framer-motion';

const HeroSimple = () => {
  return (
    <div className="relative w-full min-h-screen bg-[var(--bg-primary)] overflow-hidden flex flex-col items-center pb-32 md:pb-20 pt-12 md:pt-40 lg:pt-48">
      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <h1 
            className="text-[clamp(4rem,15vw,12rem)] font-black tracking-tighter text-[var(--text-primary)] leading-[0.8]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            HARUME
          </h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            <p className="text-[clamp(10px,2vw,14px)] font-bold tracking-[0.8em] text-[var(--text-secondary)] opacity-40 uppercase text-center px-6">
              Visual & Motion Designer
            </p>
            <div className="h-[1px] w-12 bg-[var(--corporate-color)] opacity-50" />
            
            <p className="mt-4 text-sm font-bold tracking-widest text-[var(--corporate-color)] border border-[var(--corporate-color)] px-4 py-2 rounded-full opacity-80" style={{ fontFamily: 'var(--font-display)' }}>
              SITE UNDER CONSTRUCTION
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSimple;
