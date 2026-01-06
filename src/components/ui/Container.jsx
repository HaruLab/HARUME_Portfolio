import React from 'react';

export const Container = ({ children, className = "", isFullWidth = false }) => {
  const maxWidthClass = isFullWidth ? "max-w-[1920px]" : "max-w-7xl";
  
  return (
    <div 
      className={`w-full mx-auto px-6 md:px-12 lg:px-24 ${maxWidthClass} ${className}`}
    >
      {children}
    </div>
  );
};
