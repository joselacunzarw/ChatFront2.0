import React, { useState } from 'react';
import { 
  Clock, Server, AlertCircle, Maximize2, Minimize2, Wifi, Database, 
  XCircle, ChevronDown, ChevronUp, Settings, Globe, Key, Webhook,
  Shield, Timer, FileJson, Network
} from 'lucide-react';
import { useDevStore } from '../../stores/dev';
import { useChatStore } from '../../stores/chat';
import { formatRequestLog } from '../../utils/logging';
import type { ChatError } from '../../types/chat';

// Función de ayuda para formatear timestamps de manera segura
function formatTimestamp(timestamp: number | undefined | null): string {
  if (!timestamp) return 'N/A';
  try {
    return new Date(timestamp).toISOString();
  } catch (e) {
    return 'Invalid Date';
  }
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

function DebugSection({ title, icon, children, defaultOpen = true, badge }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-gray-200">
          {icon}
          <span className="font-medium">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-900 border-t border-gray-700">{children}</div>
      )}
    </div>
  );
}

function RequestDetails({ request }: { request: any }) {
  if (!request) return null;

  return (
    <div className="space-y-4">
      {/* Información básica */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <Globe size={14} />
            <span className="font-medium">Método</span>
          </div>
          <code className="text-green-400">{request.method || 'GET'}</code>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <Timer size={14} />
            <span className="font-medium">Timestamp</span>
          </div>
          <code className="text-blue-400">{formatTimestamp(request.timestamp)}</code>
        </div>
      </div>

      {/* URL */}
      <div className="bg-gray-800 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-gray-300 mb-2">
          <Globe size={14} />
          <span className="font-medium">URL</span>
        </div>
        <code className="text-blue-400 break-all">{request.url || 'N/A'}</code>
      </div>

      {/* Headers */}
      <div className="bg-gray-800 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-gray-300 mb-2">
          <Shield size={14} />
          <span className="font-medium">Headers</span>
        </div>
        <div className="space-y-1">
          {Object.entries(request.headers || {}).map(([key, value]) => (
            <div key={key} className="grid grid-cols-[120px,1fr] gap-2 text-sm">
              <span className="text-gray-400">{key}:</span>
              <code className="text-orange-300">{String(value)}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      {request.body && (
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <FileJson size={14} />
            <span className="font-medium">Body</span>
          </div>
          <pre className="text-green-300 text-sm overflow-x-auto p-2 bg-gray-900 rounded">
            {typeof request.body === 'string' 
              ? request.body 
              : JSON.stringify(request.body, null, 2)}
          </pre>
        </div>
      )}

      {/* Métricas */}
      {request.metrics && (
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <Network size={14} />
            <span className="font-medium">Métricas</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Tiempo total:</span>
              <code className="text-purple-400">{request.metrics.duration || 0}ms</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Bytes transferidos:</span>
              <code className="text-purple-400">{request.metrics.bytesTransferred || 0} bytes</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResponseDetails({ response }: { response: any }) {
  if (!response) return null;

  return (
    <div className="space-y-4">
      {/* Status y tiempo */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <Server size={14} />
            <span className="font-medium">Status</span>
          </div>
          <code className={`${
            response.status >= 200 && response.status < 300 
              ? 'text-green-400' 
              : 'text-red-400'
          }`}>
            {response.status || 'N/A'}
          </code>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <Timer size={14} />
            <span className="font-medium">Timestamp</span>
          </div>
          <code className="text-blue-400">{formatTimestamp(response.timestamp)}</code>
        </div>
      </div>

      {/* Headers */}
      <div className="bg-gray-800 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-gray-300 mb-2">
          <Shield size={14} />
          <span className="font-medium">Headers</span>
        </div>
        <div className="space-y-1">
          {Object.entries(response.headers || {}).map(([key, value]) => (
            <div key={key} className="grid grid-cols-[120px,1fr] gap-2 text-sm">
              <span className="text-gray-400">{key}:</span>
              <code className="text-orange-300">{String(value)}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="bg-gray-800 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-gray-300 mb-2">
          <FileJson size={14} />
          <span className="font-medium">Body</span>
        </div>
        <pre className="text-green-300 text-sm overflow-x-auto p-2 bg-gray-900 rounded">
          {typeof response.body === 'string' 
            ? response.body 
            : JSON.stringify(response.body, null, 2)}
        </pre>
      </div>

      {/* Métricas */}
      {response.metrics && (
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <Network size={14} />
            <span className="font-medium">Métricas</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Tiempo de respuesta:</span>
              <code className="text-purple-400">{response.metrics.duration || 0}ms</code>
            </div>
            {response.metrics.cache && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Cache:</span>
                <code className={response.metrics.cache.hit ? 'text-green-400' : 'text-gray-400'}>
                  {response.metrics.cache.hit ? 'HIT' : 'MISS'}
                </code>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigSection({ config }: { config: Record<string, any> }) {
  return (
    <div className="space-y-4">
      {Object.entries(config).map(([category, values]) => (
        <div key={category} className="bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <Settings size={14} />
            <span className="font-medium">{category.toUpperCase()}</span>
          </div>
          <div className="space-y-1">
            {Object.entries(values).map(([key, value]) => (
              <div key={key} className="grid grid-cols-[200px,1fr] gap-2 text-sm">
                <span className="text-gray-400">{key}:</span>
                <code className={`${value ? 'text-green-400' : 'text-red-400'}`}>
                  {value || 'No configurado'}
                </code>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function RequestPanel() {
  const { isVisible, useMock } = useDevStore();
  const { lastRequest, lastResponse, error, requestTime } = useChatStore();
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible) return null;

  const envConfig = {
    api: {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_CHAT_API_URL: import.meta.env.VITE_CHAT_API_URL,
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    },
    auth: {
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
      VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    },
    app: {
      VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
      VITE_ORGANIZATION_NAME: import.meta.env.VITE_ORGANIZATION_NAME,
      VITE_MAX_CHAT_HISTORY: import.meta.env.VITE_MAX_CHAT_HISTORY,
    }
  };

  const hasConfigErrors = !envConfig.api.VITE_API_URL || 
                         !envConfig.api.VITE_CHAT_API_URL || 
                         !envConfig.api.VITE_SUPABASE_URL || 
                         !envConfig.auth.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="fixed right-4 top-4 w-[800px] bg-gray-900 rounded-lg shadow-xl border border-gray-700">
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 rounded-t-lg">
        <div className="flex items-center gap-2 text-gray-200">
          <Server size={16} />
          <h3 className="font-medium">Panel de Depuración</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            useMock ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'
          }`}>
            {useMock ? 'Mock API' : 'API Real'}
          </span>
          {hasConfigErrors && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
              Error de Configuración
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {requestTime && (
            <span className="text-sm text-gray-400">
              <Clock size={14} className="inline mr-1" />
              {requestTime}ms
            </span>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 rounded-md transition-colors"
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4 max-h-[calc(100vh-200px)] overflow-auto space-y-4">
          {/* Configuración */}
          <DebugSection 
            title="Configuración" 
            icon={<Settings size={16} className="text-gray-400" />}
            badge={hasConfigErrors ? 'Error' : 'OK'}
          >
            <ConfigSection config={envConfig} />
          </DebugSection>

          {/* Request */}
          {lastRequest && (
            <DebugSection 
              title="Request" 
              icon={<Webhook size={16} className="text-gray-400" />}
            >
              <RequestDetails request={lastRequest} />
            </DebugSection>
          )}

          {/* Response */}
          {lastResponse && (
            <DebugSection 
              title="Response" 
              icon={<Server size={16} className="text-gray-400" />}
            >
              <ResponseDetails response={lastResponse} />
            </DebugSection>
          )}

          {/* Estado y Errores */}
          {error && (
            <DebugSection 
              title="Error" 
              icon={<AlertCircle size={16} className="text-red-400" />}
              defaultOpen={true}
            >
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle size={16} className="text-red-400" />
                  <span className="text-red-300 font-medium">{error.message}</span>
                </div>
                {error.details && (
                  <pre className="text-sm text-red-300 bg-gray-800 p-3 rounded mt-2">
                    {error.details}
                  </pre>
                )}
                {error.type === 'api_error' && (
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-800 p-2 rounded">
                      <span className="text-gray-400">Status: </span>
                      <span className="text-red-300">{error.status}</span>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <span className="text-gray-400">Endpoint: </span>
                      <span className="text-red-300">{error.endpoint}</span>
                    </div>
                  </div>
                )}
              </div>
            </DebugSection>
          )}
        </div>
      )}
    </div>
  );
}