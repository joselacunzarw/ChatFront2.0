#!/bin/sh

# Reemplazar variables de entorno en el HTML y JS
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i 's|VITE_API_BASE_URL_PLACEHOLDER|'${VITE_API_BASE_URL}'|g' {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i 's|VITE_GOOGLE_CLIENT_ID_PLACEHOLDER|'${VITE_GOOGLE_CLIENT_ID}'|g' {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i 's|VITE_APP_NAME_PLACEHOLDER|'${VITE_APP_NAME}'|g' {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i 's|VITE_ORGANIZATION_NAME_PLACEHOLDER|'${VITE_ORGANIZATION_NAME}'|g' {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i 's|VITE_LOGO_BG_COLOR_PLACEHOLDER|'${VITE_LOGO_BG_COLOR}'|g' {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i 's|VITE_LOGO_TEXT_COLOR_PLACEHOLDER|'${VITE_LOGO_TEXT_COLOR}'|g' {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i 's|VITE_FEATURE_AUDIO_INPUT_PLACEHOLDER|'${VITE_FEATURE_AUDIO_INPUT}'|g' {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i 's|VITE_FEATURE_FILE_UPLOAD_PLACEHOLDER|'${VITE_FEATURE_FILE_UPLOAD}'|g' {} \;

# Ejecutar nginx
exec "$@"