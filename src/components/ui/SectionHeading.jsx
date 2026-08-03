import React from 'react';

const SectionHeading = ({ children, className = '', ...props }) => {
  // Two-tone: last word in saffron (primary), rest in dark-brown (on-surface)
  const renderTwoTone = (text) => {
    if (typeof text !== 'string') return text;
    const words = text.trim().split(' ');
    if (words.length <= 1) {
      return <span style={{ color: 'var(--color-primary)' }}>{text}</span>;
    }
    const last = words.pop();
    return (
      <>
        <span style={{ color: 'var(--color-on-surface)' }}>{words.join(' ')}&nbsp;</span>
        <span style={{ color: 'var(--color-primary)' }}>{last}</span>
      </>
    );
  };

  return (
    <div className={`section-heading-container ${className}`} {...props}>
      <h2 className="section-heading">{renderTwoTone(children)}</h2>
      <div className="divider"></div>
    </div>
  );
};

export default SectionHeading;
