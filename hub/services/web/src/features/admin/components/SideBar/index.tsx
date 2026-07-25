import {
  Icon,
  faArrowRightFromBracket,
  faList,
  faUsers,
  faCarrot,
  faChartSimple,
  faGear,
} from '@tupynambalucas-studio/assets/icons';
import { LogoMarkPositive } from '@tupynambalucas-studio/assets/logos';
import { useAuthActions } from '@/domains/auth';
import { useAdminNavigation } from '../../admin.navigation';
import type { AdminViewType } from '../../admin.navigation';
import styles from './styles.module.css';

const SideBar = () => {
  const { setView, currentView } = useAdminNavigation();
  const { logout } = useAuthActions();

  const handleNavigation = (view: AdminViewType) => {
    setView(view);
  };

  const getButtonClass = (view: AdminViewType) => {
    return currentView === view ? styles.active : '';
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <LogoMarkPositive />
      </div>
      <div className={styles.menu}>
        <button
          type="button"
          onClick={() => handleNavigation('cycles')}
          className={getButtonClass('cycles')}
        >
          <Icon icon={faList} size="xl" />
          <span className={styles.tooltip}>Ciclos</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('users')}
          className={getButtonClass('users')}
        >
          <Icon icon={faUsers} size="xl" />
          <span className={styles.tooltip}>Usuários</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('products')}
          className={getButtonClass('products')}
        >
          <Icon icon={faCarrot} size="xl" />
          <span className={styles.tooltip}>Produtos</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('reports')}
          className={getButtonClass('reports')}
        >
          <Icon icon={faChartSimple} size="xl" />
          <span className={styles.tooltip}>Relatórios</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('configurations')}
          className={getButtonClass('configurations')}
        >
          <Icon icon={faGear} size="xl" />
          <span className={styles.tooltip}>Configurações</span>
        </button>
      </div>

      <div className={styles.footer}>
        <button type="button" onClick={() => void logout()} title="Sair do sistema">
          <Icon icon={faArrowRightFromBracket} size="xl" flip="horizontal" />
        </button>
      </div>
    </div>
  );
};

export default SideBar;
