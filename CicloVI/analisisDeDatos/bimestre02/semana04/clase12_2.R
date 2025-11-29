#######################################
# REGRESIÓN LOGÍSTICA
########################################

######################
# Ejemplo TITANIC
######################

# Objetivo: predecir el estatus de sobrevivencia de un pasajero

# Instalar y cargar las librerías necesarias
install.packages("caret")
library(dplyr)
library(ggplot2)
library(caret)

# Cargar y explorar datos
df <- read.csv("titanic.csv")
head(df)
names(df)
str(df)

# Seleccionar variables relevantes y eliminar valores faltantes
df_clean <- df %>%
  select(Survived, Pclass, Sex, Age, SibSp, Parch, Fare, Embarked)

sapply(df_clean,function(x) mean(is.na(x) | !nzchar(x)))

df_clean <- df_clean %>% 
  filter(!is.na(Age) & nzchar(Embarked))

# Convertir variables categóricas a factores
df_clean$Survived <- as.factor(df_clean$Survived)
df_clean$Pclass <- as.factor(df_clean$Pclass)
df_clean$Sex <- as.factor(df_clean$Sex)
df_clean$Embarked <- as.factor(df_clean$Embarked)
str(df_clean)

# Dividir los Datos en Conjuntos de Entrenamiento y de Prueba
# 80% entrenamiento, 20% prueba, y generar un vector con 
# los índices de las obseraciones seleccionadas
set.seed(88)
train_index <- createDataPartition(df_clean$Survived, 
                                   p = 0.8,
                                   list = FALSE)
train_data <- df_clean[train_index, ]   #Datos de entrenamiento
test_data <- df_clean[-train_index, ]   #Datos de prueba

# Ajustar el Modelo de Regresión Logística
# Variables dependiente (a predecir): Survivded
model <- glm(Survived ~ Pclass + Sex + Age + SibSp + 
               Parch + Fare + Embarked, 
             data = train_data, 
             family = binomial)

# Resumen del modelo
summary(model)
model$coefficients


# EVALUAR EL MODELO
# Predecir en el conjunto de prueba
predictions <- predict(model, test_data, type = "response")

# Convertir probabilidades a etiquetas binarias
predicted_classes <- ifelse(predictions > 0.5, 1, 0)

# Matriz de confusión
conf_matrix <- confusionMatrix(factor(predicted_classes), 
                               test_data$Survived,
                               positive = "1")

# Ver la matriz de confusión
# y las métricas de evaluación
conf_matrix

# Visualizar los Resultados

# Añadir las predicciones al conjunto de prueba
test_data$predicted_prob <- predictions

# Gráfico de las probabilidades predichas vs. Edad, 
# separado por Sexo y Supervivencia
ggplot(test_data, aes(x = Age, y = predicted_prob, 
                      color = Survived)) +
  geom_point(alpha = 0.6) +
  facet_wrap(~ Sex) +
  labs(title = "Probabilidad Predicha de Supervivencia vs. Edad",
       x = "Edad",
       y = "Probabilidad Predicha") +
  theme_minimal()


###############################################################
# EJERCICIO 1: Tarea en clase sobre RL (Especies de Pingüinos)
###############################################################

# Objetivo: predecir el sexo del pingüino, a partir del resto de variables

# Cargar las librerías necesarias
library(dplyr)
library(ggplot2)
library(caret)

# Cargar y explorar datos
df <- read.csv("Penguins_Species.csv")

head(df)
names(df)
str(df)

# Seleccionar variables relevantes y eliminar valores faltantes
df_clean <- df

sapply(df_clean,function(x) mean(is.na(x) | !nzchar(x)))

df_clean <- df_clean %>% 
  filter(!is.na(sex))

df_clean <- df_clean[-c(8,11,329),]

# Convertir variables categóricas a factores
df_clean$sex <- as.factor(df_clean$sex)

# Dividir los Datos en Conjuntos de Entrenamiento y de Prueba
# 80% entrenamiento, 20% prueba, y generar un vector con 
# los índices de las obseraciones seleccionadas
set.seed(88)
train_index <- createDataPartition(df_clean$sex, 
                                   p = 0.8,
                                   list = FALSE)
train_data <- df_clean[train_index, ]   #Datos de entrenamiento
test_data <- df_clean[-train_index, ]   #Datos de prueba

