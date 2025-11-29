##################################################################
# ANÁLISIS DE CORRESPONDENCIAS
##################################################################

################################################
# Ejemplo laptop_data_cleaned_ori 1
################################################
# Analizar la relación entre el tipo de laptop, 
# y el fabricante del procesador gráfico

# Instalar y cargar librerías necesarias
#install.packages("FactoMineR")

install.packages("FactoMineR")
library(FactoMineR)
library(ggplot2)
library(dplyr)

# Cargar y explorar datos
df <- read.csv("laptop_data_cleaned_ori.csv")

head(df)
str(df)
summary(df)
names(df)

# Verificar que no existan datos faltantes
sapply(df,function(x) mean(is.na(x) | !nzchar(x)))

# Crear la Tabla de Contingencia
# Variables analizar: TypeName, Gpu_brand

tabla_contingencia <- table(df$TypeName,df$Gpu_brand)

print(tabla_contingencia)

# Realizar el Análisis de Correspondencias

resultado_ca <- CA(tabla_contingencia,graph = FALSE)

summary(resultado_ca)

# Visualizar los Resultados

# Extraer los resultados del análisis de correspondencias
fila_coords <- as.data.frame(resultado_ca$row$coord)
columna_coords <- as.data.frame(resultado_ca$col$coord)

# Añadir etiquetas
fila_coords$Etiqueta <- rownames(fila_coords)
columna_coords$Etiqueta <- rownames(columna_coords)

# Crear un gráfico de correspondencia de los resultados
ggplot() +
  geom_point(data = fila_coords, aes(x = `Dim 1`, y = `Dim 2`), color = 'blue', size = 3) +
  geom_text(data = fila_coords, aes(x = `Dim 1`, y = `Dim 2`, label = Etiqueta), 
            vjust = -0.5, hjust = 0.5) +
  geom_point(data = columna_coords, aes(x = `Dim 1`, y = `Dim 2`), color = 'red', size = 3) +
  geom_text(data = columna_coords, aes(x = `Dim 1`, y = `Dim 2`, label = Etiqueta), 
            vjust = -0.5, hjust = 0.5) +
  labs(title = 'Análisis de Correspondencias: Tipos de laptops vs marcas GPU',
       x = 'Dimensión 1',
       y = 'Dimensión 2') +
  theme_minimal()


################################################
# Ejemplo laptop_data_cleaned_ori 2
################################################
# Analizar la relación entre la compañía, 
# y el tipo de laptop

library(FactoMineR)
library(ggplot2)
library(dplyr)

# Cargar y explorar datos
df <- read.csv("laptop_data_cleaned_ori.csv")

head(df)
str(df)
summary(df)
names(df)

# Verificar que no existan datos faltantes
sapply(df,function(x) mean(is.na(x) | !nzchar(x)))

# Crear la Tabla de Contingencia
# Variables analizar: TypeName, Gpu_brand

tabla_contingencia <- table(df$Company,df$TypeName)

print(tabla_contingencia)

# Realizar el Análisis de Correspondencias

resultado_ca <- CA(tabla_contingencia,graph = FALSE)

summary(resultado_ca)

# Visualizar los Resultados

# Extraer los resultados del análisis de correspondencias
fila_coords <- as.data.frame(resultado_ca$row$coord)
columna_coords <- as.data.frame(resultado_ca$col$coord)

# Añadir etiquetas
fila_coords$Etiqueta <- rownames(fila_coords)
columna_coords$Etiqueta <- rownames(columna_coords)

# Crear un gráfico de correspondencia de los resultados
ggplot() +
  geom_point(data = fila_coords, aes(x = `Dim 1`, y = `Dim 2`), color = 'blue', size = 3) +
  geom_text(data = fila_coords, aes(x = `Dim 1`, y = `Dim 2`, label = Etiqueta), 
            vjust = -0.5, hjust = 0.5) +
  geom_point(data = columna_coords, aes(x = `Dim 1`, y = `Dim 2`), color = 'red', size = 3) +
  geom_text(data = columna_coords, aes(x = `Dim 1`, y = `Dim 2`, label = Etiqueta), 
            vjust = -0.5, hjust = 0.5) +
  labs(title = 'Análisis de Correspondencias: Tipos de laptops vs marcas GPU',
       x = 'Dimensión 1',
       y = 'Dimensión 2') +
  theme_minimal()




#########################################
# EJERCICIO 3: Tarea en clase sobre CA
#########################################

# Cargar librerías necesarias
library(ggplot2)
library(dplyr)
library(FactoMineR)

# Cargar y explorar datos
df <- read.csv("titanic.csv")

head(df)
str(df)
summary(df)
names(df)

# Limpiar datos

sapply(df,function(x) mean(is.na(x) | !nzchar(x)))

df_clean <- df %>%
  filter(!is.na(Age) & nzchar(Age))

sapply(df_clean,function(x) mean(is.na(x) | !nzchar(x)))

df_clean <- df_clean %>% 
  mutate(
    rango_edad = case_when(
      Age < 13 ~ "Niño",
      Age < 18 ~ "Adolecente",
      Age < 30 ~ "Joven",
      Age < 65 ~ "Adulto",
      TRUE ~ "Adulto Mayor"
    )) %>%
  mutate(
    Pclass = as.factor(Pclass),
    rango_edad = as.factor(rango_edad),
    Parch = as.factor(Parch),
    SibSp = as.factor(SibSp)
  )

summary(df_clean)
str(df_clean)

# Crear la Tabla de Contingencia
# Variables analizar: rango_edad, Pclass

tabla_contingencia <- table(df_clean$rango_edad,df_clean$Pclass)

print(tabla_contingencia)

# Realizar el Análisis de Correspondencias

resultado_ca <- CA(tabla_contingencia, graph = FALSE)

summary(resultado_ca)


# Visualizar los Resultados

# Extraer los resultados del análisis de correspondencias
fila_coords <- as.data.frame(resultado_ca$row$coord)
columna_coords <- as.data.frame(resultado_ca$col$coord)

# Añadir etiquetas
fila_coords$Etiqueta <- rownames(fila_coords)
columna_coords$Etiqueta <- rownames(columna_coords)

# Renombrar las columnas para facilidad de uso
colnames(fila_coords) <- c('Dim1', 'Dim2', 'Etiqueta')
colnames(columna_coords) <- c('Dim1', 'Dim2', 'Etiqueta')


# Crear un gráfico de correspondencia de los resultados
ggplot() +
  geom_point(data = fila_coords, aes(x = `Dim 1` , y = `Dim 2`), color = 'blue', size = 3) +
  geom_text(data = fila_coords, aes(x = `Dim 1` , y = `Dim 2`, label = Etiqueta), vjust = -0.5, hjust = 0.5) +
  geom_point(data = columna_coords, aes(x = `Dim 1` , y = `Dim 2`), color = 'red', size = 3) +
  geom_text(data = columna_coords, aes(x = `Dim 1` , y = `Dim 2`, label = Etiqueta), vjust = -0.5, hjust = 0.5) +
  labs(title = 'Análisis de Correspondencias: Edad vs Clase de boleto',
       x = 'Dimensión 1',
       y = 'Dimensión 2') +
  theme_minimal()
