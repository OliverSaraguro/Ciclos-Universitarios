
############################
# Regresión
# Arboles de decisión
############################

# Cargar librerías
library(readxl)
library(dplyr)
library(caret)
library(rpart)
library(rpart.plot)

# Leer los datos
df = read_excel("detenidos_2025.xlsx", sheet = 2)

# Filtrar y seleccionar las variables necesarias
df_clean = df %>%
  select(edad, nivel_de_instruccion, movilizacion, condicion, presunta_infraccion, tipo_lugar) %>%
  filter(edad > 0)  # Eliminar edades igual a 0

# Convertir variables categóricas a factores
df_clean$nivel_de_instruccion = as.factor(df_clean$nivel_de_instruccion)
df_clean$movilizacion = as.factor(df_clean$movilizacion)
df_clean$condicion = as.factor(df_clean$condicion)
df_clean$presunta_infraccion = as.factor(df_clean$presunta_infraccion)
df_clean$tipo_lugar = as.factor(df_clean$tipo_lugar)

# Dividir los datos de entrenamiento (80%) y de prueba (20%)
set.seed(88)
train_index = createDataPartition(
  df_clean$edad, 
  p = 0.8, 
  list = FALSE)

train_data = df_clean[train_index, ]
test_data = df_clean[-train_index, ]

# Modelo de regresión con árbol de decisión
model = rpart(edad ~ nivel_de_instruccion + movilizacion + condicion +
                     presunta_infraccion + tipo_lugar,
                   data = train_data,
                   method = "anova")  # método para regresión

# Resumen del modelo
summary(model)

# Visualizar el árbol
rpart.plot(model, extra = 101)

# Evaluar el modelo
# Predicciones en el conjunto de prueba
predictions = predict(model, test_data)

# Error medio absoluto (MAE)
mae = mean(abs(predictions - test_data$edad))
print(paste("Mean absolute Error (MAE):", round(mae, 2)))

# Error cuadrático medio (MSE)
mse = mean((predictions - test_data$edad)^2)
print(paste("Mean Squared Error (MSE):", round(mse, 2)))

# Raíz del error cuadrático medio (RMSE)
rmse = sqrt(mse)

print(paste("Root Mean Squared Error (RMSE):", round(rmse, 2)))

# Comparación de valores reales vs predichos
comparacion = data.frame(
  Real = test_data$edad,
  Predicho = predictions,
  Dif = abs(predictions - test_data$edad)
)

head(comparacion)
