
library(ggplot2)
library(lattice)
library(dplyr)
library(caret)
library(randomForest)


getwd()
setwd("/Users/oliversaraguro/Desktop/CicloVI/analisisDeDatos/dataset")

test_data = read.csv("house-prices-advanced-regression-techniques/test.csv") # Evaluar
train_data = read.csv("house-prices-advanced-regression-techniques/train.csv") # Entrenamiento

names(train_data)
head(train_data)
str(train_data)

unique(train_data$Neighborhood)
unique(train_data$GarageCars)
unique(train_data$OverallQual)

train_data$Neighborhood = as.factor(train_data$Neighborhood)
train_data$GarageCars = as.factor(train_data$GarageCars)
train_data$OverallQual = as.factor(train_data$OverallQual)



# Ajustar el modelo de arbol de decision
set.seed(88)
rf_model = randomForest(SalePrice ~ OverallQual + Neighborhood + GarageCars + GrLivArea + BsmtFinSF1,
                        data = train_data,
                        ntree = 300,
                        mtry = 2)
print(rf_model)

# Importancia de las variables
var_imp = importance(rf_model)
print(var_imp)

# Visualizar la importancia de las variables
varImpPlot(rf_model)



# Evaluar Modelo
test_data$Neighborhood = as.factor(test_data$Neighborhood)
test_data$GarageCars = as.factor(test_data$GarageCars)
test_data$OverallQual = as.factor(test_data$OverallQual)

unique(test_data$Neighborhood)
unique(test_data$GarageCars)
unique(test_data$OverallQual)

x = as.data.frame(test_data$GarageCars)
x = x %>%
  filter(is.na(test_data$GarageCars == 5))

colSums(is.na(test_data))


# Predecir con el modelo entrenado
predicciones <- predict(rf_model, newdata = test_data)

# Crear el archivo de submission
submission <- data.frame(Id = test_data$Id, SalePrice = predicciones)

# Guardar el archivo como submission.csv
write.csv(submission, file = "submission.csv", row.names = FALSE)

# Confirmar
head(submission)
