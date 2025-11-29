########################################################
# ANÁLISIS DE COMPONENTES PRINCIPALES
#######################################################

##################################################################
# Ejemplo sobre dataset de PAISES
##################################################################

library(dplyr)
library(ggplot2)
setwd("/Users/oliversaraguro/Desktop/CicloVI/analisisDeDatos/dataset")

# Cargar y explorar datos

df <- read.csv("Country-data.csv")

head(df)
summary(df)
names(df)

# Validar si hay valores faltantes
sapply(df, function(x) mean(is.na(x) | ! nzchar(x)))

# Calcular PCA sobre varibles continuas
df_pca <- df %>% select(-1)     # Excluye la varfiable "country"

pca <- prcomp(df_pca, center = TRUE, scale. = TRUE)

# Ver la varianza explicada (importancia de componentes)
summary(pca)

plot(pca)

# Ver la matriz de rotación
print(pca$rotation)

# Convertir los datos de PCA a un data frame
pca_data <- as.data.frame(pca$x)

# Añadir las etiquetas de los paises
pca_data$Pais <- df$country

# Crear un gráfico de dispersión para analizar los paises
# en el contexto de las dos primeras componentes PC1 y PC2
ggplot(pca_data, aes(x = PC1, y = PC2, label = Pais)) +
  geom_point() +
  geom_text(vjust = -0.5, hjust = 0.5) +
  labs(title = "PCA del Conjunto de Datos Paises",
       x = "Primer Componente Principal",
       y = "Segundo Componente Principal") +
  theme_minimal()

##################################################################
# Ejemplo sobre dataset laptops
##################################################################

# Cargar librerías necesarias
library(dplyr)
library(ggplot2)

# Cargar, explorar, y limpiar datos
df <- read.csv("laptop_data_cleaned.csv", sep=";")

str(df)
summary(df)
names(df)

# Corregir tipos de datos
df <- df %>%
  mutate ( 
    Price = as.numeric(gsub(",", ".", Price)),
    Weight = as.numeric(gsub(",", ".", Weight)),
    Ppi = as.numeric(gsub(",", ".", Ppi))
  )


# Seleccionar solo variables continuas
df_pca <- df %>%
  select(Ram,Weight,Price,Ppi,HDD,SSD)

# Validar si hay valores faltantes
sapply(df_pca, function(x) mean(is.na(x) | ! nzchar(x)))


# Calcular PCA
pca <- prcomp(df_pca, center = TRUE, scale. = TRUE)

summary(pca)

plot(pca)

# Ver la matriz de rotación
print(pca$rotation)

# Convertir los datos de PCA a un data frame y agregar el tipo de laptop
pca_data <- as.data.frame(pca$x)

names(df)

pca_data$TypeName <- df$TypeName

str(pca_data)

# Crear un gráfico de dispersión para analizar los tipos de laptop
# en el contexto de las dos primeras componentes PC1 y PC2
ggplot(pca_data, aes(x = PC1, y = PC2, colour = TypeName)) +
  geom_point() +
  labs(title = "PCA del Conjunto de Datos de Laptops",
       x = "Primer Componente Principal",
       y = "Segundo Componente Principal") +
  theme_minimal()


#########################################
# EJERCICIO 2: Tarea en clase sobre PCA
#########################################

# Cargar librerías necesarias
library(dplyr)
library(ggplot2)

# Cargar, explorar, y preparar datos
df <- read.csv("Penguins_Species.csv")

# Validar si hay valores faltantes
sapply(df, function(x) mean(is.na(x) | ! nzchar(x)))

# Eliminar valores faltantes de variables numéricas
df_clean <- df %>%
  filter(!(is.na(culmen_length_mm) | ! nzchar(culmen_length_mm)))

sapply(df_clean, function(x) mean(is.na(x) | ! nzchar(x)))

# Eliminar atípicos dados que son datos erróneos
df_clean <- df_clean %>%
  filter(flipper_length_mm < 500 & flipper_length_mm > 0)

# Calcular PCA
pca <- prcomp(df_clean[,-c(5)], center = TRUE, scale. = TRUE)

summary(pca)

plot(pca)

# Ver la matriz de rotación
print(pca$rotation)

# Convertir los datos de PCA a un data frame
pca_data <- as.data.frame(pca$x)

# Añadir las etiquetas de los géneros
pca_data$sex <- df_clean$sex

# Crear un gráfico de dispersión de las dos primeras componentes principales
ggplot(pca_data, aes(x = PC1, y = PC2, colour = sex)) +
  geom_point() +
  labs(title = "PCA del Conjunto de Datos \"Pingüinos\"",
       x = "Primer Componente Principal",
       y = "Segundo Componente Principal") +
  theme_minimal()
