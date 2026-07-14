import { Suspense, type FC } from 'react';
import { useShop } from './hooks/useShop';
import styles from './styles.module.css';
import { Icon, faUser, faShoppingCart, faCalendarAlt } from '@tupynambalucas-studio/design/icons';
import { LogoHorizontalNegative } from '@tupynambalucas-studio/design/logos';
import { ProductSearchFilter } from '../admin/components';
import ProductCard from './components/Product/ProductCard';
import CartDrawer from './components/Cart/CartDrawer';
import UserDrawer from './components/User/UserDrawer';
import Loader from '@/shared/ui/loaders/ScreenLoader';

/**
 * Shop Feature Component
 * Single responsive version following SOLID principles.
 */
const Shop: FC = () => {
  const { state, actions } = useShop();

  return (
    <Suspense fallback={<Loader />}>
      <div className={styles.shopContainer}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <LogoHorizontalNegative className={styles.logoSvg} />
            </div>

            <div className={styles.actions}>
              <button
                className={styles.iconButton}
                onClick={() => actions.setIsUserOpen(true)}
                title="Meu Perfil"
              >
                <Icon icon={faUser} size="lg" />
              </button>
              <button
                className={styles.iconButton}
                onClick={() => actions.setIsCartOpen(true)}
                title="Carrinho"
              >
                <Icon icon={faShoppingCart} size="lg" />
                {state.cartCount > 0 === true && (
                  <span className={styles.badge}>{state.cartCount}</span>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          {state.isCycleLoading === true ? (
            <div className={styles.loading}>Sincronizando com a colheita...</div>
          ) : state.activeCycle === null ? (
            <div className={styles.noResults}>
              <h3>Nenhum ciclo ativo no momento.</h3>
              <p>Fique atento às nossas redes para saber quando o próximo ciclo abrirá!</p>
            </div>
          ) : (
            <>
              <section className={styles.cycleInfo}>
                <div className={styles.cycleHeader}>
                  <h2 className={styles.cycleTitle}>{state.activeCycle.description}</h2>
                  <div className={styles.cycleBadge}>Ciclo Aberto</div>
                </div>
                <div className={styles.cycleDetails}>
                  <div className={styles.detailItem}>
                    <Icon icon={faCalendarAlt} size="sm" />
                    <span>
                      Encerramento: <strong>{state.closingDateFormatted}</strong>
                    </span>
                  </div>
                </div>
              </section>

              <div className={styles.searchBar}>
                <ProductSearchFilter
                  searchTerm={state.searchTerm}
                  onSearchChange={(val) =>
                    actions.handleFiltersChange(val, state.selectedType, state.selectedCategory)
                  }
                  selectedType={state.selectedType}
                  onTypeChange={(type) =>
                    actions.handleFiltersChange(state.searchTerm, type, state.selectedCategory)
                  }
                  selectedCategory={state.selectedCategory}
                  onCategoryChange={(cat) =>
                    actions.handleFiltersChange(state.searchTerm, state.selectedType, cat)
                  }
                />
              </div>

              <div className={styles.productGrid}>
                {(state.filteredProducts.length === 0) === true ? (
                  <div className={styles.noResults}>
                    Nenhum produto encontrado com os filtros aplicados.
                  </div>
                ) : (
                  state.filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                )}
              </div>
            </>
          )}
        </main>

        <CartDrawer isOpen={state.isCartOpen} onClose={() => actions.setIsCartOpen(false)} />
        <UserDrawer isOpen={state.isUserOpen} onClose={() => actions.setIsUserOpen(false)} />
      </div>
    </Suspense>
  );
};

export default Shop;
