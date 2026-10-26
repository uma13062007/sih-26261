import axios from 'axios';

const MOCK_MODE_KEY = 'niyantran_use_mock_api';
const API_BASE_URL_KEY = 'niyantran_api_base_url';

export const getApiBaseUrl = () => {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(API_BASE_URL_KEY) : null;
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  return String(saved || envUrl || 'http://localhost:8000/api/v1').trim().replace(/\/+$/, '');
};

export const isMockApiEnabled = () => {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(MOCK_MODE_KEY) : null;
  if (saved === 'true') return true;
  if (saved === 'false') return false;
  return import.meta.env.VITE_USE_MOCK_API !== 'false';
};

export const setMockApiEnabled = (enabled) => {
  localStorage.setItem(MOCK_MODE_KEY, String(Boolean(enabled)));
  window.dispatchEvent(new CustomEvent('niyantran:api-config-changed'));
};

export const setRuntimeApiBaseUrl = (url) => {
  const clean = String(url || '').trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(clean)) {
    throw new Error('API URL must start with http:// or https://');
  }
  localStorage.setItem(API_BASE_URL_KEY, clean);
  window.dispatchEvent(new CustomEvent('niyantran:api-config-changed'));
  return clean;
};

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    const token = localStorage.getItem('niyantran_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  // Keep AxiosResponse shape so services expose the same `{ data }` contract in
  // both mock mode and live mode.
  (response) => response,
  (error) => {
    const payload = error.response?.data;
    const customError = {
      message: payload?.error?.message || payload?.message || payload?.detail || error.message || 'API request failed',
      code: payload?.error?.code || payload?.errorCode,
      status: error.response?.status,
      data: payload,
      requestId: payload?.error?.request_id,
    };
    return Promise.reject(customError);
  }
);

export const simulateDelay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));
