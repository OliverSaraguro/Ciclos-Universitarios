############################
# SEMANA 6
# TAREA EN CLASE 
# Extraccion mediante API'S
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

contenidoR$weather[[1]]$description

# Sacamos la descripcion dentro del data.frame de la variable weather 
clima = sapply(contenidoR$weather, function(df) df$description)

# Agregamos la variable al data.frame
contenidoR = contenidoR %>%
  mutate(clima = clima)


# Seleccionamos las columnas que nescecitemos
contenidoR = contenidoR %>% 
  select(TemperaturaActual = main.temp,
         SensacionTermica = main.feels_like,
         TemperaturaMinima = main.temp_min,
         TemperaturaMaxima = main.temp_max,
         HumedadRelativa =main.humidity,
         VelocidadViento = wind.speed,
         Clima = clima
      )

str(contenidoR)


