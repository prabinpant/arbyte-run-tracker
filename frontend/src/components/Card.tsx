import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`card cartoon-border ${className}`}>
      {title && <h2 className="card-title" style={{ marginBottom: '1rem', borderBottom: '2px solid black', paddingBottom: '0.5rem' }}>{title}</h2>}
      {children}
    </div>
  );
};
