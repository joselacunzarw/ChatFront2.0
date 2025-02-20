import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/theme.css';

// Configurar variables CSS desde las variables de entorno
document.documentElement.style.setProperty('--vite-primary-color', import.meta.env.VITE_PRIMARY_COLOR);
document.documentElement.style.setProperty('--vite-secondary-color', import.meta.env.VITE_SECONDARY_COLOR);
document.documentElement.style.setProperty('--vite-accent-color', import.meta.env.VITE_ACCENT_COLOR);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);