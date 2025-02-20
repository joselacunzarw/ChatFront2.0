FROM node:20-slim as builder

WORKDIR /app

# Instalar dependencias globales
RUN npm install -g pnpm

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copiar la configuración de nginx
COPY docker/prod/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]