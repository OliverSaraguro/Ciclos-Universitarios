DROP USER proyectos2020 CASCADE;

CREATE USER proyectos2020 IDENTIFIED BY "oracle"
DEFAULT TABLESPACE users;

GRANT connect, resource TO proyectos2020;

CONN proyectos2020/oracle;

CREATE TABLE OFICINAS
       (IDOFI NUMBER(2) CONSTRAINT PK_OFI PRIMARY KEY,
        NOMBREOFI VARCHAR2(14) ,
        CIUDAD VARCHAR2(13) ) ;

CREATE TABLE FUNCIONARIOS
       (IDFUNC NUMBER(4) CONSTRAINT PK_FUN PRIMARY KEY,
        APELLIDO VARCHAR2(10),
        FECHANAC DATE,
        OFICIO VARCHAR2(12),
        SUPERVISOR NUMBER(4),
        FECHACONTRATO DATE,
        SUELDO NUMBER(7,2),
        COMISION NUMBER(7,2),
        IDOFI NUMBER(2) CONSTRAINT FK_IDOFI REFERENCES OFICINAS);

CREATE TABLE PROYECTOS (
  IDPROY NUMBER(4) CONSTRAINT PK_PROY PRIMARY KEY,
  NOMBREPROY  VARCHAR2(50),
  LUGAR    VARCHAR2(13),
  IDOFI NUMBER(2) REFERENCES OFICINAS);

CREATE TABLE PARTICIPANTES (
  IDFUNC  NUMBER(4) NOT NULL REFERENCES FUNCIONARIOS,
  IDPROY NUMBER(4) NOT NULL REFERENCES PROYECTOS,
  HORASSEMANA  NUMBER(2),
  CONSTRAINT PK_PAR PRIMARY KEY (IDFUNC,IDPROY));

INSERT INTO oficinas VALUES
        (10,'CONTABILIDAD','QUITO');
INSERT INTO oficinas VALUES 
		(20,'INVESTIGACION','GUAYAQUIL');
INSERT INTO oficinas VALUES
        (30,'VENTAS','CUENCA');
INSERT INTO oficinas VALUES
        (40,'OPERACIONES','LOJA');

INSERT INTO funcionarios VALUES
(7369,'CASTRO',to_date('17-4-1970','dd-mm-yyyy'),'SECRETARIO',7902,to_date('17-12-2014','dd-mm-yyyy'),800,NULL,20);
INSERT INTO funcionarios VALUES
(7499,'AGUIRRE',to_date('21-10-1985','dd-mm-yyyy'),'VENDEDOR',7698,to_date('20-2-2015','dd-mm-yyyy'),1600,300,30);
INSERT INTO funcionarios VALUES
(7521,'SANCHEZ',to_date('23-2-1979','dd-mm-yyyy'),'VENDEDOR',7698,to_date('22-2-2015','dd-mm-yyyy'),1250,500,30);
INSERT INTO funcionarios VALUES
(7566,'VIVANCO',to_date('9-4-1965','dd-mm-yyyy'),'DIRECTOR',7839,to_date('2-4-2015','dd-mm-yyyy'),2975,NULL,20);
INSERT INTO funcionarios VALUES
(7654,'ZAMBRANO',to_date('31-12-1989','dd-mm-yyyy'),'VENDEDOR',7698,to_date('28-9-2015','dd-mm-yyyy'),1250,1400,30);
INSERT INTO funcionarios VALUES
(7698,'ABAD',to_date('23-6-1975','dd-mm-yyyy'),'DIRECTOR',7839,to_date('1-5-2015','dd-mm-yyyy'),2850,NULL,30);
INSERT INTO funcionarios VALUES
(7782,'LOPEZ',to_date('18-12-1961','dd-mm-yyyy'),'DIRECTOR',7839,to_date('9-6-2015','dd-mm-yyyy'),2450,NULL,10);
INSERT INTO funcionarios VALUES
(7788,'DELGADO',to_date('9-5-1982','dd-mm-yyyy'),'ANALISTA',7566,to_date('13-7-2019','dd-mm-yyyy')-85,3000,NULL,20);
INSERT INTO funcionarios VALUES
(7839,'TINOCO',to_date('12-8-1956','dd-mm-yyyy'),'PRESIDENTE',NULL,to_date('17-11-2014','dd-mm-yyyy'),5000,NULL,10);
INSERT INTO funcionarios VALUES
(7844,'RIOS',to_date('7-2-1995','dd-mm-yyyy'),'VENDEDOR',7698,to_date('8-9-2015','dd-mm-yyyy'),1500,100,30);
INSERT INTO funcionarios VALUES
(7876,'ULLOA',to_date('30-5-1989','dd-mm-yyyy'),'SECRETARIO',7788,to_date('13-7-2019', 'dd-mm-yyyy')-51,1100,NULL,20);
INSERT INTO funcionarios VALUES
(7900,'ESPARZA',to_date('25-1-1980','dd-mm-yyyy'),'SECRETARIO',7698,to_date('3-12-2015','dd-mm-yyyy'),950,NULL,30);
INSERT INTO funcionarios VALUES
(7902,'GUILLEN',to_date('21-9-1966','dd-mm-yyyy'),'ANALISTA',7566,to_date('3-12-2015','dd-mm-yyyy'),3000,NULL,20);
INSERT INTO funcionarios VALUES
(7934,'JARAMILLO',to_date('15-10-1975','dd-mm-yyyy'),'SECRETARIO',7782,to_date('23-1-2016','dd-mm-yyyy'),1300,NULL,10);
INSERT INTO funcionarios VALUES
(7963,'MONTERO',to_date('16-7-1983','dd-mm-yyyy'),'VENDEDOR',7698,to_date('8-7-2016','dd-mm-yyyy'),1600,400,30);


INSERT INTO proyectos VALUES (1001, 'Optimización del proceso de producción', 'LOJA', 20);
INSERT INTO proyectos VALUES (1004, 'Reingeniería del sitio web institucional', 'CUENCA', 30);
INSERT INTO proyectos VALUES (1005, 'Optimización del proceso de distribución', 'CUENCA', 30);
INSERT INTO proyectos VALUES (1006, 'Apertura de nuevos mercados', 'MACHALA', 30);
INSERT INTO proyectos VALUES (1008, 'Optimización del proceso de recaudación', 'QUITO', 30);

INSERT INTO participantes VALUES (7499,1004,15);
INSERT INTO participantes VALUES (7499,1005,12);
INSERT INTO participantes VALUES (7521,1004,10);
INSERT INTO participantes VALUES (7521,1008,8);
INSERT INTO participantes VALUES (7654,1001,16);
INSERT INTO participantes VALUES (7654,1006,15);
INSERT INTO participantes VALUES (7654,1008,5);
INSERT INTO participantes VALUES (7844,1005,6);
INSERT INTO participantes VALUES (7934,1001,4);
INSERT INTO participantes VALUES (7839,1006,2);
INSERT INTO participantes VALUES (7698,1004,4);

COMMIT;