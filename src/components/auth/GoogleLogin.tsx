import { GoogleLogin as GoogleLoginButton } from '@react-oauth/google';
import { useAuthStore } from '../../stores/auth';
import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

export function GoogleLogin() {
  const loginWithGoogle = useAuthStore(state => state.loginWithGoogle);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [error, setError] = useState<string | null>(null);

  // Si no hay client ID configurado, no renderizar el componente
  if (!googleClientId || googleClientId === 'your-google-client-id') {
    return null;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="relative bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button 
            onClick={() => setError(null)}
            className="absolute top-2 right-2 text-red-400 hover:text-red-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex justify-center">
        <GoogleLoginButton
          onSuccess={async (response) => {
            if ('credential' in response) {
              try {
                await loginWithGoogle(response.credential!);
                setError(null);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al iniciar sesión con Google');
              }
            }
          }}
          onError={() => {
            setError('Error al iniciar sesión con Google. Por favor, intenta nuevamente.');
          }}
          theme="outline"
          size="large"
          shape="rectangular"
          width="100%"
          locale="es"
          text="continue_with"
          useOneTap
        />
      </div>
    </div>
  );
}