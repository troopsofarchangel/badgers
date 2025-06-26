
import React from 'react';

interface ClipboardDocumentListIconProps {
  className?: string;
}

const ClipboardDocumentListIcon: React.FC<ClipboardDocumentListIconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className || "w-6 h-6"}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0cA3.375 3.375 0 0 1 15 2.25c1.153 0 2.243.462 3.032 1.226C21.74 4.234 22.5 5.14 22.5 6.108V8.25a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0 0-1.123-.08C4.375 3.75 3.375 4.75 3.375 6.108V11.25c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V8.25h1.5m1.5 0H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0cA3.375 3.375 0 0 1 15 2.25c1.153 0 2.243.462 3.032 1.226C21.74 4.234 22.5 5.14 22.5 6.108V8.25a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0 0-1.123-.08C4.375 3.75 3.375 4.75 3.375 6.108V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V8.25" />
  </svg>
);

export default ClipboardDocumentListIcon;
