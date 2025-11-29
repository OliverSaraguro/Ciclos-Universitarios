library(dplyr)
library(randomForest)
###############################
# RETO
###############################

train_data = read.csv("house-prices-advanced-regression-techniques/train.csv")
test_data = read.csv("house-prices-advanced-regression-techniques/test.csv")

# Variable a predecir 
# SalePrice -> Precio de venta

head(train_data)
names(train_data)       
str(train_data)

# Variables: 
vars <- c(
  "LotArea",            # Área del terreno 
  "OverallQual",        # Calidad general del material y acabado 
  "OverallCond",        # Condición general 
  "YearBuilt",          # Año de construcción
  "YearRemodAdd",       # Año de renovación
  "TotalBsmtSF",        # Área del sótano terminado
  "GrLivArea",          # Área habitable sobre el suelo
  "GarageCars",         # Cantidad de autos que caben en el garaje
  "GarageArea",         # Área del garaje
  "FullBath",           # Baños completos sobre el suelo
  "Fireplaces",         # Número de chimeneas
  "BedroomAbvGr",       # Dormitorios sobre el suelo
  "KitchenAbvGr",       # Cocinas sobre el suelo
  "KitchenQual",        # Calidad de la cocina 
  "Neighborhood",       # Vecindario 
  "HouseStyle",         # Estilo de la casa
  "BldgType"            # Tipo de edificio
)

# Selección de variables relevantes
train_data <- train_data %>%
  select(c("SalePrice", vars))

str(train_data)

sapply(train_data, function(x) mean(is.na(x) | !nzchar(x)))

# Convertir a factor las variables categóricas
train_data$Neighborhood <- as.factor(train_data$Neighborhood)
train_data$HouseStyle <- as.factor(train_data$HouseStyle)
train_data$BldgType <- as.factor(train_data$BldgType)
train_data$KitchenQual <- as.factor(train_data$KitchenQual)

# Ajustar el modelo de arbol de decision
set.seed(88)
rf_model = randomForest( SalePrice ~ LotArea + OverallQual + OverallCond+ YearBuilt + YearRemodAdd + TotalBsmtSF + GrLivArea
                         + GarageCars + GarageArea+ FullBath + Fireplaces + BedroomAbvGr + KitchenAbvGr + Neighborhood + HouseStyle 
                         + BldgType,
                        data = train_data,
                        ntree = 500,
                        mtry = 2)
print(rf_model)

# Importancia de las variables 
var_imp = importance(rf_model)
print(var_imp)

# Visualizar la importancia de las variables
varImpPlot(rf_model)




# Evaluar el modelo 
test_data <- test_data %>%
  select(c(vars))

str(test_data)

sapply(test_data, function(x) mean(is.na(x) | !nzchar(x)))

# Convertir a factor las variables categóricas
test_data$Neighborhood <- as.factor(test_data$Neighborhood)
test_data$HouseStyle <- as.factor(test_data$HouseStyle)
test_data$BldgType <- as.factor(test_data$BldgType)
test_data$KitchenQual <- as.factor(test_data$KitchenQual)

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

