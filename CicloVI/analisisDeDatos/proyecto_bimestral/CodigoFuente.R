
#----- PROYECTO BIMESTRAL - 2 BIMESTRE ----- ####

# Librerías Necesarias
library(dplyr)
library(ggplot2)
library(corrplot)
library(lattice)
library(caret)
library(e1071)
library(rpart)
library(rpart.plot)
library(randomForest)

#Nuevas Librerías
# install.packages("xgboost")
library(xgboost)

########################################################################
# ______________________________________________________________________
# Análisis exploratorio, limpieza, y preparación de datos
# ______________________________________________________________________
########################################################################

# ----------------------------------------------
# 1. Leer el dataset
# ----------------------------------------------
df <- read.csv("df_union_fn.csv")

# ----------------------------------------------
# 2. Explorar el Dataset y Verificamos el Tipo de Variable
# ----------------------------------------------
dim(df)
colnames(df)
head(df)
str(df)
summary(df)

mode(df$bandera); unique(df$bandera)
mode(df$codigo_ISO); unique(df$codigo_ISO)
mode(df$nombrePais); unique(df$nombrePais)
mode(df$capitalPais); unique(df$capitalPais)
mode(df$continente); unique(df$continente)
mode(df$regionPais); unique(df$regionPais)
mode(df$subregionPais); unique(df$subregionPais)
mode(df$paisIndependiente); unique(df$paisIndependiente)
mode(df$tieneMar); unique(df$tieneMar)
mode(df$ONU); unique(df$ONU)
mode(df$latitud); unique(df$latitud)
mode(df$longitud); unique(df$longitud)
mode(df$areaPais); unique(df$areaPais)
mode(df$sueldoMinimo_USD); unique(df$sueldoMinimo_USD)
mode(df$salarioMinimoPorHora_USD); unique(df$salarioMinimoPorHora_USD)
mode(df$indicador); unique(df$indicador)
mode(df$dimension); unique(df$dimension)
mode(df$categoria); unique(df$categoria)
mode(df$anio); unique(df$anio)
mode(df$decada); unique(df$decada)
mode(df$unidad); unique(df$unidad)
mode(df$valorIndicador); unique(df$valorIndicador)
mode(df$pib_per_capita); unique(df$pib_per_capita)
mode(df$poblacion); unique(df$poblacion)
mode(df$pib_total); unique(df$pib_total)
mode(df$desempleo); unique(df$desempleo)

# Numéricas / Cuantitativas
# latitud, longitud, areaPais, sueldoMinimo_USD, salarioMinimoPorHora_USD,
# valorIndicador, pib_per_capita, poblacion, pib_total, desempleo.

# Categóricas
# continente, regionPais, subregionPais, paisIndependiente, tieneMar, ONU,
# anio, decada, unidad, indicador, dimension, categoria, nombrePais

# Binarias
# paisIndependiente, tieneMar, ONU

# Variables de texto / identificación
# bandera, codigo_ISO, capitalPais

# ----------------------------------------------
# 3. Tratamiento de valores nulos y vacíos
# ----------------------------------------------
# No se detectan valores NA ni vacíos en el dataset
# Por tanto, no se realiza imputación ni eliminación por valores faltantes
colSums(is.na(df))
sapply(df, function(x) sum(is.na(x) | !nzchar(as.character(x))))

# ----------------------------------------------
# 4. Limpieza y transformación de variables 
# (Convertimos a factores las variables categóricas)
# ----------------------------------------------
df <- df %>%
  mutate(
    desempleo = as.numeric(desempleo),
    continente = as.factor(continente),
    categoria = as.factor(categoria),
    anio = as.factor(anio),
    nombrePais = as.factor(nombrePais),
    indicador = as.factor(indicador),
    dimension = as.factor(dimension),
    unidad = as.factor(unidad)
  )

# ----------------------------------------------
# 5. Tablas de frecuencia
# ----------------------------------------------
table(df$categoria)
table(df$continente)
prop.table(table(df$continente))

