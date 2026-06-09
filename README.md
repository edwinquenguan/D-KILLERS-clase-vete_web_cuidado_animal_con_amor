# 🐾 Cuidado Animal con Amor

Aplicación full-stack para administrar **Mascotas**, **Dueños** y **Turnos** de la clínica veterinaria **Cuidado Animal con Amor**.

| Capa        | Tecnología                                  |
|-------------|---------------------------------------------|
| Backend     | Java 21 + Spring Boot 3 + Spring Data JPA   |
| Seguridad   | Spring Security + JWT (BCrypt)              |
| Frontend    | React + TypeScript (Vite) + Tailwind CSS    |
| Base datos  | MySQL 8                                      |
| Despliegue  | Docker + Docker Compose                      |
| Pruebas BE  | JUnit 5 (H2 en memoria)                      |
| Pruebas E2E | Serenity BDD + patrón Screenplay (Selenium) |
| API manual  | Colección Postman                           |

---

## 📁 Estructura del proyecto

```
Vet01/
├── docker-compose.yml            # Orquesta db + backend + frontend
├── .env.example                  # Variables de entorno de ejemplo
├── Vet01.postman_collection.json # Validación manual del backend (Postman/Newman)
├── docker/mysql/init.sql         # Inicialización opcional de la BD
├── src/
│   ├── Backend/                  # API Spring Boot (Maven)
│   └── FrontEnd/                 # SPA React + TS (Vite)
└── test/
    ├── backend/                  # Pruebas JUnit del backend
    └── frontend/                 # Pruebas E2E Serenity/Screenplay (proyecto Maven)
```

> Nota: por la convención de Maven/Vite, los archivos de test viven en `test/backend`
> y `test/frontend` y se enlazan mediante configuración (`testSourceDirectory` en el
> `pom.xml` del backend; proyecto Maven propio en `test/frontend` para Serenity).

---

## 🗃️ Modelo de datos

- **Dueño** (`dueno`): `id`, `nombre`, `contacto`, `direccion`, `tipoDocumento`, `documento` (único).
- **Turno** (`turno`): `id`, `disponibilidad`, `turno`, `consecutivo`, `tiempoDeEspera`,
  `servicio`, `codigo` (ej. `URG-1`), `prioritario`.
- **Mascota** (`mascota`): `id`, `nombre`, `raza`, `anios`, `servicio` (columna `motivo_consulta`),
  `fechahoraIngreso`, `fechahoraSalida`, **`duenoId`** (FK → Dueño), **`turnoId`** (FK → Turno).

Relaciones: un **Dueño** puede tener varias **Mascotas**; cada **Mascota/consulta** puede
referenciar un **Turno**. El esquema lo crea JPA automáticamente al arrancar (`ddl-auto=update`).

### Catálogo de servicios (tipo de consulta)

El "tipo de consulta" es un servicio de un catálogo fijo (endpoint `GET /api/servicios`):
Baño, Corte de uñas, Consulta médica, **Urgencia médica** (prioritaria), Profilaxis,
Vacunación, Desparasitación, Cirugías, Hospitalización, Exámenes de laboratorio,
Toma de rayos X y ecografías, Servicios preventivos.

### Reglas de negocio

- **Dueño obligatorio** y **servicio obligatorio**: una mascota no se registra sin ambos.
  En la UI el dueño puede crearse *inline* sin salir de la página.
- **Turno automático por especialidad**: al registrar una mascota se **genera su turno**:
  - `codigo` = prefijo del servicio + consecutivo **propio de ese servicio** (ej. `VAC-1`, `URG-1`).
  - `tiempoDeEspera` = nº de turnos pendientes por delante × 15 min (respetando prioridad).
  - `disponibilidad=true` (en cola). Al registrar la **fecha/hora de salida**, el turno se
    marca como atendido y sale de la cola.
- **Prioridad de urgencias**: los turnos de **Urgencia médica** (`prioritario=true`) se
  ubican al frente de la fila de espera, antes que cualquier turno normal.

### Fila de espera / pantalla pública

- `GET /api/fila` devuelve la cola ordenada (urgencias primero, luego por llegada) con
  posición, código de turno, servicio, mascota, dueño y tiempo estimado.
- **Pantalla pública** `/sala`: vista de sala de espera (diseño destacado, auto-refresco
  cada 5 s) que muestra el turno en atención y la cola, con las urgencias resaltadas.

### Autenticación, roles y portal de clientes

La app tiene **dos perfiles** autenticados con JWT (contraseñas con BCrypt):

- **CLIENTE**: se registra en `/registro`, inicia sesión en `/login` y entra a su
  **portal** (`/portal`) donde gestiona **sus** mascotas, **agenda servicios** (citas) y
  recibe **avisos** cuando un servicio termina (campana 🔔 con polling cada 10 s).
- **ADMIN**: inicia sesión en `/login` y entra al panel administrativo (CRUD de mascotas,
  dueños, turnos y gestión de **citas**). Usuario admin por defecto (configurable con
  `ADMIN_EMAIL`/`ADMIN_PASSWORD`):

  ```
  email:    admin@vet.com
  password: admin123
  ```

