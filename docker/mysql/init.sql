-- Datos semilla opcionales. JPA (ddl-auto=update) crea las tablas al iniciar
-- el backend, por lo que aqui solo nos aseguramos de la base de datos.
-- Si deseas precargar datos, descomenta los INSERT luego del primer arranque.

CREATE DATABASE IF NOT EXISTS veterinaria
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Ejemplo de carga inicial (ejecutar manualmente tras crear el esquema):
-- USE veterinaria;
-- INSERT INTO dueno (nombre, contacto, direccion, tipo_documento, documento)
--   VALUES ('Ana Perez', '3001234567', 'Calle 1 #2-3', 'CC', '10203040');
-- INSERT INTO turno (disponibilidad, turno, consecutivo, tiempo_de_espera)
--   VALUES (1, 'Manana', 1, 15);