# ----------------------------------------------
# 6. Gráfico de barras
# ----------------------------------------------
ggplot(df, aes(x = categoria)) + 
  geom_bar(fill = "steelblue") +
  labs(title = "Distribución de Categorías de Indicadores", 
       x = "Categoría",
       y = "Frecuencia") +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))

# Gráfico de barras apiladas por sexo no aplica (no hay variable sexo), 
# podrías adaptarlo por continente vs categoría

ggplot(df, aes(x = continente, fill = categoria)) +
  geom_bar() +
  labs(title = "Distribución por continente y categoría",
       x = "Continente",
       y = "Cantidad",
       fill = "Categoría") +
  theme_minimal()

# ----------------------------------------------
# 7. Tablas de contingencia
# ----------------------------------------------
tabla_continente_categoria <- table(df$continente, df$categoria)

# Gráfico de mosaico
mosaicplot(tabla_continente_categoria,
           color = TRUE,
           main = "Continente vs Categoría",
           xlab = "Continente",
           ylab = "Categoría")

# ----------------------------------------------
# 8. Medidas estadísticas de valorIndicador
# ----------------------------------------------
mean(df$valorIndicador, na.rm = TRUE)
median(df$valorIndicador, na.rm = TRUE)
sd(df$valorIndicador, na.rm = TRUE)
var(df$valorIndicador, na.rm = TRUE)
diff(range(df$valorIndicador, na.rm = TRUE))
summary(df$valorIndicador)

# ----------------------------------------------
# 9. Matriz de correlación
# ----------------------------------------------
df_num <- df %>% select(where(is.numeric))
cor_matrix <- cor(df_num, use = "complete.obs")
corrplot(cor_matrix, method = "circle", tl.col = "black", 
         title = "Matriz de Correlación", mar = c(0,0,2,0))

# ----------------------------------------------
# 10. Análisis de outliers en valorIndicador
# ----------------------------------------------
boxplot(df$valorIndicador, 
        main = "Boxplot de valorIndicador",
        ylab = "valorIndicador")

Q1 <- quantile(df$valorIndicador, 0.25, na.rm = TRUE)
Q3 <- quantile(df$valorIndicador, 0.75, na.rm = TRUE)
IQR <- Q3 - Q1

limite_inf <- Q1 - 1.5 * IQR
limite_sup <- Q3 + 1.5 * IQR

outliers <- df$valorIndicador[df$valorIndicador < limite_inf | df$valorIndicador > limite_sup]
length(outliers)
mean(df$valorIndicador < limite_inf | df$valorIndicador > limite_sup)

df_out <- df %>% filter(valorIndicador < limite_inf | valorIndicador > limite_sup)

# ----------------------------------------------
# 11. Tratamiento de outliers
# ----------------------------------------------

# Opción 1: Imputar con la mediana
df_op1 <- df %>% 
  mutate(valorIndicador = ifelse(valorIndicador < limite_inf | valorIndicador > limite_sup,
                                 median(valorIndicador), valorIndicador))
boxplot(df_op1$valorIndicador, main = "Boxplot - Opción 1: Mediana")

# Opción 2: Limitar a los rangos
df_op2 <- df %>%
  mutate(valorIndicador = ifelse(valorIndicador < limite_inf, limite_inf,
                                 ifelse(valorIndicador > limite_sup, limite_sup, valorIndicador)))
boxplot(df_op2$valorIndicador, main = "Boxplot - Opción 2: Limitar a rangos")

# Opción 3: Transformación raíz cuadrada
df_op3 <- df %>%
  mutate(valorIndicador = sqrt(valorIndicador))
boxplot(df_op3$valorIndicador, main = "Boxplot - Opción 3: Raíz Cuadrada")

# Opción 4: Transformación logarítmica
df_op4 <- df %>%
  mutate(valorIndicador = log(valorIndicador + 1))
boxplot(df_op4$valorIndicador, main = "Boxplot - Opción 4: Log")

