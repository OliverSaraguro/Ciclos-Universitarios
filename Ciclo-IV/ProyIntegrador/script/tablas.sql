DROP SCHEMA IF EXISTS utpl;

CREATE SCHEMA utpl;

USE utpl;

CREATE TABLE genero (
    codigo INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(20),
    PRIMARY KEY (codigo)
);

CREATE TABLE nacionalidad (
    codigo INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(20),
    PRIMARY KEY (codigo)
);

CREATE TABLE detenido (
    identificador             INT NOT NULL AUTO_INCREMENT,
    edad                      INT,
    sexo                      VARCHAR(15),
    autoidentificacion_etnica VARCHAR(50),
    estatus_migratorio        VARCHAR(15),
    numero_detenciones        INT,
    estado_civil              VARCHAR(20),
    nivel_instruccion         VARCHAR(50),
    nacionalidad_codigo       INT NOT NULL,
    genero_codigo             INT NOT NULL,
    PRIMARY KEY (identificador)
);

CREATE TABLE lugar (
    codigo INT NOT NULL AUTO_INCREMENT,
    tipo   VARCHAR(50),
    nombre VARCHAR(50),
    PRIMARY KEY (codigo)
);

CREATE TABLE arma (
    codigo INT NOT NULL AUTO_INCREMENT,
    tipo   VARCHAR(50),
    nombre VARCHAR(50),
    PRIMARY KEY (codigo)
);

CREATE TABLE zona (
    codigo INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(20),
    PRIMARY KEY (codigo)
);

CREATE TABLE detencion (
    codigo                      INT NOT NULL,
    tipo                        VARCHAR(20),
    codigo_iccs                 VARCHAR(10),
    presunta_infraccion         VARCHAR(300),
    presunta_subinfraccion      VARCHAR(300),
    fecha_detencion_aprehension DATE,
    hora_detencion_aprehension  TIMESTAMP,
    movilizacion                VARCHAR(50),
    presunta_flagrancia         VARCHAR(20),
    condicion                   VARCHAR(200),
    presunta_modalidad          VARCHAR(1000),
    detenido_identificador      INT NOT NULL,
    lugar_codigo                INT NOT NULL,
    arma_codigo                 INT NOT NULL,
    zona_codigo                 INT NOT NULL,
    PRIMARY KEY (codigo)
);

CREATE TABLE subzona (
    codigo      INT NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(50),
    zona_codigo INT NOT NULL,
    PRIMARY KEY (codigo)
);

CREATE TABLE provincia (
    codigo      INT NOT NULL,
    nombre      VARCHAR(50),
    zona_codigo INT NOT NULL,
    PRIMARY KEY (codigo)
);

CREATE TABLE datosestadisticos (
    codigo           INT NOT NULL AUTO_INCREMENT,
    anio             INT,
    tasadesempleo    FLOAT,
    tasapobreza      FLOAT,
    tasanoestudiadas FLOAT,
    nmrohomicidios   INT,
    nmrofemicidios   INT,
    provincia_codigo INT NOT NULL,
    PRIMARY KEY (codigo)
);

CREATE TABLE canton ( 
    codigo           INT NOT NULL,
    nombre           VARCHAR(50),
    provincia_codigo INT NOT NULL,
    PRIMARY KEY (codigo)
);

CREATE TABLE parroquia (
    codigo        VARCHAR(15) NOT NULL,
    nombre        VARCHAR(100),
    canton_codigo INT NOT NULL,
    PRIMARY KEY (codigo)
);

CREATE TABLE distrito (
    codigo           VARCHAR(8) NOT NULL,
    nombre           VARCHAR(50),
    parroquia_codigo VARCHAR(10) NOT NULL,
    PRIMARY KEY (codigo)
);

CREATE TABLE circuito (
    codigo          VARCHAR(10) NOT NULL,
    nombre          VARCHAR(50),
    distrito_codigo VARCHAR(8) NOT NULL,
    PRIMARY KEY (codigo)
);

CREATE TABLE subcircuito (
    codigo          VARCHAR(15) NOT NULL,
    nombre          VARCHAR(50),
    circuito_codigo VARCHAR(10) NOT NULL,
    PRIMARY KEY (codigo)
);


-- Claves Fornaeas
ALTER TABLE detencion
    ADD CONSTRAINT arma_fk FOREIGN KEY (arma_codigo)
        REFERENCES arma (codigo);

ALTER TABLE parroquia
    ADD CONSTRAINT canton_fk FOREIGN KEY (canton_codigo)
        REFERENCES canton (codigo);

ALTER TABLE subcircuito
    ADD CONSTRAINT circuito_fk FOREIGN KEY (circuito_codigo)
        REFERENCES circuito (codigo);

ALTER TABLE detencion
    ADD CONSTRAINT detenido_fk FOREIGN KEY (detenido_identificador)
        REFERENCES detenido (identificador);

ALTER TABLE circuito
    ADD CONSTRAINT distrito_fk FOREIGN KEY (distrito_codigo)
        REFERENCES distrito (codigo);

ALTER TABLE detenido
    ADD CONSTRAINT genero_fk FOREIGN KEY (genero_codigo)
        REFERENCES genero (codigo);

ALTER TABLE detencion
    ADD CONSTRAINT lugar_fk FOREIGN KEY (lugar_codigo)
        REFERENCES lugar (codigo);

ALTER TABLE detenido
    ADD CONSTRAINT nacionalidad_fk FOREIGN KEY (nacionalidad_codigo)
        REFERENCES nacionalidad (codigo);

ALTER TABLE distrito
    ADD CONSTRAINT parroquia_fk FOREIGN KEY (parroquia_codigo)
        REFERENCES parroquia (codigo);

ALTER TABLE datosestadisticos
    ADD CONSTRAINT provincia_fk FOREIGN KEY (provincia_codigo)
        REFERENCES provincia (codigo);

ALTER TABLE canton
    ADD CONSTRAINT provincia_fkv1 FOREIGN KEY (provincia_codigo)
        REFERENCES provincia (codigo);

ALTER TABLE detencion
    ADD CONSTRAINT zona_fk FOREIGN KEY (zona_codigo)
        REFERENCES zona (codigo);

ALTER TABLE subzona
    ADD CONSTRAINT zona_fkv1 FOREIGN KEY (zona_codigo)
        REFERENCES zona (codigo);

ALTER TABLE provincia
    ADD CONSTRAINT zona_fkv2 FOREIGN KEY (zona_codigo)
        REFERENCES zona (codigo);
