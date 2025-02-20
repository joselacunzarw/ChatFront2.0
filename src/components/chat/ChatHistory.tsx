import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../stores/chat';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { AlertCircle, XCircle } from 'lucide-react';
import type { ChatError } from '../../types/chat';

function ErrorMessage({ error }: { error: ChatError }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 mx-auto max-w-[85%]">
      <div className="w-full bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="text-red-400" size={20} />
          <span className="text-red-400 font-medium">{error.message}</span>
        </div>
        {error.details && (
          <p className="text-sm text-red-300 mt-1">{error.details}</p>
        )}
        {error.type === 'api_error' && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-800/50 p-2 rounded">
              <span className="text-gray-400">Status: </span>
              <span className="text-red-300">{error.status}</span>
            </div>
            <div className="bg-gray-800/50 p-2 rounded">
              <span className="text-gray-400">Endpoint: </span>
              <span className="text-red-300">{error.endpoint}</span>
            </div>
          </div>
        )}
        {error.type === 'network_error' && (
          <div className="mt-3 text-sm text-red-300">
            <p>Estado de conexión: {error.connection.online ? 'Online' : 'Offline'}</p>
            {error.connection.type && (
              <p>Tipo de conexión: {error.connection.type}</p>
            )}
          </div>
        )}
        {error.type === 'config_error' && (
          <div className="mt-3 text-sm">
            <p className="text-red-300">Variables faltantes:</p>
            <ul className="list-disc list-inside mt-1 text-red-300">
              {error.missingVars.map(variable => (
                <li key={variable}>{variable}</li>
              ))}
            </ul>
            {error.suggestions && error.suggestions.length > 0 && (
              <>
                <p className="text-gray-400 mt-2">Sugerencias:</p>
                <ul className="list-disc list-inside mt-1 text-gray-400">
                  {error.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatHistory() {
  const { messages, isLoading, error } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, error]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <ChatMessage key={message.timestamp + index} message={message} />
      ))}
      {isLoading && (
        <div className="flex items-start">
          <div className="max-w-[85%] rounded-2xl bg-background-light">
            <TypingIndicator />
          </div>
        </div>
      )}
      {error && <ErrorMessage error={error} />}
      <div ref={bottomRef} />
    </div>
  );
}