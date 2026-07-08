import { useMemo } from 'react';
import { useAuthUser } from '@/domains/auth';
import userIconList from './constants';
import styles from './styles.module.css';

interface IconDisplayProps {
  className?: string;
  size?: string; // Alterado para string para aceitar unidades
  forceIcon?: string;
}

export const IconDisplay = ({ className = '', size = '2.5rem', forceIcon }: IconDisplayProps) => {
  const user = useAuthUser();
  const iconName = forceIcon ?? user?.icon ?? userIconList[0].name;

  const iconData = useMemo(() => {
    return userIconList.find((item) => item.name === iconName) ?? userIconList[0];
  }, [iconName]);

  return (
    <img
      src={iconData.base64}
      alt={iconName}
      className={`${styles.iconBase} ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