# Opción 5: Eliminar outliers
df_op5 <- df %>%
  filter(valorIndicador >= limite_inf & valorIndicador <= limite_sup)
boxplot(df_op5$valorIndicador, main = "Boxplot - Opción 5: Sin outliers")

# ----------------------------------------------
# 12. #La opción elegida para tratar los Outliers es la Opción 4: Transformación Logarítmica
# ----------------------------------------------

df <- df %>%
  mutate(valorIndicador = log(valorIndicador + 1))
boxplot(df$valorIndicador, main = "Boxplot Tratados los Outliers")

outliers <- df$valorIndicador[df$valorIndicador < limite_inf | df$valorIndicador > limite_sup]
length(outliers)
mean(df$valorIndicador < limite_inf | df$valorIndicador > limite_sup)


########################################################################
# ______________________________________________________________________
# Aplique al menos 4 técnicas de análisis multivariante y/o predictivo 
# (clasificación o regresión) que se han estudiando en clase.
# ______________________________________________________________________
########################################################################

########################################################################
# _______________________________________________________________
# 1. MODELO DE REGRESIÓN LINEAL MÚLTIPLE - REGRESIÓN
# _______________________________________________________________
########################################################################

# ------------------------------------------------------------
# CARGAR Y SELECCIONAR VARIABLES
# Variable dependiente: valorIndicador
# Variables predictoras: nombrePais, sueldoMinimo_USD, categoria, anio, poblacion, desempleo, pib_total
# ------------------------------------------------------------
df_model <- df %>%
  select(valorIndicador, nombrePais, sueldoMinimo_USD, categoria, anio, poblacion, desempleo, pib_total)

# ------------------------------------------------------------
# CONVERSIÓN DE VARIABLES CATEGÓRICAS A FACTOR
# ------------------------------------------------------------
df_model$nombrePais <- as.factor(df_model$nombrePais)
df_model$categoria  <- as.factor(df_model$categoria)
df_model$anio       <- as.factor(df_model$anio)

# ------------------------------------------------------------
# DIVISIÓN DE DATOS EN ENTRENAMIENTO Y PRUEBA
# ------------------------------------------------------------
set.seed(123)
train_index <- createDataPartition(df_model$valorIndicador, p = 0.8, list = FALSE)
train_data  <- df_model[train_index, ]
test_data   <- df_model[-train_index, ]

# ------------------------------------------------------------
# ENTRENAMIENTO DEL MODELO DE REGRESIÓN LINEAL MÚLTIPLE
# ------------------------------------------------------------
modelo_lm <- lm(valorIndicador ~ nombrePais + sueldoMinimo_USD + categoria + anio +
                  poblacion + desempleo + pib_total,
                data = train_data)

# Ver resumen del modelo
summary(modelo_lm)

# ------------------------------------------------------------
# PREDICCIONES Y EVALUACIÓN
# ------------------------------------------------------------
predicciones <- predict(modelo_lm, newdata = test_data)

# Calcular métricas de evaluación
mae <- mean(abs(predicciones - test_data$valorIndicador))
mse <- mean((predicciones - test_data$valorIndicador)^2)
rmse <- sqrt(mse)

cat("MAE:", round(mae, 2), "\n")
cat("MSE:", round(mse, 2), "\n")
cat("RMSE:", round(rmse, 2), "\n")

########################################################################
# _______________________________________________________________
# 2. MODELO ÁRBOL DE DECISIÓN - REGRESIÓN
# _______________________________________________________________
########################################################################

# ------------------------------------------------------------
# Seleccionar variables
# Variable dependiente: valorIndicador
# Variables predictoras: nombrePais, sueldoMinimo_USD, categoria, anio, poblacion, desempleo, pib_total
# ------------------------------------------------------------
df_arbol <- df %>%
  select(valorIndicador, nombrePais, sueldoMinimo_USD, categoria, anio, poblacion, desempleo, pib_total)

