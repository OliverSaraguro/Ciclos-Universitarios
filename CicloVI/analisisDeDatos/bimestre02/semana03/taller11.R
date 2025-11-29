library(dplyr)
library(FactoMineR)
library(ggplot2)

getwd()
setwd("/Users/oliversaraguro/Desktop/CicloVI/analisisDeDatos/dataset")


df = read.csv("titanic.csv")
str(df)
head(df)
summary(df)
names(df)

# Añadir variable: rango de edad
df = df %>%
  filter(!is.na(Age)) %>% #Filtramos filas con valores nulos
  mutate(
    rango_edad = case_when(
    Age < 13 ~ "Niño",
    Age >= 13 & Age < 18 ~ "Adolescente",
    Age >= 18 & Age < 30 ~ "Joven",
    Age >= 30 & Age < 65 ~ "Adulto",
    Age >= 65 ~ "Adulto mayor"
  )
)

# convertir a factores
df$Pclass = as.factor(df$Pclass)
df$rango_edad = as.factor(df$rango_edad)

# Crear la tabla de contingencia
# Variables:
tabla_contingencia = table(df$rango_edad, df$Pclass)
print(tabla_contingencia)

# Realizar el analisis de correspondencia
resultado_ca = CA(tabla_contingencia, graph = FALSE)
summary(resultado_ca)

# Visualizar los resultados
# Extraer los resultados del analisis de correspondencias
fila_coords = as.data.frame(resultado_ca$row$coord)
columna_coords = as.data.frame(resultado_ca$col$coord)

# Anadir etiquetas
fila_coords$Etiqueta = rownames(fila_coords)
columna_coords$Etiqueta = rownames(columna_coords)

# Renombrar columnas para facilidad de uso
colnames(fila_coords) = c("Dim1", "Dim2", "Etiqueta")
colnames(columna_coords) = c("Dim1", "Dim2", "Etiqueta")

# Crear un grafico de dispersion de los resultados
ggplot() +
  geom_point(data = fila_coords, aes(x = Dim1, y = Dim2), color = "blue", size = 3) +
  geom_text(data = fila_coords, aes(x = Dim1, y = Dim2, label = Etiqueta),
            vjust = -0.5, hjust = 0.5) +
  geom_point(data = columna_coords, aes(x = Dim1, y = Dim2), color = "red",
             size = 3) +
  geom_text(data = columna_coords, aes(x = Dim1, y = Dim2, label = Etiqueta),
            vjust = -0.5, hjust = 0.5) +
  labs(title = "Analisis de Correspondencias",
       x = "Dimension 1",
       y = "Dimension 2") +
  theme_minimal()

