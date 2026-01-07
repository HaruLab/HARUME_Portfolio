import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from 'framer-motion';

const Section = ({ index, children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const scale = useTransform(progress, range, [0.95, 1, 1, 1.05]);
  const y = useTransform(progress, range, [50, 0, 0, -50]);
  const blurValue = useTransform(progress, range, [10, 0, 0, 10]);
  const rotateX = useTransform(progress, range, [10, 0, 0, -10]);
  
  const filter = useMotionTemplate`blur(${blurValue}px)`;

  return (
    <motion.div
      style={{ 
        opacity, 
        scale, 
        y, 
        filter,
        perspective: 1000,
        rotateX
      }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-24"
    >
      {children}
    </motion.div>
  );
};

const StickySections = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const content = [
    {
      title: "HARUME",
      subtitle: "PORTFOLIO 2026",
      description: "Motion Designer & Creative Developer building transparent digital experiences.",
      color: "var(--corporate-color)"
    },
    {
      title: "CRAFTING MOTION",
      subtitle: "PHASE 01",
      description: "Bringing static ideas to life through fluid animations and dynamic interactions.",
      color: "#000000"
    },
    {
      title: "CLEAN DESIGN",
      subtitle: "PHASE 02",
      description: "Minimalist aesthetics combined with powerful functionality for the modern web.",
      color: "#666666"
    },
    {
      title: "LIMITLESS APP",
      subtitle: "PHASE 03",
      description: "Building scalable and performant applications that push the boundaries of UX.",
      color: "var(--corporate-color)"
    }
  ];

  return (
    <div ref={containerRef} className="relative h-[1000vh] bg-[var(--bg-primary)] z-[5]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {content.map((item, i) => {
          const step = 1 / content.length;
          const start = i * step;
          const end = (i + 1) * step;
          
          // SIGNIFICANT STAY: 
          // 0% -> 10% (Fade in)
          // 10% -> 90% (STAY - no change)
          // 90% -> 100% (Fade out)
          const range = [start, start + step * 0.15, end - step * 0.15, end];
          
          return (
            <Section 
              key={i} 
              index={i} 
              progress={smoothProgress} 
              range={range}
            >
              <div className="max-w-4xl text-center px-6">
                <motion.span 
                  className="inline-block text-[10px] md:text-xs font-black tracking-[0.6em] text-[var(--text-secondary)] uppercase mb-6 opacity-40"
                  style={{ color: item.color }}
                >
                  {item.subtitle}
                </motion.span>
                <h2 
                  className="text-7xl md:text-[11rem] font-black tracking-tighter mb-10 leading-[0.85] text-[var(--text-primary)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.title}
                </h2>
                <p className="text-xl md:text-3xl text-[var(--text-secondary)] font-medium max-w-2xl mx-auto leading-tight md:leading-relaxed">
                  {item.description}
                </p>
              </div>
              
              {/* Decorative side text */}
              <div className="absolute left-12 bottom-12 hidden md:block">
                 <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-primary)] opacity-20 transform -rotate-90 origin-left">
                   EST. 2026 / HARUME PORTFOLIO
                 </p>
              </div>
            </Section>
          );
        })}
      </div>
    </div>
  );
};

export default StickySections;
