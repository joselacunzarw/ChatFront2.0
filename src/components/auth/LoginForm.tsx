/**
 * @author Jose Lacunza Kobs
 * @description Formulario de login con diseño moderno y manejo de errores
 */

import React, { useState } from 'react';
import { useAuthStore } from '../../stores/auth';
import { MessageCircleWarning, Mail, Lock, Loader2 } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      setPassword(''); // Limpiar contraseña en error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <div className="mt-1 relative">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg 
                     shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-primary/20 focus:border-primary transition-colors"
            disabled={isLoading}
            required
          />
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg 
                     shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-primary/20 focus:border-primary transition-colors"
            disabled={isLoading}
            required
          />
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <MessageCircleWarning size={16} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent 
                 rounded-lg shadow-sm text-white bg-primary hover:bg-primary-dark 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary 
                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Iniciando sesión...</span>
          </>
        ) : (
          <span>Iniciar sesión</span>
        )}
      </button>

      {/* Forgot password link */}
      <div className="text-center">
        <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </form>
  );
}