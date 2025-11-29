
library(dplyr)
library(caret)
library(e1071)

##############################
# Clasificacion Bayesiana 
# DataSet: Penguins_Species
##############################

df = read.csv("Penguins_Species.csv")

head(df)
names(df)
str(df)

# Seleccionar variables relevantes y eliminar valores faltantes 
df_clean = df %>%
  select(sex, culmen_length_mm, culmen_depth_mm, flipper_length_mm, body_mass_g)

# Estadísticas de valores faltantes (nulos o vacíos)
sapply(df, function(x) sum(is.na(x) | !nzchar(x))) # Conteo
sapply(df, function(x) mean(is.na(x) | !nzchar(x))) # Proporción

# Limpieza de datos: eliminar filas con sexo faltante o "."
df_clean <- df %>%
  filter(!is.na(sex) & sex != ".")

# Verificar nuevamente valores faltantes
sapply(df_clean, function(x) sum(is.na(x) | !nzchar(x)))

# Convertir variable categórica a factor
df_clean$sex <- as.factor(df_clean$sex)

# 2 Parte
# Dividir los datos de entrenamiento (80%) y de prueba (20%)
set.seed(88)
train_index = createDataPartition(df_clean$sex,
                                  p = 0.8,
                                  list = FALSE)

train_data = df_clean[train_index, ] # Datos de entrenamiento
test_data = df_clean[-train_index, ] # Datos de prueba


# Ajustar el modelo de arbol de decision
nb_model = naiveBayes(sex ~ culmen_depth_mm  + body_mass_g,
                      data = train_data)

print(nb_model)


# Evaluar el modelo
nb_pred = predict(nb_model, test_data)

# Matriz de confusion
conf_matrix = confusionMatrix(nb_pred,
                              test_data$sex,
                              positive = "MALE")

print(conf_matrix)

