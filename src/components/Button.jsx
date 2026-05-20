import React from 'react';

export const Button = ({ children, onClick, disabled, className = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-12 sm:h-14 bg-[#228B22] text-white text-base sm:text-lg font-semibold rounded-lg
      shadow-[0px_4px_10px_rgba(0,0,0,0.30)] active:scale-[0.98] transition-all
      flex items-center justify-center font-sans
      disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
      ${className}`}
    >
      {children}
    </button>
  );
};
