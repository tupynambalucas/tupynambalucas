import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info' }) => {
  const styles = {
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}
    >
      {children}
    </span>
  );
};
