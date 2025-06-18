create user enemdu2019 identified by oracle
default tablespace users
temporary tablespace temp;

grant connect, resource to enemdu2019;

create table enemdu2019.enemdu (
    id_persona VARCHAR2(26),
    anio NUMERIC(4),
    mes SMALLINT,
    provincia CHAR(2),
    canton CHAR(4),
    area VARCHAR2(10),
    genero VARCHAR2(10),
    edad SMALLINT,
    estado_civil VARCHAR2(25),
    nivel_de_instruccion VARCHAR2(50),
    etnia VARCHAR2(30),
    ingreso_laboral NUMERIC(8,2),
    condicion_actividad VARCHAR2(100),
    sectorizacion VARCHAR2(50),
    grupo_ocupacion VARCHAR2(100),
    rama_actividad VARCHAR2(100),
    factor_expansion DOUBLE PRECISION
    );
