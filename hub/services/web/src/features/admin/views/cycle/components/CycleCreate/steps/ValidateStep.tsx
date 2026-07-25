import React from 'react';
import { Icon, faExclamationTriangle } from '@tupynambalucas-studio/assets/icons';
import styles from '../styles.module.css';
import type { IProduct } from '@tupynambalucas-hub/core';
import type { FailedLine } from '../parseList';

interface ValidateStepProps {
  products: IProduct[];
  failedLines?: FailedLine[];
  onRemoveProduct: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
  onStartFixing: () => void; // <--- Obrigatório para o modo "Correção em Massa"
}

export const ValidateStep: React.FC<ValidateStepProps> = ({
  products,
  failedLines = [],
  onRemoveProduct,
  onBack,
  onNext,
  onStartFixing,
}) => {
  const hasErrors = failedLines.length > 0;

  return (
    <div className={styles.stepContainer}>
      <div className={styles.headerStep}>
        <h3>Validar Produtos ({products.length})</h3>
        <button type="button" className={styles.secondaryBtn} onClick={onBack}>
          Voltar / Editar Texto
        </button>
      </div>

      <div className={styles.previewList}>
        {products.map((p, idx) => {
          // Using a stable combination for key when _id is missing
          const productKey = p._id ?? `${p.name}-${p.category}-${idx}`;
          return (
            <div key={productKey} className={styles.productRow}>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemoveProduct(idx)}
                title="Remover produto"
              >
                ×
              </button>

              <div className={styles.pInfo}>
                <strong>{p.name}</strong>
                <div className={styles.pSubInfo}>
                  <small className={styles.categoryTag}>{p.category}</small>
                  {p.measure.label !== undefined && (
                    <small className={styles.labelTag}>{p.measure.label}</small>
                  )}
                  {p.content && (
                    <span className={styles.contentBadge}>
                      {p.content.value}
                      {p.content.unit}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.pMeta}>
                {p.measure.minimumOrder && (
                  <span className={styles.minOrderBadge}>
                    Min: {p.measure.minimumOrder.value} {p.measure.minimumOrder.type}
                  </span>
                )}
                <div className={styles.priceContainer}>
                  <span className={styles.unitBadge}>{p.measure.type}</span>
                  <span className={styles.price}>R$ {Number(p.measure.value).toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasErrors ? (
        <div className={styles.dangerZone}>
          <div className={styles.dangerHeader}>
            <Icon icon={faExclamationTriangle} />
            Atenção: {failedLines.length} produtos da lista não puderam ser lidos
          </div>
          <div className={styles.dangerContent}>
            <div className={styles.failedPreview}>
              {failedLines.slice(0, 3).map((fail, fIdx) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={`fail-${fIdx}`}>• {fail.text}</div>
              ))}
              {failedLines.length > 3 && (
                <div style={{ marginTop: 4, fontStyle: 'italic' }}>
                  + Outros {failedLines.length - 3} produtos não puderam ser lidos
                </div>
              )}
            </div>
            <div className={styles.dangerFooter}>
              Verifique se esses itens têm preço formatado corretamente.
            </div>
            <button type="button" className={styles.fixButton} onClick={onStartFixing}>
              Corrigir Produtos
            </button>
          </div>
        </div>
      ) : (
        <footer className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={onNext}>
            Continuar
          </button>
        </footer>
      )}
    </div>
  );
};
