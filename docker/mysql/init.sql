-- ============================================================
-- Esquema y datos iniciales para: Cuidado Animal con Amor
-- Generado desde los scripts del API FastAPI
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;

DROP DATABASE IF EXISTS DB_CUIDADO_ANIMAL;

CREATE SCHEMA DB_CUIDADO_ANIMAL DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE DB_CUIDADO_ANIMAL;

-- -----------------------------------------------------
-- Table ROLES
-- -----------------------------------------------------
CREATE TABLE ROLES (
  rol_id INT NOT NULL AUTO_INCREMENT,
  rol_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (rol_id),
  UNIQUE INDEX rol_id_UNIQUE (rol_id ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table CITIES
-- -----------------------------------------------------
CREATE TABLE CITIES (
  city_id INT NOT NULL AUTO_INCREMENT,
  city_name TEXT NOT NULL,
  PRIMARY KEY (city_id),
  UNIQUE INDEX city_id_UNIQUE (city_id ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table USERS
-- -----------------------------------------------------
CREATE TABLE USERS (
  rol_id INT NOT NULL,
  user_id INT NOT NULL AUTO_INCREMENT,
  user_name VARCHAR(255) NOT NULL,
  user_first_surname VARCHAR(255) NOT NULL,
  user_second_surname VARCHAR(255) NOT NULL,
  user_phone VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_address VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_city INT NOT NULL,
  user_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_status INT NOT NULL DEFAULT 2,
  PRIMARY KEY (user_id),
  UNIQUE INDEX users_id_UNIQUE (user_id ASC),
  INDEX fk_rol_users_idx (rol_id ASC),
  CONSTRAINT fk_rol_user
    FOREIGN KEY (rol_id) REFERENCES ROLES (rol_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_city_user
    FOREIGN KEY (user_city) REFERENCES CITIES (city_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table OWNERS
-- -----------------------------------------------------
CREATE TABLE OWNERS (
  owner_id INT NOT NULL AUTO_INCREMENT,
  owner_name VARCHAR(255) NOT NULL,
  owner_first_surname VARCHAR(255) NOT NULL,
  owner_second_surname VARCHAR(255) NOT NULL,
  owner_phone VARCHAR(255) NOT NULL,
  owner_email VARCHAR(255) NOT NULL,
  owner_address VARCHAR(255) NOT NULL,
  owner_city INT NOT NULL,
  owner_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  owner_status INT NOT NULL DEFAULT 2,
  PRIMARY KEY (owner_id),
  UNIQUE INDEX owner_id_UNIQUE (owner_id ASC),
  CONSTRAINT fk_owner_city
    FOREIGN KEY (owner_city) REFERENCES CITIES (city_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table SPECIES
-- -----------------------------------------------------
CREATE TABLE SPECIES (
  species_id INT NOT NULL AUTO_INCREMENT,
  species_name VARCHAR(100) NOT NULL,
  species_status INT NOT NULL DEFAULT 2,
  PRIMARY KEY (species_id),
  UNIQUE INDEX species_id_UNIQUE (species_id ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table BREEDS
-- -----------------------------------------------------
CREATE TABLE BREEDS (
  breed_id INT NOT NULL AUTO_INCREMENT,
  species_id INT NOT NULL,
  breed_name VARCHAR(100) NOT NULL,
  breed_status INT NOT NULL DEFAULT 2,
  PRIMARY KEY (breed_id),
  UNIQUE INDEX breed_id_UNIQUE (breed_id ASC),
  INDEX fk_breed_species_idx (species_id ASC),
  CONSTRAINT fk_breed_species
    FOREIGN KEY (species_id) REFERENCES SPECIES (species_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table PETS
-- -----------------------------------------------------
CREATE TABLE PETS (
  pet_id INT NOT NULL AUTO_INCREMENT,
  owner_id INT NOT NULL,
  species_id INT NOT NULL,
  breed_id INT NOT NULL,
  pet_name VARCHAR(255) NOT NULL,
  pet_birthdate DATE NOT NULL,
  pet_sex ENUM('M', 'F') NOT NULL,
  pet_color VARCHAR(100) NOT NULL,
  pet_weight DECIMAL(5,2) NOT NULL,
  pet_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pet_status INT NOT NULL DEFAULT 2,
  PRIMARY KEY (pet_id),
  UNIQUE INDEX pet_id_UNIQUE (pet_id ASC),
  CONSTRAINT fk_pet_owner FOREIGN KEY (owner_id) REFERENCES OWNERS (owner_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pet_species FOREIGN KEY (species_id) REFERENCES SPECIES (species_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pet_breed FOREIGN KEY (breed_id) REFERENCES BREEDS (breed_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table APPOINTMENTS
-- -----------------------------------------------------
CREATE TABLE APPOINTMENTS (
  appointment_id INT NOT NULL AUTO_INCREMENT,
  pet_id INT NOT NULL,
  user_id INT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  appointment_reason VARCHAR(500) NOT NULL,
  appointment_date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  appointment_status INT NOT NULL DEFAULT 1,
  PRIMARY KEY (appointment_id),
  UNIQUE INDEX appointment_id_UNIQUE (appointment_id ASC),
  CONSTRAINT fk_appointment_pet FOREIGN KEY (pet_id) REFERENCES PETS (pet_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_appointment_user FOREIGN KEY (user_id) REFERENCES USERS (user_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table CONSULTATIONS
-- -----------------------------------------------------
CREATE TABLE CONSULTATIONS (
  consultation_id INT NOT NULL AUTO_INCREMENT,
  pet_id INT NOT NULL,
  user_id INT NOT NULL,
  appointment_id INT NULL,
  consultation_weight DECIMAL(5,2) NOT NULL,
  consultation_temperature DECIMAL(4,1) NOT NULL,
  consultation_diagnosis TEXT NOT NULL,
  consultation_treatment TEXT NOT NULL,
  consultation_notes TEXT NULL,
  consultation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (consultation_id),
  UNIQUE INDEX consultation_id_UNIQUE (consultation_id ASC),
  CONSTRAINT fk_consultation_pet FOREIGN KEY (pet_id) REFERENCES PETS (pet_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_consultation_user FOREIGN KEY (user_id) REFERENCES USERS (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_consultation_appointment FOREIGN KEY (appointment_id) REFERENCES APPOINTMENTS (appointment_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table VACCINES
-- -----------------------------------------------------
CREATE TABLE VACCINES (
  vaccine_id INT NOT NULL AUTO_INCREMENT,
  species_id INT NOT NULL,
  vaccine_name VARCHAR(255) NOT NULL,
  vaccine_disease VARCHAR(255) NOT NULL,
  vaccine_manufacturer VARCHAR(255) NOT NULL,
  vaccine_status INT NOT NULL DEFAULT 2,
  PRIMARY KEY (vaccine_id),
  UNIQUE INDEX vaccine_id_UNIQUE (vaccine_id ASC),
  CONSTRAINT fk_vaccine_species FOREIGN KEY (species_id) REFERENCES SPECIES (species_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table VACCINATIONS
-- -----------------------------------------------------
CREATE TABLE VACCINATIONS (
  vaccination_id INT NOT NULL AUTO_INCREMENT,
  pet_id INT NOT NULL,
  vaccine_id INT NOT NULL,
  user_id INT NOT NULL,
  vaccination_date DATE NOT NULL,
  vaccination_next_date DATE NOT NULL,
  vaccination_batch VARCHAR(100) NOT NULL,
  vaccination_notes VARCHAR(500) NULL,
  PRIMARY KEY (vaccination_id),
  UNIQUE INDEX vaccination_id_UNIQUE (vaccination_id ASC),
  CONSTRAINT fk_vaccination_pet FOREIGN KEY (pet_id) REFERENCES PETS (pet_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_vaccination_vaccine FOREIGN KEY (vaccine_id) REFERENCES VACCINES (vaccine_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_vaccination_user FOREIGN KEY (user_id) REFERENCES USERS (user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table MEDICATIONS
-- -----------------------------------------------------
CREATE TABLE MEDICATIONS (
  medication_id INT NOT NULL AUTO_INCREMENT,
  medication_name VARCHAR(255) NOT NULL,
  medication_presentation VARCHAR(100) NOT NULL,
  medication_unit VARCHAR(50) NOT NULL,
  medication_status INT NOT NULL DEFAULT 2,
  PRIMARY KEY (medication_id),
  UNIQUE INDEX medication_id_UNIQUE (medication_id ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table PRESCRIPTIONS
-- -----------------------------------------------------
CREATE TABLE PRESCRIPTIONS (
  prescription_id INT NOT NULL AUTO_INCREMENT,
  consultation_id INT NOT NULL,
  prescription_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  prescription_notes TEXT NULL,
  PRIMARY KEY (prescription_id),
  UNIQUE INDEX prescription_id_UNIQUE (prescription_id ASC),
  CONSTRAINT fk_prescription_consultation FOREIGN KEY (consultation_id) REFERENCES CONSULTATIONS (consultation_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table PRESCRIPTION_DETAILS
-- -----------------------------------------------------
CREATE TABLE PRESCRIPTION_DETAILS (
  detail_id INT NOT NULL AUTO_INCREMENT,
  prescription_id INT NOT NULL,
  medication_id INT NOT NULL,
  detail_dose VARCHAR(100) NOT NULL,
  detail_frequency VARCHAR(100) NOT NULL,
  detail_duration VARCHAR(100) NOT NULL,
  detail_instructions TEXT NULL,
  PRIMARY KEY (detail_id),
  UNIQUE INDEX detail_id_UNIQUE (detail_id ASC),
  CONSTRAINT fk_detail_prescription FOREIGN KEY (prescription_id) REFERENCES PRESCRIPTIONS (prescription_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_detail_medication FOREIGN KEY (medication_id) REFERENCES MEDICATIONS (medication_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ============================================================
-- VISTAS
-- ============================================================

CREATE OR REPLACE VIEW V_PETS_FULL AS
SELECT p.pet_id, p.pet_name, p.pet_birthdate, p.pet_sex, p.pet_color, p.pet_weight,
       p.pet_status, p.pet_date, o.owner_id,
       CONCAT(o.owner_name, ' ', o.owner_first_surname) AS owner_full_name,
       o.owner_phone, o.owner_email, s.species_id, s.species_name, b.breed_id, b.breed_name
FROM PETS AS p
INNER JOIN OWNERS AS o ON p.owner_id = o.owner_id
INNER JOIN SPECIES AS s ON p.species_id = s.species_id
INNER JOIN BREEDS AS b ON p.breed_id = b.breed_id;

CREATE OR REPLACE VIEW V_VACCINATIONS_FULL AS
SELECT va.vaccination_id, va.vaccination_date, va.vaccination_next_date, va.vaccination_batch,
       va.vaccination_notes, p.pet_id, p.pet_name, s.species_name, vac.vaccine_id,
       vac.vaccine_name, vac.vaccine_disease, vac.vaccine_manufacturer,
       CONCAT(u.user_name, ' ', u.user_first_surname) AS vet_full_name
FROM VACCINATIONS AS va
INNER JOIN PETS AS p ON va.pet_id = p.pet_id
INNER JOIN SPECIES AS s ON p.species_id = s.species_id
INNER JOIN VACCINES AS vac ON va.vaccine_id = vac.vaccine_id
INNER JOIN USERS AS u ON va.user_id = u.user_id;

CREATE OR REPLACE VIEW V_CONSULTATIONS_FULL AS
SELECT c.consultation_id, c.consultation_date, c.consultation_weight, c.consultation_temperature,
       c.consultation_diagnosis, c.consultation_treatment, c.consultation_notes,
       p.pet_id, p.pet_name, s.species_name, b.breed_name, o.owner_id,
       CONCAT(o.owner_name, ' ', o.owner_first_surname) AS owner_full_name, o.owner_phone,
       CONCAT(u.user_name, ' ', u.user_first_surname) AS vet_full_name, u.user_id AS vet_id,
       c.appointment_id
FROM CONSULTATIONS AS c
INNER JOIN PETS AS p ON c.pet_id = p.pet_id
INNER JOIN SPECIES AS s ON p.species_id = s.species_id
INNER JOIN BREEDS AS b ON p.breed_id = b.breed_id
INNER JOIN OWNERS AS o ON p.owner_id = o.owner_id
INNER JOIN USERS AS u ON c.user_id = u.user_id;

CREATE OR REPLACE VIEW V_APPOINTMENTS_FULL AS
SELECT a.appointment_id, a.appointment_date, a.appointment_time, a.appointment_reason,
       a.appointment_status, a.appointment_date_created, p.pet_id, p.pet_name, s.species_name,
       o.owner_id, CONCAT(o.owner_name, ' ', o.owner_first_surname) AS owner_full_name,
       o.owner_phone, CONCAT(u.user_name, ' ', u.user_first_surname) AS vet_full_name,
       u.user_id AS vet_id
FROM APPOINTMENTS AS a
INNER JOIN PETS AS p ON a.pet_id = p.pet_id
INNER JOIN SPECIES AS s ON p.species_id = s.species_id
INNER JOIN OWNERS AS o ON p.owner_id = o.owner_id
INNER JOIN USERS AS u ON a.user_id = u.user_id;

CREATE OR REPLACE VIEW V_PRESCRIPTIONS_FULL AS
SELECT pr.prescription_id, pr.prescription_date, pr.prescription_notes, c.consultation_id,
       c.consultation_date, p.pet_id, p.pet_name,
       CONCAT(o.owner_name, ' ', o.owner_first_surname) AS owner_full_name,
       CONCAT(u.user_name, ' ', u.user_first_surname) AS vet_full_name,
       pd.detail_id, m.medication_name, m.medication_presentation, m.medication_unit,
       pd.detail_dose, pd.detail_frequency, pd.detail_duration, pd.detail_instructions
FROM PRESCRIPTIONS AS pr
INNER JOIN CONSULTATIONS AS c ON pr.consultation_id = c.consultation_id
INNER JOIN PETS AS p ON c.pet_id = p.pet_id
INNER JOIN OWNERS AS o ON p.owner_id = o.owner_id
INNER JOIN USERS AS u ON c.user_id = u.user_id
INNER JOIN PRESCRIPTION_DETAILS AS pd ON pr.prescription_id = pd.prescription_id
INNER JOIN MEDICATIONS AS m ON pd.medication_id = m.medication_id;

-- ============================================================
-- DATOS INICIALES (bcrypt rounds=12)
-- ============================================================

INSERT INTO ROLES VALUES (null,'Admin'),(null,'Veterinario'),(null,'Recepcionista'),(null,'Cliente');

INSERT INTO CITIES VALUES
(null,'Bogotá'),(null,'Medellín'),(null,'Cali'),
(null,'Barranquilla'),(null,'Cartagena'),(null,'Bucaramanga');

-- Admin  password: admin123
INSERT INTO USERS VALUES (1,null,'Laura','Gómez','Pérez','3001112233','admin@cuidadoanimal.com','Calle 10 #20-30','$2b$12$hmREs4WG7S0OOiUUCJnDs.ON2K5kgzEga8PC64yd9PLDpphJg/5MO',1,'2026-01-01',2);

-- Veterinarios  vet123 / vet456 / vet789
INSERT INTO USERS VALUES
(2,null,'Andrés','Martínez','Ruiz','3104445566','andres.martinez@cuidadoanimal.com','Carrera 15 #8-44','$2b$12$OXu8PHeYRlPCe52XUSoB6eYOs9ZpL4V6izZ16sxF9nOzDTu/HbVm2',1,'2026-01-05',2),
(2,null,'Camila','Torres','Vargas','3117778899','camila.torres@cuidadoanimal.com','Calle 50 #22-10','$2b$12$xxt/aCQt7oaPoG8N9GYYNO3N7EJnhKq4guyM2esyM/ALk.R8e4n6a',1,'2026-01-10',2),
(2,null,'Felipe','Rodríguez','Castro','3129990011','felipe.rodriguez@cuidadoanimal.com','Av. El Parque #5-12','$2b$12$c6eRLMsX5qdGRWILiv2W4O2su6SL3luIF03TX2B44uHPRF6owu9cS',1,'2026-02-01',2);

-- Recepcionistas  rec123 / rec456
INSERT INTO USERS VALUES
(3,null,'Sofía','Herrera','Mora','3151234567','sofia.herrera@cuidadoanimal.com','Cra 30 #15-20','$2b$12$nw56lZgJS8WPf3/1r/G52ejfUyGxP2n13Jq8GiiRtXJw3IpLwOcYC',1,'2026-01-08',2),
(3,null,'Diego','Salazar','Ríos','3163456789','diego.salazar@cuidadoanimal.com','Cl. 100 #45-12','$2b$12$SE/lNU.uOFSwZ1sSH3Nbvux1FPoJ3c.HtR1IdG5dfERJmgvwWXyl2',1,'2026-01-15',2);

INSERT INTO OWNERS VALUES
(null,'Juan','Pérez','García','3004567890','juan.perez@gmail.com','Calle 123 #45-67',1,'2026-01-12',2),
(null,'María','López','Rodríguez','3112345678','maria.lopez@gmail.com','Carrera 10 #20-30',1,'2026-01-15',2),
(null,'Carlos','García','Moreno','3121112233','carlos.garcia@yahoo.com','Calle 45 #12-30',2,'2026-01-20',2),
(null,'Ana','Ramírez','Torres','3134445566','ana.ramirez@hotmail.com','Av. Siempre Viva 742',1,'2026-01-22',2),
(null,'Pedro','Herrera','Suárez','3147778899','pedro.herrera@gmail.com','Transv. 56 #34-90',3,'2026-02-01',2),
(null,'Valentina','Cárdenas','Prieto','3159990011','valentina.cardenas@gmail.com','Zona Industrial 4',1,'2026-02-05',2),
(null,'Javier','Morales','Rincón','3168889900','javier.morales@gmail.com','Cl. 80 #10-55',2,'2026-02-10',2),
(null,'Sandra','Fernández','Quintero','3172223344','sandra.fernandez@gmail.com','Carrera 15 #8-44',1,'2026-02-15',2),
(null,'Luisa','Rojas','Bedoya','3185556677','luisa.rojas@gmail.com','Cl. 30 #22-18',4,'2026-03-01',2),
(null,'Miguel','Castro','Salazar','3193334455','miguel.castro@gmail.com','Cra 20 #5-18',1,'2026-03-05',2);

INSERT INTO SPECIES VALUES (null,'Perro',2),(null,'Gato',2),(null,'Conejo',2),(null,'Hámster',2),(null,'Ave',2),(null,'Reptil',2);

INSERT INTO BREEDS VALUES
(null,1,'Labrador Retriever',2),(null,1,'Bulldog Francés',2),(null,1,'Golden Retriever',2),
(null,1,'Pastor Alemán',2),(null,1,'Beagle',2),(null,1,'Poodle',2),
(null,1,'Chihuahua',2),(null,1,'Mestizo',2),
(null,2,'Persa',2),(null,2,'Siamés',2),(null,2,'Maine Coon',2),
(null,2,'Ragdoll',2),(null,2,'Bengalí',2),(null,2,'Mestizo',2),
(null,3,'Holland Lop',2),(null,3,'Mini Rex',2),(null,3,'Angora',2),
(null,4,'Sirio',2),(null,4,'Ruso',2),
(null,5,'Periquito',2),(null,5,'Canario',2),(null,5,'Loro',2);

INSERT INTO PETS VALUES
(null,1,1,1,'Toby','2021-03-15','M','Amarillo',28.50,'2026-01-12',2),
(null,2,2,9,'Mimi','2020-07-22','F','Blanco',4.20,'2026-01-15',2),
(null,3,1,4,'Rex','2019-11-10','M','Negro con café',32.80,'2026-01-20',2),
(null,4,2,10,'Luna','2022-05-01','F','Gris',3.80,'2026-01-22',2),
(null,5,1,6,'Max','2023-02-18','M','Blanco',5.50,'2026-02-01',2),
(null,6,2,14,'Nube','2021-09-30','F','Naranja',4.00,'2026-02-05',2),
(null,7,1,2,'Bruno','2020-12-25','M','Atigrado blanco y negro',12.30,'2026-02-10',2),
(null,8,3,15,'Coco','2022-08-14','F','Marrón',2.10,'2026-02-15',2),
(null,9,5,22,'Piolín','2021-04-05','M','Amarillo',0.08,'2026-03-01',2),
(null,10,1,3,'Rocky','2022-06-20','M','Dorado',29.00,'2026-03-05',2);

INSERT INTO VACCINES VALUES
(null,1,'Moquillo Canino','Moquillo (Distemper)','MSD Animal Health',2),
(null,1,'Parvovirus Canino','Parvovirus','Boehringer Ingelheim',2),
(null,1,'Rabia Canina','Rabia','Zoetis',2),
(null,1,'Hepatitis Infecciosa','Hepatitis infecciosa canina','MSD Animal Health',2),
(null,1,'Polivalente Canina (DHPPi)','Distemper, Hepatitis, Parvo, Parainfluenza','Virbac',2),
(null,1,'Leptospirosis','Leptospirosis','Zoetis',2),
(null,2,'Trivalente Felina (FVRCP)','Rinotraqueítis, Calicivirus, Panleucopenia','Zoetis',2),
(null,2,'Rabia Felina','Rabia','Boehringer Ingelheim',2),
(null,2,'Leucemia Felina (FeLV)','Leucemia viral felina','MSD Animal Health',2),
(null,3,'Mixomatosis','Mixomatosis','MSD Animal Health',2),
(null,3,'Enfermedad Hemorrágica Viral','VHD/RHD','Hipra',2);

INSERT INTO MEDICATIONS VALUES
(null,'Amoxicilina','Tableta','mg',2),(null,'Metronidazol','Tableta','mg',2),
(null,'Ivermectina','Inyectable','ml',2),(null,'Meloxicam','Tableta','mg',2),
(null,'Prednisolona','Tableta','mg',2),(null,'Enrofloxacina','Tableta','mg',2),
(null,'Omeprazol','Cápsula','mg',2),(null,'Furosemida','Tableta','mg',2),
(null,'Enalapril','Tableta','mg',2),(null,'Cefalexina','Jarabe','ml',2),
(null,'Dexametasona','Inyectable','ml',2),(null,'Tramadol','Tableta','mg',2);

INSERT INTO APPOINTMENTS VALUES
(null,1,2,'2026-01-15','09:00:00','Revisión general anual','2026-01-12',3),
(null,2,3,'2026-01-18','10:30:00','Vacunación trivalente','2026-01-15',3),
(null,3,2,'2026-01-22','11:00:00','Control de peso y dieta','2026-01-20',3),
(null,4,4,'2026-01-25','08:30:00','Tos persistente','2026-01-22',3),
(null,5,2,'2026-02-05','14:00:00','Desparasitación','2026-02-01',3),
(null,6,3,'2026-02-08','15:30:00','Revisión dental','2026-02-05',3),
(null,7,4,'2026-02-12','09:00:00','Alergia en piel','2026-02-10',2),
(null,8,2,'2026-02-18','10:00:00','Revisión post operatoria','2026-02-15',2),
(null,9,3,'2026-03-03','11:30:00','Pérdida de plumas','2026-03-01',2),
(null,10,4,'2026-03-07','08:00:00','Cojera miembro posterior','2026-03-05',2);

INSERT INTO CONSULTATIONS VALUES
(null,1,2,1,29.20,38.5,'Animal en buen estado general. Sin alteraciones detectadas.','Vitaminas y dieta balanceada recomendada.','Próxima cita en 6 meses.','2026-01-15'),
(null,2,3,2,4.10,38.2,'Gata sana. Se aplica vacuna trivalente FVRCP.','Vacuna aplicada sin reacciones adversas.',null,'2026-01-18'),
(null,3,2,3,33.50,38.8,'Sobrepeso. Dieta hipocalórica recomendada.','Reducción de 20% en porciones diarias. Ejercicio diario.','Control en 1 mes.','2026-01-22'),
(null,4,4,4,3.75,39.1,'Infección respiratoria leve.','Antibiótico y antiinflamatorio por 7 días.','Aislar de otros animales.','2026-01-25'),
(null,5,2,5,5.60,38.3,'Estado general óptimo. Desparasitación aplicada.','Ivermectina inyectable aplicada.',null,'2026-02-05'),
(null,6,3,6,4.05,38.0,'Sarro dental moderado. Limpieza programada.','Limpieza dental bajo anestesia programada para próxima semana.',null,'2026-02-08');

INSERT INTO VACCINATIONS VALUES
(null,1,5,2,'2026-01-15','2027-01-15','LOT-DVH-0045','Sin reacciones adversas'),
(null,2,7,3,'2026-01-18','2027-01-18','LOT-TRF-0012',null),
(null,3,1,2,'2026-01-22','2027-01-22','LOT-MOQ-0033','Animal algo ansioso pero toleró bien'),
(null,4,8,4,'2026-01-25','2027-01-25','LOT-RAB-0071',null),
(null,5,3,2,'2026-02-05','2027-02-05','LOT-RAB-0072',null),
(null,2,9,3,'2026-02-08','2027-02-08','LOT-FLV-0015','Primera dosis FeLV');

INSERT INTO PRESCRIPTIONS VALUES (null,4,'2026-01-25','Mantener abrigada a la mascota durante el tratamiento');
INSERT INTO PRESCRIPTION_DETAILS VALUES
(null,1,1,'250mg','Cada 12 horas','7 días','Administrar con comida'),
(null,1,4,'0.5mg/kg','Una vez al día','5 días','No exceder la dosis indicada');

INSERT INTO PRESCRIPTIONS VALUES (null,3,'2026-01-22','Controlar el peso semanalmente');
INSERT INTO PRESCRIPTION_DETAILS VALUES
(null,2,7,'20mg','Una vez al día en ayunas','30 días','Administrar 30 minutos antes del desayuno');
