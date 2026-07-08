import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

interface CsrfResponse {
  token: string;
}

interface FailedRequestQueueItem {
  resolve: (token: string) => void;
  reject: (err: Error) => void;
}

let csrfToken: string | null = null;
let isRefreshing = false;
let failedQueue: FailedRequestQueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error !== null) {
      prom.reject(error);
    } else if (token !== null) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setCsrfToken(token: string) {
  csrfToken = token;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (
    csrfToken !== null &&
    config.method !== undefined &&
    !['get', 'head', 'options'].includes(config.method.toLowerCase())
  ) {
    config.headers.set('x-csrf-token', csrfToken);
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 403 && originalRequest._retry !== true) {
      if (isRefreshing === true) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.set('x-csrf-token', token);
              resolve(api(originalRequest));
            },
            reject: (err: Error) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.get<CsrfResponse>('/api/csrf-token', {
          withCredentials: true,
          baseURL: '/api',
        });

        const newToken = response.data.token;
        setCsrfToken(newToken);

        processQueue(null, newToken);

        originalRequest.headers.set('x-csrf-token', newToken);
        return await api(originalRequest);
      } catch (refreshError) {
        const errorToReject =
          refreshError instanceof Error ? refreshError : new Error(String(refreshError));
        processQueue(errorToReject, null);
        return Promise.reject(errorToReject);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const initializeCsrf = async (): Promise<void> => {
  try {
    const response = await api.get<CsrfResponse>('/csrf-token');
    setCsrfToken(response.data.token);
  } catch (error) {
    if (import.meta.env.DEV === true) {
      console.error('CSRF Initialization failed:', error);
    }
  }
};
