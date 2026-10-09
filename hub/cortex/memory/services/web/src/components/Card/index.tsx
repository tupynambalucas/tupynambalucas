import React from 'react';
import styles from './styles.module.css';

export interface CardProps {
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
    <div className={`${styles.card} ${className}`.trim()}>
      {hasHeader ? (
        <div className={styles.cardHeader}>
          <div>
            {title != null ? <h3 className={styles.cardTitle}>{title}</h3> : null}
            {hasSubtitle ? <p className={styles.cardSubtitle}>{subtitle}</p> : null}
          </div>
          {action != null ? <div>{action}</div> : null}
        </div>
      ) : null}
      <div>{children}</div>
    </div>
  );
};

export default Card;
