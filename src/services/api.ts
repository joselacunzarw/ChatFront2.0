// Asegurarse de que las URLs sean válidas o usar rutas relativas
const API_URL = import.meta.env.VITE_API_URL || '/api';
const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || '/chat';

// Asegurarse de que las URLs sean válidas
function ensureValidUrl(baseUrl: string, path: string): string {
  try {
    return new URL(path, baseUrl).toString();
  } catch {
    // Si la URL no es válida, usar ruta relativa
    return path;
  }
}

export const api = {
  auth: {
    login: ensureValidUrl(API_URL, '/login'),
    googleLogin: ensureValidUrl(API_URL, '/login/google')
  },
  chat: {
    query: ensureValidUrl(CHAT_API_URL, '/consultar'),
    history: ensureValidUrl(CHAT_API_URL, '/chat/history'),
  },
  health: ensureValidUrl(CHAT_API_URL, '/health'),
  user: {
    profile: ensureValidUrl(API_URL, '/user/profile'),
    settings: ensureValidUrl(API_URL, '/user/settings'),
  }
};