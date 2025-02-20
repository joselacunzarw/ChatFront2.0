import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatState, Message, ChatError, RequestMetrics } from '../types/chat';
import { sendChatMessage } from '../services/chat';
import { useAuthStore } from './auth';
import { config } from '../config/theme';

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,
      lastRequest: null,
      lastResponse: null,
      requestTime: null,
      requestLog: null,
      metrics: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0
      },

      sendMessage: async (content: string) => {
        const { user, token } = useAuthStore.getState();
        if (!token) {
          set({ error: {
            type: 'auth_error',
            message: 'No autenticado',
            details: 'Se requiere autenticación para enviar mensajes',
            severity: 'error',
            timestamp: Date.now(),
            environment: import.meta.env.MODE,
            status: 401
          }});
          return;
        }

        const startTime = Date.now();
        
        // Crear el request
        const request = {
          timestamp: startTime,
          method: 'POST',
          url: import.meta.env.VITE_CHAT_API_URL + '/consultar',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Request-ID': crypto.randomUUID()
          },
          body: {
            question: content,
            history: get().messages.slice(-config.maxChatHistory)
          },
          metrics: {
            startTime,
            endTime: 0,
            duration: 0,
            status: 0,
            bytesTransferred: 0
          } as RequestMetrics
        };

        // Agregar mensaje del usuario inmediatamente
        const userMessage: Message = {
          role: 'user',
          content,
          timestamp: Date.now(),
          user: {
            name: user?.name,
            email: user?.email
          }
        };

        set(state => ({
          messages: [...state.messages, userMessage],
          isLoading: true,
          error: null,
          lastRequest: request,
          metrics: {
            ...state.metrics,
            totalRequests: state.metrics.totalRequests + 1
          }
        }));

        try {
          const reply = await sendChatMessage(content, request.body.history, token);
          const endTime = Date.now();
          
          // Actualizar métricas del request
          request.metrics.endTime = endTime;
          request.metrics.duration = endTime - startTime;
          request.metrics.status = 200;

          // Crear el response
          const response = {
            timestamp: endTime,
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'X-Response-Time': `${endTime - startTime}ms`
            },
            body: { reply },
            metrics: {
              duration: endTime - startTime,
              cache: { hit: false }
            }
          };

          const assistantMessage: Message = {
            role: 'assistant',
            content: reply,
            timestamp: Date.now()
          };

          set(state => ({ 
            messages: [...state.messages, assistantMessage],
            isLoading: false,
            lastResponse: response,
            requestTime: endTime - startTime,
            metrics: {
              ...state.metrics,
              successfulRequests: state.metrics.successfulRequests + 1,
              averageResponseTime: (
                (state.metrics.averageResponseTime * state.metrics.successfulRequests) +
                (endTime - startTime)
              ) / (state.metrics.successfulRequests + 1)
            }
          }));
        } catch (error) {
          const endTime = Date.now();
          
          // Actualizar métricas del request con el error
          request.metrics.endTime = endTime;
          request.metrics.duration = endTime - startTime;
          request.metrics.status = (error as any).status || 500;

          set(state => ({ 
            error: error as ChatError,
            isLoading: false,
            requestTime: endTime - startTime,
            metrics: {
              ...state.metrics,
              failedRequests: state.metrics.failedRequests + 1
            }
          }));
        }
      },

      clearHistory: () => set({ 
        messages: [], 
        lastRequest: null, 
        lastResponse: null, 
        requestTime: null,
        requestLog: null,
        error: null,
        metrics: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          averageResponseTime: 0
        }
      })
    }),
    {
      name: 'chat-storage'
    }
  )
);