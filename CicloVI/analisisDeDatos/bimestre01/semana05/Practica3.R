# Práctica 3: Extraer datos mediante web scraping
# Por Oliver Roberto Saraguro Remache

######################
##### Practica 3 #####
######################

install.packages("rvest")
library("rvest")
library("dplyr")

# 1ER EJERCICIO

url <- "https://www.worldometers.info/world-population/population-by-country/"

# Leemos el contenido HTML de la página
pagina = read_html(url)

# Obtenemos la informacion de toda la tabla de la pagina 
tabla = html_table(pagina)

# Asignamos la tabla 1
tabla = tabla[[1]]

# Nombres de columnas de la tabla 
names(tabla)

# Seleccionamos las columnas que nescecitamos
resultado1 = tabla %>%
  select(Pais = 2, Poblacion = 3, SuperficieTerrestre = 7, Migrantes = 8, EdadPromedio = 10)

# Revisión de la estructura del resultado
str(resultado1)

# Hacemos su respectiva limpieza 
resultado1 = resultado1%>%
  mutate(Poblacion = as.numeric(gsub(",","", Poblacion)),
         SuperficieTerrestre = as.numeric(gsub(",","", SuperficieTerrestre)),
         Migrantes = gsub(",","", Migrantes),
         Migrantes = gsub("−","-", Migrantes),
         Migrantes = as.numeric(Migrantes))


# 2DO EJERCICIO

url2 <- "https://www.metacritic.com/browse/game/pc/all/current-year/metascore/?platform=pc&page=1"

# Leemos el contenido HTML de la página
pagina2 = read_html(url2)

# Extraemos la sección principal de la página
base = pagina2 %>%
  html_elements(".c-productListings_grid")

# Extracción de títulos, fechas y descripciones
titulos = base%>%
  html_elements("h3 span:nth-child(2)") %>%
  html_text2()

fechas = base%>%
  html_elements(".u-text-uppercase") %>%
  html_text2()

descripciones = base%>%
  html_elements(".c-finderProductCard_description") %>%
  html_text2()

# Creación del data frame resultado2
resultado2 = data.frame(Titulo = titulos, Fecha = fechas, Descripcion = descripciones)

# Revisión de la estructura del resultado
str(resultado2)


