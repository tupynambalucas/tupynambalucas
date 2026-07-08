import { type FC } from 'react';
import { useAuthUser, useAuthActions } from '@/domains/auth';
import { IconDisplay } from '@/shared/ui/UserIcon';
import styles from './styles.module.css';
import {
  Icon,
  faTimes,
  faList,
  faUser,
  faArrowRightFromBracket,
} from '@tupynambalucas-studio/assets/icons';

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserDrawer: FC<UserDrawerProps> = ({ isOpen, onClose }) => {
  const user = useAuthUser();
  const { logout } = useAuthActions();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  if (user === null) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen === true ? styles.active : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen === true ? styles.open : ''}`}>
        <div className={styles.header}>
          <h3>Meu Perfil</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <Icon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <IconDisplay size="3rem" />
            </div>
            <div className={styles.userMeta}>
              <span className={styles.userName}>{user.username}</span>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
          </div>

          <div className={styles.details}>
            <h4 className={styles.sectionTitle}>Informações da Conta</h4>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Nível de Acesso</span>
              <span className={styles.detailValue}>
                {user.role === 'admin' ? 'Administrador' : 'Membro'}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Membro desde</span>
              <span className={styles.detailValue}>
                {user.createdAt !== undefined
                  ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                  : 'N/A'}
              </span>
            </div>
          </div>

          <nav className={styles.menu}>
            <h4 className={styles.sectionTitle}>Navegação</h4>
            <button className={styles.menuItem}>
              <Icon icon={faList} />
              <span>Histórico de Pedidos</span>
            </button>
            <button className={styles.menuItem}>
              <Icon icon={faUser} />
              <span>Dados Cadastrais</span>
            </button>
          </nav>
        </div>

        <div className={styles.footer}>
          <button className={styles.logoutBtn} onClick={() => void handleLogout()}>
            <Icon icon={faArrowRightFromBracket} />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDrawer;
