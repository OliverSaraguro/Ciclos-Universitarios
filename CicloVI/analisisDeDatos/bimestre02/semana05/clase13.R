install.packages("rpart")
install.packages("rpart.plot")
install.packages("caret")

library(dplyr)
library(caret)
library(rpart)
library(rpart.plot)


getwd()
setwd("/Users/oliversaraguro/Desktop/CicloVI/analisisDeDatos/dataset")

#######################################
# ARBOL DE DECICIÓN
#######################################

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



# 2 PARTE
# Dividir los datos de entrenamiento (80%) y de prueba (20%)
set.seed(88)
train_index = createDataPartition(df_clean$Survived,
                                  p = 0.8,
                                  list = FALSE)

train_data = df_clean[train_index, ] # Datos de entrenamiento
test_data = df_clean[-train_index, ] # Datos de prueba

# Ajustar el modelo de arbol de decision
model = rpart(Survived ~ Pclass + Sex + Age + SibSp + Parch + Fare + Embarked,
              data = train_data,
              method = "class")

summary(model)

# Visualizar el arbol de decision
rpart.plot(model, extra = 104)


# EVALURAR EL MODELO 
# Predicciones en el conjunto de pruebas 
predictions = predict(model, test_data, type = "class")

conf_matriz = confusionMatrix(predictions,
                              test_data$Survived,
                              positive = "1")

print(conf_matriz)



# 3 PARTE
# PODAR EL ARBOL BASADO EN EL VALOR OPTIMO DE CP 
cp_optimo = model$cptable[which.min(model$cptable[, "xerror"]), "CP"]

p_model = prune(model, cp = cp_optimo) # prune sirve para podar el arbol

summary(p_model)


# Visualizar el arbol podado 
rpart.plot(p_model)

# EVALURAR EL MODELO 
# Predicciones en el conjunto de pruebas 
predictions = predict(p_model, test_data, type = "class")

conf_matriz = confusionMatrix(predictions,
                              test_data$Survived)

print(conf_matriz)


#######################################
# REGRESIÓN
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

# Convertir a factores
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
model = rpart(Age ~ Survived + Pclass + Sex + SibSp + Parch + Fare + Embarked,
              data = train_data,
              method = "anova")

summary(model)

# 3 PARTE
# PODAR EL ARBOL BASADO EN EL VALOR OPTIMO DE CP 
cp_optimo = model$cptable[which.min(model$cptable[, "xerror"]), "CP"]

p_model = prune(model, cp = cp_optimo) # prune sirve para podar el arbol

summary(p_model)

# Visualizar el arbol podado 
rpart.plot(model)

# 4 PARTE
# Evaluar el modelo 
# Predicciones en el conjunto de pruebas 
predictions = predict(model, test_data)

# Existen 3 errores
# Error medio absoluto (MAE)
mae = mean(abs(predictions - test_data$Age))
print(paste("Mean Absolute Error (MAE): ", round(mae, 2)))

# La media del error al cuadrado (MSE)
mse = mean((predictions - test_data$Age) ^ 2)
print(paste("Mean Squared Error (MSE): ", round(mse, 2)))

# Raíz del error cuadrático medio (RMSE)
rmse <- sqrt(mse)
print(paste("Root Mean Squared Error (RMSE):", round(rmse, 2)))

comparacion = data.frame(
  Real = test_data$Age,
  Predicho = predictions,
  Dif = abs(predictions - test_data$Age)
)

head(comparacion)



