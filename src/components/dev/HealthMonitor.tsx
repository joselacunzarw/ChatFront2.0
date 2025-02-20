import React, { useState, useEffect } from 'react';
import { Activity, Database, Clock, Package } from 'lucide-react';
import { checkApiHealth } from '../../services/health';
import type { HealthStatus } from '../../types/api';

export function HealthMonitor() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<number>(Date.now());

  const checkHealth = async () => {
    try {
      const status = await checkApiHealth();
      setHealth(status);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar la API');
    } finally {
      setLastCheck(Date.now());
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Verificar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin">
          <Activity size={24} className="text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity 
            size={20} 
            className={health.status === 'healthy' ? 'text-green-500' : 'text-red-500'} 
          />
          <span className="font-medium">
            Estado: {health.status === 'healthy' ? 'Saludable' : 'Con problemas'}
          </span>
        </div>
        <button
          onClick={checkHealth}
          className="text-sm text-primary hover:text-primary-dark"
        >
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(health.services).map(([service, status]) => (
          <div key={service} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Database size={16} className={status.status === 'up' ? 'text-green-500' : 'text-red-500'} />
              <span className="font-medium capitalize">{service}</span>
            </div>
            <div className="text-sm text-gray-600">
              Latencia: {status.latency}ms
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
        <div className="flex items-center gap-1">
          <Package size={14} />
          <span>v{health.version}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>
            Última verificación: {new Date(lastCheck).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}