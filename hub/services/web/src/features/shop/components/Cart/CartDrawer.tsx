import { type FC } from 'react';
import { useCartItems, useCartActions, useCartTotal } from '@/features/shop/domains/cart';
import styles from './styles.module.css';
import { Icon, faTimes, faTrash, faPlus, faMinus } from '@tupynambalucas-studio/design/icons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const items = useCartItems();
  const { removeItem, updateAmount, clearCart } = useCartActions();
  const total = useCartTotal();

  const handleConfirmOrder = () => {
    alert('Compra confirmada! Iniciando processamento de pagamento...');
    clearCart();
    onClose();
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen === true ? styles.active : ''}`}
        onClick={onClose}
      />

      <div className={`${styles.drawer} ${isOpen === true ? styles.open : ''}`}>
        <div className={styles.header}>
          <h3>Seu Carrinho</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <Icon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Seu carrinho está vazio.</p>
              <span>Escolha produtos saudáveis e orgânicos para começar!</span>
            </div>
          ) : (
            <div className={styles.itemList}>
              {items.map((item) => (
                <div key={item._id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemPrice}>
                      R$ {Number(item.measure.value).toFixed(2)}
                    </span>
                  </div>

                  <div className={styles.itemActions}>
                    {item.measure.type === 'unidade' ? (
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() => updateAmount(item, item.amount - 1)}
                          className={styles.qtyBtn}
                        >
                          <Icon icon={faMinus} size="xs" />
                        </button>
                        <span className={styles.qty}>{item.amount}</span>
                        <button
                          onClick={() => updateAmount(item, item.amount + 1)}
                          className={styles.qtyBtn}
                        >
                          <Icon icon={faPlus} size="xs" />
                        </button>
                      </div>
                    ) : (
                      <div className={styles.weightControls}>
                        <input
                          type="number"
                          className={styles.weightInput}
                          value={item.amount}
                          onChange={(e) => updateAmount(item, Number(e.target.value))}
                          min="0"
                          step="50"
                        />
                        <span className={styles.weightUnit}>g</span>
                      </div>
                    )}

                    <button onClick={() => removeItem(item._id!)} className={styles.removeBtn}>
                      <Icon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 === true && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Total Estimado</span>
              <span className={styles.totalAmount}>R$ {total.toFixed(2)}</span>
            </div>

            <button className={styles.confirmBtn} onClick={handleConfirmOrder}>
              Confirmar Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
