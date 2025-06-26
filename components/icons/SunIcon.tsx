
import React from 'react';

interface SunIconProps {
  className?: string;
}

const SunIcon: React.FC<SunIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className || "w-6 h-6"}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.364-1.591 1.591M21 12h-2.25m-.364 6.364-1.591-1.591M12 18.75V21m-6.364-.364 1.591-1.591M3 12h2.25m.364-6.364 1.591 1.591M12 12a2.25 2.25 0 0 0-2.25 2.25c0 1.242.666 2.04 1.546 2.04.88 0 1.546-.798 1.546-2.04A2.25 2.25 0 0 0 12 12Z" />
  </svg>
);

export default SunIcon;