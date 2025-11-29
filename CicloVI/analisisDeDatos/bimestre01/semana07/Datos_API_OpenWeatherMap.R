# Desarrollo del ejercicio propuesto sobre obtención de datos
# mediante la API de la plataforma Open Weather Map

# EXTRACCIÓN DE DATOS
# -------------------------

# Cargar librerías
library(httr)
library(jsonlite)
library(dplyr)

# Definir la URL base y parámetros para la API
url_base <- "https://api.openweathermap.org/data/2.5/forecast"

parametros <- list(lat = -4, 
                   lon = -79.2,
                   appid = "4afd29be646ee3c7027bea84dc25ce84",
                   units = "metric",
                   lang = "es")

# Realizar la solicitud GET
respuesta <- GET(url_base,query = parametros)


# Verificar el estado de la respuesta (se espera status HTTP 200)
status_code(respuesta)

# Si la solicitud fue exitosa, extraer y procesar los datos

# Extraer el contenido del response (en formato JSON)
contenido_json <- content(respuesta,"text")

contenido_R <- fromJSON(contenido_json,flatten = TRUE)

# Se extrae el 4to elemento de la lista que contiene el data frame
# con los datos del pronóstico.
datos_tiempo <- contenido_R[[4]]

# Mostrar los datos
head(datos_tiempo)
str(datos_tiempo)
