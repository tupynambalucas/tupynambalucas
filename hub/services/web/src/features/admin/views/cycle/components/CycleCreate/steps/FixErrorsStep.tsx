import React from 'react';
import { Icon, faSync } from '@tupynambalucas-studio/assets/icons';
import styles from '../styles.module.css';
import type { FixingItem } from '../types';

// Interface corrigida para corresponder ao index.tsx
interface FixErrorsStepProps {
  fixingItems: FixingItem[];
  onUpdateItem: (id: string, field: keyof FixingItem, value: string) => void;
  onProcessFixed: () => void;
}

export const FixErrorsStep: React.FC<FixErrorsStepProps> = ({
  fixingItems,
  onUpdateItem,
  onProcessFixed,
}) => {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.headerStep}>
        <h3>Corrigindo Produtos ({fixingItems.length})</h3>
      </div>

      <div className={styles.fixList}>
        {fixingItems.map((item) => (
          <div key={item.id} className={styles.fixCard}>
            <div className={styles.fixCardTitle}>
              Texto Original: &quot;{item.originalText}&quot;
            </div>

            <div className={styles.fixGrid}>
              {/* Campo Nome */}
              <div className={styles.fixField} style={{ flex: '2 1 12.5rem' }}>
                <label>Nome do Produto</label>
                <input
                  className={styles.fixInput}
                  value={item.name}
                  onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                  placeholder="Nome..."
                />
              </div>

              {/* Campo Preço */}
              <div className={styles.fixField} style={{ flex: '1 1 5rem' }}>
                <label>Preço (R$)</label>
                <input
                  className={styles.fixInput}
                  value={item.price}
                  onChange={(e) => onUpdateItem(item.id, 'price', e.target.value)}
                  placeholder="0,00"
                  type="number"
                />
              </div>

              {/* Campo Unidade */}
              <div className={styles.fixField} style={{ flex: '1 1 6.25rem' }}>
                <label>Unidade</label>
                <select
                  className={styles.fixInput}
                  value={item.unit}
                  onChange={(e) => onUpdateItem(item.id, 'unit', e.target.value)}
                >
                  <option value="unidade">Unidade</option>
                  <option value="kg">Kg</option>
                </select>
              </div>

              {/* Campo Conteúdo */}
              <div className={styles.fixField} style={{ flex: '1 1 7.5rem' }}>
                <label>Peso/Vol (Opcional)</label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <input
                    className={styles.fixInput}
                    value={item.contentValue}
                    onChange={(e) => onUpdateItem(item.id, 'contentValue', e.target.value)}
                    placeholder="Ex: 500"
                    type="number"
                  />
                  <select
                    className={styles.fixInput}
                    value={item.contentUnit}
                    onChange={(e) => onUpdateItem(item.id, 'contentUnit', e.target.value)}
                    style={{ width: '3.75rem', padding: '0.4rem' }}
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="L">L</option>
                  </select>
                </div>
              </div>

              {/* Campo Pedido Mínimo */}
              <div className={styles.fixField} style={{ flex: '1 1 7.5rem' }}>
                <label>Min. Pedido (Opcional)</label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <select
                    className={styles.fixInput}
                    value={item.minOrderType}
                    onChange={(e) => onUpdateItem(item.id, 'minOrderType', e.target.value)}
                    style={{ width: '5.3125rem', padding: '0.4rem' }}
                  >
                    <option value="">Nenhum</option>
                    <option value="caixa">Caixa</option>
                    <option value="saca">Saca</option>
                  </select>
                  <input
                    className={styles.fixInput}
                    value={item.minOrderValue}
                    onChange={(e) => onUpdateItem(item.id, 'minOrderValue', e.target.value)}
                    placeholder="Qtd"
                    type="number"
                  />
                </div>
              </div>

              {/* Campo Categoria */}
              <div className={styles.fixField} style={{ flex: '1 1 7.5rem' }}>
                <label>Categoria</label>
                <input
                  className={styles.fixInput}
                  value={item.category}
                  disabled
                  title="Categoria detectada automaticamente"
                  style={{ backgroundColor: '#f3f4f6' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className={styles.actions}>
        <button type="button" className={styles.primaryBtn} onClick={onProcessFixed}>
          <Icon icon={faSync} style={{ marginRight: 8 }} />
          Atualizar Produtos
        </button>
      </footer>
    </div>
  );
};
