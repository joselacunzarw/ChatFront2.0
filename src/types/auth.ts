import { jwtDecode } from 'jwt-decode';

export interface Applications {
  [key: string]: string;
}

export interface User {
  id: string | number;
  email: string;
  name?: string;
  avatar?: string;
  applications: Applications;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

export interface JWTPayload {
  sub: string;
  applications: Applications;
  exp: number;
  name?: string;
  picture?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
}

export function hasRequiredPermissions(user: User | null, appId: string = 'chatbot1'): boolean {
  if (!user?.applications) return false;
  // Permitir acceso a usuarios con rol 'user' o 'admin'
  return ['user', 'admin'].includes(user.applications[appId]);
}

export function parseLoginResponse(response: LoginResponse): { user: User; token: string } {
  const token = response.access_token;
  let user: User;

  if (response.user) {
    // Si los permisos vienen en la respuesta
    user = response.user;
  } else {
    // Si los permisos están en el JWT
    const decoded = jwtDecode<JWTPayload>(token);
    user = {
      id: decoded.sub,
      email: decoded.sub,
      name: decoded.name,
      avatar: decoded.picture,
      applications: decoded.applications
    };
  }

  return { user, token };
}