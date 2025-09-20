
import React from 'react';

const BallIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 0-4.95 1.88" />
    <path d="M12 22a10 10 0 0 1-4.95-1.88" />
    <path d="M2.88 7.05a10 10 0 0 1 18.24 0" />
    <path d="M21.12 16.95a10 10 0 0 1-18.24 0" />
    <path d="m5 12 1.58 2.74" />
    <path d="m17.42 9.26 1.58 2.74" />
    <path d="M9.26 4.58 12 12l-2.74 4.74" />
    <path d="M14.74 4.58 12 12l2.74 4.74" />
  </svg>
);

export default BallIcon;
