-- Generado por Oracle SQL Developer Data Modeler 23.1.0.087.0806
--   en:        2024-04-22 12:04:27 ECT
--   sitio:      Oracle Database 11g
--   tipo:      Oracle Database 11g



-- predefined type, no DDL - MDSYS.SDO_GEOMETRY

-- predefined type, no DDL - XMLTYPE

CREATE TABLE alquileres (
    id_alquiler               INTEGER NOT NULL,
    usuario_cedula            VARCHAR2(10) NOT NULL,
    bicicletas_nmro_reguistro INTEGER NOT NULL,
    nmro_horas                SMALLINT NOT NULL,
    fecha_hora_pres           DATE DEFAULT SYSDATE NOT NULL,  -- SYSDATE PERMITE SABER LA HORA EN ORACLE
    fecha_hora_dev            DATE
);

ALTER TABLE alquileres ADD CONSTRAINT alquileres_pk PRIMARY KEY ( id_alquiler );

ALTER TABLE alquileres ADD CONSTRAINT alquileres_ced_bic_fec_un UNIQUE(cedula, nmro_reguistro, fecha_hora_pres);

ALTER TABLE alquileres ADD CONSTRAINT ALQUILERES_NMRO_HORAS_CK CHECK(nmro_horas BETWEEN 1 AND 4);

ALET TABLE alquileres ADD CONSTRAINT ALQUILERES_FECHAS_CK CHECK (fecha_hora_dev > fecha_hora_pres);

CREATE TABLE bicicletas (
    nmro_reguistro             INTEGER NOT NULL,
    marca                      VARCHAR2(20) NOT NULL,
    modelo                     VARCHAR2(20) NOT NULL,
    tipo                       CHAR(1) NOT NULL,
    color                      VARCHAR2(20) NOT NULL,
    estado                     CHAR(1) DEFAULT 'D' NOT NULL,
    rastreador_nmro_rastreador INTEGER NOT NULL,
    fecha_instalacion_rast     DATE NOT NULL,
    latitud_ultima             FLOAT NOT NULL,
    longitud_ultima            FLOAT NOT NULL
);

ALTER TABLE bicicletas ADD CONSTRAINT bicicleta_pk PRIMARY KEY ( nmro_reguistro );

CREATE TABLE rastreador (
    nmro_rastreador INTEGER NOT NULL,
    marca           VARCHAR2(20) NOT NULL,
    modelo          unknown 
--  ERROR: Datatype UNKNOWN is not allowed 
     NOT NULL,
    nmro_serie      VARCHAR2(15) NOT NULL
);

ALTER TABLE rastreador ADD CONSTRAINT rasterador_pk PRIMARY KEY ( nmro_rastreador );

CREATE TABLE tiulos (
    usuario_cedula VARCHAR2(10) NOT NULL,
    titulo         VARCHAR2(50) NOT NULL
);

ALTER TABLE tiulos ADD CONSTRAINT tiulos_pk PRIMARY KEY ( usuario_cedula,
                                                          titulo );

CREATE TABLE usuario (
    cedula     VARCHAR2(10) NOT NULL,
    apellidos  VARCHAR2(35) NOT NULL,
    nombres    VARCHAR2(35) NOT NULL,
    direccion  VARCHAR2(300) NOT NULL,
    email      VARCHAR2(20),
    telefono_1 VARCHAR2(15) NOT NULL,
    telefono_2 VARCHAR2(15),
    telefono_3 VARCHAR2(15)
);

ALTER TABLE usuario ADD CONSTRAINT usuario_pk PRIMARY KEY ( cedula );

ALTER TABLE alquileres
    ADD CONSTRAINT alquileres_bicicletas_fk FOREIGN KEY ( bicicletas_nmro_reguistro )
        REFERENCES bicicletas ( nmro_reguistro );

ALTER TABLE alquileres
    ADD CONSTRAINT alquileres_usuario_fk FOREIGN KEY ( usuario_cedula )
        REFERENCES usuario ( cedula );

ALTER TABLE bicicletas
    ADD CONSTRAINT bicicletas_rasterador_fk FOREIGN KEY ( rastreador_nmro_rastreador )
        REFERENCES rastreador ( nmro_rastreador );

ALTER TABLE tiulos
    ADD CONSTRAINT tiulos_usuario_fk FOREIGN KEY ( usuario_cedula )
        REFERENCES usuario ( cedula );



-- Informe de Resumen de Oracle SQL Developer Data Modeler: 
-- 
-- CREATE TABLE                             5
-- CREATE INDEX                             0
-- ALTER TABLE                              9
-- CREATE VIEW                              0
-- ALTER VIEW                               0
-- CREATE PACKAGE                           0
-- CREATE PACKAGE BODY                      0
-- CREATE PROCEDURE                         0
-- CREATE FUNCTION                          0
-- CREATE TRIGGER                           0
-- ALTER TRIGGER                            0
-- CREATE COLLECTION TYPE                   0
-- CREATE STRUCTURED TYPE                   0
-- CREATE STRUCTURED TYPE BODY              0
-- CREATE CLUSTER                           0
-- CREATE CONTEXT                           0
-- CREATE DATABASE                          0
-- CREATE DIMENSION                         0
-- CREATE DIRECTORY                         0
-- CREATE DISK GROUP                        0
-- CREATE ROLE                              0
-- CREATE ROLLBACK SEGMENT                  0
-- CREATE SEQUENCE                          0
-- CREATE MATERIALIZED VIEW                 0
-- CREATE MATERIALIZED VIEW LOG             0
-- CREATE SYNONYM                           0
-- CREATE TABLESPACE                        0
-- CREATE USER                              0
-- 
-- DROP TABLESPACE                          0
-- DROP DATABASE                            0
-- 
-- REDACTION POLICY                         0
-- 
-- ORDS DROP SCHEMA                         0
-- ORDS ENABLE SCHEMA                       0
-- ORDS ENABLE OBJECT                       0
-- 
-- ERRORS                                   1
-- WARNINGS                                 0
