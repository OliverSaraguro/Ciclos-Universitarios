
############################
# SEMANA 6
# Extraccion mediante API'S
############################

install.packages("httr")
library("httr")
library("jsonlite")
library("dplyr")

url_base = "https://api.worldbank.org/v2/country"

region = "CLA"
nivelIngresos = "UMC"
formato = "json"
cantObeservaciones = 1000 

url = paste0(url_base,
             "?region=", region,
             "&incomeLevel=", nivelIngresos,
             "&format=", formato,
             "&per_page=", cantObeservaciones)


respuesta = GET(url)

# Otra forma de llamar
parametros = list(
  region = "CLA",
  incomeLevel = "UMC",
  format = "json",
  per_page = 1000
)

respuesta = GET(url_base, query = parametros)



class(respuesta) # Verifica que tipo creo

status_code(respuesta) # Verificamos el estado

# Guardamos el contenido desde content que se creo en respuesta en formato JSON
contenido_json = content(respuesta, "text", encoding = "UTF-8") 

# Convertir a JSON
contenidoR = fromJSON(contenido_json, flatten = TRUE)

paises = contenidoR[[2]]

paises = paises %>%
  select(
    id, 
    iso2Code, 
    region = region.value, 
    capital = capitalCity, 
    nivel_ingreso = incomeLevel.value, 
    tipo_financiamiento = lendingType.value, 
    longitud = longitude, 
    latitud = latitude)

str(paises)

paises = paises %>%
  mutate(longitud = as.numeric(longitud),
         latitud = as.numeric(latitud))

