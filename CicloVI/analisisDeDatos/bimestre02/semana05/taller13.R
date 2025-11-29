getwd()
library(dplyr)
library(caret)
library(rpart)
library(rpart.plot)

#######################################
# DataSet - Penguins_Species.csv
#######################################

# Cargar y explorar datos
df <- read.csv("Penguins_Species.csv")

head(df)
str(df)
names(df)

# Estadísticas generales
dim(df)
colnames(df)
summary(df)
class(df)
unique(df)

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

# Renombrar columnas
df_clean <- rename(
  df_clean,
  largo_pico_mm = culmen_length_mm,
  profundidad_pico_mm = culmen_depth_mm,
  largo_ala_mm = flipper_length_mm,
  masa_corporal_g = body_mass_g,
  sexo = sex
)

# Verificar estructura final
str(df_clean)

# Dividir los datos de entrenamiento (80%) y de prueba (20%)
set.seed(88)
train_index <- createDataPartition(df_clean$sexo, p = 0.8, list = FALSE)
train_data <- df_clean[train_index, ] # Datos de entrenamiento
test_data <- df_clean[-train_index, ] # Datos de prueba

# Ajustar el Modelo de Árbol de Decisión
model <- rpart(sexo ~ largo_pico_mm + profundidad_pico_mm + largo_ala_mm +
                 masa_corporal_g,
               data = train_data,
               method = "class") # Clasificación

# Ver el resumen del modelo
summary(model)

# Visualizar el árbol de decisión
rpart.plot(model, extra = 104)

# EVALUAR EL MODELO
# Predicciones en el conjunto de prueba
predictions <- predict(model, test_data, type = "class")

# Matriz de confusión
conf_matrix <- confusionMatrix(predictions,
                               test_data$sexo,
                               positive = "MALE")
print(conf_matrix)

#######################################
# DataSet - laptop_data_cleaned.csv
#######################################

# Cargar y explorar datos
df <- read.csv("laptop_data_cleaned.csv",
               sep = ";", dec = ",")
head(df)
str(df)
names(df)

# Selección de variables relevantes y eliminación de valores faltantes
df_clean <- df %>%
  select(TouchScreen, Price, Weight, Ppi, Ips, TypeName)

sapply(df_clean, function(x) mean(is.na(x) | !nzchar(as.character(x))))

# Filtrar filas sin valores faltantes
df_clean <- df_clean %>%
  filter(!is.na(Price) & !is.na(Weight) & !is.na(Ppi) & !is.na(Ips) &
           !is.na(TypeName) & !is.na(TouchScreen))

# Convertir variables categóricas a factores
df_clean$TouchScreen <- as.factor(df_clean$TouchScreen)
df_clean$Ips <- as.factor(df_clean$Ips)
df_clean$TypeName <- as.factor(df_clean$TypeName)
str(df_clean)

# Dividir los datos de entrenamiento (80%) y de prueba (20%)
set.seed(88)
train_index <- createDataPartition(df_clean$TouchScreen, p = 0.8, list =
                                     FALSE)
train_data <- df_clean[train_index, ]
test_data <- df_clean[-train_index, ]

# Ajustar el Modelo de Árbol de Decisión
model <- rpart(TouchScreen ~ Price + Weight + Ppi + Ips + TypeName,
               data = train_data,
               method = "class")

# Ver el resumen del modelo
summary(model)

# Visualizar el árbol de decisión
rpart.plot(model, extra = 104)

# EVALUAR EL MODELO
# Predicciones en el conjunto de prueba
predictions <- predict(model, test_data, type = "class")

# Matriz de confusión
conf_matrix <- confusionMatrix(predictions,
                               test_data$TouchScreen,
                               positive = "1")
print(conf_matrix)

#######################################
# Regresión
# DataSet - laptop_data_cleaned_ori.csv
#######################################
# Cargar y explorar datos
df <- read.csv("laptop_data_cleaned.csv",
               sep = ";", dec = ",")

head(df)
str(df)
names(df)

# Selección de variables relevantes y eliminación de valores faltantes
df_clean <- df %>%
  select(Price, TypeName, Ram, Ppi, Cpu_brand, SSD)

sapply(df_clean, function(x) mean(is.na(x) | !nzchar(as.character(x))))

df_clean <- df_clean %>%
  filter(!is.na(Price) & !is.na(TypeName) & !is.na(Ram) & !is.na(Ppi) &
           !is.na(Cpu_brand) & !is.na(SSD))

# Convertir variables categóricas a factores
df_clean$TypeName <- as.factor(df_clean$TypeName)
df_clean$Cpu_brand <- as.factor(df_clean$Cpu_brand)
str(df_clean)

# Dividir los datos de entrenamiento (80%) y de prueba (20%)
set.seed(88)
train_index <- createDataPartition(df_clean$Price, p = 0.8, list = FALSE)
train_data <- df_clean[train_index, ] # Datos de entrenamiento
test_data <- df_clean[-train_index, ] # Datos de prueba

# Ajustar el Modelo de Árbol de Decisión
model <- rpart(Price ~ TypeName + Ram + Ppi + Cpu_brand + SSD,
               data = train_data,
               method = "anova") # Se utiliza para problemas de regresión

# Ver el resumen del modelo
summary(model)

# Visualizar el árbol de decisión
rpart.plot(model)

# Evaluar el modelo
# Predicciones en el conjunto de prueba
predictions <- predict(model, test_data)

# Error medio absoluto (MAE)
mae <- mean(abs(predictions - test_data$Price))
print(paste("Mean absolute Error (MAE):", round(mae, 2)))

# Error cuadrático medio (MSE)
mse <- mean((predictions - test_data$Price)^2)
print(paste("Mean Squared Error (MSE):", round(mse, 2)))

# Raíz del error cuadrático medio (RMSE)
rmse <- sqrt(mse)
print(paste("Root Mean Squared Error (RMSE):", round(rmse, 2)))

# Comparación de valores reales vs predichos
comparacion <- data.frame(
  Real = test_data$Price,
  Predicho = predictions,
  Dif = abs(predictions - test_data$Price)
)

head(comparacion)

