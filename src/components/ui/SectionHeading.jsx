import React from 'react';

const SectionHeading = ({ children, className = '', ...props }) => {
  return (
    <div className={`section-heading-container ${className}`} {...props}>
      <h2 className="section-heading">{children}</h2>
      <div className="divider"></div>
    </div>
  );
};

export default SectionHeading;
