import { api } from './api';
import type { LoginResponse, User } from '../types/auth';
import { parseLoginResponse } from '../types/auth';
import { jwtDecode } from 'jwt-decode';

interface GoogleCredentialPayload {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

export async function loginWithCredentials(
  email: string, 
  password: string
): Promise<{ user: User; token: string }> {
  try {
    const response = await fetch(api.auth.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data: LoginResponse = await response.json();
    return parseLoginResponse(data);
  } catch (error) {
    throw new Error('Credenciales inválidas');
  }
}

export async function loginWithGoogle(
  credential: string
): Promise<{ user: User; token: string }> {
  try {
    // Decodificar el token de Google para obtener la información necesaria
    const payload = jwtDecode<GoogleCredentialPayload>(credential);

    const response = await fetch(api.auth.googleLogin, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name
      })
    });

    if (!response.ok) {
      let errorMessage = 'Error al iniciar sesión con Google';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        // Si no podemos parsear la respuesta, usar mensaje genérico
      }
      throw new Error(errorMessage);
    }

    const data: LoginResponse = await response.json();
    return parseLoginResponse(data);
  } catch (error) {
    console.error('Error en login con Google:', error);
    if (error instanceof Error && error.message.includes('User not found')) {
      throw new Error('Usuario no registrado. Por favor, contacta al administrador para obtener acceso.');
    }
    throw new Error(error instanceof Error ? error.message : 'Error al iniciar sesión con Google');
  }
}

// Función de ayuda para desarrollo
export function createDevUser(): { user: User; token: string } {
  return {
    user: {
      id: 'dev',
      email: 'dev@local',
      applications: {
        chatbot1: 'user'
      }
    },
    token: 'dev-token'
  };
}