# Ajustar el Modelo de Regresión Logística
# Variables dependiente (a predecir): Survivded
model <- glm(sex ~ culmen_length_mm + culmen_depth_mm + 
               flipper_length_mm + body_mass_g, 
             data = train_data, 
             family = binomial)

str(train_data$sex)

# Resumen del modelo
summary(model)
model$coefficients


# EVALUAR EL MODELO
# Predecir en el conjunto de prueba
predictions <- predict(model, test_data, type = "response")

# Convertir probabilidades a etiquetas binarias
predicted_classes <- ifelse(predictions > 0.5, "MALE", "FEMALE")

# Matriz de confusión
conf_matrix <- confusionMatrix(factor(predicted_classes), 
                               test_data$sex,
                               positive = "MALE")

# Ver la matriz de confusión
# y las métricas de evaluación
conf_matrix


# Visualizar los Resultados

# Añadir las predicciones al conjunto de prueba
test_data$predicted_prob <- predictions

# Gráfico de las probabilidades predichas vs. la masa corporal, 
ggplot(test_data, aes(x = body_mass_g, y = predicted_prob, 
                      color = sex)) +
  geom_point(alpha = 0.6) +
  labs(title = "Probabilidad Predicha de sex = MALE vs. Masa Corporal",
       x = "Masa Corporal",
       y = "Probabilidad Predicha") +
  theme_minimal()


###############################################################
# EJERCICIO 1: Tarea en clase sobre RL (Laptops)
###############################################################

# Objetivo: predecir si la pantalla es IPS a partir de: compañía, 
# tipo de laptop, precio, resolución ppi, y fabricante del GPU 

# Cargar las librerías necesarias
library(dplyr)
library(ggplot2)
library(caret)

# Cargar y explorar datos
df <- read.csv("laptop_data_cleaned_ori.csv")

head(df)
names(df)
str(df)

# Seleccionar variables relevantes y eliminar valores faltantes
df_clean <- df %>%
  select(Ips, Company, TypeName, Price, Ppi, Gpu_brand, Os)

sapply(df_clean,function(x) mean(is.na(x) | !nzchar(x)))

# Convertir variables categóricas a factores
df_clean$Ips <- as.factor(df_clean$Ips)
df_clean$Company <- as.factor(df_clean$Company)
df_clean$TypeName <- as.factor(df_clean$TypeName)
df_clean$Gpu_brand <- as.factor(df_clean$Gpu_brand)
df_clean$Os<- as.factor(df_clean$Os)
str(df_clean)

# Dividir los Datos en Conjuntos de Entrenamiento y de Prueba
# 80% entrenamiento, 20% prueba, y generar un vector con 
# los índices de las obseraciones seleccionadas
set.seed(676)
train_index <- createDataPartition(df_clean$Ips, 
                                   p = 0.8,
                                   list = FALSE)
train_data <- df_clean[train_index, ]   #Datos de entrenamiento
test_data <- df_clean[-train_index, ]   #Datos de prueba

# Ajustar el Modelo de Regresión Logística
# Variables dependiente (a predecir): Survivded
model <- glm(Ips ~ Company + TypeName + Price + Ppi + Gpu_brand, 
             data = train_data, 
             family = binomial)

# Resumen del modelo
summary(model)
model$coefficients


# EVALUAR EL MODELO
# Predecir en el conjunto de prueba
predictions <- predict(model, test_data, type = "response")

# Convertir probabilidades a etiquetas binarias
predicted_classes <- ifelse(predictions > 0.5, 1, 0)

# Matriz de confusión
conf_matrix <- confusionMatrix(factor(predicted_classes), 
                               test_data$Ips,
                               positive = "1")

# Ver la matriz de confusión
# y las métricas de evaluación
conf_matrix


# Visualizar los Resultados

# Añadir las predicciones al conjunto de prueba
test_data$predicted_prob <- predictions

# Gráfico de las probabilidades predichas vs. el precio, 
# separado en paneles según el Sistema Operativo
ggplot(test_data, aes(x = Price, y = predicted_prob, 
                      color = Ips)) +
  geom_point() +
  facet_wrap(~ Os) +
  labs(title = "Probabilidad Predicha de pantalla IPS vs. el precio",
       x = "Precio",
       y = "Probabilidad Predicha") +
  theme_minimal()
