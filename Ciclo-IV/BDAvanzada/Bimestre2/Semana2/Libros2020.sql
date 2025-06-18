DROP USER libros2020 CASCADE;

CREATE USER libros2020 IDENTIFIED BY "oracle"
DEFAULT TABLESPACE users;

GRANT connect, resource TO libros2020;

CREATE TABLE libros2020.autores (
    idautor      INTEGER NOT NULL,
    nombreautor  VARCHAR2(100) NOT NULL,
    numlibros    INTEGER NOT NULL,
    CONSTRAINT autores_pk PRIMARY KEY ( idautor ),
    CONSTRAINT aut_numlibros_ck CHECK ( numlibros >= 0 )
);

CREATE TABLE libros2020.autorias (
    idlibro  INTEGER NOT NULL,
    idautor  INTEGER NOT NULL,
    orden    SMALLINT NOT NULL,
    CONSTRAINT autorias_pk PRIMARY KEY ( idautor, idlibro ),
    CONSTRAINT aut_lib_orden_uk UNIQUE ( idlibro, orden )
);

CREATE TABLE libros2020.libros (
    idlibro     INTEGER NOT NULL,
    titulo      VARCHAR2(500) NOT NULL,
    numpaginas  INTEGER NOT NULL,
    anio        NUMBER(4) NOT NULL,
    nroedicion  NUMBER(2) NOT NULL,
    CONSTRAINT libros_pk PRIMARY KEY ( idlibro ),
    CONSTRAINT lib_numpaginas_ck CHECK ( numpaginas BETWEEN 50 AND 2000 ),
    CONSTRAINT lib_nroedicion_ck CHECK ( nroedicion > 0 ),
    CONSTRAINT lib_anio_ck CHECK ( anio >= 1800 )
);

ALTER TABLE libros2020.autorias
    ADD CONSTRAINT autores_autorias_fk FOREIGN KEY ( idautor )
        REFERENCES libros2020.autores ( idautor );

ALTER TABLE libros2020.autorias
    ADD CONSTRAINT libros_autorias_fk FOREIGN KEY ( idlibro )
        REFERENCES libros2020.libros ( idlibro );

INSERT INTO libros2020.libros values (1,'Java 8',340,2015,1);
INSERT INTO libros2020.libros values (2,'PHP',250,2019,2);

INSERT INTO libros2020.autores values (1,'Luis Joyanes',0);
INSERT INTO libros2020.autores values (2,'Carlos Coronel',0);
INSERT INTO libros2020.autores values (3,'María Zapata',0);
INSERT INTO libros2020.autores values (4,'Steven Morris',0);

INSERT INTO libros2020.autorias values (1,1,1);
INSERT INTO libros2020.autorias values (1,3,2);
INSERT INTO libros2020.autorias values (2,2,1);

COMMIT;