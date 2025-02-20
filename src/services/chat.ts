/**
 * @author Jose Lacunza Kobs
 * @description Chat service with enhanced error handling and metrics
 */

import { api } from './api';
import type { 
  Message, ChatResponse, ApiError, ChatError, RequestMetrics 
} from '../types/chat';
import { useDevStore } from '../stores/dev';
import { mockChatMessage } from './mockChat';

function createRequestMetrics(): RequestMetrics {
  return {
    startTime: Date.now(),
    endTime: 0,
    duration: 0,
    status: 0,
    bytesTransferred: 0,
    cache: {
      hit: false
    }
  };
}

function finalizeMetrics(metrics: RequestMetrics, response: Response): RequestMetrics {
  metrics.endTime = Date.now();
  metrics.duration = metrics.endTime - metrics.startTime;
  metrics.status = response.status;
  metrics.bytesTransferred = parseInt(response.headers.get('content-length') || '0', 10);
  metrics.cache = {
    hit: response.headers.get('x-cache')?.includes('HIT') || false,
    age: parseInt(response.headers.get('age') || '0', 10)
  };
  return metrics;
}

function getConnectionInfo() {
  return {
    online: navigator.onLine,
    type: (navigator as any).connection?.type,
    rtt: (navigator as any).connection?.rtt
  };
}

export async function sendChatMessage(
  question: string, 
  history: Message[], 
  token: string
): Promise<string> {
  const useMock = useDevStore.getState().useMock;
  
  if (useMock) {
    const response = await mockChatMessage();
    return response.reply;
  }

  const metrics = createRequestMetrics();
  const requestId = crypto.randomUUID();
  const environment = import.meta.env.MODE;

  try {
    // Validar configuración
    const requiredVars = [
      'VITE_API_URL',
      'VITE_CHAT_API_URL',
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];

    const missingVars = requiredVars.filter(
      key => !import.meta.env[key]
    );

    if (missingVars.length > 0) {
      throw {
        type: 'config_error',
        message: 'Variables de entorno faltantes',
        details: `Faltan las siguientes variables: ${missingVars.join(', ')}`,
        severity: 'error',
        timestamp: Date.now(),
        environment,
        missingVars,
        invalidVars: {},
        suggestions: [
          'Verifica que exista el archivo .env',
          'Copia las variables desde .env.example',
          'Contacta al equipo de desarrollo para obtener los valores correctos'
        ]
      } as ChatError;
    }

    const url = new URL(api.chat.query);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Request-ID': requestId
    };

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        question,
        history: history.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      })
    });

    finalizeMetrics(metrics, response);

    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          code: response.status,
          message: response.statusText,
          details: null
        };
      }

      // Manejar errores específicos
      if (response.status === 401 || response.status === 403) {
        const error: AuthError = {
          type: 'auth_error',
          message: 'Error de autenticación',
          details: errorData.message || 'Token inválido o expirado',
          severity: 'error',
          timestamp: Date.now(),
          environment,
          status: response.status,
          token: {
            expired: response.status === 401,
            expiresAt: parseInt(response.headers.get('x-token-expires') || '0', 10)
          }
        };
        throw error;
      }

      if (response.status === 429) {
        const error: RateLimitError = {
          type: 'rate_limit_error',
          message: 'Límite de solicitudes excedido',
          details: errorData.message || 'Has excedido el límite de solicitudes',
          severity: 'warning',
          timestamp: Date.now(),
          environment,
          limit: parseInt(response.headers.get('x-ratelimit-limit') || '0', 10),
          remaining: parseInt(response.headers.get('x-ratelimit-remaining') || '0', 10),
          reset: parseInt(response.headers.get('x-ratelimit-reset') || '0', 10),
          retryAfter: parseInt(response.headers.get('retry-after') || '0', 10)
        };
        throw error;
      }

      const apiError: ApiErrorResponse = {
        type: 'api_error',
        message: errorData.message || `Error ${response.status}`,
        details: errorData.details || response.statusText,
        severity: 'error',
        timestamp: Date.now(),
        environment,
        requestId,
        status: response.status,
        statusText: response.statusText,
        responseTime: metrics.duration,
        endpoint: url.toString(),
        method: 'POST',
        headers: Object.fromEntries(response.headers.entries()),
        data: errorData,
        retryable: response.status >= 500 || response.status === 429
      };
      throw apiError;
    }

    const data: ChatResponse = await response.json();
    return data.reply;
  } catch (error) {
    // Manejar errores de red
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      const networkError: NetworkError = {
        type: 'network_error',
        message: 'Error de conexión',
        details: 'No se pudo establecer conexión con el servidor',
        severity: 'error',
        timestamp: Date.now(),
        environment,
        original: error,
        connection: getConnectionInfo(),
        request: {
          url: api.chat.query,
          method: 'POST',
          timeout: 30000
        }
      };
      throw networkError;
    }

    // Re-lanzar errores ya tipados
    if ((error as ChatError).type) {
      throw error;
    }

    // Error desconocido
    const unknownError: UnknownError = {
      type: 'unknown_error',
      message: 'Error inesperado',
      details: error instanceof Error ? error.message : 'Error desconocido',
      severity: 'error',
      timestamp: Date.now(),
      environment,
      original: error,
      context: {
        url: api.chat.query,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    };
    throw unknownError;
  }
}