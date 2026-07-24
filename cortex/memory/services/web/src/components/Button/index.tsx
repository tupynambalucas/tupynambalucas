import React from 'react';
import styles from './styles.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const combinedClass = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`.trim();

  return (
    <button className={combinedClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
