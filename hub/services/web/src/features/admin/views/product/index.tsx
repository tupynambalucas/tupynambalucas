import type { FC } from 'react';
import { faCarrot } from '@tupynambalucas-studio/design/icons';
import { AdminContainer } from '../../components';
import { useProductManager } from '@/features/admin/domains/product/hooks/useProductManager';
import { ProductManagerFilters, ProductManagerList } from './components/ProductManager';

const ProductsView: FC = () => {
  const { state, actions } = useProductManager();

  return (
    <AdminContainer title="Central de Produtos" icon={faCarrot}>
      <ProductManagerFilters
        searchTerm={state.searchTerm}
        selectedType={state.selectedType}
        selectedCategory={state.selectedCategory}
        onFiltersChange={actions.handleFiltersChange}
      />

      <ProductManagerList
        products={state.products}
        isLoading={state.isLoading}
        isSubmitting={state.isSubmitting}
        editingId={state.editingId}
        editForm={state.editForm}
        onEdit={actions.handleEditClick}
        onUpdateForm={actions.handleUpdateEditForm}
        onSave={() => void actions.handleSaveInlineEdit()}
        onCancel={actions.handleCancelInlineEdit}
      />
    </AdminContainer>
  );
};

export default ProductsView;
