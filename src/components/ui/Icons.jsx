import React from 'react';

const IconBase = ({ children, size = 32, ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="#008080" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    {children}
  </svg>
);

export const OmIcon = (props) => (
  <IconBase {...props}>
    <path d="M12 2c-.6 0-1.1.2-1.5.6-.4.4-.6.9-.6 1.5 0 .6.2 1.1.6 1.5.4.4.9.6 1.5.6s1.1-.2 1.5-.6c.4-.4.6-.9.6-1.5s-.2-1.1-.6-1.5c-.4-.4-.9-.6-1.5-.6z" />
    <path d="M7.5 10c0-1.4 1.1-2.5 2.5-2.5h4c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5h-1c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5h2" />
    <path d="M6 14.5c-1.1 0-2 .9-2 2s.9 2 2 2" />
    <path d="M18 14.5c1.1 0 2 .9 2 2s-.9 2-2 2" />
  </IconBase>
);

export const ScrollIcon = (props) => (
  <IconBase {...props}>
    <path d="M4 18V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    <path d="M4 18c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2" />
    <path d="M8 7h8" />
    <path d="M8 11h8" />
    <path d="M8 15h4" />
  </IconBase>
);

export const LotusIcon = (props) => (
  <IconBase {...props}>
    <path d="M12 22s-8-6-8-12c0-4.4 3.6-8 8-8s8 3.6 8 8c0 6-8 12-8 12z" />
    <path d="M12 22s4-6 4-12c0-2.2-1.8-4-4-4s-4 1.8-4 4c0 6 4 12 4 12z" />
    <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </IconBase>
);

export const StarMapIcon = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v18" />
    <path d="M3 12h18" />
    <path d="M18.4 5.6l-12.8 12.8" />
    <path d="M5.6 5.6l12.8 12.8" />
    <circle cx="12" cy="12" r="3" />
  </IconBase>
);

export const SunIcon = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2" />
    <path d="M12 21v2" />
    <path d="M4.22 4.22l1.42 1.42" />
    <path d="M18.36 18.36l1.42 1.42" />
    <path d="M1 12h2" />
    <path d="M21 12h2" />
    <path d="M4.22 19.78l1.42-1.42" />
    <path d="M18.36 5.64l1.42-1.42" />
  </IconBase>
);

export const TelescopeIcon = (props) => (
  <IconBase {...props}>
    <path d="M10 13l-4 4v4" />
    <path d="M14 13l4 4v4" />
    <path d="M20 4l-9 9" />
    <path d="M16 2l-9 9" />
    <path d="M12 8l-3 3" />
  </IconBase>
);

export const CardIcon = (props) => (
  <IconBase {...props}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 7h6" />
    <path d="M9 11h6" />
    <path d="M9 15h2" />
  </IconBase>
);
