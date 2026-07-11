import type { FC, ReactNode } from 'react';
import styles from './styles.module.css';
import { Icon, type IconType } from '@tupynambalucas-studio/design/icons';

interface AdminContainerProps {
  children: ReactNode;
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  icon?: IconType;
  headerActions?: ReactNode;
  level?: 'h2' | 'h3';
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

const AdminContainer: FC<AdminContainerProps> = ({
  children,
  title,
  subtitle,
  icon,
  headerActions,
  level = 'h2',
  className = '',
  headerClassName = '',
  contentClassName = '',
}) => {
  const TitleTag = level;

  return (
    <div className={`${styles.container} ${className}`}>
      {(title !== undefined || headerActions !== undefined) && (
        <header className={`${styles.header} ${headerClassName}`}>
          <div className={styles.titleWrapper}>
            {title !== undefined && (
              <TitleTag className={`${styles.title} ${styles[level]}`}>
                {icon !== undefined && <Icon icon={icon} />}
                {title}
              </TitleTag>
            )}
            {subtitle !== undefined && <span className={styles.subtitle}>{subtitle}</span>}
          </div>
          {headerActions !== undefined && <div className={styles.actions}>{headerActions}</div>}
        </header>
      )}
      <div className={`${styles.content} ${contentClassName}`}>{children}</div>
    </div>
  );
};

export default AdminContainer;
