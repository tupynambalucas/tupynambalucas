import type { FC } from 'react';
import { Icon, faSearch, faTimes } from '@tupynambalucas-studio/design/icons';
import { PRODUCT_MEASURE_TYPES, PRODUCT_CATEGORIES } from '@tupynambalucas-hub/core';
import styles from './styles.module.css';

interface ProductSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  placeholder?: string;
}

const ProductSearchFilter: FC<ProductSearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedCategory,
  onCategoryChange,
  placeholder = 'Buscar produto...',
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <Icon icon={faSearch} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm !== '' && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => onSearchChange('')}
            title="Limpar pesquisa"
          >
            <Icon icon={faTimes} />
          </button>
        )}
      </div>

      <div className={styles.filtersWrapper}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Categorias:</span>
          <div className={styles.typeFilters}>
            <button
              type="button"
              className={`${styles.typeBtn} ${selectedCategory === '' ? styles.active : ''}`}
              onClick={() => onCategoryChange('')}
            >
              Todas
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.typeBtn} ${selectedCategory === cat ? styles.active : ''}`}
                onClick={() => onCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Unidades:</span>
          <div className={styles.typeFilters}>
            <button
              type="button"
              className={`${styles.typeBtn} ${selectedType === '' ? styles.active : ''}`}
              onClick={() => onTypeChange('')}
            >
              Todas
            </button>
            {PRODUCT_MEASURE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`${styles.typeBtn} ${selectedType === type ? styles.active : ''}`}
                onClick={() => onTypeChange(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchFilter;
