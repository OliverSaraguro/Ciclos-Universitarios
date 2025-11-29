
install.packages("randomForest")

library(dplyr)
library(caret)
library(randomForest)



getwd()
setwd("/Users/oliversaraguro/Desktop/CicloVI/analisisDeDatos/dataset")

#######################################
# CLASIFICACIÓN
#######################################

# 1 PARTE
df = read.csv("titanic.csv")
dim(df)
colnames(df)
head(df)
str(df)
summary(df)
class(df)
unique(df)


# Seleccionar variables relevantes y eliminar valores faltantes 
df_clean = df %>%
  select(Survived, Pclass, Sex, Age, SibSp, Parch, Fare, Embarked)

sapply(df_clean, function(x) mean(is.na(x) | !nzchar(x))) # Media de valores faltantes y nulos

df_clean = df_clean %>%
  filter(!is.na(Age) & nzchar(Embarked))

df_clean$Survived = as.factor(df_clean$Survived)
df_clean$Pclass = as.factor(df_clean$Pclass)
df_clean$Sex = as.factor(df_clean$Sex)
df_clean$Embarked = as.factor(df_clean$Embarked)
str(df_clean)


# 2 Parte
# Dividir los datos de entrenamiento (80%) y de prueba (20%)
set.seed(88)
train_index = createDataPartition(df_clean$Survived,
                                  p = 0.8,
                                  list = FALSE)

train_data = df_clean[train_index, ] # Datos de entrenamiento
test_data = df_clean[-train_index, ] # Datos de prueba

# Ajustar el modelo de arbol de decision
rf_model = randomForest(Survived ~ Pclass + Sex + Age + SibSp + Parch + Fare + Embarked,
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
                              test_data$Survived,
                              positive = "1")

print(conf_matrix)



##########################
# REGRESION
##########################

# 1 PARTE
df = read.csv("titanic.csv")

head(df)
names(df)
str(df)


# Seleccionar variables relevantes y eliminar valores faltantes 
df_clean = df %>%
  select(Age, Pclass, Sex, Survived, SibSp, Parch, Fare, Embarked)

sapply(df_clean, function(x) mean(is.na(x) | !nzchar(x))) # Media de valores faltantes y nulos

df_clean = df_clean %>%
  filter(!is.na(Age) & nzchar(Embarked))

df_clean$Survived = as.factor(df_clean$Survived)
df_clean$Pclass = as.factor(df_clean$Pclass)
df_clean$Sex = as.factor(df_clean$Sex)
df_clean$Embarked = as.factor(df_clean$Embarked)
str(df_clean)

# 2 PARTE

# Dividir los datos de entrenamiento (80%) y de prueba (20%)
set.seed(88)
train_index = createDataPartition(df_clean$Survived,
                                  p = 0.8,
                                  list = FALSE)

train_data = df_clean[train_index, ] # Datos de entrenamiento
test_data = df_clean[-train_index, ] # Datos de prueba

# Ajustar el modelo de arbol de decision
set.seed(88)
rf_model = randomForest(Age ~ Pclass + Sex + Survived+ SibSp + Parch + Fare + Embarked,
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

# Error medio absoluto (MAE)
mae = mean(abs(rf_pred - test_data$Age))
print(paste("Mean Absolute Error (MAE): ", round(mae, 2)))

# Error cuadratico medio (MSE)
mse = mean((rf_pred - test_data$Age) ^ 2)
print(paste("Mean Squared Error (MSE): ", round(mse, 2)))

# Raiz de el error cuadratico medio (RMSE)
rmse <- sqrt(mse)
print(paste("Root Mean Squared Error (RMSE):", round(rmse, 2)))

