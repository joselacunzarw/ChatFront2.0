import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthLayout } from './components/layout/AuthLayout';
import { ChatContainer } from './components/chat/ChatContainer';
import { DevControls } from './components/dev/DevControls';
import { RequestPanel } from './components/dev/RequestPanel';
import { useAuthStore } from './stores/auth';
import { hasRequiredPermissions } from './types/auth';
import { useIsAdmin } from './hooks/useIsAdmin';
import { useDevStore } from './stores/dev';
import { config } from './config/theme';

export default function App() {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = useIsAdmin();
  const { showPanel } = useDevStore();
  const showDevTools = config.devMode && isAdmin;

  if (!isAuthenticated) {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthLayout />
      </GoogleOAuthProvider>
    );
  }

  // Solo verificar permisos después de autenticarse
  if (!hasRequiredPermissions(user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Acceso Denegado</h2>
          <p className="mt-2 text-gray-600">
            No tienes permisos para acceder a esta aplicación.
          </p>
          <button
            onClick={() => useAuthStore.getState().logout()}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 p-4">
      <div className="mx-auto w-full max-w-4xl">
        <ChatContainer />
      </div>
      {showDevTools && (
        <>
          <DevControls />
          {showPanel && <RequestPanel />}
        </>
      )}
    </div>
  );
}