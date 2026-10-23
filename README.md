# AguaFix API

API para el reporte ciudadano de fugas de agua con soporte para fotos en S3, envío de correos a cuadrillas y despliegue en Docker.

## Variables de entorno

Copia `.env.template` a `.env` y llena los valores:

```bash
cp .env.template .env
```

Variables necesarias:
- `PORT`: Puerto de la app (3000 por defecto)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Conexión a PostgreSQL
- `MAILER_SERVICE`, `MAILER_USER`, `MAILER_PASSWORD`, `MAILER_TO`: Configuración de correo
- `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET_NAME`: Credenciales de S3
- `DOCKER_USER`: Tu usuario de Docker Hub

## Levantar con Docker Compose

Para correr la base de datos y la API con la imagen de Docker Hub:

```bash
docker compose up -d
```

Para ver los logs:

```bash
docker compose logs -f api
```

## Endpoints

### POST /reports
Crea un reporte de fuga. Requiere `multipart/form-data`.

Campos requeridos:
- `address`: Dirección de la fuga
- `description`: Descripción del problema
- `severity`: Severidad (`low`, `medium`, `high`)
- `reporterPhone`: Teléfono de contacto
- `photo`: Archivo de imagen de la fuga (obligatorio)

Sube la foto a `reports/` en el bucket de S3, guarda el registro con `photoUrl` y manda correo a la cuadrilla con la foto adjunta.

### GET /reports
Regresa la lista de reportes registrados con `photoUrl` y `repairPhotoUrl`.
  
  
  
  
  
