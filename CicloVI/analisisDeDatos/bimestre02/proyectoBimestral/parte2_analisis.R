getwd()


df_analisis = read.csv("df_union_fn.csv")
str(df_analisis)
df_analisis = df_analisis %>%
  rename()

########################################
# Clasificacion de variables 
# Numericas, categoricas y bimodales 
########################################
unique(df_analisis$indicador)
# Numericas
# latitud, longitud, areaPais, sueldoMinimo_USD, salarioMinimoPorHora_USD, anio
# valorIndicador, pib_per_capita, poblacion, pib_total, desempleo

# Categoricas
# regresion logistica -> indcador
# bandera, codigo_ISO, nombrePais, capitalPais, continente, regionPais, subregionPais
# paisIndependiente, tieneMar, ONU, indicador, dimension, categoria, unidad

# Bimodales
# decada

# Variable a predecir: valor indicador.
# Variables que ayudarán: nombrePais, sueldoMinimo_USD, categoría, anio, 
# población, desempleo, Pib_total

##############################
# Regresion logistica
##############################
library(dplyr)
library(ggplot2)
library(caret)
library(lattice)

head(df_analisis)
names(df_analisis)
str(df_analisis)

unique(df_clean$indicador)

# Seleccionar variables relevantes y eliminar valores faltantes 
df_clean = df_analisis %>%
  select(indicador, categoria, sueldoMinimo_USD, poblacion, desempleo., pib_per_capita, anio)

# Seleccionamos lo 2 indicadores que tengan mas casos
# Victims of serious assault => 0           
# Violent offences => 1
table(df_clean$indicador)
df_clean <- df_clean %>%
  filter(indicador != "Victims of sexual violence")

# Reemplazar los valores
df_clean$indicador <- ifelse(df_clean$indicador == "Victims of serious assault", 0, 1)
table(df_clean$indicador)

# Convertir a factor
df_clean$indicador= as.factor(df_clean$indicador)
df_clean$categoria= as.factor(df_clean$categoria)
str(df_clean)

# Porcentaje de NAs por columna
sapply(df_clean, function(x) mean(is.na(x)))

# 2 PARTE
# Dividir los datos de entrenamiento (80%) y de prueba (20%)
set.seed(88)
train_index = createDataPartition(df_clean$indicador,
                                  p = 0.8,
                                  list = FALSE)

train_data = df_clean[train_index, ] # Datos de entrenamiento
test_data = df_clean[-train_index, ] # Datos de prueba

# Ajustar el modelo de arbol de decision
model = glm(indicador ~ sueldoMinimo_USD + poblacion + desempleo.+ pib_per_capita + anio,
              data = train_data,
              family = "binomial")


summary(model)
model$coefficients

# Evaluar modelo 
# Predecir el conjunto de pruebas 
prediction = predict(model, test_data, type = "response")

# Convertir probabilidades a etiquetas binarias 
predicted_classes = ifelse(prediction > 0.5, 1, 0)

# Matris de confusion 
conf_matrix = confusionMatrix(factor(predicted_classes),
                              test_data$indicador,
                              positive = "1")
# Ver matriz de confusion 
# y las metricas de evaluacion
conf_matrix

# Visualizar los resultados 
# Añadir las predicciones al conjunto de pruebas 
test_data$predicted_rob = prediction

# Agregar la columna de probabilidades predichas al conjunto de prueba
test_data$predicted_prob <- prediction  # prediction ya contiene las probabilidades

# Gráfico de las probabilidades predichas
ggplot(test_data, aes(x = anio, y = predicted_prob, color = indicador)) +
  geom_point(alpha = 0.6, size = 2) +
  labs(
    title = "Probabilidad Predicha vs. Año",
    x = "Año",
    y = "Probabilidad Predicha",
    color = "Indicador"
  ) +
  theme_minimal()




##############################
# Arbol de descicon 
##############################
library(dplyr)
library(caret)
library(rpart)
library(rpart.plot)

