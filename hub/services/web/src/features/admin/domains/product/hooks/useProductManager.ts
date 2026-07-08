import { useState, useEffect, useCallback } from 'react';
import {
  useProducts,
  useProductLoading,
  useProductSubmitting,
  useProductActions,
} from '@/domains/product';
import { useProductFilters } from '@/domains/product/hooks/useProductFilters';
import type { IProduct, ProductResponse } from '@tupynambalucas-hub/core';

/**
 * Domain-level hook for managing product data and search.
 * Consolidated from Admin to be accessible throughout the app.
 */
export const useProductManager = () => {
  const products = useProducts();
  const isLoading = useProductLoading();
  const isSubmitting = useProductSubmitting();
  const { fetchProducts, updateProduct } = useProductActions();
  const {
    searchTerm,
    selectedType,
    selectedCategory,
    handleFiltersChange: setFilters,
  } = useProductFilters();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<IProduct>>({});

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const handleFiltersChange = useCallback(
    (search: string, type: string, category: string) => {
      setFilters(search, type, category);
      void fetchProducts({
        search: search !== '' ? search : undefined,
        type: type !== '' ? type : undefined,
        category: category !== '' ? category : undefined,
      });
    },
    [fetchProducts, setFilters],
  );

  const handleEditClick = useCallback((product: ProductResponse) => {
    if (product._id !== undefined) {
      setEditingId(product._id);
      setEditForm(JSON.parse(JSON.stringify(product)) as Partial<IProduct>);
    }
  }, []);

  const handleSaveInlineEdit = useCallback(async () => {
    if (editingId !== null && editForm.name !== undefined && editForm.name !== '') {
      const success = await updateProduct(editingId, editForm);
      if (success === true) {
        setEditingId(null);
      }
    }
  }, [editingId, editForm, updateProduct]);

  const handleCancelInlineEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleUpdateEditForm = useCallback((updates: Partial<IProduct>) => {
    setEditForm((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    state: {
      products,
      isLoading,
      isSubmitting,
      searchTerm,
      selectedType,
      selectedCategory,
      editingId,
      editForm,
    },
    actions: {
      handleFiltersChange,
      handleEditClick,
      handleSaveInlineEdit,
      handleCancelInlineEdit,
      handleUpdateEditForm,
    },
  };
};
