############################
# SEMANA 7
# TAREA EN CLASE 
# LIMPIEZA DE DATOS 
############################

install.packages("httr")
library("httr")
library(RMySQL)
library("jsonlite")
library("dplyr")

url_base = "https://api.openweathermap.org/data/2.5/forecast"

latitud = -3.98661
longitud = -79.35763
apikey = "4afd29be646ee3c7027bea84dc25ce84"

url = paste0(url_base,
             "?lat=", latitud,
             "&lon=", longitud,
             "&appid=", apikey)
respuesta = GET(url)

class(respuesta)

status_code(respuesta) # Verificamos el estado

# Guardamos el contenido desde content que se creo en respuesta en formato JSON
contenido_json = content(respuesta, "text") 


contenidoR = fromJSON(contenido_json, flatten = TRUE)
class(contenidoR)

# Obtenemos el contenido de la posicion 4
contenidoR = contenidoR[[4]]
str(contenidoR)



# LIMPIEZA DE DATOS
# Tratamiento de valores faltantes 
# NA en rain.3h significa nivel 0
datos_f = contenidoR %>%
  mutate(rain.3h = ifelse(is.na(rain.3h), 0, rain.3h))


# TRANSFORMACION DE DATOS
# Reducir la dimensionalidad y solo dejar variable relevante 
# Hora, temp min, temp max, nivel de lluvia, tipo de clima

# Sacamos la descripcion dentro del data.frame de la variable weather 
class(datos_f$weather)

datos_f = datos_f %>%
  mutate(tipoClima = sapply(weather, function(df) df$description))

datos_f = datos_f %>%
  select(dt_txt, main.temp_min, main.temp_max, rain.3h, tipoClima)

str(datos_f)


datos_f = datos_f %>%
  mutate(hora = as.POSIXct(dt_txt, format = "%Y-%m-%d %H:%M:%S"))

# ENRIQUECIMIENTO DE DATOS 
# Agregar la temperatura promedio 
datos_f = datos_f %>%
  mutate(tempPromedio = (main.temp_min + main.temp_max) / 2)

         