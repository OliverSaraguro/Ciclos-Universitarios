library(dplyr)
library(caret)  # Para regresión logística y partición
library(rpart)
library(rpart.plot)
library(ggplot2)  # Necesario para el gráfico

# Establecer el directorio de trabajo
setwd("/Users/oliversaraguro/Desktop/CicloVI/analisisDeDatos/dataset")

# Cargar dataset
df <- read.csv("Penguins_Species.csv")

# Vista preliminar
head(df)
names(df)
str(df)

# Seleccionar variables relevantes
df_clean <- df %>%
  select(sex, culmen_length_mm, culmen_depth_mm,
         flipper_length_mm, body_mass_g)

# Verificar valores faltantes
sapply(df_clean, function(x) sum(is.na(x) | !nzchar(as.character(x))))
sapply(df_clean, function(x) mean(is.na(x) | !nzchar(as.character(x))))

# Eliminar casos con sexo faltante o inválido
df_clean <- df_clean %>%
  filter(!is.na(sex), sex != ".")

# Convertir variable objetivo a factor
df_clean$sex <- as.factor(df_clean$sex)

# Dividir en entrenamiento (80%) y prueba (20%)
set.seed(88)
train.index <- createDataPartition(df_clean$sex, p = 0.8, list = FALSE)
train_data <- df_clean[train.index, ]
test_data <- df_clean[-train.index, ]

# Ajustar el Modelo de Regresión Logística
# NOTA: Se mantienen todas las variables para observar su significancia estadística
model <- glm(sex ~ culmen_length_mm + culmen_depth_mm +
               flipper_length_mm + body_mass_g,
             data = train_data,
             family = binomial)

# Ver resumen del modelo
summary(model)
model$coefficients

# Predecir en el conjunto de prueba
predictions <- predict(model, test_data, type = "response")

# Convertir probabilidades en clases predichas
# Asumiendo que "MALE" es la clase positiva
predicted_classes <- ifelse(predictions > 0.5, "MALE", "FEMALE")
predicted_classes <- factor(predicted_classes, levels = c("FEMALE", "MALE"))

# Matriz de confusión
conf_matrix <- confusionMatrix(predicted_classes,
                               test_data$sex,
                               positive = "MALE")

# Ver resultados
conf_matrix

# Visualizar las probabilidades predichas en función del ancho del pico
test_data$predicted_prob <- predictions

ggplot(test_data, aes(x = culmen_depth_mm, y = predicted_prob, color = sex)) +
  geom_point(alpha = 0.6) +
  labs(title = "Probabilidad predicha de ser macho o hembra vs Ancho del Pico",
       x = "Ancho del Pico (mm)",
       y = "Probabilidad Predicha") +
  theme_minimal()



#####################################
# DataSet: laptop_data_cleaned.csv
#####################################

df_2 = read.csv("laptop_data_cleaned.csv",
                sep = ";", dec = ",")

str(df_2)

unique(df_2$TypeName)

# Seleccionar variables relevantes y eliminar valores faltantes
df_clean2 <- df_2 %>%
  select(TouchScreen, TypeName, Price, Weight, Ppi, Ips)

sapply(df_clean2, function(x) sum(is.na(x) | !nzchar(as.character(x))))

# Converit a factores
df_clean2$TouchScreen = as.factor(df_clean2$TouchScreen)
df_clean2$Ips = as.factor(df_clean2$Ips)
df_clean2$TypeName = as.factor(df_clean2$TypeName)

str(df_clean2)


# Dividir los datos en conjuntos de entrenamiento y prueba
set.seed(88)
indices <- createDataPartition(df_clean2$TouchScreen, p = 0.8, list = FALSE)
entrenamiento <- df_clean2[indices, ]
prueba <- df_clean2[-indices, ]


# Crear el modelo de regresión logística
modelo <- glm(TouchScreen ~ TypeName + Price + Weight + Ppi + Ips, data = entrenamiento, 
              family = binomial)


# Resumen del modelo
summary(modelo)


# Hacer predicciones
probabilidades <- predict(modelo, newdata = prueba, type = "response")
predicciones <- ifelse(probabilidades > 0.5, 1, 0)


# Convertir a factor para comparación
predicciones <- as.factor(predicciones)
levels(predicciones) <- levels(df_clean2$TouchScreen)


# Matriz de confusión
confusionMatrix(predicciones, prueba$TouchScreen)


# Gráfico de probabilidades (usando la variable continua "Ppi")
ggplot(data = prueba, aes(x = Ppi, y = probabilidades, color = TouchScreen)) +
  geom_point() +
  labs(title = "Probabilidad de TouchScreen según PPI", x = "PPI", y = "Probabilidad") +
  theme_minimal()

