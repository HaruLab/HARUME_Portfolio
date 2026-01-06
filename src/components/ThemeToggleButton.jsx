import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-12 h-12 flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-md border border-[var(--border-color)] rounded-full shadow-lg cursor-pointer overflow-hidden group pointer-events-auto"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <motion.div
          initial={false}
          animate={{
            rotate: theme === 'dark' ? 0 : 90,
            opacity: theme === 'dark' ? 1 : 0,
            scale: theme === 'dark' ? 1 : 0.5,
          }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0 flex items-center justify-center text-[var(--corporate-color)]"
        >
          <Moon size={20} fill="currentColor" />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{
            rotate: theme === 'light' ? 0 : -90,
            opacity: theme === 'light' ? 1 : 0,
            scale: theme === 'light' ? 1 : 0.5,
          }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0 flex items-center justify-center text-[var(--corporate-color)]"
        >
          <Sun size={20} fill="currentColor" />
        </motion.div>
      </div>

      {/* Decorative Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-[var(--corporate-color)] opacity-0 group-hover:opacity-10 transition-opacity"
        initial={false}
      />
    </motion.button>
  );
};

export default ThemeToggleButton;
