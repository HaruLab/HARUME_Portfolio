import { motion } from "framer-motion";

function WorkCard({ work, index, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group block cursor-pointer h-full will-change-transform"
    >
      <div className="flex flex-col h-full group">
        <div 
          className="relative aspect-video mb-4 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] transition-all duration-300 group-hover:ring-[5px] group-hover:ring-[var(--corporate-color)] group-hover:ring-inset group-hover:border-transparent"
          style={{ borderRadius: '8px' }}
        >
          <img
            loading="lazy"
            src={work.img}
            alt={work.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ease-out"
          />
        </div>
        
        <div className="flex-1 flex flex-col px-0.5 pb-2">
          <div className="flex flex-col gap-1">
             <div className="flex flex-col items-start gap-0.5">
                <h3 className="text-sm md:text-base font-black text-[var(--text-primary)] leading-tight m-0 transition-colors group-hover:text-[var(--corporate-color)] line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {work.title}
                </h3>
                <span className="text-[9px] font-bold text-[var(--text-secondary)] tracking-[0.2em] uppercase opacity-30">
                  {work.category}
                </span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default WorkCard;
