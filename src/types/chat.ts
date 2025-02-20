/**
 * @fileoverview Definiciones de tipos para el sistema de chat
 * @author Jose Lacunza Kobs
 * @version 1.0.0
 * @license MIT
 * 
 * Este archivo contiene todas las definiciones de tipos necesarias para el sistema de chat,
 * incluyendo mensajes, reacciones, archivos adjuntos y manejo de errores.
 */

/**
 * Configuración de características del chat
 * @typedef {Object} ChatFeatures
 */
export interface ChatFeatures {
  /** Configuración de reacciones (like/dislike) */
  reactions: {
    enabled: boolean;
    types: Array<'like' | 'dislike'>;
  };
  /** Configuración de opciones para compartir */
  sharing: {
    enabled: boolean;
    options: Array<'copy'>;
  };
  /** Configuración de carga de archivos */
  uploads: {
    enabled: boolean;
    maxSize: number;
    allowedTypes: {
      files: {
        enabled: boolean;
        extensions: string[];
      };
      audio: {
        enabled: boolean;
        maxDuration: number;
        formats: string[];
      };
    };
  };
}

/**
 * Representa una reacción a un mensaje
 * @typedef {Object} MessageReaction
 */
export interface MessageReaction {
  type: 'like' | 'dislike';
  userId: string;
  messageId: string;
  timestamp: number;
}

/**
 * Representa un archivo adjunto en un mensaje
 * @typedef {Object} MessageAttachment
 */
export interface MessageAttachment {
  type: 'file' | 'audio';
  url: string;
  name: string;
  size: number;
  mimeType: string;
  duration?: number; // Solo para archivos de audio
}

/**
 * Representa un mensaje en el chat
 * @typedef {Object} Message
 */
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  user?: {
    name?: string;
    email?: string;
  };
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
}

// ... (resto del código existente)