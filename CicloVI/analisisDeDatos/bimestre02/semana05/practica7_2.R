
############################
# Clasificación
# Arboles de decisión
############################

# Cargar librerías
library(readxl)
library(dplyr)
library(caret)
library(rpart)
library(rpart.plot)

getwd()
setwd("/Users/oliversaraguro/Desktop/CicloVI/analisisDeDatos/dataset")
df = read_excel("detenidos_2025.xlsx", sheet = 2)

names(df)
str(df)

df_clean = df %>%
  select(sexo, nivel_de_instruccion, movilizacion, condicion, presunta_infraccion, tipo_lugar)

names(df_clean)
str(df_clean)

df_clean = df_clean %>%
  filter(sexo == "HOMBRE" | sexo == "MUJER")

sapply(df_clean, function(x) mean(is.na(x) | !nzchar(x))) # Media de valores faltantes y nulos

unique(df_clean$tipo_lugar)

df_clean$sexo = as.factor(df_clean$sexo)
df_clean$nivel_de_instruccion = as.factor(df_clean$nivel_de_instruccion)
df_clean$movilizacion = as.factor(df_clean$movilizacion)
df_clean$condicion = as.factor(df_clean$condicion)
df_clean$tipo_lugar = as.factor(df_clean$tipo_lugar)
df_clean$presunta_infraccion = as.factor(df_clean$presunta_infraccion) 


set.seed(88)
train_index = createDataPartition(df_clean$sexo,
                                  p = 0.8,
                                  list = FALSE)

train_data = df_clean[train_index, ]

test_data = df_clean[-train_index, ]

model = rpart(sexo ~ nivel_de_instruccion + movilizacion + condicion + 
                presunta_infraccion + tipo_lugar,
            data = train_data,
            method = "class")
summary(model)

# Visualizar el arbol de decision
rpart.plot(model, extra = 104)

# EVALUAR EL MODELO
# Predicciones en el conjunto de prueba
predictions <- predict(model, test_data, type = "class")

# Matriz de confusión
conf_matrix <- confusionMatrix(predictions,
                               test_data$sexo,
                               positive = "HOMBRE")
print(conf_matrix)



