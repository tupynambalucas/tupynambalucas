import React from 'react';
import styles from './styles.module.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info' }) => {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
};

export default Badge;
