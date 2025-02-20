# UDC Asistente Virtual

Un asistente virtual moderno y accesible para la Universidad del Chubut, construido con React, TypeScript y Tailwind CSS.

![UDC Asistente](https://udc.edu.ar/wp-content/uploads/2022/03/logo-udc.png)

## 🚀 Características

- 💬 Chat interactivo con IA
- 🔒 Autenticación segura (Email y Google)
- 📱 Diseño responsivo
- 📎 Soporte para archivos adjuntos
- 🎙️ Entrada de audio
- 👍 Sistema de reacciones
- 🌐 Integración con API REST
- 🔄 WebSocket para comunicación en tiempo real
- 🛡️ Seguridad y validación robusta
- 🎨 Tema personalizable

## 📋 Requisitos Previos

- Node.js 20.x o superior
- Docker y Docker Compose (para despliegue en producción)
- Git (opcional, para clonar el repositorio)

## 🛠️ Instalación y Uso

### Desarrollo Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/joselacunzarw/ChatFront2.0.git
   cd ChatFront2.0
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Copia el archivo de ejemplo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Configura las variables de entorno en el archivo `.env`:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_CHAT_API_URL=http://localhost:8000
   VITE_GOOGLE_CLIENT_ID=tu-google-client-id
   # ... otras variables
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Producción con Docker

1. Configura las variables de entorno en un archivo `.env`:
   ```env
   WEB_PORT=80
   VITE_API_URL=http://api:8000
   VITE_CHAT_API_URL=http://api:8000
   # ... otras variables
   ```

2. Crea la red de Docker si no existe:
   ```bash
   docker network create app-network
   ```

3. Construye y levanta los contenedores:
   ```bash
   docker compose up --build -d
   ```

4. Verifica los logs:
   ```bash
   docker compose logs -f
   ```

## ⚙️ Configuración

### Variables de Entorno Requeridas

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base de la API | `http://localhost:8000` |
| `VITE_CHAT_API_URL` | URL del servicio de chat | `http://localhost:8000` |
| `VITE_GOOGLE_CLIENT_ID` | ID de cliente de Google OAuth | - |
| `VITE_APP_NAME` | Nombre de la aplicación | `UDC asistente` |
| `VITE_ORGANIZATION_NAME` | Nombre de la organización | `Universidad del Chubut` |
| `VITE_MAX_CHAT_HISTORY` | Límite de mensajes en el historial | `10` |

### Características Configurables

| Variable | Descripción | Tipo |
|----------|-------------|------|
| `VITE_ENABLE_REACTIONS` | Habilitar reacciones | Boolean |
| `VITE_ENABLE_FILE_UPLOAD` | Habilitar carga de archivos | Boolean |
| `VITE_ENABLE_AUDIO_UPLOAD` | Habilitar entrada de audio | Boolean |
| `VITE_MAX_FILE_SIZE` | Tamaño máximo de archivos (bytes) | Number |

## 🔍 Validaciones

La aplicación implementa múltiples capas de validación:

### Validación de Configuración
- Verifica todas las variables de entorno requeridas
- Valida tipos y formatos de variables
- Proporciona valores por defecto seguros

### Validación de Autenticación
- Verifica tokens JWT
- Valida permisos de usuario
- Controla acceso a características

### Validación de Entrada
- Limita tamaño de archivos
- Verifica tipos MIME permitidos
- Valida formato de mensajes

## ❗ Solución de Problemas

### Error de Variables de Entorno
```
ZodError: [{"code":"invalid_type","expected":"string","received":"undefined","path":["VITE_API_URL"]...}]
```
**Solución**: Verifica que todas las variables de entorno requeridas estén definidas en el archivo `.env`.

### Error de Conexión API
```
NetworkError: Failed to fetch
```
**Solución**: 
1. Verifica que la API esté en ejecución
2. Confirma las URLs en las variables `VITE_API_URL` y `VITE_CHAT_API_URL`
3. Asegúrate que la red de Docker esté creada y configurada correctamente

### Error de CORS
```
Access to fetch at 'http://api:8000' from origin 'http://localhost' has been blocked by CORS policy
```
**Solución**: Verifica la configuración de CORS en el servidor API y asegúrate que los orígenes permitidos estén correctamente configurados.

### Problemas de Autenticación Google
```
Error: Invalid Client ID
```
**Solución**: 
1. Verifica que `VITE_GOOGLE_CLIENT_ID` sea válido
2. Confirma que el dominio esté autorizado en la consola de Google Cloud
3. Asegúrate que los orígenes permitidos estén configurados en Google OAuth

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Vista previa de la build de producción
- `npm run lint`: Ejecuta el linter
- `npm run test`: Ejecuta los tests (cuando estén configurados)

## 🔐 Seguridad

La aplicación implementa varias medidas de seguridad:

- Headers de seguridad HTTP
- Sanitización de entrada
- Rate limiting
- Validación de tokens
- Políticas de CORS
- Content Security Policy (CSP)

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Jose Lacunza Kobs** - *Desarrollo Inicial* - [jlacunza](https://github.com/jlacunza)

## 🙏 Agradecimientos

- Universidad del Chubut por el apoyo y recursos
- Comunidad de código abierto por las herramientas utilizadas
