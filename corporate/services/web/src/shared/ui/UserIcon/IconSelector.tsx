import userIconList from './constants';
import styles from './styles.module.css';

interface IconSelectorProps {
  selectedIcon: string;
  onSelect: (iconName: string) => void;
  disabled?: boolean;
  className?: string;
}

export const IconSelector = ({
  selectedIcon,
  onSelect,
  disabled,
  className = '',
}: IconSelectorProps) => (
  <div className={`${styles.selectorContainer} ${className}`}>
    <label>Escolha seu avatar da fauna:</label>
    <div className={styles.iconGrid}>
      {userIconList.map((item) => (
        <div
          key={item.name}
          className={`${styles.iconOption} ${selectedIcon === item.name ? styles.selectedIcon : ''}`}
          onClick={() => disabled !== true && onSelect(item.name)}
        >
          <img src={item.base64} alt={item.name} />
        </div>
      ))}
    </div>
  </div>
);
