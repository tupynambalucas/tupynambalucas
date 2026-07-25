import { type FC } from 'react';
import type { IProduct } from '@tupynambalucas-hub/core';
import { useCartItems, useCartActions } from '@/features/shop/domains/cart';
import styles from './styles.module.css';
import { Icon, faPlus, faMinus } from '@tupynambalucas-studio/assets/icons';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const items = useCartItems();
  const { updateAmount } = useCartActions();

  const cartItem = items.find((item) => item._id === product._id);
  const currentAmount = cartItem?.amount ?? 0;

  const handleUpdateAmount = (newAmount: number) => {
    updateAmount(product, newAmount);
  };

  const isUnit = product.measure.type === 'unidade';

  return (
    <div className={styles.card}>
      <div className={styles.imagePlaceholder}>
        <div className={styles.tagsContainer}>
          <span className={styles.category}>{product.category}</span>
          {(product.measure.label !== undefined) === true && (
            <span className={styles.labelTag}>{product.measure.label}</span>
          )}
        </div>
      </div>

      <div className={styles.info}>
        <h4 className={styles.name}>{product.name}</h4>

        <div className={styles.details}>
          <span className={styles.measure}>
            {product.measure.type}
            {product.content !== null && product.content !== undefined && (
              <>
                {' '}
                • {product.content.value}
                {product.content.unit}
              </>
            )}
          </span>
          <span className={styles.price}>R$ {Number(product.measure.value).toFixed(2)}</span>
        </div>

        <div className={styles.controlsContainer}>
          {isUnit === true ? (
            <div className={styles.unitControls}>
              <button
                className={styles.qtyBtn}
                onClick={() => handleUpdateAmount(currentAmount - 1)}
                disabled={currentAmount === 0}
              >
                <Icon icon={faMinus} />
              </button>
              <div className={styles.amountDisplay}>{currentAmount}</div>
              <button
                className={styles.qtyBtn}
                onClick={() => handleUpdateAmount(currentAmount + 1)}
              >
                <Icon icon={faPlus} />
              </button>
            </div>
          ) : (
            <div className={styles.weightControls}>
              <input
                type="number"
                className={styles.weightInput}
                value={currentAmount === 0 ? '' : currentAmount}
                onChange={(e) => handleUpdateAmount(Number(e.target.value))}
                placeholder="0"
                min="0"
                step="50"
              />
              <span className={styles.weightUnit}>g</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