# ------------------------------------------------------------
# Convertir variables categóricas a factores
# ------------------------------------------------------------
df_arbol$nombrePais <- as.factor(df_arbol$nombrePais)
df_arbol$categoria  <- as.factor(df_arbol$categoria)
df_arbol$anio       <- as.factor(df_arbol$anio)

# ------------------------------------------------------------
# Dividir datos en entrenamiento (80%) y prueba (20%)
# ------------------------------------------------------------
set.seed(88)
train_index <- createDataPartition(df_arbol$valorIndicador, p = 0.8, list = FALSE)
train_data  <- df_arbol[train_index, ]
test_data   <- df_arbol[-train_index, ]

# ------------------------------------------------------------
# Entrenar modelo de Árbol de Decisión para regresión
# ------------------------------------------------------------
modelo_arbol <- rpart(valorIndicador ~ nombrePais + sueldoMinimo_USD + categoria +
                        anio + poblacion + desempleo + pib_total,
                      data = train_data,
                      method = "anova")

# ------------------------------------------------------------
# Visualizar estructura del árbol
# ------------------------------------------------------------
rpart.plot(modelo_arbol, main = "Árbol de Decisión - valorIndicador")

# ------------------------------------------------------------
# Predicciones y evaluación del modelo
# ------------------------------------------------------------
predicciones <- predict(modelo_arbol, test_data)

# MAE - Error absoluto medio
mae <- mean(abs(predicciones - test_data$valorIndicador))
cat("MAE:", round(mae, 2), "\n")

# MSE - Error cuadrático medio
mse <- mean((predicciones - test_data$valorIndicador)^2)
cat("MSE:", round(mse, 2), "\n")

# RMSE - Raíz del error cuadrático medio
rmse <- sqrt(mse)
cat("RMSE:", round(rmse, 2), "\n")

# ------------------------------------------------------------
# Comparación de valores reales vs predichos
# ------------------------------------------------------------
comparacion <- data.frame(
  Real     = test_data$valorIndicador,
  Predicho = predicciones,
  Diferencia = abs(test_data$valorIndicador - predicciones)
)

head(comparacion)

########################################################################
# _______________________________________________________________
# 3. MODELO RANDOM FOREST - REGRESIÓN
# _______________________________________________________________
########################################################################

# ------------------------------------------------------------
# Seleccionar y preparar variables
# Variable dependiente: valorIndicador
# Variables predictoras: nombrePais, sueldoMinimo_USD, categoria, anio, poblacion, desempleo, pib_total
# ------------------------------------------------------------
df_rf <- df %>%
  select(valorIndicador, nombrePais, sueldoMinimo_USD, categoria, anio, poblacion, desempleo, pib_total) 

# ------------------------------------------------------------
# Convertir variables categóricas a factores
# ------------------------------------------------------------
df_rf$nombrePais <- as.factor(df_rf$nombrePais)
df_rf$categoria  <- as.factor(df_rf$categoria)
df_rf$anio       <- as.factor(df_rf$anio)

# ------------------------------------------------------------
# Dividir datos en entrenamiento (80%) y prueba (20%)
# ------------------------------------------------------------
set.seed(88)
train_index <- createDataPartition(df_rf$valorIndicador, p = 0.8, list = FALSE)
train_data <- df_rf[train_index, ]
test_data  <- df_rf[-train_index, ]

# ------------------------------------------------------------
# Ajustar el modelo Random Forest (regresión)
# ------------------------------------------------------------
set.seed(88)
rf_model <- randomForest(valorIndicador ~ nombrePais + sueldoMinimo_USD + categoria +
                           anio + poblacion + desempleo + pib_total,
                         data = train_data,
                         ntree = 200,
                         mtry = 3,
                         importance = TRUE)

# ------------------------------------------------------------
# Ver el modelo y la importancia de variables
# ------------------------------------------------------------
print(rf_model)
varImpPlot(rf_model)

# ------------------------------------------------------------
# Realizar predicciones y evaluar el modelo
# ------------------------------------------------------------
rf_pred <- predict(rf_model, test_data)

