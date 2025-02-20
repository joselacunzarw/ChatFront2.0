export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: number;
  services: {
    database?: {
      status: 'up' | 'down';
      latency: number;
    };
    cache?: {
      status: 'up' | 'down';
      latency: number;
    };
  };
  version: string;
}

export interface ApiEndpoint {
  name: string;
  url: string;
  method: string;
  description: string;
}

export const API_DOCUMENTATION: ApiEndpoint[] = [
  {
    name: 'Health Check',
    url: '/health',
    method: 'GET',
    description: 'Verifica el estado de salud de la API y sus servicios'
  },
  {
    name: 'Chat Query',
    url: '/chat',
    method: 'POST',
    description: 'Envía una consulta al chatbot'
  },
  {
    name: 'Chat History',
    url: '/chat/history',
    method: 'GET',
    description: 'Obtiene el historial de conversaciones'
  }
];