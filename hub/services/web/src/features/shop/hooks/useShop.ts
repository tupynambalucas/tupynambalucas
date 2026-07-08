import { useEffect, useMemo, useState } from 'react';
import { useActiveCycle, useCycleActions, useCycleLoading } from '@/domains/cycle';
import { useCartCount } from '@/features/shop/domains/cart';
import { useProductFilters } from '@/domains/product/hooks/useProductFilters';
import type { ProductResponse } from '@tupynambalucas-hub/core';

export const useShop = () => {
  const activeCycle = useActiveCycle();
  const { fetchActiveCycle } = useCycleActions();
  const isCycleLoading = useCycleLoading();
  const cartCount = useCartCount();
  const { searchTerm, selectedType, selectedCategory, handleFiltersChange } = useProductFilters();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  useEffect(() => {
    void fetchActiveCycle();
  }, [fetchActiveCycle]);

  const filteredProducts = useMemo(() => {
    const cycleProducts = activeCycle?.products;
    if (cycleProducts === undefined) return [];

    return cycleProducts.filter((p) => {
      if (typeof p === 'string') return false;

      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === '' || p.measure.type === selectedType;
      const matchesCategory = selectedCategory === '' || p.category === selectedCategory;

      return matchesSearch === true && matchesType === true && matchesCategory === true;
    }) as ProductResponse[];
  }, [activeCycle?.products, searchTerm, selectedType, selectedCategory]);

  const closingDateFormatted = useMemo(() => {
    const closingDate = activeCycle?.closingDate;
    if (closingDate === undefined) return '';

    return new Date(closingDate).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [activeCycle?.closingDate]);

  return {
    state: {
      activeCycle,
      isCycleLoading,
      searchTerm,
      selectedType,
      selectedCategory,
      isCartOpen,
      isUserOpen,
      filteredProducts,
      cartCount,
      closingDateFormatted,
    },
    actions: {
      handleFiltersChange,
      setIsCartOpen,
      setIsUserOpen,
    },
  };
};
