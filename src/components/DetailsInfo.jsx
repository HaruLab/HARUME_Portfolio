import React from "react";
import { Plus } from "lucide-react";

const DetailsInfo = ({ summary, children }) => {
  return (
    <details
      className="group overflow-hidden transition-all duration-300"
    >
      <summary
        className="list-none cursor-pointer flex items-center justify-between p-7 rounded-[2.5rem] bg-[var(--bg-secondary)]/80 hover:bg-[var(--bg-secondary)] transition-all border border-[var(--border-color)]/10 group-open:bg-[var(--bg-secondary)] group-open:rounded-b-none group-open:border-b-0"
      >
        <span 
          className="text-base md:text-lg font-bold text-[var(--text-primary)] tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {summary}
        </span>
        <div className="w-8 h-8 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-[var(--corporate-color)] transition-all duration-500 group-open:rotate-[135deg] group-open:bg-[var(--corporate-color)] group-open:text-white">
          <Plus size={18} />
        </div>
      </summary>
      <div className="px-10 py-10 text-sm md:text-base text-[var(--text-secondary)] leading-relaxed animate-in fade-in slide-in-from-top-1 duration-500 bg-[var(--bg-secondary)]/40 rounded-b-[2.5rem] border border-[var(--border-color)]/10 border-t-0 opacity-80">
        {children}
      </div>
    </details>
  );
};

export default DetailsInfo;