rm(list = ls())

############################
# PRACTICA BIMESTRAL
############################

library("httr")
library("jsonlite")
library("dplyr")
library("tidyr")

getwd()
setwd("/Users/oliversaraguro/Downloads")


# Carga de datos desde CSV
?read.table()
datos <- read.csv("countries_gdp_hist_f.csv", sep = ';', fileEncoding = "latin1")

str(datos)

# Renombrar Columnas
datos = datos %>%
  rename(
    pais = country,
    region = region,
    grupoIngresos = income_group,
    anio = year, 
    pibValor_USD = total_gdp,
    pibMillon_USD = total_gdp_million,
    gdpVariacion_PIB = gdp_variation
  )

# Separar el codigo y nombre de pais
datos = datos %>%
  separate(col = pais,
           c("codigo", "pais"),
           sep = " / ")

# Separa el continente, el subcontinente, la region intermedia
datos = datos %>%
  separate(col = region,
           c("continente", "subcontinente", "regionIntermedia"),
           sep = " / ")

# Para los valores vacios en regionIntermedia pone "No Aplica"
unique(datos$regionIntermedia)

datos = datos %>%
  mutate(regionIntermedia = trimws(regionIntermedia), 
         regionIntermedia = if_else(regionIntermedia == "", 
                                    "No Aplica", regionIntermedia))


# PIB que no tienen valor se asume que es 0
# Las variables anio, y relacionados con el PIB deben quedar formateados como numeros
datos = datos %>%
  mutate(
    pibValor_USD = gsub(",", ".", pibValor_USD),
    pibMillon_USD = gsub(",", ".", pibMillon_USD),
    gdpVariacion_PIB = gsub(",", ".", gdpVariacion_PIB),	
    pibValor_USD = as.numeric(pibValor_USD),
    pibMillon_USD = as.numeric(pibMillon_USD),
    gdpVariacion_PIB = as.numeric(gdpVariacion_PIB),
    pibValor_USD = if_else(is.na(pibValor_USD), 0, pibValor_USD),
    pibMillon_USD = if_else(is.na(pibMillon_USD), 0, pibMillon_USD),
    gdpVariacion_PIB = if_else(is.na(gdpVariacion_PIB), 0, gdpVariacion_PIB),
    )

# Anexar los datos del codigo del continente y la poblacion del continente en un 
# data.frame continente

continetes = data.frame(
  continente = c("Africa", "Americas", "Asia", "Europe", "Oceania"),
  continente_codigo_ISO = c("AF", "AM", "AS", "EU", "OC"),
  continente_poblacion_M = c(1360, 1004, 4641, 748, 43)
)

datos = datos %>%
  inner_join(continetes, by = c(continente = "continente"))


# Agregar una variable que contenga la decada que corresponda
# 1960 - 2021
datos = datos %>%
  mutate(
    decada = case_when(
      anio >= 1960 & anio <= 1969 ~ 1960,
      anio >= 1970 & anio <= 1979 ~ 1970,
      anio >= 1980 & anio <= 1989 ~ 1980,
      anio >= 1990 & anio <= 1999 ~ 1990,
      anio >= 2000 & anio <= 2009 ~ 2000,
      anio >= 2010 & anio <= 2019 ~ 2010,
      anio >= 2020 & anio <= 2029 ~ 2020,
      TRUE ~ anio
    )
  )

# Conjunto final
DATOS_EXAMEN_B1 = datos %>%
  select(-c(pibValor_USD, gdpVariacion_PIB, continente_codigo_ISO))

# Estadisitica Final 
# obtener el total de PIB en millones de dolares por cada continente y año
ESTADISTICA_EXAMEN_B1 <- DATOS_EXAMEN_B1 %>%
  group_by(continente, anio) %>%
  summarise(totalMillones_PIB = sum(pibMillon_USD))



        
          



    