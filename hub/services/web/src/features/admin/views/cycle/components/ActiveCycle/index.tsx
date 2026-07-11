import { useState, useMemo } from 'react';
import { useActiveCycle } from '@/domains/cycle';
import { useAdminCycleStore } from '../../../../domains/cycle/cycle.store';
import styles from './styles.module.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Icon,
  faBoxOpen,
  faArrowLeft,
  faTrash,
  faPen,
  faCircle,
} from '@tupynambalucas-studio/design/icons';
import type { IProduct } from '@tupynambalucas-hub/core';
import { AdminContainer, ProductSearchFilter } from '../../../../components';

export const ActiveCycleDashboard = () => {
  const activeCycle = useActiveCycle();
  const { setActiveCycleViewMode } = useAdminCycleStore();

  if (activeCycle === null) return null;

  return (
    <AdminContainer
      title="Ciclo Ativo"
      icon={faCircle}
      subtitle={
        <>
          {format(new Date(activeCycle.openingDate), "dd 'de' MMMM", { locale: ptBR })}
          {' até '}
          {format(new Date(activeCycle.closingDate), "dd 'de' MMMM", { locale: ptBR })}
        </>
      }
    >
      <div className={styles.content}>
        <p className={styles.description}>{activeCycle.description}</p>

        <div className={styles.stats}>
          <div className={styles.card}>
            <strong>{activeCycle.products.length}</strong>
            <span>Produtos</span>
          </div>

          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => setActiveCycleViewMode('products')}
          >
            <Icon icon={faBoxOpen} size="2x" />
            <span>Gerenciar Produtos</span>
          </button>
        </div>
      </div>
    </AdminContainer>
  );
};

export const ActiveCycleFilters = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedType: string;
  setSelectedType: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
}) => {
  const { setActiveCycleViewMode, isSubmitting } = useAdminCycleStore();

  return (
    <AdminContainer
      title="Gerenciar Produtos do Ciclo"
      level="h3"
      headerActions={
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => setActiveCycleViewMode('dashboard')}
          disabled={isSubmitting}
        >
          <Icon icon={faArrowLeft} /> Voltar
        </button>
      }
    >
      <div className={styles.filterSection}>
        <ProductSearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
    </AdminContainer>
  );
};