**Flujo de citas**: el cliente agenda → estado `SOLICITADA`; el admin avanza a
`EN_PROCESO` y `TERMINADA`. Al marcar `TERMINADA`, el cliente recibe el aviso en su campana.
El cliente puede **cancelar** sus citas (`CANCELADA`).

El token JWT se envía en `Authorization: Bearer <token>`; el frontend lo guarda en
`localStorage`. Configurable con `JWT_SECRET` y `JWT_EXP_MIN`.

---

## 🚀 Ejecución con Docker (recomendado)

Requisitos: **Docker** y **Docker Compose**.

```bash
# 1. (Opcional) crea tu archivo de entorno
cp .env.example .env

# 2. Construye y levanta todo
docker compose up --build
```

Servicios disponibles:

| Servicio  | URL                              |
|-----------|----------------------------------|
| Frontend (admin) | http://localhost            |
| Sala de espera   | http://localhost/sala       |
| Backend    | http://localhost:8080/api        |
| phpMyAdmin | http://localhost:8081            |
| MySQL      | localhost:3306                   |

> **phpMyAdmin**: ingresa con el usuario y contraseña de la BD (`vetuser` / `vetpass`
> por defecto, o `root` / `rootpass`). El servidor ya viene preconfigurado (`PMA_HOST=db`).

Para detener: `docker compose down` (agrega `-v` para borrar también los datos).

---

## 🧑‍💻 Ejecución en modo desarrollo (sin Docker)

Requisitos: **JDK 21**, **Node 20+**, **Maven** y un **MySQL** local (o solo la BD vía Docker:
`docker compose up db`).

### Backend
```bash
cd src/Backend
# Variables (opcional, valores por defecto entre paréntesis):
#   DB_HOST(localhost) DB_PORT(3306) DB_NAME(veterinaria) DB_USER(vetuser) DB_PASSWORD(vetpass)
mvn spring-boot:run
```
API en http://localhost:8080/api

### Frontend
```bash
cd src/FrontEnd
npm install
npm run dev
```
App en http://localhost:5173 (las llamadas a `/api` se redirigen al backend en `:8080`).

---

## 🔌 Endpoints REST

Para cada recurso (`duenos`, `turnos`, `mascotas`):

| Método | Ruta                      | Descripción            |
|--------|---------------------------|------------------------|
| GET    | `/api/{recurso}`          | Listar todos           |
| GET    | `/api/{recurso}/{id}`     | Obtener por id         |
| POST   | `/api/{recurso}`          | Crear (201)            |
| PUT    | `/api/{recurso}/{id}`     | Actualizar             |
| DELETE | `/api/{recurso}/{id}`     | Eliminar (204)         |

Endpoints adicionales:

| Método | Ruta             | Descripción                                   |
|--------|------------------|-----------------------------------------------|
| GET    | `/api/servicios` | Catálogo de servicios (tipo de consulta)      |
| GET    | `/api/fila`      | Fila de espera ordenada (urgencias primero)   |

Autenticación y portal (rol entre paréntesis):

| Método | Ruta                                      | Descripción                          |
|--------|-------------------------------------------|--------------------------------------|
| POST   | `/api/auth/register`                      | Registro de cliente (público)        |
| POST   | `/api/auth/login`                         | Login, devuelve JWT (público)        |
| GET/POST | `/api/portal/mascotas`                  | Mascotas del cliente (CLIENTE)       |
| GET/POST | `/api/portal/citas`                     | Citas del cliente (CLIENTE)          |
| PUT    | `/api/portal/citas/{id}/cancelar`         | Cancelar cita (CLIENTE)              |
| GET    | `/api/portal/notificaciones`              | Avisos pendientes (CLIENTE)          |
| POST   | `/api/portal/notificaciones/marcar-leidas`| Marcar avisos leídos (CLIENTE)       |
| GET    | `/api/citas`                              | Todas las citas (ADMIN)              |
| PUT    | `/api/citas/{id}/estado`                  | Cambiar estado de cita (ADMIN)       |

Al crear una **mascota** se envían `duenoId` y `servicio` (ambos obligatorios); el `turnoId`
**no** se envía: el backend asigna el turno automáticamente, numerado por servicio. En una
edición sí puede incluirse `turnoId` para conservar el turno ya asignado.

---

## ✅ Pruebas

### Backend (JUnit + H2)
```bash
cd src/Backend
mvn test
```

### E2E del frontend (Serenity BDD + Screenplay)
Requiere la aplicación corriendo (`docker compose up`) y **Google Chrome** instalado
(el driver se descarga automáticamente).

```bash
cd test/frontend
mvn clean verify
```
Reporte HTML generado en `test/frontend/target/site/serenity/index.html`.

### Validación del backend con Postman
- **Postman**: importa `Vet01.postman_collection.json` y ejecuta la colección
  (variable `baseUrl` = `http://localhost:8080`).
- **Newman** (CLI):
  ```bash
  npm install -g newman
  newman run Vet01.postman_collection.json
  ```

---

## 🧰 Comandos útiles

```bash
docker compose logs -f backend     # Ver logs del backend
docker compose up --build backend  # Reconstruir solo el backend
docker compose down -v             # Detener y borrar volúmenes (datos)
```
