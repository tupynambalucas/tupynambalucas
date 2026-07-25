import type { FC } from 'react';
import { Icon, faPen } from '@tupynambalucas-studio/assets/icons';
import type { IProduct, ProductResponse } from '@tupynambalucas-hub/core';
import { ProductSearchFilter } from '../../../../components';
import styles from './styles.module.css';

interface ProductManagerFiltersProps {
  searchTerm: string;
  selectedType: string;
  selectedCategory: string;
  onFiltersChange: (search: string, type: string, category: string) => void;
}

export const ProductManagerFilters: FC<ProductManagerFiltersProps> = ({
  searchTerm,
  selectedType,
  selectedCategory,
  onFiltersChange,
}) => (
  <div className={styles.filters}>
    <ProductSearchFilter
      searchTerm={searchTerm}
      onSearchChange={(val) => onFiltersChange(val, selectedType, selectedCategory)}
      selectedType={selectedType}
      onTypeChange={(type) => onFiltersChange(searchTerm, type, selectedCategory)}
      selectedCategory={selectedCategory}
      onCategoryChange={(cat) => onFiltersChange(searchTerm, selectedType, cat)}
    />
  </div>
);

interface ProductEditInlineProps {
  editForm: Partial<IProduct>;
  onUpdateForm: (updates: Partial<IProduct>) => void;
  onSave: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ProductEditInline: FC<ProductEditInlineProps> = ({
  editForm,
  onUpdateForm,
  onSave,
  onCancel,
  isSubmitting,
}) => (
  <div className={styles.editInlineContainer}>
    <div className={styles.fixGrid}>
      <div className={styles.fixField} style={{ flex: '2 1 12.5rem' }}>
        <label htmlFor="edit-name">Nome do Produto</label>
        <input
          id="edit-name"
          className={styles.fixInput}
          value={editForm.name ?? ''}
          onChange={(e) => onUpdateForm({ name: e.target.value })}
          placeholder="Nome..."
        />
      </div>
      <div className={styles.fixField} style={{ flex: '1 1 5rem' }}>
        <label htmlFor="edit-price">Preço (R$)</label>
        <input
          id="edit-price"
          className={styles.fixInput}
          value={editForm.measure?.value ?? ''}
          onChange={(e) =>
            onUpdateForm({
              measure: {
                type: editForm.measure?.type ?? 'unidade',
                value: Number(e.target.value),
                minimumOrder: editForm.measure?.minimumOrder,
              },
            })
          }
          placeholder="0.00"
          type="number"
          step="0.01"
        />
      </div>
      <div className={styles.fixField} style={{ flex: '1 1 6.25rem' }}>
        <label htmlFor="edit-unit">Unidade</label>
        <select
          id="edit-unit"
          className={styles.fixInput}
          value={editForm.measure?.type ?? 'unidade'}
          onChange={(e) => {
            const val = e.target.value;
            onUpdateForm({
              measure: {
                type: val,
                label: undefined,
                value: editForm.measure?.value ?? 0,
                minimumOrder: editForm.measure?.minimumOrder,
              },
            });
          }}
        >
          <option value="unidade">Unidade</option>
          <option value="kg">Kg</option>
        </select>
      </div>
      <div className={styles.fixField} style={{ flex: '1 1 7.5rem' }}>
        <label htmlFor="edit-content-val">Peso/Vol (Opcional)</label>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <input
            id="edit-content-val"
            className={styles.fixInput}
            value={editForm.content?.value ?? ''}
            onChange={(e) =>
              onUpdateForm({
                content: {
                  unit: editForm.content?.unit ?? 'g',
                  value: e.target.value !== '' ? Number(e.target.value) : 0,
                },
              })
            }
            placeholder="Ex: 500"
            type="number"
          />
          <select
            aria-label="Unidade de conteúdo"
            className={styles.fixInput}
            value={editForm.content?.unit ?? 'g'}
            onChange={(e) =>
              onUpdateForm({
                content: {
                  unit: e.target.value as 'g' | 'kg' | 'ml' | 'L',
                  value: editForm.content?.value ?? 0,
                },
              })
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
        <label htmlFor="edit-min-order-type">Pedido Mín. (Opcional)</label>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <select
            id="edit-min-order-type"
            className={styles.fixInput}
            value={editForm.measure?.minimumOrder?.type ?? ''}
            onChange={(e) => {
              const type = e.target.value;
              onUpdateForm({
                measure: {
                  type: editForm.measure?.type ?? 'unidade',
                  value: editForm.measure?.value ?? 0,
                  minimumOrder:
                    type !== ''
                      ? { type, value: editForm.measure?.minimumOrder?.value ?? 1 }
                      : undefined,
                },
              });
            }}
            style={{ width: '5.3125rem', padding: '0.4rem' }}
          >
            <option value="">Nenhum</option>
            <option value="caixa">Caixa</option>
            <option value="saca">Saca</option>
          </select>
          <input
            aria-label="Quantidade mínima"
            className={styles.fixInput}
            value={editForm.measure?.minimumOrder?.value ?? ''}
            onChange={(e) => {
              const val = e.target.value;
              const minOrderType = editForm.measure?.minimumOrder?.type;
              onUpdateForm({
                measure: {
                  type: editForm.measure?.type ?? 'unidade',
                  value: editForm.measure?.value ?? 0,
                  minimumOrder:
                    minOrderType !== undefined && minOrderType !== ''
                      ? { type: minOrderType, value: val !== '' ? Number(val) : 0 }
                      : undefined,
                },
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
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </button>
      <button
        type="button"
        className={styles.saveInlineBtn}
        onClick={() => void onSave()}
        disabled={isSubmitting}
      >
        {isSubmitting === true ? 'Salvando...' : 'Salvar'}
      </button>
    </div>
  </div>
);

interface ProductRowProps {
  product: ProductResponse;
  onEdit: (product: ProductResponse) => void;
  disabled: boolean;
}

export const ProductRow: FC<ProductRowProps> = ({ product, onEdit, disabled }) => (
  <div className={styles.productRow}>
    <div className={styles.pInfo}>
      <strong>{product.name}</strong>
      <div className={styles.pSubInfo}>
        <span className={styles.categoryTag}>{product.category}</span>
        {product.measure.label !== undefined && (
          <span className={styles.labelTag}>{product.measure.label}</span>
        )}
        {product.content !== null && product.content !== undefined && (
          <span className={styles.contentBadge}>
            {product.content.value}
            {product.content.unit}
          </span>
        )}
      </div>
    </div>
    <div className={styles.pMeta}>
      <div className={styles.priceContainer}>
        <span className={styles.unitBadge}>{product.measure.type}</span>
        <span className={styles.price}>R$ {Number(product.measure.value).toFixed(2)}</span>
      </div>
      <div className={styles.pActions}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => onEdit(product)}
          title="Editar"
          disabled={disabled}
        >
          <Icon icon={faPen} />
        </button>
      </div>
    </div>
  </div>
);

interface ProductManagerListProps {
  products: ProductResponse[];
  isLoading: boolean;
  isSubmitting: boolean;
  editingId: string | null;
  editForm: Partial<IProduct>;
  onEdit: (product: ProductResponse) => void;
  onUpdateForm: (updates: Partial<IProduct>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProductManagerList: FC<ProductManagerListProps> = ({
  products,
  isLoading,
  isSubmitting,
  editingId,
  editForm,
  onEdit,
  onUpdateForm,
  onSave,
  onCancel,
}) => (
  <div className={styles.productsList}>
    {isLoading === true ? (
      <div className={styles.loading}>Carregando produtos...</div>
    ) : (
      products.map((p) =>
        editingId === p._id ? (
          <ProductEditInline
            key={`edit-${p._id ?? 'new'}`}
            editForm={editForm}
            onUpdateForm={onUpdateForm}
            onSave={onSave}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
          />
        ) : (
          <ProductRow key={p._id} product={p} onEdit={onEdit} disabled={isSubmitting} />
        ),
      )
    )}
  </div>
);
