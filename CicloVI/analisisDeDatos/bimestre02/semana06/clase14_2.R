
install.packages("e1071")

library(dplyr)
library(caret)
library(e1071)

##############################
# Clasificacion Bayesiana 
##############################

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

# 2 Parte
# Dividir los datos de entrenamiento (80%) y de prueba (20%)
set.seed(88)
train_index = createDataPartition(df_clean$Survived,
                                  p = 0.8,
                                  list = FALSE)

train_data = df_clean[train_index, ] # Datos de entrenamiento
test_data = df_clean[-train_index, ] # Datos de prueba


# Ajustar el modelo de arbol de decision
nb_model = naiveBayes(Survived ~ Pclass + Sex + Age + SibSp + Parch + Fare + Embarked,
                        data = train_data)

print(nb_model)

# Evaluar el modelo
nb_pred = predict(nb_model, test_data)

# Matriz de confusion
conf_matrix = confusionMatrix(nb_pred,
                              test_data$Survived,
                              positive = "1")

print(conf_matrix)
