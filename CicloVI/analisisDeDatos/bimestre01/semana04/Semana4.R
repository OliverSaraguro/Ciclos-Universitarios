# DIA MARTES
# Cargar Datos 
getwd()
setwd("/Users/oliversaraguro/Desktop/Ciclo VI/AnalisisDeDatos/bimestre01/semana03")

datos <- read.csv("titanic.csv", sep = ",", quote = "\"", dec = ".")
head(datos)
str(datos)
summaary(datos)
dim(datos)

# Selección y Proyección
# Obtener nombre, genero, edad, estado de supervivencia, puerto de embarque
# de pasajeros de 3era clase menores a 40 años

# 1 OPCION
r <- datos[datos$Pclass == 3 & datos$Age == 40 & !is.na(datos$Age), 
           c("Name", "Sex", "Age", "Survived", "Embarked")]
r

# 2 OPCION
r1 <- subset(datos, Pclass == 3 & Age == 40 & !is.na(Age), 
             c(Name, Sex, Age, Survived, Embarked))
r1

# 3 OPCION 
install.packages("dplyr")
library("dplyr")

r2 <- datos %>%
  filter(Pclass == 3 & Age < 40 & !is.na(Age)) %>%
  select(Nombre = Name, Genero = Sex, Edad = Age, Supervivencia = Survived, PuertoEmbarque = Embarked) %>%
  arrange(desc(Supervivencia), Nombre) %>% # Ordenamiento
  mutate(RangoEdad = if_else(Edad <= 13, "Niño", if_else(Edad >= 25, "Joven", "Adulto"))) %>% #Agregar Columna
  mutate(NombrePuerto = case_when(PuertoEmbarque == "C" ~ "Cherbourg",
                                  PuertoEmbarque == "Q" ~ "Queenstown",
                                  PuertoEmbarque == "S" ~ "Southamton",
                                  TRUE ~ "DESCONOCIDO")) %>%
  mutate(Genero = if_else(Genero == "female","Mujer","Hombre")) %>%
  mutate(PromedioEdad = case_when(Edad > mean(Edad) ~ "Arriba",
                                  Edad > mean(Edad) ~ "Debajo",
                                  TRUE ~ "Promedio"))
r2  


# DIA MIERCOLES 
# Agrupamiento
datos %>%
  summarise(TotalPasajeros = n(), 
            SumaTarifas = sum(Fare), 
            TarifaPromedio = mean(Fare),
            EdadMinima = min(Age, na.rm = TRUE),
            EdadMaxima = max(na.omit(Age)),
            PuertosSalida = n_distinct(Embarked[Embarked != ""]))

#  TarifaMinima = min(Fare[Fare != 0], na.rm = TRUE))
datos %>% 
  mutate(Fare = if_else(Fare == 0, NA, Fare)) %>%
  group_by(Pclass) %>%
  summarise(TotalPasajeros = n(),
            EdadPromedio = mean(Age, na.rm = TRUE),
            TarifaMaxima = max(Fare, na.rm = TRUE),
            TarifaMinima = min(Fare, na.rm = TRUE),
            PasajerosMujeres = sum(Sex == "female"),
            PasajerosHombres = sum(Sex == "male"),
            PorcentajeMujeres = PasajerosMujeres / TotalPasajeros * 100,
            PorcentajeHombres = PasajerosHombres / TotalPasajeros * 100) %>%
  filter(PorcentajeMujeres > 30)

r5 = datos %>%
  filter(!is.na(Age)) %>%
  group_by(Age) %>%
  summarise(TotalPasajeros = n()) %>%
  filter(TotalPasajeros > 10) %>%
  arrange(desc(TotalPasajeros))

r6 = datos %>%
  filter(!is.na(Age)) %>%
  group_by(Age) %>%
  summarise(TotalPasajeros = n()) %>%
  slice_max(order_by = TotalPasajeros, n = 3)



