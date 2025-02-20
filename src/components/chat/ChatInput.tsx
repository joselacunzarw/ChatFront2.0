/**
 * @fileoverview Componente de entrada de mensajes con soporte para archivos y audio
 * @author Jose Lacunza Kobs
 * @version 1.0.0
 * @license MIT
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, X, Loader2 } from 'lucide-react';
import { useChatStore } from '../../stores/chat';
import { config } from '../../config/app';

interface ChatInputProps {
  disabled?: boolean;
}

export function ChatInput({ disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const { sendMessage, isLoading } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { features } = config.app;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && files.length === 0 || isLoading || disabled) return;

    await sendMessage(message);
    setMessage('');
    setFiles([]);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      const isValidSize = file.size <= features.uploads.maxSize;
      const isValidType = features.uploads.allowedTypes.files.extensions
        .includes(`.${file.name.split('.').pop()}`);
      return isValidSize && isValidType;
    });
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = () => {
    if (!features.uploads.allowedTypes.audio.enabled) return;
    setIsRecording(true);
    // TODO: Implementar grabación de audio
  };

  const stopRecording = () => {
    setIsRecording(false);
    // TODO: Implementar detención de grabación
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4">
      {/* Archivos adjuntos */}
      {files.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm text-gray-600">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Área de texto */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 'Chat deshabilitado' : 'Escribe tu mensaje...'}
            className="w-full rounded-lg border-0 bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-primary/20 
                     resize-none min-h-[44px] max-h-[200px] disabled:opacity-50"
            disabled={disabled || isLoading}
            rows={1}
          />
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          {/* Subir archivo */}
          {features.uploads.allowedTypes.files.enabled && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept={features.uploads.allowedTypes.files.extensions.join(',')}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isLoading}
                className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Paperclip size={20} />
              </button>
            </>
          )}

          {/* Grabar audio */}
          {features.uploads.allowedTypes.audio.enabled && (
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={disabled || isLoading}
              className={`rounded-full p-2 ${
                isRecording ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Mic size={20} />
            </button>
          )}

          {/* Enviar mensaje */}
          <button
            type="submit"
            disabled={(!message.trim() && files.length === 0) || isLoading || disabled}
            className="rounded-full bg-primary p-2 text-white hover:bg-primary-dark
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </form>
  );
}