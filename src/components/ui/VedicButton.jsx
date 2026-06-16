import React from 'react';

const VedicButton = ({ children, onClick, className = '', style = {}, ...props }) => {
  return (
    <button 
      className={`vedic-button ${className}`} 
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default VedicButton;
