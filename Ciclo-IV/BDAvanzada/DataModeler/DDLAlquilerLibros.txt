-- Generado por Oracle SQL Developer Data Modeler 23.1.0.087.0806
--   en:        2024-04-22 12:04:30 COT
--   sitio:      Oracle Database 11g
--   tipo:      Oracle Database 11g



-- predefined type, no DDL - MDSYS.SDO_GEOMETRY

-- predefined type, no DDL - XMLTYPE

CREATE TABLE alquileres (
    idalquiler   INTEGER NOT NULL,
    cedula       VARCHAR2(10 CHAR) NOT NULL,
    nro_registro INTEGER NOT NULL,
    nro_horas    SMALLINT NOT NULL,
    fecha_hora_p DATE DEFAULT SYSDATE NOT NULL,
    fecha_hora_d DATE
);

ALTER TABLE alquileres ADD CONSTRAINT alquileres_pk PRIMARY KEY ( idalquiler );

ALTER TABLE alquileres
    ADD CONSTRAINT alquileres_ced_bic_fec_un UNIQUE ( cedula,
                                                      nro_registro,
                                                      fecha_hora_p );

ALTER TABLE ALQUILERES ADD CONSTRAINT ALQUILERES_NRO_HORAS_CK CHECK (NRO_HORAS BETWEEN 1 AND 4);

ALTER TABLE ALQUILERES ADD CONSTRAINT ALQUILERES_FECHAS_CK CHECK (FECHA_HORA_D > FECHA_HORA_P);


CREATE TABLE bicicletas (
    nro_registro                 INTEGER NOT NULL,
    marca                        VARCHAR2(20) NOT NULL,
    modelo                       VARCHAR2(20) NOT NULL,
    tipo                         CHAR(1) NOT NULL,
    color                        VARCHAR2(20) NOT NULL,
    estado                       CHAR(1) DEFAULT 'D' NOT NULL,
    nro_rastreador               INTEGER NOT NULL,
    fecha_instalacion_rastreador DATE NOT NULL,
    latitud_ultima               FLOAT NOT NULL,
    longitud_ultima              FLOAT NOT NULL
);

ALTER TABLE bicicletas ADD CONSTRAINT bicicletas_pk PRIMARY KEY ( nro_registro );

ALTER TABLE bicicletas ADD CONSTRAINT bicicletas_nro_rastreador_un UNIQUE ( nro_rastreador );

ALTER TABLE BICICLETAS ADD CONSTRAINT BICICLETAS_ESTADO_CK CHECK (ESTADO IN ('U','D','A'));

ALTER TABLE BICICLETAS ADD CONSTRAINT BICICLETAS_TIPO_CK CHECK (TIPO IN ('M','E'));

CREATE TABLE rastreadores (
    nro_rastreador INTEGER NOT NULL,
    marca          VARCHAR2(20) NOT NULL,
    modelo         VARCHAR2(20) NOT NULL,
    nro_serie      VARCHAR2(15) NOT NULL
);

ALTER TABLE rastreadores ADD CONSTRAINT rastreadores_pk PRIMARY KEY ( nro_rastreador );

CREATE TABLE titulos (
    cedula VARCHAR2(10 CHAR) NOT NULL,
    titulo VARCHAR2(50) NOT NULL
);

ALTER TABLE titulos ADD CONSTRAINT titulos_pk PRIMARY KEY ( cedula,
                                                            titulo );

CREATE TABLE usuarios (
    cedula    VARCHAR2(10 CHAR) NOT NULL,
    apellidos VARCHAR2(40) NOT NULL,
    nombres   VARCHAR2(40) NOT NULL,
    direccion VARCHAR2(300) NOT NULL,
    email     VARCHAR2(100),
    telefono1 VARCHAR2(15) NOT NULL,
    telefono2 VARCHAR2(15),
    telefono3 VARCHAR2(15)
);

ALTER TABLE usuarios ADD CONSTRAINT usuarios_pk PRIMARY KEY ( cedula );

ALTER TABLE usuarios ADD CONSTRAINT usuarios_email_un UNIQUE ( email );

ALTER TABLE alquileres
    ADD CONSTRAINT alquileres_bicicletas_fk FOREIGN KEY ( nro_registro )
        REFERENCES bicicletas ( nro_registro );

ALTER TABLE alquileres
    ADD CONSTRAINT alquileres_usuarios_fk FOREIGN KEY ( cedula )
        REFERENCES usuarios ( cedula );

ALTER TABLE bicicletas
    ADD CONSTRAINT bicicletas_rastreadores_fk FOREIGN KEY ( nro_rastreador )
        REFERENCES rastreadores ( nro_rastreador );

ALTER TABLE titulos
    ADD CONSTRAINT titulos_usuarios_fk FOREIGN KEY ( cedula )
        REFERENCES usuarios ( cedula );



-- Informe de Resumen de Oracle SQL Developer Data Modeler: 
-- 
-- CREATE TABLE                             5
-- CREATE INDEX                             0
-- ALTER TABLE                             12
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
-- ERRORS                                   0
-- WARNINGS                                 0
