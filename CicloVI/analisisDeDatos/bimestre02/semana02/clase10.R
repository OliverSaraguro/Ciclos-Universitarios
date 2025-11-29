

########################################################
# REGRESIÓN LINEAL MÚLTIPLE
#######################################################

###############################
# Ejemplo sobre dataset mtcars
###############################

head(mtcars)
str(mtcars)
names(mtcars)

# Modelo de regresión lineal múltiple
model <- lm(mpg ~ wt + hp + drat, data = mtcars)

summary(model)

# Comparativa valor predicho vs valor real
predicciones <- predict(model, newdata = mtcars)

comparacion <- data.frame(Real = mtcars$mpg, Predicho = predicciones, 
                          Residuo = mtcars$mpg - predicciones)

print(comparacion)

###############################
# Ejemplo sobre dataset titanic
###############################

library(dplyr)

# Cargar y explorar datos
df <- read.csv("titanic.csv")

head(df)
summary(df)
names(df)

# Preprocesar datos
sapply(df, function(x) mean(is.na(x) | !nzchar(x)))

df_clean <- df %>% 
  select(-c(PassengerId, Name, Ticket, Cabin)) %>%
  filter(!is.na(Age) & nzchar(Embarked))

sapply(df_clean, function(x) mean(is.na(x) | !nzchar(x)))

# Convertir variables categóricas a factores
names(df_clean)

df_clean <- df_clean %>% 
  mutate(
    Survived = as.factor(Survived),
    Pclass = as.factor(Pclass),
    Sex = as.factor(Sex),
    Embarked = as.factor(Embarked)
  )

summary(df_clean)
str(df_clean)

# Modelo de regresión lineal múltiple
# Variable dependiente: Age

modelo <- lm(Age ~ Survived + Pclass + Sex + SibSp + Parch + Fare + Embarked, 
             data = df_clean)
summary(modelo)


# Corrección de valores atípicos (Fare)

names(df_clean)

Q1 <- quantile(df_clean$Fare,.25)
Q3 <- quantile(df_clean$Fare,.75)
IQR <- Q3 -Q1
l_sup <- Q3 + 1.5 * IQR
l_inf <- Q1 - 1.5 * IQR

sum(df_clean$Fare < l_inf | df_clean$Fare > l_sup)
mean(df_clean$Fare < l_inf | df_clean$Fare > l_sup)

# Correccion 1: Transforma datos por Raiz cuadrada

df_final <- df_clean %>%
  mutate(Fare_sqrt = sqrt(Fare))

modelo <- lm(Age ~ Survived + Pclass + Sex + SibSp + Parch + Fare_sqrt + Embarked, 
             data = df_final)
summary(modelo)


# Correccion 2: Eliminar atípicos

df_clean_sin_out <- df_clean %>%
  filter(!(df_clean$Fare < l_inf | df_clean$Fare > l_sup))

modelo <- lm(Age ~ Survived + Pclass + Sex + SibSp + Parch + Fare + Embarked, 
             data = df_clean_sin_out)
summary(modelo)


#############################################################
# Ejercicio 1: Tarea en clase sobre Regresión Lineal Múltiple
#############################################################

library(dplyr)

df <- read.csv("laptop_data_cleaned.csv", sep=";")

sapply(df, function(x) mean(is.na(x) | !nzchar(x)))

str(df)

df <- df %>%
  mutate ( 
    Price = as.numeric(gsub(",", ".", Price)),
    Weight = as.numeric(gsub(",", ".", Weight)),
    Ppi = as.numeric(gsub(",", ".", Ppi))
  )

# Factorizar variables categoricas
df <- df %>%
  mutate(
    Company = as.factor(Company),
    TypeName = as.factor(TypeName),
    Cpu_brand = as.factor(Cpu_brand),
    Gpu_brand = as.factor(Gpu_brand),
    SSD = as.factor(SSD),
    Os = as.factor(Os)
  )

str(df)

modelo <- lm(Price ~ Ram + Cpu_brand + SSD + Company + TypeName , data = df)

summary(modelo)
