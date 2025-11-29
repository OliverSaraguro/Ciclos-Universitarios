rm(list = ls())

############################
# PROYECTO BIMESTRAL
############################

library("httr")
library("jsonlite")
library("dplyr")
library("tidyr")
library(readxl)
library(rvest)


# -----------------------
# Estraemos de la Api
# -----------------------

url = "https://restcountries.com/v3.1/region/americas"

rpta = GET(url)

class(rpta)

status_code(rpta) 

contJson = content(rpta, "text", encoding = "UTF-8") 

contenidoApi = fromJSON(contJson, flatten = TRUE)

paisesLatinoamerica = c("Argentina", "Peru", "Chile", "Panama", "Brazil",
                        "Costa Rica", "Ecuador", "Colombia", "Guatemala",
                        "Mexico", "Uruguay", "Dominican Republic", "Paraguay", "Haiti", 
                        "Honduras", "El Salvador", "Nicaragua", "Bolivia", "Venezuela")


contenidoApi = contenidoApi %>%
  filter(name.common %in% paisesLatinoamerica)

contenidoApi = contenidoApi %>% 
  select(flag, name.common, name.official, capital,independent, continents, 
         unMember, region, subregion, latlng, landlocked, area, population)

str(contenidoApi)

contenidoApi %>%
  distinct(name.common)

# Renombrando columnas 
contenidoApi <- contenidoApi %>%
  rename(
    bandera = flag,
    nombrePais = name.common,
    nombrePaisOficial = name.official,
    capitalPais = capital,
    paisIndependiente = independent,
    continente = continents,
    ONU = unMember,
    regionPais = region,
    subregionPais = subregion,
    coordenadas = latlng, 
    tieneMar = landlocked,
    areaPais = area, 
    poblacion = population
  )

contenidoApi = contenidoApi %>%
  mutate(capitalPais = unlist(capitalPais),
         continente = unlist(continente))

contenidoApi = contenidoApi %>%
  mutate(coordenadas = sapply(coordenadas, paste, collapse = " "))

# Separar valores compuestos (TRANSFORMACION)
contenidoApi = contenidoApi %>%
  separate(col = coordenadas,
           c("latitud", "longitud"),
           sep = " ")

# Convertir 
contenidoApi = contenidoApi %>%
  mutate(latitud = as.numeric(latitud),
         longitud = as.numeric(longitud))


contenidoApi = contenidoApi %>%
  mutate(nombrePais = case_when(
    nombrePais == "Dominican Republic" ~ "Republica Dominicana",
    nombrePais == "Brazil" ~ "Brasil",
    TRUE ~ nombrePais
  ))
           
          

contenidoApi %>%
  distinct(nombrePais)


# --------------------------------
# Estraemos mediante Web Scraping 
# --------------------------------

urlWeb = "https://www.ondata.com.ec/ranking-de-salarios-minimos-en-america-latina-2025/"

# Leemos el contenido HTML de la página
pagina = read_html(urlWeb, encoding = "UTF-8")

# Extraemos los elementos h2
sueldos = pagina %>%
  html_elements("h2.elementor-heading-title") %>%  # Seleccionamos los h2 deseados
  html_text2()  # Extraemos el contenido

# Creamos un dataframe con el texto del h2
sueldos_Basicos = data.frame(sueldos)

# Separamos el texto del h2 en dos columnas: país y sueldo
sueldos_Basicos = sueldos_Basicos %>%
  separate(col = sueldos, 
           c("pais", "sueldo"), 
           sep = " – ") 
  
  
sueldos_Basicos = sueldos_Basicos %>%  
  mutate(
    pais = iconv(pais, from = "UTF-8", to = "ASCII//TRANSLIT"),
    pais = gsub("'","", pais))
  
  
sueldos_Basicos = sueldos_Basicos %>%  
  mutate(
    sueldo = as.numeric(gsub("[\\$,]", "", sueldo)) 
  )

sueldos_Basicos = sueldos_Basicos %>%
  mutate(salarioMinimoPorHora_USD = round(sueldo / 160, 2)) %>%
  rename(sueldoMinimo_USD = sueldo)

sueldos_Basicos = sueldos_Basicos %>%
  filter(pais != "Belice")

sueldos_Basicos %>%
  distinct(pais) 

# ----------------------------------
# Extraccion mediante archivo Excel 
# ----------------------------------
getwd()
setwd("/Users/oliversaraguro/Desktop/CicloVI/analisisDeDatos/dataset")
# Leer el archivo
datosExcel <- read_excel("data_cts_violent_and_sexual_crime.xlsx", sheet = 1)

#Verificamos la estructura
str(datosExcel)

unique(datosExcel$Country)
paisesLatinoamerica <- c(
  "Argentina", "Bolivia", "Brasil", "Chile",
  "Colombia", "Costa Rica", "Ecuador",
  "El Salvador", "Guatemala", "Haiti", "Honduras",
  "Mexico", "Nicaragua", "Panama",
  "Paraguay", "Peru", "Republica Dominicana",
  "Uruguay", "Venezuela"
)

