getwd()
setwd("/Users/oliversaraguro/Desktop/CicloVI/analisisDeDatos/bimestre01/semana03")

df = read.csv("titanic.csv")
dim(df)
colnames(df)
head(df)
str(df)
summary(df)
class(df)
unique(df)

# Valores nulos 
colSums(is.na(df))      # Cuantos valores nulos hay en la columna
colMeans(is.na(df))     # Media valores nulos hay en la columna

# Valores nulos y vacion
sapply(df, function(x) sum(is.na(x) | !nzchar(x))) # Cantidad de valores faltantes y nulos
sapply(df, function(x) mean(is.na(x) | !nzchar(x))) # Media de valores faltantes y nulos

# Inspeccionar observaciones con valores faltantes 
df[is.na(df$Embarked) | !nzchar(df$Embarked),]


###################################################
# Tratamiento de valores faltantes
###################################################

library(dplyr)

# Opción 1: Eliminación de filas
df1 <- df %>% filter(!is.na(Embarked) & nzchar(Embarked))

# Opción 2: Eliminación de columnas
df2 <- df %>% select(-Cabin)

# Opción 3: Imputación de valors nulos (media, mediana, u otro)
# Ej: asignar la mediana del resto de observaciones
mediana_Age <- median(df$Age,na.rm = TRUE)
df3 <- df %>% mutate(Age = ifelse(is.na(Age),mediana_Age,Age))

# Opción 4: Imputación con valores múltiples
# Ej: asignar la media de la edad según la clase a la que pertenece
df4 <- df %>% 
  mutate (Age = case_when(
    is.na(Age) & Pclass == 1 ~ mean(Age[Pclass == 1],na.rm = TRUE),
    is.na(Age) & Pclass == 2 ~ mean(Age[Pclass == 2],na.rm = TRUE),
    is.na(Age) & Pclass == 3 ~ mean(Age[Pclass == 3],na.rm = TRUE),
    TRUE ~ Age
  ))                     



###################################################
# Identificación de tipos de variables
###################################################

colnames(df)
str(df)
unique(df$PassengerId)
mode(df$Survived)
unique(df$Embarked)

# Tipos de variables
# Numéricas / Cuantitativas
#           Age, Fare
# Categóricas
#           Survived, Pclass, Sex, Embarked
# Bimodales
#           SibSp, Parch
# Variables de texto / no representativas:
#           PassengerId, Name, Ticket, Cabin


###################################################
# Análisis univariado V. Categóricas
###################################################

# FACTORIZAR VARIABLES CATEGÓRICAS

str(df)

# Convertir variables categóricas a factores
df$Sex <- as.factor(df$Sex)
df$Pclass <- as.factor(df$Pclass)

str(df)
sapply(df, function(x) mode(x))
sapply(df, function(x) class(x))

# o

df <- df %>% 
  mutate(Sex = as.factor(Sex),
         Pclass = as.factor(Pclass))


# TABLAS DE FRECUENCIA

table(df$Pclass)

table(df$Sex)

prop.table(table(df$Pclass))


# GRAFICO DE BARRAS

install.packages("ggplot2")
library(ggplot2)

ggplot(df, aes(x = Pclass)) +
  geom_bar() +
  labs(title = "Distribución por clase de boleto",
       x = "Clase de boleto",
       y = "Frecuencia") +
  theme_minimal()

# GRÁFICO DE BARRAS APILADAS

ggplot(df, aes(x = Sex, fill = Pclass)) +
  geom_bar() +
  labs(
    title = "Distribución de pasajeros por sexo y clase",
    x = "Sexo",
    y = "Cantidad",
    fill = "Clase"
  ) +
  theme_minimal()


# TABLAS DE CONTINGENCIA

table(df$Sex, df$Pclass)


# GRAFICO DE MOSAICO

tabla_contingencia <- table(df$Sex, df$Pclass)

mosaicplot(tabla_contingencia, 
           color = TRUE,
           main = "Genero vs Clase de boleto",
           xlab = "Genero",
           ylab = "Clase de boleto")


###################################################
# Análisis univariado V. Numéricas
###################################################

# MEDIDAS DE TENDENCIA CENTRAL Y DISPERSIÓN

mean(df$Age, na.rm = TRUE)                              # Media

median(df$Age, na.rm = TRUE)                            # Mediana

