getwd()

library(dplyr)
df = read.csv("Obesidad_Data.csv")

str(df)
names(df)
head(df)

unique(df$SCC)
# Clasificacion de variables
# Categoricas 
# - Gender - family_with_overweight - FAVC - CAEC - SMOKE - SCC - CALC - MTRANS - NObeyesdad
# Numericas
# - Age - Height - Weight - FCVC - NCP - CH2O - FAF - TUE
# Bimodales
# - 

# Media de valores faltantes y nulos
sapply(df, function(x) sum(is.na(x) | !nzchar(x))) 

# Limpieza
df = df %>% filter(nzchar(family_with_overweight))
df = df %>% filter(!is.na(FCVC))

# Verficamos
sapply(df, function(x) sum(is.na(x) | !nzchar(x)))

###############################
# CLASIFICACION
# Predecir: nivel de obesidad
###############################
# Random Forest
library(dplyr)
library(caret)
library(randomForest)

unique(df$NObeyesdad)
# Seleccionamos las variable
df_analisis1 = df %>% select(NObeyesdad, FCVC, NCP, Age, TUE, FAF, CH2O, Gender)

# Convertimos a factores
df_analisis1$NObeyesdad = as.factor(df_analisis1$NObeyesdad)
df_analisis1$Gender = as.factor(df_analisis1$Gender)

# Dividir los datos de entrenamiento (80%) y de Prueba (20%)
set.seed (88)
train_index = createDataPartition(df_analisis1$NObeyesdad, p = 0.8, list = FALSE)
train_data = df_analisis1[train_index, ] 

#Datos de entrenamiento 
test_data <- df_analisis1[-train_index, ] 

#Datos de prueba
# Ajustar el modelo Random Forest
set.seed (88)

rf_model = randomForest(NObeyesdad ~ Age + FCVC + TUE + FAF + NCP + CH2O + Gender,
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

# Matriz de confusión
conf_matrix <- confusionMatrix(rf_pred,
                              test_data$NObeyesdad)
print(conf_matrix)


#########################################
# REGRESION
# Predecir: indice de masa corporal(IMC)
#########################################

# Random Forest
library(dplyr)
library(caret)
library(randomForest)

# Calculamos el IMC
df_analisis2 = df %>% 
  mutate(IMC = Weight / (Height^2)
)

names(df_analisis2)
unique(df_analisis2$CALC)

# Seleccionamos las variable
df_analisis2 = df_analisis2 %>% 
  select(IMC, Age, FCVC, TUE, CAEC, FAF, NCP, CALC, Gender)

# Convertimos a factores
df_analisis2$CAEC = as.factor(df_analisis2$CAEC)

df_analisis2$CALC = as.factor(df_analisis2$CALC)
df_analisis2$Gender = as.factor(df_analisis2$Gender)

# Dividir los datos de entrenamiento (80%) y de Prueba (20%)
set.seed (88)
train_index = createDataPartition(df_analisis2$IMC, 
                                  p = 0.8, 
                                  list = FALSE)
train_data = df_analisis2[train_index, ] 

#Datos de entrenamiento 
test_data <- df_analisis2[-train_index, ] 

#Datos de prueba
# Ajustar el modelo Random Forest
set.seed (88)

rf_model = randomForest(IMC ~ Age + FCVC + TUE + CAEC + FAF + NCP + CALC + Gender,
                        data = train_data, 
                        ntree = 300, 
                        mtry = 3)

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
mae = mean(abs(rf_pred - test_data$IMC))
print(paste("Mean Absolute Error (MAE):", round(mae, 2)))

# Error cuadrático medio (MSE)
mse = mean((rf_pred - test_data$IMC)^2)
print(paste("Mean Squared Error (MSE):", round(mse, 2)))

# Raíz del error cuadrático medio (RMSE)
rmse = sqrt(mse)
print(paste("Root Mean Squared Error (RMSE):", round(rmse, 2)))




