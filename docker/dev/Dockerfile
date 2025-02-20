FROM node:20-slim

WORKDIR /app

# Instalar dependencias globales
RUN npm install -g pnpm

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install

# Copiar el resto del código
COPY . .

# Exponer puerto de desarrollo
EXPOSE 5173

# Comando para desarrollo
CMD ["pnpm", "dev", "--host"]