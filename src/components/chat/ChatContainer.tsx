/**
 * @author Jose Lacunza Kobs
 * @description Componente principal del chat que maneja la interfaz y la lógica de la conversación
 */

import React from 'react';
import { ChatHistory } from './ChatHistory';
import { ChatInput } from './ChatInput';
import { Trash2, LogOut, AlertTriangle, Building2, UserCircle2 } from 'lucide-react';
import { useChatStore } from '../../stores/chat';
import { useAuthStore } from '../../stores/auth';
import { config } from '../../config/app';

export function ChatContainer() {
  const { messages, clearHistory } = useChatStore();
  const { user, logout } = useAuthStore();
  
  const maxHistory = config.app.maxChatHistory;
  const userMessageCount = messages.filter(m => m.role === 'user').length;
  const hasReachedLimit = userMessageCount >= maxHistory;

  const handleLogout = () => {
    clearHistory();
    logout();
  };

  const handleNewChat = () => {
    clearHistory();
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col rounded-2xl border-0 bg-white shadow-soft">
      {/* Header con logo y controles */}
      <div className="flex items-center justify-between bg-gradient-to-r from-primary to-primary-dark p-4 rounded-t-2xl">
        <div className="flex items-center gap-3">
          {/* Contenedor del logo con manejo de fallback */}
          <div className="relative h-10 w-10 flex items-center justify-center">
            {config.app.organization.logo ? (
              <>
                <img 
                  src={config.app.organization.logo}
                  alt={`${config.app.organization.name} Logo`}
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                    if (fallback) {
                      fallback.classList.remove('hidden');
                    }
                  }}
                />
                <div className="fallback-icon hidden absolute inset-0 p-2 bg-white/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              </>
            ) : (
              <div className="p-2 bg-white/10 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
          
          {/* Información de la organización */}
          <div>
            <h2 className="text-xl font-bold text-white">
              {config.app.name}
            </h2>
            <p className="text-sm text-white/80">
              {config.app.organization.name}
            </p>
          </div>
        </div>

        {/* Usuario actual y controles */}
        <div className="flex items-center gap-4">
          {/* Información del usuario */}
          <div className="flex items-center gap-2 text-white">
            <div className="relative w-8 h-8">
              {user?.avatar ? (
                <img 
                  src={user.avatar}
                  alt={user.name || user.email}
                  className="rounded-full w-8 h-8 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`${user?.avatar ? 'hidden' : ''} absolute inset-0 rounded-full bg-white/10 flex items-center justify-center`}>
                <UserCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.name || user?.email}</p>
              {user?.name && (
                <p className="text-xs text-white/70">{user.email}</p>
              )}
            </div>
          </div>

          {/* Controles: Nueva conversación y Cerrar sesión */}
          <div className="flex gap-3">
            <button
              onClick={handleNewChat}
              className="rounded-full p-2 text-white/80 hover:bg-white/10 transition-colors"
              title="Nueva conversación"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full p-2 text-white/80 hover:bg-white/10 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Alerta de límite de mensajes */}
      {hasReachedLimit && (
        <div className="bg-yellow-50 border-b border-yellow-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" size={20} />
            <div className="flex-1">
              <p className="text-sm text-yellow-700">
                Has alcanzado el límite de {maxHistory} preguntas en esta conversación.
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                Para continuar, puedes{' '}
                <button
                  onClick={handleNewChat}
                  className="text-yellow-800 hover:text-yellow-900 underline font-medium"
                >
                  iniciar una nueva conversación
                </button>
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Componentes principales del chat */}
      <ChatHistory />
      <ChatInput disabled={hasReachedLimit} />
    </div>
  );
}