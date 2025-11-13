import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api',
  timeout: 10000,
});

function authHeader(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchCategories(token?: string) {
  const res = await api.get('/categories', { headers: authHeader(token) });
  return res.data;
}

export async function fetchProducts(token?: string) {
  const res = await api.get('/products', { headers: authHeader(token) });
  return res.data;
}
