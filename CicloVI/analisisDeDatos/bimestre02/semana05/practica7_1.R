
# Cargar librerías
library(readxl)
library(dplyr)
library(ggplot2)
library(caret)

getwd()
df = read_excel("detenidos_2025.xlsx", sheet = 2)

names(df)

# seleccionamos las variables nescesarias
df_clean = df %>%
  select(sexo, estatus_migratorio, movilizacion, condicion, nivel_de_instruccion, 
         presunta_infraccion)

names(df_clean)
str(df_clean)

df_clean = df_clean %>%
  filter(sexo == "HOMBRE" | sexo == "MUJER")

df_clean = df_clean %>%
  mutate(sexo = case_when(
    sexo == "HOMBRE" ~ "1",
    sexo == "MUJER" ~ "0"
  ))

df_clean$sexo = as.numeric(df_clean$sexo)

############################
# Regresión logística
############################

df_clean$sexo = as.factor(df_clean$sexo)
df_clean$estatus_migratorio = as.factor(df_clean$estatus_migratorio)
df_clean$movilizacion = as.factor(df_clean$movilizacion)
df_clean$condicion = as.factor(df_clean$condicion)
df_clean$nivel_de_instruccion = as.factor(df_clean$nivel_de_instruccion)

# Funcion que me permite contar cuantas observacion tiene cada tipo de infraccion
# para solo dejar a las que tienen mas de 100
contar_presuntas_infracciones <- function(df) {
  df %>%
    group_by(presunta_infraccion) %>%
    summarise(Frecuencia = n()) %>%
    arrange(desc(Frecuencia))
}

x = contar_presuntas_infracciones(df_clean)

agrupar_infracciones <- function(df, umbral = 100) {
  freqs <- table(df$presunta_infraccion)
  frecuentes <- names(freqs[freqs > umbral])
  
  df$presunta_infraccion <- as.character(df$presunta_infraccion)
  df$presunta_infraccion[!(df$presunta_infraccion %in% frecuentes)] <- "OTROS"
  df$presunta_infraccion <- as.factor(df$presunta_infraccion)
  
  return(df)
}

df_clean <- agrupar_infracciones(df_clean)

x = df_clean %>%
  count(presunta_infraccion, sort = TRUE)

# Dividir los Datos en Conjuntos 80% entrenamiento, 20% prueba,
set.seed(88)
train_index = createDataPartition(df_clean$sexo,
                                  p = 0.8,
                                  list = FALSE)

train_data = df_clean[train_index, ] # Datos de entrenamiento

test_data = df_clean[-train_index, ]  # Datos de prueba

# Ajustar el Modelo de Regresión Logística
# Variables dependiente (a predecir): sexo
model = glm(sexo ~ estatus_migratorio + movilizacion + condicion + 
              nivel_de_instruccion + presunta_infraccion,
            data = train_data,
            family = binomial)

# Resumen del modelo
summary(model)
model$coefficients

# EVALUAR EL MODELO
# Predecir en el conjunto de prueba
predictions <- predict(model, test_data, type = "response")

# Convertir probabilidades a etiquetas binarias
predicted_classes = ifelse(predictions > 0.5, 1, 0)

# Matriz de confusión
conf_matirx = confusionMatrix(factor(predicted_classes),
                              test_data$sexo,
                              positive = "1")

conf_matirx

# Visualizar

test_data$predicted_prob <- predictions

# Convertir sexo en factor con etiquetas legibles
test_data$sexo_factor <- factor(test_data$sexo,
                                levels = c(0, 1),
                                labels = c("Mujer", "Hombre"))

# Filtrar los 10 delitos más frecuentes
top_delitos = test_data %>%
  group_by(presunta_infraccion) %>%
  summarise(n = n()) %>%
  arrange(desc(n)) %>%
  slice(1:10) %>%
  pull(presunta_infraccion)

# Filtrar solo esos delitos
test_top <- test_data %>%
  filter(presunta_infraccion %in% top_delitos)

# Graficar
ggplot(test_top, aes(x = presunta_infraccion, y = predicted_prob, fill = sexo_factor)) +
  geom_boxplot(alpha = 0.7, outlier.size = 0.5) +
  labs(title = "Probabilidad Predicha de ser Hombre por Infracción (Top 10)",
       x = "Presunta Infracción",
       y = "Probabilidad Predicha",
       fill = "Sexo real") +
  theme_minimal() +
  coord_flip() +  # 🔁 Invierte los ejes para mejor lectura
  theme(plot.title = element_text(size = 14),
        axis.text.y = element_text(size = 9),
        legend.position = "bottom")

