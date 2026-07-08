import { AxiosError } from 'axios';
import i18n from '@/i18n';

interface ApiErrorData {
  code?: string;
  message?: string;
}

export const getErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError) {
    if (err.code === 'ERR_NETWORK') {
      return i18n.t('errors.NETWORK_ERROR');
    }

    if (err.response?.status === 500) {
      return i18n.t('errors.INTERNAL_SERVER_ERROR');
    }

    const data = err.response?.data as ApiErrorData | undefined;
    if (data?.code !== undefined && data.code !== '') {
      return i18n.t(`errors.${data.code}`);
    }
  }
  return i18n.t('errors.UNKNOWN_ERROR');
};

export const extractErrorCode = (err: unknown): string | null => {
  if (err instanceof AxiosError) {
    const data = err.response?.data as ApiErrorData | undefined;
    return data?.code ?? null;
  }
  return null;
};