export const ActiveCycleProductsList = ({
  searchTerm,
  selectedType,
  selectedCategory,
}: {
  searchTerm: string;
  selectedType: string;
  selectedCategory: string;
}) => {
  const activeCycle = useActiveCycle();
  const { updateActiveCycleProducts, isSubmitting } = useAdminCycleStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<IProduct>>({});
  const [localUpdatedProducts, setLocalUpdatedProducts] = useState<IProduct[] | null>(null);

  const productsToShow = useMemo((): IProduct[] => {
    if (localUpdatedProducts !== null) {
      return localUpdatedProducts;
    }
    if (activeCycle?.products !== undefined) {
      return activeCycle.products as IProduct[];
    }
    return [];
  }, [localUpdatedProducts, activeCycle]);

  const filteredProducts = useMemo(() => {
    return productsToShow.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === '' || p.measure.type === selectedType;
      const matchesCategory = selectedCategory === '' || p.category === selectedCategory;
      return matchesSearch === true && matchesType === true && matchesCategory === true;
    });
  }, [productsToShow, searchTerm, selectedType, selectedCategory]);

  const handleRemoveProduct = async (productToRemove: IProduct) => {
    const updatedProducts = productsToShow.filter((p) => p !== productToRemove);
    setLocalUpdatedProducts(updatedProducts);
    const success = await updateActiveCycleProducts(updatedProducts);
    if (success === true) {
      setLocalUpdatedProducts(null);
    }
  };

  const handleEditClick = (product: IProduct) => {
    setEditingId(product._id ?? null);
    setEditForm(JSON.parse(JSON.stringify(product)) as Partial<IProduct>);
  };

  const handleSaveInlineEdit = async () => {
    if (editingId !== null && editForm.name !== undefined && editForm.name !== '') {
      const updatedProducts = productsToShow.map((p) =>
        p._id === editingId ? (editForm as IProduct) : p,
      );

      setLocalUpdatedProducts(updatedProducts);
      const success = await updateActiveCycleProducts(updatedProducts);
      if (success === true) {
        setEditingId(null);
        setLocalUpdatedProducts(null);
      }
    }
  };

  const handleCancelInlineEdit = () => {
    setEditingId(null);
  };

  return (
    <AdminContainer title={`Lista de Produtos (${filteredProducts.length})`} level="h3">
      <div className={styles.productsList}>
        {filteredProducts.map((p, idx) =>
          editingId !== null && p._id !== undefined && editingId === p._id ? (
            <div key={`edit-${p._id}`} className={styles.editInlineContainer}>
              <div className={styles.fixGrid}>
                <div className={styles.fixField} style={{ flex: '2 1 12.5rem' }}>
                  <label>Nome do Produto</label>
                  <input
                    className={styles.fixInput}
                    value={editForm.name ?? ''}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome..."
                  />
                </div>
                <div className={styles.fixField} style={{ flex: '1 1 5rem' }}>
                  <label>Preço (R$)</label>
                  <input
                    className={styles.fixInput}
                    value={editForm.measure?.value ?? ''}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        measure: {
                          type: prev.measure?.type ?? 'unidade',
                          value: Number(e.target.value),
                          minimumOrder: prev.measure?.minimumOrder,
                        },
                      }))
                    }
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div className={styles.fixField} style={{ flex: '1 1 6.25rem' }}>
                  <label>Unidade</label>
                  <select
                    className={styles.fixInput}
                    value={editForm.measure?.type ?? 'unidade'}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        measure: {
                          type: e.target.value,
                          value: prev.measure?.value ?? 0,
                          minimumOrder: prev.measure?.minimumOrder,
                        },
                      }))
                    }
                  >
                    <option value="unidade">Unidade</option>
                    <option value="kg">Kg</option>
                  </select>
                </div>
                <div className={styles.fixField} style={{ flex: '1 1 7.5rem' }}>
                  <label>Peso/Vol (Opcional)</label>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <input
                      className={styles.fixInput}
                      value={editForm.content?.value ?? ''}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          content: {
                            unit: prev.content?.unit ?? 'g',
                            value: e.target.value !== '' ? Number(e.target.value) : 0,
                          },
                        }))
                      }
                      placeholder="Ex: 500"
                      type="number"
                    />
                    <select
                      className={styles.fixInput}
                      value={editForm.content?.unit ?? 'g'}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          content: {
                            unit: e.target.value as 'g' | 'kg' | 'ml' | 'L',
                            value: prev.content?.value ?? 0,
                          },
                        }))
                      }
                      style={{ width: '3.75rem', padding: '0.4rem' }}
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                    </select>
                  </div>
                </div>
                <div className={styles.fixField} style={{ flex: '1 1 7.5rem' }}>
                  <label>Pedido Mín. (Opcional)</label>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <select
                      className={styles.fixInput}
                      value={editForm.measure?.minimumOrder?.type ?? ''}
                      onChange={(e) => {
                        const type = e.target.value;
                        setEditForm((prev) => ({
                          ...prev,
                          measure: {
                            type: prev.measure?.type ?? 'unidade',
                            value: prev.measure?.value ?? 0,
                            minimumOrder:
                              type !== ''
                                ? { type, value: prev.measure?.minimumOrder?.value ?? 1 }
                                : undefined,
                          },
                        }));
                      }}
                      style={{ width: '5.3125rem', padding: '0.4rem' }}
                    >
                      <option value="">Nenhum</option>
                      <option value="caixa">Caixa</option>
                      <option value="saca">Saca</option>
                    </select>
                    <input
                      className={styles.fixInput}
                      value={editForm.measure?.minimumOrder?.value ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditForm((prev) => {
                          const minOrderType = prev.measure?.minimumOrder?.type;
                          return {
                            ...prev,
                            measure: {
                              type: prev.measure?.type ?? 'unidade',
                              value: prev.measure?.value ?? 0,
                              minimumOrder:
                                minOrderType !== undefined && minOrderType !== ''
                                  ? { type: minOrderType, value: val !== '' ? Number(val) : 0 }
                                  : undefined,
                            },
                          };
                        });
                      }}
                      placeholder="Qtd"
                      type="number"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.editActions}>
                <button
                  type="button"
                  className={styles.cancelInlineBtn}
                  onClick={handleCancelInlineEdit}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className={styles.saveInlineBtn}
                  onClick={() => void handleSaveInlineEdit()}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          ) : (
            <div key={p._id ?? `draft-${p.name}-${idx}`} className={styles.productRow}>
              <div className={styles.pInfo}>
                <strong>{p.name}</strong>
                <div className={styles.pSubInfo}>
                  <span className={styles.categoryTag}>{p.category}</span>
                  {p.measure.label !== undefined && (
                    <span className={styles.labelTag}>{p.measure.label}</span>
                  )}
                </div>
              </div>
              <div className={styles.pMeta}>
                <div className={styles.priceContainer}>
                  <span className={styles.unitBadge}>{p.measure.type}</span>
                  <span className={styles.price}>R$ {Number(p.measure.value).toFixed(2)}</span>
                </div>
              </div>
              <div className={styles.pActions}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => handleEditClick(p)}
                  title="Editar"
                  disabled={isSubmitting}
                >
                  <Icon icon={faPen} />
                </button>
                <button
                  type="button"
                  className={`${styles.iconBtn} ${styles.danger}`}
                  onClick={() => void handleRemoveProduct(p)}
                  title="Remover do Ciclo"
                  disabled={isSubmitting}
                >
                  <Icon icon={faTrash} />
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </AdminContainer>
  );
};

export default ActiveCycleDashboard;