sd(df$Age, na.rm = TRUE)                                # Desviación estándar

var(df$Age, na.rm = TRUE)                               # Varianza

max(df$Age, na.rm = TRUE) - min(df$Age, na.rm = TRUE)   # Rango

diff(range(df$Age, na.rm = TRUE))                       # Rango

summary(df$Age)                                         # Resumen estadístico


# HISTOGRAMAS

library(ggplot2)

ggplot(df, aes(x=Fare)) +
  geom_histogram(binwidth = 50) +
  labs(title = "Distribución de Tarifas",
       x = "Tarifa",
       y = "Frecuencia") +
  theme_minimal()


# DIAGRAMAS DE DISPERSIÓN

ggplot(df, aes(x = Age, y = Fare)) +
  geom_point() +
  labs(title = "Tarifas vs Edades",
       x = "Edades",
       y = "Tarifas") +
  theme_minimal()


# MATRIZ DE CORRELACIÓN

install.packages("corrplot")
library(corrplot)
library(dplyr)

# Seleccionar solo variables numéricas
df_num <- df %>%
  select(where(is.numeric))

# Ver estructura de variables numéricas seleccionadas
str(df_num)

# Calcular la matriz de correlación (omitiendo NA)
cor_matrix <- cor(df_num, use = "complete.obs")

# Mostrar la matriz en consola
print(cor_matrix)

# Graficar la matriz de correlación
corrplot(cor_matrix, method = "circle", 
         tl.col = "black",
         title = "Matriz de Correlación - Titanic", 
         mar = c(0,0,2,0))


###################################################
# Análisis de outliers (valores atípicos)
###################################################

# Mostrar cuartiles
quantile(df$Fare, na.rm = TRUE)

# Calcular IQR
Q1 <- quantile(df$Fare,0.25, na.rm = TRUE)
Q3 <- quantile(df$Fare,0.75, na.rm = TRUE)
IQR <- Q3 - Q1

# Calcular límites
limite_inf <- Q1 - 1.5 * IQR
limite_sup <- Q3 + 1.5 * IQR

# Detectar outliers usando los límites inferior y superior
outliers <- df$Fare[df$Fare < limite_inf | df$Fare > limite_sup]
print(outliers)

# Cantidad absoluta y relativa de outliers
sum(df$Fare < limite_inf | df$Fare > limite_sup)
mean(df$Fare < limite_inf | df$Fare > limite_sup)

# Observaciones con valores atípicos
df_out <- df %>% filter(Fare < limite_inf | Fare > limite_sup)

# Visualización con boxplot (diagrama de caja)
boxplot(df$Fare, main = "Boxplot de Fare", 
        ylab = "Precio del pasaje")
boxplot.stats(df$Fare)$out

###################################################
# Tratamiento de outliers
###################################################

# SIN TRATAMIENTO

sd(df$Fare)
quantile(df$Fare)
boxplot(df$Fare)

# OPCIÓN 1: Imputar atípicos con mediana

df_op1 <- df %>%
  mutate(Fare = ifelse(Fare < limite_inf | Fare > limite_sup,
                       median(Fare),Fare))
sd(df_op1$Fare)
quantile(df_op1$Fare)
boxplot(df_op1$Fare)

# OPCIÓN 2: Imputar atipicos con limites

df_op2 <- df %>%
  mutate(Fare = ifelse(Fare < limite_inf, 0,
                       ifelse(Fare > limite_sup, 
                              limite_sup, Fare)))
sd(df_op2$Fare)
quantile(df_op2$Fare)
boxplot(df_op2$Fare)

# OPCIÓN 3: Transforma datos por Raiz cuadrada

df_op3 <- df %>%
  mutate(Fare = sqrt(Fare))
sd(df_op3$Fare)
quantile(df_op3$Fare)
boxplot(df_op3$Fare)


# OPCIÓN 4: Transformar datos por logaritmo

df_op4 <- df %>%
  mutate(Fare = log(Fare + 1))
sd(df_op4$Fare)
quantile(df_op4$Fare)
boxplot(df_op4$Fare)


# OPCIÓN 5: Eliminar atípicos

df_op5 <- df %>%
  filter(df$Fare >= limite_inf & df$Fare <= limite_sup)
sd(df_op5$Fare)
quantile(df_op5$Fare)
boxplot(df_op5$Fare)

