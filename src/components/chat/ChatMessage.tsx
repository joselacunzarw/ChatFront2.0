/**
 * @fileoverview Componente de mensaje de chat con soporte para reacciones y markdown
 * @author Jose Lacunza Kobs
 * @version 1.0.0
 * @license MIT
 */

import React, { useState } from 'react';
import { Message } from '../../types/chat';
import { Bot, Paperclip, Music } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDateTime } from '../../utils/dateTime';
import { markdownComponents } from './MarkdownComponents';
import { MessageActions } from './MessageActions';
import { MessageAvatar } from './MessageAvatar';
import { config } from '../../config/app';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleLike = () => {
    setIsLiked(!isLiked);
    setIsDisliked(false);
    // TODO: Implementar llamada a API
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    setIsLiked(false);
    // TODO: Implementar llamada a API
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} group`}>
      <MessageAvatar 
        isUser={isUser} 
        userAvatar={message.user?.avatar}
        userName={message.user?.name}
      />

      <div className="flex flex-col max-w-[85%]">
        {/* Nombre del usuario */}
        {isUser && message.user?.name && (
          <div className="flex justify-end mb-1">
            <span className="text-sm font-medium text-gray-600">
              {message.user.name}
            </span>
          </div>
        )}

        {/* Mensaje */}
        <div className={`relative rounded-lg px-4 py-2 ${
          isUser 
            ? 'bg-primary text-white rounded-tr-none' 
            : 'bg-white border border-gray-200 rounded-tl-none'
        }`}>
          {/* Contenido del mensaje */}
          {isUser ? (
            <>
              <p className="text-white">{message.content}</p>
              {/* Archivos adjuntos del usuario */}
              {message.attachments?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm"
                    >
                      {attachment.type === 'file' ? (
                        <Paperclip size={14} />
                      ) : (
                        <Music size={14} />
                      )}
                      <span>{attachment.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Acciones del mensaje (solo para mensajes del asistente) */}
          {!isUser && config.app.features.reactions.enabled && (
            <MessageActions
              isLiked={isLiked}
              isDisliked={isDisliked}
              isCopied={isCopied}
              onLike={handleLike}
              onDislike={handleDislike}
              onCopy={handleCopy}
            />
          )}
        </div>

        {/* Metadatos */}
        <div className={`mt-1 flex items-center gap-2 text-xs ${
          isUser ? 'justify-end text-gray-500' : 'text-gray-400'
        }`}>
          <span>{formatDateTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}