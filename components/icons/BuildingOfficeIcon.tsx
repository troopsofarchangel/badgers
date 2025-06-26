
import React from 'react';

interface BuildingOfficeIconProps {
  className?: string;
}

const BuildingOfficeIcon: React.FC<BuildingOfficeIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className || "w-6 h-6"}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M8.25 21V3m8.25 18V3M3 3h18M3 21h18m-9-18v18M4.5 12H20M4.5 6H20M4.5 18H20" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12.75v3.375c0 .621-.504 1.125-1.125 1.125H5.625c-.621 0-1.125-.504-1.125-1.125V12.75m13.875-3.375V6.75c0-.621-.504-1.125-1.125-1.125H5.625c-.621 0-1.125.504-1.125 1.125v2.625m13.875 0V9.375m-13.875 0V9.375m13.875 0H4.125" />

  </svg>
);

export default BuildingOfficeIcon;
