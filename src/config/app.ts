import { z } from 'zod';

const envSchema = z.object({
  // API Configuration
  VITE_API_URL: z.string().url(),
  VITE_CHAT_API_URL: z.string().url(),
  
  // Authentication
  VITE_GOOGLE_CLIENT_ID: z.string(),
  
  // Application Settings
  VITE_APP_NAME: z.string(),
  VITE_APP_DESCRIPTION: z.string(),
  VITE_ORGANIZATION_NAME: z.string(),
  VITE_ORGANIZATION_LOGO_URL: z.string().url(),
  VITE_ASSISTANT_NAME: z.string(),
  VITE_MAX_CHAT_HISTORY: z.coerce.number().positive(),
  
  // Theme Configuration
  VITE_PRIMARY_COLOR: z.string(),
  VITE_SECONDARY_COLOR: z.string(),
  VITE_ACCENT_COLOR: z.string(),
  
  // Chat Features Configuration
  VITE_ENABLE_REACTIONS: z.coerce.boolean(),
  VITE_ENABLE_MESSAGE_COPY: z.coerce.boolean(),
  VITE_ENABLE_FILE_UPLOAD: z.coerce.boolean(),
  VITE_ENABLE_AUDIO_UPLOAD: z.coerce.boolean(),
  VITE_MAX_FILE_SIZE: z.coerce.number(),
  VITE_ALLOWED_FILE_TYPES: z.string(),
  VITE_ALLOWED_AUDIO_TYPES: z.string(),
  VITE_MAX_AUDIO_DURATION: z.coerce.number(),
  
  // Development
  VITE_DEV_MODE: z.coerce.boolean()
});

const env = envSchema.parse(import.meta.env);

export const config = {
  api: {
    baseUrl: env.VITE_API_URL,
    chatUrl: env.VITE_CHAT_API_URL
  },
  auth: {
    googleClientId: env.VITE_GOOGLE_CLIENT_ID
  },
  app: {
    name: env.VITE_APP_NAME,
    description: env.VITE_APP_DESCRIPTION,
    organization: {
      name: env.VITE_ORGANIZATION_NAME,
      logo: env.VITE_ORGANIZATION_LOGO_URL
    },
    assistant: {
      name: env.VITE_ASSISTANT_NAME
    },
    maxChatHistory: env.VITE_MAX_CHAT_HISTORY,
    features: {
      reactions: {
        enabled: env.VITE_ENABLE_REACTIONS
      },
      sharing: {
        enabled: env.VITE_ENABLE_MESSAGE_COPY
      },
      uploads: {
        enabled: env.VITE_ENABLE_FILE_UPLOAD || env.VITE_ENABLE_AUDIO_UPLOAD,
        maxSize: env.VITE_MAX_FILE_SIZE,
        allowedTypes: {
          files: {
            enabled: env.VITE_ENABLE_FILE_UPLOAD,
            extensions: env.VITE_ALLOWED_FILE_TYPES.split(',')
          },
          audio: {
            enabled: env.VITE_ENABLE_AUDIO_UPLOAD,
            maxDuration: env.VITE_MAX_AUDIO_DURATION,
            formats: env.VITE_ALLOWED_AUDIO_TYPES.split(',')
          }
        }
      }
    }
  },
  theme: {
    colors: {
      primary: env.VITE_PRIMARY_COLOR,
      secondary: env.VITE_SECONDARY_COLOR,
      accent: env.VITE_ACCENT_COLOR
    }
  },
  dev: {
    enabled: env.VITE_DEV_MODE
  }
} as const;