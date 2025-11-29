rm = (list = ls())
# CARGAR 
getwd()
setwd("/Users/oliversaraguro/Desktop/Ciclo VI/AnalisisDeDatos/bimestre01/semana03")

datos <- read.csv("titanic.csv", sep = ",", quote = "\"", dec = ".")\


###########
# JOINS
###########
library("dplyr")

datos %>% distinct(Embarked)

puertos = data.frame(Embarked = c("C", "Q", "S", ""),
                     Puerto = c("Cherbourg", "Queenstown", "Southampton", "Indetermindo"))

resultado = datos %>% inner_join(puertos, by = "Embarked")
resultado = datos %>% inner_join(puertos)

estaturas = data.frame( Id = c(1:891),
                        Estatura = sample(150:200, size = 891, replace = TRUE))
# replace -> para que el valor se pueda repetir
# size -> total de veces a repetir

resultado = resultado %>% inner_join(estaturas, by = join_by(PassengerId == Id))


tarifas = data.frame(desde = c(0, 30, 100),
                     hasta = c(29.99, 99.99, 9999.99),
                     TipoTarifa = c("Baja", "Media", "Alta"))
resultado = resultado %>%
  inner_join(tarifas, by = join_by(between(Fare, desde, hasta)))
# between -> permite valores esten dentro de el rango 
  
resultado = resultado %>%
  select(-c(desde, hasta))

rm = (list = ls())
# LEER JSON
getwd()
setwd("/Users/oliversaraguro/Desktop/CicloVI/AnalisisDeDatos/bimestre01/semana05")
getwd()

install.packages("jsonlite")
library("jsonlite")

libros = fromJSON("LibrosPearson.json")



###############
# SCRAPING
###############
getwd()

install.packages("rvest")
library("rvest")
library("dplyr")

url <- "https://es.wikipedia.org/wiki/Provincias_de_Ecuador"
pagina = read_html(url)

class(pagina)

tablas <- html_table(pagina)

tablaProvincia = tablas[[1]]

names(tablaProvincia)

provincias = tablaProvincia%>%
  select(Provincia, Poblacion = 5, Area = 2, Densidad = 8, Cantones = 9)

str(provincias)

# gsub -> permite reemplazar la cadena por otro valor\
x = substr(provincias$Poblacion[1], start = 4, stop = 4)
x

provincias = provincias%>%
  mutate(Poblacion = as.integer(gsub(x, "", Poblacion)))


provincias = provincias%>%
  mutate(Area = as.integer(gsub(x, "", Area)),
         Densidad = as.numeric(gsub(",",".", Densidad)))

##############

url2 <- "https://books.toscrape.com"
pagina2 = read_html(url2)  

nodos <- pagina2 %>%
  html_elements(".product_pod h3 a")

nodos[[1]]

titulos = nodos %>% 
  html_attr("title")

enlaces = nodos %>% 
  html_attr("href")

nodos <- pagina2 %>%
  html_elements(".price_color")

nodos <- nodos%>%
  html_text2()


libros = data.frame(Tiulo = titulos, Enlace = enlaces, Precio = nodos)

libros = libros %>%
  mutate(Precio = as.numeric(gsub("£", "", Precio)))

str(libros)



#########
# 2da forma
########

base = pagina2 %>%
  html_elements(".product_pod")


titulos = base%>%
  html_element("h3 a") %>%
  html_attr("title")


enlaces = base%>%
  html_element("h3 a") %>%
  html_attr("href")

precios = base%>%
  html_element("div p") %>%
  html_text2()

imagenes = base%>%
  html_element(".image_container a img") %>%
  html_attr("src")

libros2 = data.frame(Tiulo = titulos, Enlace = enlaces, Precio = precios, Imagen = imagenes)



##########################
### Actividad en Clase ###
##########################

url3 <- "https://www.alphaeditorialcloud.com/library/search/Data%20science"

pagina3 = read_html(url3)

informacion = pagina3 %>%
  html_elements(".Issue-container")


titulos = informacion %>%
  html_element("h2") %>%
  html_text2()

fecha = informacion %>%
  html_elements(".Issue-publicationDate") %>%
  html_text2()

autores = informacion %>%
  html_elements(".Issue-author") %>%
  html_text2()

precios = informacion %>%
  html_elements(".Issue-price") %>%
  html_text2() 

imagenes = informacion %>%
  html_elements("img") %>%
  html_attr("data-src") 

imagenes <- imagenes[!is.na(imagenes)]



informacionLibros <- data.frame(TituloLibro = titulos, Fecha = fecha, Autor = autores, Precio = precios, URL = imagenes)
str(informacionLibros)

informacionLibros = informacionLibros %>%
  mutate(Precio = gsub(" COP", "", Precio),
         Precio = gsub(",", "", Precio),
         Precio = gsub("\\$ ", "", Precio),
         Precio = gsub(" ", "", Precio),
         Precio = as.numeric(Precio))






  