head(df_analisis)
names(df_analisis)
str(df_analisis)

# Seleccionar variables relevantes y eliminar valores faltantes 
df_clean1 = df_analisis %>%
  select(valorIndicador, areaPais, indicador, poblacion, desempleo., pib_per_capita)

df_clean1$indicador= as.factor(df_clean1$indicador)

# Porcentaje de NAs por columna
sapply(df_clean1, function(x) mean(is.na(x)))

# 2 PARTE
# Dividir los datos de entrenamiento (80%) y de prueba (20%)
set.seed(88)
train_index = createDataPartition(df_clean1$valorIndicador,
                                  p = 0.8,
                                  list = FALSE)

train_data = df_clean1[train_index, ] # Datos de entrenamiento
test_data = df_clean1[-train_index, ] # Datos de prueba

# Ajustar el modelo de arbol de decision
model = rpart(valorIndicador ~ areaPais + poblacion + desempleo. + pib_per_capita + indicador,
              data = train_data,
              method = "anova")

summary(model)

# Visualizar el árbol de decisión
rpart.plot(model)


# EVALUAR EL MODELO DE REGRESIÓN

# Predicciones en el conjunto de prueba
predictions <- predict(model, test_data)

# Error medio absoluto (MAE)
mae <- mean(abs(predictions - test_data$valorIndicador))
print(paste("Mean Absolute Error (MAE):", round(mae, 2)))

# Error cuadrático medio (MSE)
mse <- mean((predictions - test_data$valorIndicador)^2)
print(paste("Mean Squared Error (MSE):", round(mse, 2)))

# Raíz del error cuadrático medio (RMSE)
rmse <- sqrt(mse)
print(paste("Root Mean Squared Error (RMSE):", round(rmse, 2)))

# Tabla comparativa de predicciones vs valores reales
comparacion <- data.frame(
  Real = test_data$valorIndicador,
  Predicho = predictions,
  Diferencia_Abs = abs(predictions - test_data$valorIndicador)
)

# Mostrar las primeras filas
head(comparacion)


##############################
# Random forest
##############################

library(dplyr)
library(caret)
library(randomForest)

head(df_analisis)
names(df_analisis)
str(df_analisis)

# Seleccionar variables relevantes y eliminar valores faltantes 
df_clean2 = df_analisis %>%
  select(valorIndicador, areaPais, poblacion, desempleo., pib_per_capita, indicador)


df_clean2$indicador= as.factor(df_clean2$indicador)


# Porcentaje de NAs por columna
sapply(df_clean2, function(x) mean(is.na(x)))

# 2 PARTE
# Dividir los datos de entrenamiento (80%) y de prueba (20%)
set.seed(88)
train_index = createDataPartition(df_clean2$valorIndicador,
                                  p = 0.8,
                                  list = FALSE)

train_data = df_clean2[train_index, ] # Datos de entrenamiento
test_data = df_clean2[-train_index, ] # Datos de prueba

# Ajustar el modelo de arbol de decision
rf_model = randomForest(valorIndicador ~ areaPais + poblacion + desempleo. + pib_per_capita + indicador,
              data = train_data,
              ntree = 500,
              mtry = 2)

print(rf_model)

# Importancia de las variables
var_imp = importance(rf_model)
print(var_imp)

# Visualizar la importancia de las variables
varImpPlot(rf_model)

# EVALUAR EL MODELO
# Predicciones en el conjunto de prueba
rf_pred = predict(rf_model, test_data)

# Error medio absoluto (MAE)
mae = mean(abs(rf_pred - test_data$valorIndicador))
print(paste("Mean Absolute Error (MAE):", round(mae, 2)))

# Error cuadrático medio (MSE)
mse = mean((rf_pred - test_data$valorIndicador)^2)
print(paste("Mean Squared Error (MSE):", round(mse, 2)))

# Raíz del error cuadrático medio (RMSE)
rmse = sqrt(mse)
print(paste("Root Mean Squared Error (RMSE):", round(rmse, 2)))










