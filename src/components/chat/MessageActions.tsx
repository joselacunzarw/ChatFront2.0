/**
 * @author Jose Lacunza Kobs
 * @description Componente para las acciones disponibles en los mensajes del asistente
 */

import React from 'react';
import { ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { config } from '../../config/app';

interface MessageActionsProps {
  isLiked: boolean;
  isDisliked: boolean;
  isCopied: boolean;
  onLike: () => void;
  onDislike: () => void;
  onCopy: () => void;
}

export function MessageActions({
  isLiked,
  isDisliked,
  isCopied,
  onLike,
  onDislike,
  onCopy
}: MessageActionsProps) {
  const { features } = config.app;

  return (
    <div className="absolute -right-2 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white p-1 rounded-lg shadow-md">
      {/* Reacciones */}
      {features.reactions.enabled && (
        <>
          <button
            onClick={onLike}
            className={`p-1 rounded hover:bg-gray-100 transition-colors ${
              isLiked ? 'text-primary' : 'text-gray-400'
            }`}
            title={isLiked ? 'Quitar me gusta' : 'Me gusta'}
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            onClick={onDislike}
            className={`p-1 rounded hover:bg-gray-100 transition-colors ${
              isDisliked ? 'text-red-500' : 'text-gray-400'
            }`}
            title={isDisliked ? 'Quitar no me gusta' : 'No me gusta'}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Copiar contenido */}
      {features.sharing.enabled && (
        <button
          onClick={onCopy}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400"
          title="Copiar respuesta"
        >
          {isCopied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}