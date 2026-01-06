import React from 'react';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'pill', // pill, primary, outline
  className = "",
  icon = null,
  href = null,
  ...props
}) => {
  const baseStyles = "transition-all group inline-flex items-center justify-center gap-3 font-display font-bold tracking-[0.2em] uppercase cursor-pointer";
  
  const variants = {
    pill: "h-10 md:h-12 px-6 md:px-8 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full text-[var(--text-primary)] hover:!border-[var(--corporate-color)] hover:!text-[var(--corporate-color)] text-[10px] md:text-xs",
    primary: "px-12 py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full text-sm hover:scale-105 active:scale-95",
    // Add more variants as needed
  };

  const Component = href ? 'a' : 'button';
  
  return (
    <Component
      onClick={onClick}
      href={href}
      className={`${baseStyles} ${variants[variant] || variants.pill} ${className}`}
      {...props}
    >
      {children}
      {icon && icon}
    </Component>
  );
};
