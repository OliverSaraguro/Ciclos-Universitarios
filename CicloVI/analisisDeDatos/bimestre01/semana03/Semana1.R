
# Variables
x <- 3
y <- 4
z <- x + y

# Presentar
print(z)
z

# Expresiones
booleana <- 8 == 2 ** 3
booleana

# Vectores
v1 <- c(2,7,4)
v1[2]

v2 <- c(5,9,3)

v3 <- v1 + v2
v3

v4 <- c(1:10)
v4

v5 <- c('Hola','como','estas')
v5


# Configuracion del directorio de trabajo
getwd()
setwd("/Users/oliversaraguro/Desktop/Ciclo VI/AnalisisDeDatos/bimestre01/semana03")



# Carga de datos desde CSV
?read.table()
datos <- read.csv('titanic.csv', sep=',')  
datos



# Cdata# Carga de datos desde Ecxel
install.packages("rJava")
library(rJava)

install.packages('xlsx')
library(xlsx)
?read.xlsx
datosEx <- read.xlsx("titanic.xlsx", sheetIndex = 1)


# Inspeccion de Datos 
print(datos)
datos
head(datos)
str(datos)
summary(datos)
dim(datos)
class(datos)
mode(datos)


# Seleccionar o consultar datos 
x1 <- datos$Name
x2 <- datos['Name']
class(x1)
class(x2)

x3 <- datos[c('Name', 'Age')]
x4 <- datos[!is.na(datos$Age) & datos$Age > 65, c('Name', 'Age')]

x5 <- datos[!is.na(datos$Age) & datos$Age > 65,]

?subset
x6 <- subset(datos, !is.na(Age) & Age > 65, c(Name, Sex, Age))

# Columnas que se quieren de la 1 a la 4
x7 <- subset(datos, !is.na(Age) & Age > 65, c(1:4))

# Columnas que no se quieren de la 1 a la 4
x8 <- subset(datos, !is.na(Age) & Age > 65, -c(1:4))

# Estadisticas Basicas
?mean
?median
mean(datos$Fare) # Media aritmética: Promedio
median(datos$Fare) # Valor del centro 
max(datos$Fare)
min(datos$Fare)
sum(datos$Fare)
sd(datos$Fare) # Desviacion Estandar
var(datos$Fare) # Varianza
range(datos$Fare) # Rango
diff(range(datos$Fare)) # Saca la diferencia entre el rango

mean(datos$Fare, na.rm = TRUE) # Remover los nulos en el segundo parametro

# AGREGAR VARIABLES DERIVADAS 
datos$MayorEdad <- datos$Age >= 18


# Exportar datos 
write.table(datos, 'titani_new.csv', sep = ',', row.names = FALSE)
write.table(datos, 'titani_new1.csv')
