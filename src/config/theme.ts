export const theme = {
  colors: {
    // Colors from UDC website
    primary: '#004A87',    // Dark blue from header
    secondary: '#F39200',  // Orange from accents
    accent: '#E30613',     // Red from logo
    background: '#FFFFFF',
    text: '#333333',
    gray: {
      light: '#F5F5F5',
      medium: '#E0E0E0',
      dark: '#666666'
    }
  },
  fonts: {
    primary: '"Roboto", sans-serif',
    secondary: '"Open Sans", sans-serif'
  }
};

export const config = {
  maxChatHistory: Number(import.meta.env.VITE_MAX_CHAT_HISTORY) || 10,
  devMode: import.meta.env.VITE_DEV_MODE === 'true',
  apiUrl: import.meta.env.VITE_API_URL,
  chatApiUrl: import.meta.env.VITE_CHAT_API_URL
};