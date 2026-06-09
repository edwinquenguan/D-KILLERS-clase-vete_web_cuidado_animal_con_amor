# Historial de la sesión — Proyecto Vet01

> Exportación de la conversación de desarrollo del sistema de gestión para veterinaria
> **Vet01** (Claude Code). Reconstruido a partir de los mensajes de la sesión.
> Fecha: 2026-06.

---

## Índice

1. [Petición inicial: generar el proyecto full-stack](#1-petición-inicial)
2. [Cómo correr las pruebas de backend](#2-pruebas-de-backend)
3. [Agregar phpMyAdmin](#3-phpmyadmin)
4. [Iteración 2: turno automático, dueño inline y Tailwind](#4-iteración-2)
5. [Code review detallada](#5-code-review)
6. [Iteración 3: servicios, turno por especialidad y sala de espera](#6-iteración-3)
7. [Iteración 4: portal de clientes (auth, agendamiento, avisos)](#7-iteración-4)
8. [Diagrama de arquitectura Spring Boot](#8-diagrama-de-arquitectura)

---

## 1. Petición inicial

**Usuario:** Generar un proyecto con backend en Java, frontend en React con TS, base de
datos MySQL. Distribución de carpetas: `src/Backend`, `src/FrontEnd`, `test/backend`,
`test/frontend`. README con explicación de uso y ejecución. Docker para desplegar los
artefactos y la base de datos. Software para una veterinaria con la estructura:
- **Mascotas**(nombre, raza, años, motivo_consulta, fechahora_ingreso, fechahora_salida)
- **Dueño**(Nombre, Contacto, Direccion, tipoDocumento, Documento)
- **Turno**(Disponibilidad, turno, consecutivo, tiempo_de_espera)

**Decisiones acordadas (preguntas):**
- Backend: **Spring Boot + Maven** (Java 21).
- Alcance: **CRUD completo** de las 3 entidades con API REST + UI funcional.
- Modelo: **agregar IDs y relaciones** (Dueño 1→N Mascotas; Mascota N→1 Turno; Documento único).
- Pruebas frontend: **Serenity BDD + patrón Screenplay** (WebDriver).
- Crear archivo **Postman** en la raíz para validar el backend.

**Resultado:**
- Backend Spring Boot 3 (entidades JPA, repositorios, servicios, controladores REST
  `/api/duenos|mascotas|turnos`, CORS, manejo global de errores, Dockerfile multi-stage).
- Frontend React + TS (Vite), CRUD de las 3 entidades, cliente API tipado, nginx + proxy.
- MySQL 8, `docker-compose.yml` (db + backend + frontend), `.env.example`, `.gitignore`.
- Pruebas backend (JUnit + H2) y E2E Serenity/Screenplay (proyecto Maven en `test/frontend`).
- `Vet01.postman_collection.json` en la raíz. README completo.
- **Verificación:** frontend compila, imagen backend `BUILD SUCCESS`, `docker compose up`
  levanta los 3 contenedores; flujo Dueño→Turno→Mascota probado con relaciones anidadas.

---

## 2. Pruebas de backend

**Usuario:** ¿Cuántas pruebas de backend tengo y cómo las corro?

**Respuesta:** 2 pruebas iniciales en `test/backend/com/vet`:
- `DuenoRepositoryTest` (`@DataJpaTest`).
- `MascotaServiceTest` (`@SpringBootTest`).

Ambas con **H2 en memoria** (no requieren MySQL). Ejecución:
```bash
cd src/Backend && mvn test
```
Como la máquina no tiene Java/Maven, alternativa vía contenedor:
```bash
docker run --rm -v "$PWD":/proj -w /proj/src/Backend maven:3.9-eclipse-temurin-21 mvn test
```

---

## 3. phpMyAdmin

**Usuario:** Agregar phpMyAdmin a Docker para visualizar la DB desde el navegador.

**Resultado:** servicio `phpmyadmin` (imagen `phpmyadmin:5`) en `docker-compose.yml`,
conectado a `db`, expuesto en el puerto **8081**. README actualizado.
**Verificado:** responde HTTP 200. Login `vetuser`/`vetpass` o `root`/`rootpass`.

---

## 4. Iteración 2

**Usuario:**
- El turno se debe asignar automáticamente según los turnos ocupados.
- Al registrar una mascota, pedir automáticamente a qué dueño pertenece o registrar dueño.
- Implementar Tailwind y que la app sea responsive.
- (Sobre selección) las pruebas deben ser con webdriver Serenity y Screenplay (ya estaban).
- Crear archivo para validar el backend con Postman en la raíz (ya estaba).

**Decisiones acordadas:**
- Turno: se **genera uno nuevo en cola** por mascota (ya no se elige).
- `consecutivo` = siguiente número; `tiempo_de_espera` = suma de la atención de los
  turnos pendientes por delante (el primero queda en 0).
- Dueño: selector + **"Nuevo dueño" inline**.

**Resultado:**
- `TurnoService.generarSiguiente()`, cierre de turno al registrar salida.
- `MascotaService` auto-asigna turno; **dueño obligatorio** (400 si falta).
- Tailwind CSS (config + directivas), navbar responsive con menú hamburguesa,
  formularios `grid-cols-1 md:grid-cols-2`, tablas con scroll horizontal.
- Componente `NuevoDuenoInline.tsx`.
- **Verificación:** 4/4 pruebas backend; frontend compila; E2E Docker con volumen limpio
  (turno #1 espera 0 min, #2 espera 15 min); POST sin dueño → 400.

---

## 5. Code review

**Usuario:** Code review detallada de todo el repo.

**Hallazgos principales (resumen):**

**Alta prioridad**
1. Falta `@Transactional` en servicios → operaciones no atómicas (turno huérfano).
2. Borrado de Dueño/Turno referenciado → 500 (debería ser 409).
3. Documento duplicado → 500; `existsByDocumento` definido pero sin usar.
4. Handler genérico expone detalles internos.

**Media prioridad**
5. Semántica de `Turno.disponibilidad` confusa.
6. `import` en medio de `client.ts`.
7. Errores de `delete` sin feedback en el frontend.
8. Posible doble envío de formularios.
9. Sin paginación.
10. Cobertura desbalanceada (sin tests de capa web; E2E solo dueños).

**Baja prioridad:** cálculo de espera global, CORS `*`, `ddl-auto=update` en prod,
`.env` en el directorio, validación mixta, healthcheck del backend, accesibilidad.

Varias de estas se aplicaron en iteraciones posteriores (`@Transactional`, import movido,
try/catch en borrado, aria-expanded).

---

## 6. Iteración 3

**Usuario:**
- "Tipo de consulta" como desplegable con servicios: baño, corte de uñas, consulta médica,
  urgencia médica, profilaxis, vacunación, desparasitación, cirugías, hospitalización,
  exámenes de laboratorio, toma de rayos X y ecografías, servicios preventivos.
- Mostrar información en fila de espera con número de turno.
- El número de turno según la especialidad, dando prioridad a urgencias.
- Interfaz de usuario más atractiva que la del admin.

**Decisiones acordadas:**
- Numeración: **prefijo por servicio + contador propio** (`URG-1`, `VAC-1`…).
- Prioridad: **urgencias siempre primero**.
- Servicio urgente: **solo "Urgencia médica"**.
- UI nueva: **pantalla pública de sala de espera** (`/sala`).

**Resultado:**
- Enum `Servicio` (12 servicios con label/prefijo/prioritario), endpoint `/api/servicios`.
- `Turno` con `servicio`, `codigo` (ej. `URG-1`) y `prioritario`; consecutivo por servicio.
- Fila de espera `/api/fila` (urgencias primero, luego llegada, con tiempo estimado).
- `MascotasPage`: select de servicios; `SalaEsperaPage` (`/sala`) con diseño destacado y
  auto-refresco cada 5 s; urgencias resaltadas.
- Mejoras del review: `@Transactional`, import al inicio, try/catch en borrado, aria-expanded.
- **Verificación:** 6/6 pruebas backend; E2E Docker mostró `VAC-1`, `VAC-2`, `URG-1` con la
  urgencia en posición 1 de la fila; screenshot de `/sala`.

---

## 7. Iteración 4

**Usuario:** Agregar página web donde el usuario deba registrarse, logearse, programar los
servicios que requiera, y ser avisado cuando el servicio termine.

**Decisiones acordadas:**
- Autenticación: **Spring Security + JWT** (BCrypt).
- Cuenta **vinculada a un Dueño**; el cliente gestiona solo sus mascotas y citas.
- Aviso **in-app** (campana + polling), sin SMTP.
- Agendamiento con entidad **Cita** y estados `SOLICITADA → EN_PROCESO → TERMINADA` (+ `CANCELADA`).

**Resultado:**
- Seguridad: `SecurityConfig`, `JwtService`, `JwtAuthFilter`, `CustomUserDetailsService`;
  entidad `Usuario` (rol CLIENTE/ADMIN ↔ Dueño); `AuthController` (`/register`, `/login`);
  `DataSeeder` (admin inicial `admin@vet.com`/`admin123`).
- Citas: `Cita`/`EstadoCita`, `CitaService`, `PortalController` (CLIENTE) y
  `CitaAdminController` (ADMIN).
- Frontend: `AuthContext`, `RutaProtegida`, `LoginPage`, `RegistroPage`, portal
  (`PortalLayout` con campana 🔔, `PortalMascotasPage`, `AgendarPage`) y `CitasAdminPage`.
- **Verificación:** 9/9 pruebas backend (incl. `AuthCitaTest`); E2E Docker del flujo completo
  registro→agendar→admin TERMINA→**notificación aparece**→marcar leída; cliente en endpoint
  admin → 403; screenshots de `/registro` y portal.
- **Bug encontrado y corregido:** la sesión se hidrataba en `useEffect` y `RutaProtegida`
  redirigía a login antes de tiempo → inicialización síncrona del estado en `AuthContext`.
- Follow-ups señalados: la prueba Serenity `GestionDuenosTest` quedó desactualizada (ahora
  `/duenos` exige login ADMIN); peticiones sin token devuelven 403 en vez de 401.

---

## 8. Diagrama de arquitectura

**Usuario:** Diagrama de arquitectura de Spring Boot con explicación detallada de cada segmento.

Se entregó un diagrama en capas y el flujo de una petición, con la explicación de:

```
NAVEGADOR (React / Postman)
        │ HTTP + JSON, Authorization: Bearer <JWT>
        ▼
SPRING BOOT (VetApplication)
  ├─ Cadena de filtros de Security: CorsFilter → JwtAuthFilter → Authorization (roles)
  ├─ Capa Web (@RestController): Auth/Servicio/Fila/Dueno/Mascota/Turno/Portal/CitaAdmin
  │     ▼ recibe DTOs, valida @Valid, devuelve JSON
  ├─ Capa de Servicio (@Service): Usuario/Cita/Mascota/Turno/Dueno  (reglas, @Transactional)
  │     ▼
  ├─ Capa de Persistencia (@Repository): Spring Data JPA  (query methods derivados)
  │     ▼
  └─ Modelo/Entidades (@Entity): Usuario/Dueno/Mascota/Turno/Cita (+enums)
  Transversal: GlobalExceptionHandler · SecurityConfig · DataSeeder · application.yml
        │ JDBC (Hibernate ORM)
        ▼
     MySQL 8
```

**Segmentos explicados:**
1. **VetApplication** — arranque del contenedor IoC, Tomcat embebido, autoconfiguración.
2. **Cadena de filtros (Security)** — CORS, `JwtAuthFilter` (valida token → SecurityContext),
   reglas por rol, sesión stateless, `JwtService` (firma/valida).
3. **Capa Web (@RestController)** — frontera HTTP, mapea rutas, valida DTOs, sin lógica.
4. **DTOs** — objetos del JSON desacoplados de las entidades (validación de entrada).
5. **Capa de Servicio (@Service)** — lógica de negocio y transacciones.
6. **Repositorios (@Repository)** — Spring Data JPA genera la implementación; query methods.
7. **Entidades (@Entity)** — mapeo objeto-relacional con Hibernate; relaciones y enums.
8. **Transversales** — `GlobalExceptionHandler`, `DataSeeder`, `application.yml`.
9. **MySQL** — fuera de la JVM, vía JDBC/ORM.

**Por qué en capas:** responsabilidad única por capa
(`Controller → Service → Repository → Entity`); testeable, mantenible y segura.

---

## Stack final

| Capa        | Tecnología                                  |
|-------------|---------------------------------------------|
| Backend     | Java 21 + Spring Boot 3 + Spring Data JPA   |
| Seguridad   | Spring Security + JWT (BCrypt)              |
| Frontend    | React + TypeScript (Vite) + Tailwind CSS    |
| Base datos  | MySQL 8                                      |
| Despliegue  | Docker + Docker Compose (+ phpMyAdmin)      |
| Pruebas BE  | JUnit 5 (H2 en memoria) — 9 pruebas        |
| Pruebas E2E | Serenity BDD + patrón Screenplay (Selenium) |
| API manual  | Colección Postman                           |

### URLs (con `docker compose up --build`)
- Admin: http://localhost · Sala de espera: http://localhost/sala
- Login/Registro: http://localhost/login · http://localhost/registro · Portal: http://localhost/portal
- Backend API: http://localhost:8080/api · phpMyAdmin: http://localhost:8081

### Credenciales admin por defecto
`admin@vet.com` / `admin123`
