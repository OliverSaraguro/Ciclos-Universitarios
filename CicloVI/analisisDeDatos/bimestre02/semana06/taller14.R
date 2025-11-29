library(dplyr)
library(caret)
library(randomForest)
#######################################
# DataSet - Penguins_Species.csv
#######################################


#######################################
# DataSet - laptop_data_cleaned.csv
#######################################

# 1 parte
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

# 2 parte
# Dividir los datos de entrenamiento (80%) y de prueba (20%)
set.seed(88)
train_index <- createDataPartition(df_clean$TouchScreen, p = 0.8, list =
                                     FALSE)
train_data <- df_clean[train_index, ]
test_data <- df_clean[-train_index, ]

# Ajustar el Modelo de Árbol de Decisión
rf_model <- randomForest(TouchScreen ~ Price + Weight + Ppi + Ips + TypeName,
               data = train_data,
               ntree = 100,
               mtry = 2)
print(rf_model)

# Importancia de las variables 
var_imp = importance(rf_model)
print(var_imp)

# Visualizar la importancia de las variables
varImpPlot(rf_model)

# Evaluar el modelo 
# Predicciones en el conjunto de prueba 
rf_pred = predict(rf_model, test_data)

# Matriz de confusión
conf_matrix = confusionMatrix(rf_pred,
                              test_data$TouchScreen,
                              positive = "1")

print(conf_matrix)

#######################################
# Regresion
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
rf_model <- randomForest(Price ~ TypeName + Ram + Ppi + Cpu_brand + SSD,
               data = train_data,
               ntree = 100,
               mtry = 2) # 5 / 3 = 1.66 ~ 1
print(rf_model)

# Importancia de las variables 
var_imp = importance(rf_model)
print(var_imp)

# Visualizar la importancia de las variables
varImpPlot(rf_model)

# Evaluar el modelo 
# Predicciones en el conjunto de prueba 
rf_pred = predict(rf_model, test_data)

# Error medio absoluto (MAE)
mae = mean(abs(rf_pred - test_data$Price))
print(paste("Mean Absolute Error (MAE): ", round(mae, 2)))

# Error cuadratico medio (MSE)
mse = mean((rf_pred - test_data$Price) ^ 2)
print(paste("Mean Squared Error (MSE): ", round(mse, 2)))

# Raiz de el error cuadratico medio (RMSE)
rmse <- sqrt(mse)
print(paste("Root Mean Squared Error (RMSE):", round(rmse, 2)))

