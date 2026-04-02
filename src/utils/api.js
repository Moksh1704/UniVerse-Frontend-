/**
 * api.js — HTTP client using fetch (avoids axios URL.protocol issue on Hermes)
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://universesocial.onrender.com';

async function getAuthHeader() {
  try {
    const token = await AsyncStorage.getItem('universe_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function request(method, path, body) {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.detail || data?.message || 'Something went wrong');
  }
  return res.json();
}

const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  put:    (path, body)  => request('PUT',    path, body),
  delete: (path)        => request('DELETE', path),
};

export default api;
