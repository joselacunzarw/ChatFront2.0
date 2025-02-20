import { api } from './api';
import { HealthStatus } from '../types/api';
import { useDevStore } from '../stores/dev';

export async function checkApiHealth(): Promise<HealthStatus> {
  const useMock = useDevStore.getState().useMock;
  
  if (useMock) {
    return mockHealthCheck();
  }

  const response = await fetch(`${api.health}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Error al verificar la salud de la API');
  }

  return response.json();
}

function mockHealthCheck(): HealthStatus {
  return {
    status: 'healthy',
    timestamp: Date.now(),
    services: {
      database: {
        status: 'up',
        latency: 45
      },
      cache: {
        status: 'up',
        latency: 12
      }
    },
    version: '1.0.0'
  };
}