# Calcular métricas de error
mae <- mean(abs(rf_pred - test_data$valorIndicador))
mse <- mean((rf_pred - test_data$valorIndicador)^2)
rmse <- sqrt(mse)

cat("MAE:", round(mae, 2), "\n")
cat("MSE:", round(mse, 2), "\n")
cat("RMSE:", round(rmse, 2), "\n")

# ------------------------------------------------------------
# Comparación real vs predicho
# ------------------------------------------------------------
comparacion <- data.frame(
  Real     = test_data$valorIndicador,
  Predicho = rf_pred,
  Diferencia = abs(test_data$valorIndicador - rf_pred)
)

head(comparacion)


########################################################################
# _______________________________________________________________
# 4. MODELO NAIVE BAYES - Clasificación 
# _______________________________________________________________
########################################################################

# ------------------------------------------------------------
# Selección de variables para el modelo
# Variable dependiente: continente
# Variables predictoras: pib_per_capita, poblacion, desempleo, sueldoMinimo_USD,
# salarioMinimoPorHora_USD, areaPais, valorIndicador, pib_total, anio, categoria
# ------------------------------------------------------------
df_model <- df %>%
  select(continente, pib_per_capita, poblacion, desempleo, 
         sueldoMinimo_USD, salarioMinimoPorHora_USD, areaPais, 
         valorIndicador, pib_total, anio, categoria)

# ------------------------------------------------------------
# Conversión de variables categóricas a factor
# ------------------------------------------------------------
df_model$continente <- as.factor(df_model$continente)
df_model$anio       <- as.factor(df_model$anio)
df_model$categoria  <- as.factor(df_model$categoria)

# ------------------------------------------------------------
# División de datos en entrenamiento y prueba (80/20)
# ------------------------------------------------------------
set.seed(88)
train_index <- createDataPartition(df_model$continente, p = 0.8, list = FALSE)
train_data <- df_model[train_index, ]
test_data <- df_model[-train_index, ]

# ------------------------------------------------------------
# Ajustar el modelo Naive Bayes
# ------------------------------------------------------------

nb_model <- naiveBayes(continente ~ ., data = train_data)

# ------------------------------------------------------------
# Ver el resumen del modelo
# ------------------------------------------------------------
print(nb_model)

# ------------------------------------------------------------
# Evaluar el modelo - Predicciones 
# ------------------------------------------------------------
nb_pred <- predict(nb_model, test_data)

# ------------------------------------------------------------
# Matriz de confusión
# ------------------------------------------------------------
library(caret)
conf_matrix <- confusionMatrix(nb_pred, test_data$continente)
print(conf_matrix)

########################################################################
# ______________________________________________________________________
# Investigue dos técnicas adicionales de análisis (no vistas en clase),
# y aplíquelas sobre el conjunto de datos. 
# ______________________________________________________________________
########################################################################

########################################################################
# ____________________________________________________________
# 5. MODELO XGBOOST - REGRESIÓN
# ____________________________________________________________
########################################################################

# ------------------------------------------------------------
# SELECCIÓN Y PREPARACIÓN DE VARIABLES
# Variable dependiente: valorIndicador (numérica)
# Variables predictoras: nombrePais, sueldoMinimo_USD, 
# categoria, anio, poblacion, desempleo, pib_total
# ------------------------------------------------------------
df_model <- df %>%
  select(valorIndicador, nombrePais, sueldoMinimo_USD, categoria, anio, poblacion, desempleo, pib_total) 
# ------------------------------------------------------------
# Convertir variables categóricas a factores
# ------------------------------------------------------------
df_model$nombrePais <- as.factor(df_model$nombrePais)
df_model$categoria <- as.factor(df_model$categoria)
df_model$anio <- as.factor(df_model$anio)

# ------------------------------------------------------------
# Crear variables dummy (one-hot encoding)
# ------------------------------------------------------------
dummies <- dummyVars(valorIndicador ~ ., data = df_model)
df_encoded <- predict(dummies, newdata = df_model)
df_final <- data.frame(valorIndicador = df_model$valorIndicador, df_encoded)

