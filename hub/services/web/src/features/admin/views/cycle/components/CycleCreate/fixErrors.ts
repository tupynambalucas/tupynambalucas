import type { IProduct } from '@tupynambalucas-hub/core';
import { type FailedLine, resolveIntelligentMeasure } from './parseList';
import type { FixingItem } from './types';

const PRICE_REGEX = /(?:[R$]\s*)?(\d+[.,]?\d*)\b/i;
const CONTENT_REGEX = /(\d+(?:[.,]\d+)?)\s*(g|gr|kg|ml|l|lt|litros?)/i;
const UNIT_SUFFIX_REGEX =
  /\s(kg|un|uni|unidade|pct|pcte|pacote|maço|maco|bandeja|bdj|litro|l|lt|pote|pt|garrafa|garrafão|saca|fardo)\s*$/i;
const MIN_ORDER_REGEX = /\/\s*(cx|caixa|saca)\s*([\d.,]+)\s*(kg|un|uni|unidade)?/i;

export const createFixingItems = (failedLines: FailedLine[]): FixingItem[] => {
  return failedLines.map((fail, idx) => {
    const cleanText = fail.text
      .replace(/[\-*•]/g, '')
      .replace(/^\*+|\*+$/g, '')
      .trim();
    let estimatedName = cleanText;
    let estimatedPrice = '';
    let estimatedUnit = 'unidade';
    let estimatedContentValue = '';
    let estimatedContentUnit = 'g';
    let estimatedMinOrderType = '';
    let estimatedMinOrderValue = '';

    const priceMatch = PRICE_REGEX.exec(cleanText);
    if (priceMatch) {
      estimatedPrice = priceMatch[1].replace(',', '.');
      estimatedName = cleanText.substring(0, priceMatch.index).trim();
    }

    const unitMatch = UNIT_SUFFIX_REGEX.exec(estimatedName);
    if (unitMatch) {
      estimatedUnit = unitMatch[1].toLowerCase();
      estimatedName = estimatedName.substring(0, unitMatch.index).trim();
    }

    const contentMatch = CONTENT_REGEX.exec(estimatedName);
    if (contentMatch) {
      estimatedContentValue = contentMatch[1].replace(',', '.');
      estimatedContentUnit = contentMatch[2].toLowerCase();
      estimatedName = estimatedName.replace(contentMatch[0], '').trim();
    }

    const minOrderMatch = MIN_ORDER_REGEX.exec(cleanText);
    if (minOrderMatch) {
      let inputType = minOrderMatch[1].toLowerCase();
      if (['cx', 'caixa'].includes(inputType)) inputType = 'caixa';
      if (inputType === 'saca') inputType = 'saca';
      estimatedMinOrderType = inputType;
      estimatedMinOrderValue = minOrderMatch[2].replace(',', '.');
    }

    return {
      id: `fix-${idx}-${fail.text.length}`,
      originalText: fail.text,
      category: fail.category || '',
      name: estimatedName,
      price: estimatedPrice,
      unit: estimatedUnit,
      contentValue: estimatedContentValue,
      contentUnit: estimatedContentUnit,
      minOrderType: estimatedMinOrderType,
      minOrderValue: estimatedMinOrderValue,
    };
  });
};

export const processFixedItems = (fixingItems: FixingItem[]) => {
  const stillInvalid: FixingItem[] = [];
  const validNewProducts: IProduct[] = [];

  fixingItems.forEach((item) => {
    const priceNum = parseFloat(item.price.replace(',', '.'));
    const contentValNum =
      item.contentValue !== undefined && item.contentValue !== ''
        ? parseFloat(item.contentValue.replace(',', '.'))
        : NaN;
    const minOrderValNum =
      item.minOrderValue !== undefined && item.minOrderValue !== ''
        ? parseFloat(item.minOrderValue.replace(',', '.'))
        : NaN;

    if (item.name.trim().length > 2 && Number.isNaN(priceNum) === false && priceNum > 0) {
      let contentData = undefined;
      if (Number.isNaN(contentValNum) === false) {
        let unit: 'g' | 'kg' | 'ml' | 'L' = 'g';
        const u = (item.contentUnit ?? 'g').toLowerCase();
        if (['g', 'gr'].includes(u)) unit = 'g';
        else if (['kg'].includes(u)) unit = 'kg';
        else if (['ml'].includes(u)) unit = 'ml';
        else if (['l', 'lt', 'litro'].includes(u)) unit = 'L';

        contentData = { value: contentValNum, unit };
      }

      let minimumOrder = undefined;
      if (
        item.minOrderType !== undefined &&
        item.minOrderType !== '' &&
        Number.isNaN(minOrderValNum) === false
      ) {
        minimumOrder = {
          type: item.minOrderType,
          value: minOrderValNum,
        };
      }

      const resolvedMeasure = resolveIntelligentMeasure(item.unit);

      validNewProducts.push({
        name: item.name.trim(),
        category: item.category,
        available: true,
        measure: {
          type: resolvedMeasure.type,
          label: resolvedMeasure.label,
          value: priceNum,
          minimumOrder,
        },
        content: contentData,
      });
    } else {
      stillInvalid.push(item);
    }
  });

  return { stillInvalid, validNewProducts };
};