# Renombramos las columnas
datosCrimenesLatinoamerica <- datosExcel %>%
  select(
    codigo_ISO = `Iso3_code`,
    pais = `Country`,
    region = `Region`,
    subregion = `Subregion`,
    indicador = `Indicator`,
    dimension = `Dimension`,
    categoria = `Category`,
    anio = `Year`,
    unidad = `Unit of measurement`,
    valor = `VALUE`,
    fuente = `Source`
  ) %>%
  mutate(
    anio = as.numeric(anio),
    valor = as.numeric(valor)
  )

#Filtramos la información de los últimos 10 años
#Filtramos por Region Americas
#Filtramos por Subregion Latin America and the Caribbean 
datosCrimenesLatinoamerica <- datosCrimenesLatinoamerica %>%
  filter(
    anio %in% 2014:2023,
    region == "Americas",
    subregion == "Latin America and the Caribbean"
  )

#Verificamos los paises que se extraen
datosCrimenesLatinoamerica %>%
  distinct(pais) %>%
  print(n = Inf)

#Corregimos el nombre del pais Bolivia (Plurinational State of) a Bolivia
#Corregimos el nombre del pais Dominican Republic a Republica Dominicana
#Corregimos el nombre del pais Brazil a Brasil
datosCrimenesLatinoamerica <- datosCrimenesLatinoamerica %>%
  mutate(pais = case_when(
    pais == "Bolivia (Plurinational State of)" ~ "Bolivia",
    pais == "Dominican Republic" ~ "Republica Dominicana",
    pais == "Venezuela (Bolivarian Republic of)" ~ "Venezuela",
    pais == "Brazil" ~ "Brasil",
    TRUE ~ pais 
  ))

#Filtramos los paises del DataFrame datosCrimenesLatinoamerica en base al vector de paisesLatinoamerica
datosCrimenesLatinoamerica <- datosCrimenesLatinoamerica %>%
  filter(pais %in% paisesLatinoamerica)

#Verificamos la estructura del DataFrame final
str(datosCrimenesLatinoamerica)

datosCrimenesLatinoamerica = datosCrimenesLatinoamerica %>%
  mutate(valor = round(valor, 2))

datosCrimenesLatinoamerica %>%
  distinct(pais)


# ------------------------------
# Union 
# ------------------------------

dataSet = contenidoApi %>%
  left_join(sueldos_Basicos, by = c(nombrePais = "pais"))


dataSet = dataSet %>%
  left_join(datosCrimenesLatinoamerica, by = c(nombrePais = "pais"))

unique(dataSet$nombrePais)

dataSet %>% filter(nombrePais == "Cuba")


# Preprocesamiento de los datos mediante tareas de limpieza, transformación y enriquecimiento.

str(dataSet)

# LIMPIEZA
# ONU
dataSet = dataSet %>% 
  mutate(
    ONU = as.character(ONU),
    ONU = case_when(
      ONU == "TRUE" ~ "Si",
      ONU == "FALSE" ~ "No",
      TRUE ~ ONU
    )
  )

# LIMPIEZA
# PAIS INDEPENDIENTE
dataSet = dataSet %>% 
  mutate(
    paisIndependiente = as.character(paisIndependiente),
    paisIndependiente = case_when(
      paisIndependiente == "TRUE" ~ "Si",
      paisIndependiente == "FALSE" ~ "No",
      TRUE ~ paisIndependiente
    )
  )

# LIMPIEZA
# TIENE MAR
dataSet = dataSet %>% 
  mutate(
    tieneMar = as.character(tieneMar),
    tieneMar = case_when(
      tieneMar == "TRUE" ~ "Si",
      tieneMar == "FALSE" ~ "No",
      TRUE ~ tieneMar
    )
  )

# TRANSFORMACION
# Decadas 2014 - 2023
dataSet = dataSet %>%
  mutate(
    decada = case_when(
      anio >= 2010 & anio <= 2019 ~ 2010,
      anio >= 2020 & anio <= 2029 ~ 2020,
      TRUE ~ anio
    )
  )

# ENRIQUECIMIENTO 
# Creacion de la variable densidadPlobacional = poblacion/areaPais
dataSet = dataSet %>%
  mutate(densidadPoblacional = round(poblacion / areaPais, 2))


# TRANFORMACION
dataSet = dataSet %>%
  select(bandera,
         codigo_ISO,
         nombrePais,
         capitalPais, 
         continente,
         regionPais,  
         subregionPais,
         paisIndependiente, 
         tieneMar, 
         ONU, 
         latitud, 
         longitud, 
         areaPais, 
         poblacion,    
         sueldoMinimo_USD, 
         salarioMinimoPorHora_USD,        
         indicador,          
         dimension,       
         categoria, 
         anio,
         decada, 
         unidad, 
         valorIndicador = valor) 


