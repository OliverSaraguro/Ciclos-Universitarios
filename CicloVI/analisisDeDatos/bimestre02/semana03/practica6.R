
library(readxl)
library(dplyr)
library(ggplot2)
library(lubridate)
library(FactoMineR)

df = read_excel("/Users/oliversaraguro/Downloads/detenidos_2025.xlsx", sheet = 2)

names(df)

df = df %>%
  select(-1, -19, -20, -21, -27, -28, -29, -34, -35)

names(df)

unique(df$tipo)
unique(df$estado_civil)
unique(df$estatus_migratorio)
unique(df$edad)
unique(df$sexo)
unique(df$genero)
unique(df$nacionalidad)
unique(df$autoidentificacion_etnica)
unique(df$nivel_de_instruccion)
unique(df$condicion)
unique(df$movilizacion)
unique(df$tipo_arma)
unique(df$arma)
unique(df$lugar)
unique(df$tipo_lugar)
unique(df$nombre_zona)
unique(df$nombre_subzona)
unique(df$nombre_distrito)
unique(df$nombre_circuito)
unique(df$nombre_subcircuito)
unique(df$nombre_provincia)
unique(df$nombre_canton)
unique(df$nombre_parroquia)
unique(df$presunta_infraccion)



names(df)

# Combina fecha y hora en un nuevo campo de tipo POSIXct
df = df %>%
  mutate(
    hora_real = format(hora_detencion_aprehension, "%H:%M:%S"),
    fecha_hora_detencion = ymd(fecha_detencion_aprehension) + hms(hora_real)
  ) %>%
  select(-fecha_detencion_aprehension, -hora_detencion_aprehension, -hora_real)

unique(df$fecha_hora_detencion)

str(df)

# crear varuiables numericas
df$nivel_instruccion_num <- case_when(
  df$nivel_de_instruccion == "EDUCACION INICIAL" ~ 1,
  df$nivel_de_instruccion == "EDUCACION GENERAL BASICA" ~ 2,
  df$nivel_de_instruccion == "BACHILLERATO" ~ 3,
  df$nivel_de_instruccion == "TERCER NIVEL TECNICO-TECNOLOGICO Y DE GRADO" ~ 4,
  df$nivel_de_instruccion == "CUARTO NIVEL O DE POSGRADO" ~ 5,
  df$nivel_de_instruccion == "SE DESCONOCE" ~ 6,
  df$nivel_de_instruccion == "NO APLICA" ~ 7,
  TRUE ~ NA_real_
)

df$tipo_arma_num <- case_when(
  df$tipo_arma == "NINGUNA" ~ 1,
  df$tipo_arma == "ARMAS BLANCAS (OBJETO CORTANTE O PUNZANTE)" ~ 2,
  df$tipo_arma == "ARMAS DE FUEGO" ~ 3,
  TRUE ~ NA_real_
)


# Numericas 
# Edad, nivel_instruccion_num, tipo_arma_num

# Categoricas 
# tipo, estado_civil, condicion, estatus_migratorio, sexo, genero, nacionalidad,
# nivel_de_instruccion, autoidentificacion_etnica
# movilizacion, tipo_arma, tipo_lugar, nombre_zona, nombre_provincia

# Texto
# arma, lugar, nombre_subzona, nombre_distrito, nombre_circuito, nombre_subcircuito
# nombre_canton, nombre_parroquia, presunta_infraccion

# Tiempo
# fecha_hora_detencion



df$tipo = as.factor(df$tipo)
df$genero = as.factor(df$genero)
df$condicion = as.factor(df$condicion)
df$movilizacion = as.factor(df$movilizacion)
df$tipo_arma = as.factor(df$tipo_arma)


# A
# Modelo de regresión múltiple
modelo <- lm(edad ~ tipo + genero + condicion + movilizacion + tipo_arma + 
               tipo_lugar + nombre_provincia + presunta_infraccion, data = df)

# Resumen del modelo
summary(modelo)





# ANALISIS PCA
# Preparar datos 
df_pca <- df %>% select(edad, nivel_instruccion_num, tipo_arma_num) 

# PCA corregido
pca <- prcomp(df_pca, center = TRUE, scale. = TRUE)

# Resumen
summary(pca)

# Matriz de rotación
print(pca$rotation)

# Datos transformados
pca_data <- as.data.frame(pca$x)

# Agregar edad para colorear
pca_data$edad <- df_pca$edad

# Gráfico PCA con color por edad
ggplot(pca_data, aes(x = PC1, y = PC2, color = edad)) + 
  geom_point(alpha = 0.7) + 
  labs(
    title = "PCA del conjunto de datos",
    x = "Primer componente principal",
    y = "Segundo componente principal",
    color = "Edad"
  ) + 
  theme_minimal()





# ANALISIS CA

sapply(df, function(x) mean(is.na(x) | !nzchar(x)))

# Crear la tabla de contingencia
# Variables: tipo_lugar & tipo_arma
# Para ver si ciertos lugares están más asociados a ciertos tipos de armas.
tabla_contingencia = table(df$tipo_lugar, df$tipo_arma)

print(tabla_contingencia)

# Realizar el analisis de correspondencia
resultado_ca = CA(tabla_contingencia, graph = FALSE)

summary(resultado_ca)


# Visualizar los resultados del Análisis de Correspondencias

# Extraer coordenadas de filas y columnas
fila_coords <- as.data.frame(resultado_ca$row$coord)
columna_coords <- as.data.frame(resultado_ca$col$coord)

# Añadir etiquetas
fila_coords$Etiqueta <- rownames(fila_coords)
columna_coords$Etiqueta <- rownames(columna_coords)

# Renombrar columnas
colnames(fila_coords) <- c("Dim1", "Dim2", "Etiqueta")
colnames(columna_coords) <- c("Dim1", "Dim2", "Etiqueta")

# Crear gráfico
library(ggplot2)

ggplot() + 
  # Puntos azules para las filas (lugares)
  geom_point(data = fila_coords, aes(x = Dim1, y = Dim2), color = "blue", size = 3) + 
  geom_text(data = fila_coords, aes(x = Dim1, y = Dim2, label = Etiqueta),
            color = "blue", vjust = -0.5, hjust = 0.5, size = 3) + 
  
  # Puntos rojos para las columnas (tipos de arma)
  geom_point(data = columna_coords, aes(x = Dim1, y = Dim2), color = "red", size = 4, shape = 17) + 
  geom_text(data = columna_coords, aes(x = Dim1, y = Dim2, label = Etiqueta),
            color = "red", vjust = -0.5, hjust = 0.5, size = 3.5, fontface = "bold") + 
  
  # Etiquetas del gráfico
  labs(
    title = "Análisis de Correspondencias: Tipo de lugar vs Tipo de arma",
    x = "Dimensión 1",
    y = "Dimensión 2"
  ) + 
  
  theme_minimal() +
  theme(
    plot.title = element_text(hjust = 0.5, face = "bold", size = 14),
    axis.title = element_text(face = "bold")
  )





