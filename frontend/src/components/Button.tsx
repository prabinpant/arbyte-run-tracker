import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const variantClass = variant === 'primary' ? 'vibrant-pink' : variant === 'secondary' ? 'vibrant-cyan' : 'vibrant-green';
  return (
    <button className={`btn-retro ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
