import axios, { AxiosInstance } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const tradingAPI = {
  getExchanges: () => apiClient.get('/trading/exchanges'),
  getExchangeInfo: (exchangeName: string) => apiClient.get(`/trading/exchanges/${exchangeName}/info`),
  getMarkets: (exchangeName: string) => apiClient.get(`/trading/exchanges/${exchangeName}/markets`),
  getOrderBook: (exchangeName: string, symbol: string, limit?: number) =>
    apiClient.get(`/trading/exchanges/${exchangeName}/orderbook/${symbol}`, { params: { limit } }),
  getTicker: (exchangeName: string, symbol: string) =>
    apiClient.get(`/trading/exchanges/${exchangeName}/ticker/${symbol}`),
};

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (email: string, password: string) =>
    apiClient.post('/auth/register', { email, password }),
};

export default apiClient;
