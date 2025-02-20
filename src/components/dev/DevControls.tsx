import React from 'react';
import { Settings, Eye, EyeOff, RotateCcw, Database, MonitorSmartphone } from 'lucide-react';
import { useDevStore } from '../../stores/dev';
import { useChatStore } from '../../stores/chat';

export function DevControls() {
  const { isVisible, toggleVisibility, useMock, toggleMock, togglePanel } = useDevStore();
  const clearHistory = useChatStore(state => state.clearHistory);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      <button
        onClick={toggleVisibility}
        className="rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700"
        title={isVisible ? 'Ocultar controles' : 'Mostrar controles'}
      >
        {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      {isVisible && (
        <div className="flex flex-col gap-2">
          <button
            onClick={toggleMock}
            className={`rounded-full p-2 text-white ${
              useMock ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            title={useMock ? 'Usando Mock API' : 'Usando API Real'}
          >
            <Database size={20} />
          </button>
          <button
            onClick={togglePanel}
            className="rounded-full bg-indigo-600 p-2 text-white hover:bg-indigo-700"
            title="Toggle Dev Panel"
          >
            <MonitorSmartphone size={20} />
          </button>
          <button
            onClick={clearHistory}
            className="rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
            title="Limpiar historial"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      )}
    </div>
  );
}