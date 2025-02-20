/**
 * @fileoverview Componente de layout para la pantalla de autenticación
 * @author Jose Lacunza Kobs
 * @version 1.0.0
 * @license MIT
 */

import React, { useState } from 'react';
import { LoginForm } from '../auth/LoginForm';
import { GoogleLogin } from '../auth/GoogleLogin';
import { Settings, Building2 } from 'lucide-react';
import { useChatStore } from '../../stores/chat';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { config } from '../../config/app';

export function AuthLayout() {
  const clearHistory = useChatStore(state => state.clearHistory);
  const showDevMode = config.dev.enabled;
  const [logoError, setLogoError] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const showGoogleLogin = googleClientId && googleClientId !== 'your-google-client-id';

  const handleDevMode = () => {
    clearHistory();
    window.localStorage.setItem('auth-storage', JSON.stringify({
      state: {
        user: { 
          id: 'dev',
          email: 'dev@local',
          applications: { chatbot1: 'admin' } // Cambiado a 'admin' para habilitar debug
        },
        token: 'dev-token',
        isAuthenticated: true
      }
    }));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo con fallback */}
        {config.app.organization.logo && !logoError ? (
          <img
            src={config.app.organization.logo}
            alt={`${config.app.organization.name} Logo`}
            className="mx-auto h-12 w-auto"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
        )}

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {config.app.name}
        </h2>
        {config.app.description && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {config.app.description}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
          
          {showGoogleLogin && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    O continuar con
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <GoogleLogin />
              </div>
            </div>
          )}

          {showDevMode && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleDevMode}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 
                         shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white 
                         hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-primary"
              >
                <Settings className="h-4 w-4" />
                Modo Desarrollo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}