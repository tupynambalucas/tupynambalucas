import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
}) => {
  const hasHeader = title != null || action != null;
  const hasSubtitle = subtitle != null && subtitle !== '';

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg ${className}`}>
      {hasHeader ? (
        <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
          <div>
            {title != null ? (
              <h3 className="text-base font-semibold text-slate-100">{title}</h3>
            ) : null}
            {hasSubtitle ? <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p> : null}
          </div>
          {action != null ? <div>{action}</div> : null}
        </div>
      ) : null}
      <div>{children}</div>
    </div>
  );
};
