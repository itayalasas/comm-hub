# AuthSystem Public Forms

Este es un proyecto standalone de formularios públicos para AuthSystem.

## Deployment

Este proyecto está configurado para deployarse automáticamente en Netlify.

## Variables de Entorno

Las siguientes variables están pre-configuradas en el archivo .env:

- VITE_SUPABASE_URL: URL de tu proyecto Supabase
- VITE_SUPABASE_ANON_KEY: Anon key de Supabase
- VITE_APP_ID: ID de la aplicación
- VITE_API_KEY: API key de la aplicación

## Rutas

- `/login` - Formulario de inicio de sesión
- `/register` - Formulario de registro
- `/reset-password` - Formulario de recuperación de contraseña

Todas las rutas requieren los parámetros `app_id` y `api_key` en la URL.
