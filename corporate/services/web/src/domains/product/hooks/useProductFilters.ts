import { useState, useCallback } from 'react';

export const useProductFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleFiltersChange = useCallback((search: string, type: string, category: string) => {
    setSearchTerm(search);
    setSelectedType(type);
    setSelectedCategory(category);
  }, []);

  return {
    searchTerm,
    selectedType,
    selectedCategory,
    handleFiltersChange,
  };
};
