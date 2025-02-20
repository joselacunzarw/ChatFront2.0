import React, { useState } from 'react';
import { Activity, Database } from 'lucide-react';
import { DraggablePanel } from './DraggablePanel';
import { HealthMonitor } from './HealthMonitor';
import { RequestPanel } from './RequestPanel';
import { useDevStore } from '../../stores/dev';

export function DevPanel() {
  const { togglePanel } = useDevStore();
  const [activeTab, setActiveTab] = useState<'health' | 'requests'>('health');

  return (
    <DraggablePanel 
      title="Panel de Desarrollo" 
      onClose={togglePanel}
    >
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            activeTab === 'health' 
              ? 'bg-primary text-white' 
              : 'hover:bg-gray-100'
          }`}
        >
          <Activity size={16} />
          <span>Estado API</span>
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            activeTab === 'requests' 
              ? 'bg-primary text-white' 
              : 'hover:bg-gray-100'
          }`}
        >
          <Database size={16} />
          <span>Requests</span>
        </button>
      </div>

      {activeTab === 'health' ? (
        <HealthMonitor />
      ) : (
        <RequestPanel />
      )}
    </DraggablePanel>
  );
}