# ------------------------------------------------------------
# DIVISIÓN DE DATOS: ENTRENAMIENTO Y PRUEBA
# ------------------------------------------------------------
set.seed(123)
train_index <- createDataPartition(df_final$valorIndicador, p = 0.8, list = FALSE)
train_data <- df_final[train_index, ]
test_data  <- df_final[-train_index, ]

# ------------------------------------------------------------
# Convertir a matrices para XGBoost
# ------------------------------------------------------------
x_train <- as.matrix(train_data[, -1])
y_train <- train_data$valorIndicador
x_test  <- as.matrix(test_data[, -1])
y_test  <- test_data$valorIndicador

# ------------------------------------------------------------
# ENTRENAMIENTO DEL MODELO XGBOOST
# ------------------------------------------------------------
xgb_model <- xgboost(data = x_train, label = y_train, 
                     objective = "reg:squarederror",
                     nrounds = 100, verbose = 0)

# ------------------------------------------------------------
# EVALUACIÓN DEL MODELO
# ------------------------------------------------------------
predictions <- predict(xgb_model, x_test)

# Calcular métricas de error
mae <- mean(abs(predictions - y_test))
mse <- mean((predictions - y_test)^2)
rmse <- sqrt(mse)

cat("MAE:", round(mae, 2), "\n")
cat("MSE:", round(mse, 2), "\n")
cat("RMSE:", round(rmse, 2), "\n")

# ___________________________________________________________________
# 6. MODELO DE REGRESIÓN SVR (Support Vector Regression) - REGRESIÓN
# ____________________________________________________________________

# ------------------------------------------------------------
# CARGAR Y SELECCIONAR VARIABLES
# Variable dependiente: valorIndicador
# Variables predictoras: nombrePais, sueldoMinimo_USD, categoria, anio, poblacion, desempleo, pib_total
# ------------------------------------------------------------
df_model <- df %>%
  select(valorIndicador, nombrePais, sueldoMinimo_USD, categoria, anio, poblacion, desempleo, pib_total)

# ------------------------------------------------------------
# TRANSFORMAR VARIABLES CATEGÓRICAS EN DUMMIES
# ------------------------------------------------------------
df_model$nombrePais <- as.factor(df_model$nombrePais)
df_model$categoria <- as.factor(df_model$categoria)
df_model$anio <- as.factor(df_model$anio)

dummies <- dummyVars(valorIndicador ~ ., data = df_model)
df_encoded <- predict(dummies, newdata = df_model)
df_final <- data.frame(valorIndicador = df_model$valorIndicador, df_encoded)

# ------------------------------------------------------------
# DIVISIÓN DE DATOS EN ENTRENAMIENTO Y PRUEBA
# ------------------------------------------------------------
set.seed(123)
train_index <- createDataPartition(df_final$valorIndicador, p = 0.8, list = FALSE)
train_data <- df_final[train_index, ]
test_data  <- df_final[-train_index, ]

# ------------------------------------------------------------
# ENTRENAR MODELO SVR (Support Vector Regression)
# ------------------------------------------------------------
svr_model <- svm(valorIndicador ~ ., data = train_data, kernel = "radial")

# ------------------------------------------------------------
# PREDICCIONES Y EVALUACIÓN
# ------------------------------------------------------------
predictions <- predict(svr_model, newdata = test_data)

mae <- mean(abs(predictions - test_data$valorIndicador))
mse <- mean((predictions - test_data$valorIndicador)^2)
rmse <- sqrt(mse)

cat("MAE:", round(mae, 2), "\n")
cat("MSE:", round(mse, 2), "\n")
cat("RMSE:", round(rmse, 2), "\n")

#Estudiantes:
# Oliver Roberto Saraguro Remache
# Iván Patricio González Castro
# Renata Alejandra Maldonado Bravo
# Italo Israel López Armijos

