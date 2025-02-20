import React from 'react';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500">
      <div className="flex gap-1">
        <span className="animate-bounce [animation-delay:-0.3s]">•</span>
        <span className="animate-bounce [animation-delay:-0.2s]">•</span>
        <span className="animate-bounce [animation-delay:-0.1s]">•</span>
      </div>
      <span className="ml-1">Escribiendo</span>
    </div>
  );
}