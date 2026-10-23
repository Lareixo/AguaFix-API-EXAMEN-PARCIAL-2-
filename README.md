# AguaFix API 💧

API REST para el reporte y seguimiento de fugas de agua potable, desarrollada con [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/), [PostgreSQL](https://www.postgresql.org/), [AWS S3](https://aws.amazon.com/s3/) y [Docker](https://www.docker.com/).

---

## 🚀 Requisitos y Características

- **Reporte con foto**: Los ciudadanos pueden adjuntar una fotografía de la fuga (`photo`) al crear un reporte mediante `POST /reports` (`multipart/form-data`).
- **Almacenamiento en la nube (AWS S3)**: Módulo `StorageModule` con `StorageService` que sube las fotos a la carpeta `reports/` del bucket en S3 utilizando `@aws-sdk/client-s3` y retorna la URL pública del objeto.
- **Notificaciones por correo**: Al crearse un reporte, se envía una notificación a la cuadrilla de atención con la información del reporte y la imagen visible mediante una etiqueta `<img>` en la plantilla HTML.
- **Migraciones TypeORM (`synchronize: false`)**: Control de esquema con migraciones para agregar las columnas `photoUrl` y `repairPhotoUrl` a la tabla `WATER_REPORT`.
- **Docker y Compose**: `Dockerfile` optimizado en dos fases basado en `node:22-alpine` y `compose.yaml` para orquestar la API con PostgreSQL usando la imagen publicada en Docker Hub.
- **CI/CD Automatizado**: Flujo en GitHub Actions (`.github/workflows/deploy.yml`) que compila la imagen de Docker y la publica en Docker Hub automáticamente en cada push a la rama `main`.

---

## 🛠️ Variables de Entorno

Copia el archivo `.env.template` a `.env` y completa tus credenciales:

```bash
cp .env.template .env
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto en el que escucha la API | `3000` |
| `DB_HOST` | Host de PostgreSQL | `localhost` (o `postgres` en Docker) |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `secret` |
| `DB_NAME` | Nombre de la base de datos | `aguafix` |
| `MAILER_SERVICE` | Servicio de correo | `gmail` |
| `MAILER_USER` | Correo remitente | `cuadrilla@gmail.com` |
| `MAILER_PASSWORD` | Contraseña de aplicación de Gmail | `xxxx xxxx xxxx xxxx` |
| `MAILER_TO` | Correo destino de cuadrilla | `cuadrilla@municipio.gob.mx` |
| `AWS_REGION` | Región del bucket S3 | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | Access Key ID de AWS | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Secret Access Key de AWS | `wJalrXUtn...` |
| `AWS_BUCKET_NAME` | Nombre del Bucket en S3 | `mi-bucket-aguafix` |
| `DOCKER_USER` | Usuario de Docker Hub | `mi_usuario_docker` |

> ⚠️ **IMPORTANTE**: Nunca subas el archivo `.env` a Git ni lo copies dentro de la imagen de Docker.

---

## 📦 Instalación y Ejecución Local

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar la base de datos local (PostgreSQL)
docker compose up postgres -d

# 3. Ejecutar migraciones
npm run migration:run

# 4. Iniciar en modo desarrollo
npm run start:dev
```

---

## 🐳 Despliegue con Docker y Docker Compose

El archivo `compose.yaml` levanta la API utilizando la imagen publicada en Docker Hub junto a la base de datos PostgreSQL:

```bash
# Levantar servicios
docker compose up -d

# Ver logs
docker compose logs -f api
```

---

## 📡 Endpoints de la API

### 1. `POST /reports`
Crea un nuevo reporte de fuga de agua con fotografía adjunta.

- **Content-Type**: `multipart/form-data`
- **Body**:
  - `address` *(string, obligatorio)*: Dirección donde se ubica la fuga.
  - `description` *(string, obligatorio)*: Descripción detallada de la fuga.
  - `severity` *(string, obligatorio)*: Severidad (`low`, `medium`, `high`).
  - `reporterPhone` *(string, obligatorio)*: Teléfono del ciudadano.
  - `photo` *(file, obligatorio)*: Archivo de imagen de la fuga.

**Respuesta exitosa (`201 Created`):**
```json
{
  "id": 1,
  "address": "Av. Independencia #402, Centro",
  "description": "Fuga de agua potable saliendo de la banqueta",
  "severity": "high",
  "reporterPhone": "4491234567",
  "isResolved": false,
  "photoUrl": "https://mi-bucket-aguafix.s3.us-east-1.amazonaws.com/reports/1729683921-fuga.jpg",
  "repairPhotoUrl": null,
  "createdAt": "2026-10-23T11:00:00.000Z"
}
```

> Si no se envía el archivo en el campo `photo`, la API responde con `400 Bad Request`.

---

### 2. `GET /reports`
Obtiene la lista de todos los reportes registrados, ordenados por fecha descendente.

**Respuesta exitosa (`200 OK`):**
```json
[
  {
    "id": 1,
    "address": "Av. Independencia #402, Centro",
    "description": "Fuga de agua potable saliendo de la banqueta",
    "severity": "high",
    "reporterPhone": "4491234567",
    "isResolved": false,
    "photoUrl": "https://mi-bucket-aguafix.s3.us-east-1.amazonaws.com/reports/1729683921-fuga.jpg",
    "repairPhotoUrl": null,
    "createdAt": "2026-10-23T11:00:00.000Z"
  }
]
```

---

## 🧪 Pruebas Unitarias

```bash
npm run test
```

---

## ⚙️ Configuración de GitHub Actions & Docker Hub

1. En tu repositorio de GitHub, dirígete a **Settings > Secrets and variables > Actions**.
2. Agrega los siguientes secretos:
   - `DOCKER_USER`: Tu usuario de Docker Hub.
   - `DOCKER_PASSWORD`: Tu contraseña o Personal Access Token (PAT) de Docker Hub.
3. Al realizar `git push origin main`, el workflow `.github/workflows/deploy.yml` compilará la imagen y la publicará en Docker Hub con la etiqueta `latest`.
