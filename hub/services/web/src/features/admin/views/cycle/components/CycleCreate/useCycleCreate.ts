import { useState, useCallback, useEffect } from 'react';
import { useAdminCycleStore } from '../../../../domains/cycle/cycle.store';
import { useCyclesNavigation } from '../../cycle.navigation';
import { parseProductList, type FailedLine } from './parseList';
import { createFixingItems, processFixedItems } from './fixErrors';
import type { FixingItem } from './types';
import type { IProduct } from '@tupynambalucas-hub/core';

export const useCycleCreate = () => {
  const { currentStep, setStep, resetNavigation } = useCyclesNavigation();
  const { createCycle, isSubmitting, error: storeError } = useAdminCycleStore();

  // --- Estado Local ---
  const [textInput, setTextInput] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [failedLines, setFailedLines] = useState<FailedLine[]>([]);

  // Estado para correção em massa
  const [fixingItems, setFixingItems] = useState<FixingItem[]>([]);
  const [isFixingErrors, setIsFixingErrors] = useState(false);

  const [openingDate, setOpeningDate] = useState<Date | null>(new Date());
  const [closingDate, setClosingDate] = useState<Date | null>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  });

  useEffect(() => {
    return () => resetNavigation();
  }, [resetNavigation]);

  const handleReset = useCallback(() => {
    setTextInput('');
    setDescription('');
    setProducts([]);
    setFailedLines([]);
    setFixingItems([]);
    setIsFixingErrors(false);
    resetNavigation();
  }, [resetNavigation]);

  const handleParse = useCallback(() => {
    const { products: parsedProducts, failedLines: failures } = parseProductList(textInput);
    setProducts(parsedProducts);
    setFailedLines(failures);

    // Se houver falhas, não entra em modo de correção automático,
    // apenas mostra o ValidateStep com o alerta, igual ao original.
    setStep('validate-list');
    setIsFixingErrors(false);
  }, [textInput, setStep]);

  const handleStartFixing = useCallback(() => {
    const itemsToFix = createFixingItems(failedLines);
    setFixingItems(itemsToFix);
    setIsFixingErrors(true);
  }, [failedLines]);

  const handleUpdateFixingItem = useCallback(
    (id: string, field: keyof FixingItem, value: string) => {
      setFixingItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      );
    },
    [],
  );

  const handleProcessFixedItems = useCallback(() => {
    const { stillInvalid, validNewProducts } = processFixedItems(fixingItems);

    if (validNewProducts.length > 0) {
      setProducts((prev) => [...prev, ...validNewProducts]);
    }

    setFixingItems(stillInvalid);

    if (stillInvalid.length === 0) {
      setIsFixingErrors(false);
      setFailedLines([]); // Limpa as falhas pois foram todas resolvidas
    }
  }, [fixingItems]);

  const handleRemoveProduct = useCallback((indexToRemove: number) => {
    setProducts((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (openingDate === null || closingDate === null) return;

    const finalDescription = description.trim()
      ? description
      : `Ciclo de ${openingDate.toLocaleDateString()}`;

    const success = await createCycle({
      description: finalDescription,
      openingDate,
      closingDate,
      products,
    });

    if (success) {
      handleReset();
    }
  }, [createCycle, openingDate, closingDate, products, description, handleReset]);

  return {
    state: {
      step: currentStep,
      textInput,
      description,
      products,
      failedLines,
      fixingItems, // Array
      openingDate,
      closingDate,
      isSubmitting,
      storeError,
      isFixingErrors,
    },
    actions: {
      setStep,
      setTextInput,
      setDescription,
      setOpeningDate,
      setClosingDate,
      handleParse,
      handleStartFixing,
      handleUpdateFixingItem,
      handleProcessFixedItems,
      handleRemoveProduct,
      handleSubmit,
      handleReset,
    },
  };
};
