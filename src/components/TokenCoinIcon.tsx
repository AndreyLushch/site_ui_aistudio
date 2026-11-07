import React from 'react';

interface TokenCoinIconProps {
  className?: string;
  size?: number;
}

export const TokenCoinIcon: React.FC<TokenCoinIconProps> = ({ className = 'w-5 h-5', size }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      {/* Outer coin border with warm amber gradient */}
      <circle cx="16" cy="16" r="14.5" fill="currentColor" fillOpacity="0.15" />
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="2.5" />
      {/* Inner groove circle */}
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
      {/* Letter 'Н' (Настолки) in center */}
      <path
        d="M11.5 10.5V21.5M20.5 10.5V21.5M11.5 16H20.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
