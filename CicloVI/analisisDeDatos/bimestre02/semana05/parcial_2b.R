
library(dplyr)
library(ggplot2)

getwd()
df = read.csv("datasetParcial_2b.csv")

########################
# EXPLORACIÓN
########################

dim(df) # 32581    12
colnames(df)
head(df)
str(df)
summary(df)
class(df)

unique(df$Id)
unique(df$Age)
unique(df$Income)
unique(df$Home)
unique(df$Emp_length)
unique(df$Intent)
unique(df$Amount)
unique(df$Rate)
unique(df$Status)
unique(df$Percent_income)
unique(df$Default)
unique(df$Cred_length)

# Clasificacion de variables 
# Numericas
# -> Id, Age, Icome, Emp_length, Amount, Rate, Percent_income, Cred_length
# Categoricas 
# -> Home, Intent, Status, Default
# Bimodales 

#########################
# ANALISIS EDA
#########################

# Valores nulos
sapply(df, function(x) sum(is.na(x) | !nzchar(x))) # Cantidad de valores faltantes y nulos       

# Inspeccionar observaciones con valores faltantes 
df[is.na(df$Emp_length) | !nzchar(df$Emp_length),]
df[is.na(df$Rate) | !nzchar(df$Rate),]

df_clean = df %>% select(-1)

# Elimine datos Faltantes -> Emp_length
df_clean = df_clean %>% filter(!is.na(Emp_length) | !nzchar(df$Emp_length) )
df_clean = df_clean %>% filter(!is.na(Rate) | !nzchar(Rate) )

sapply(df_clean_2, function(x) sum(is.na(x) | !nzchar(x))) 

# Elimine datos Atipicos para una de las variables
# Mostrar cuartiles
quantile(df_clean$Age, na.rm = TRUE)

# Calcular IQR
Q1 <- quantile(df_clean$Age,0.25, na.rm = TRUE)
Q1
Q3 <- quantile(df_clean$Age,0.75, na.rm = TRUE)
Q3
IQR <- Q3 - Q1
IQR

# Calcular límites
limite_inf <- Q1 - 1.5 * IQR
limite_sup <- Q3 + 1.5 * IQR
limite_inf
limite_sup

# Detectar outliers usando los límites inferior y superior
outliers <- df_clean$Age[df_clean$Age < limite_inf | df_clean$Age > limite_sup]
print(outliers)

# Cantidad absoluta y relativa de outliers
sum(df_clean$Age < limite_inf | df_clean$Age > limite_sup)
mean(df_clean$Age < limite_inf | df_clean$Age > limite_sup)

# Observaciones con valores atípicos
df_out <- df_clean %>% filter(Age < limite_inf | Age > limite_sup)
df_out

# Visualización con boxplot (diagrama de caja)
boxplot(df_clean$Age, main = "Boxplot de Age", 
        ylab = "Precio del pasaje")
boxplot.stats(df_clean$Age)$out

# Eliminar Outliers
df_clean <- df_clean %>%
  filter(Age >= limite_inf & Age <= limite_sup)

sd(df_clean$Age)
quantile(df_clean$Age)
boxplot(df_clean$Age)



#########################
# ANALISIS PCA
#########################
str(df_clean)

# Calcular PCA sobre varibles continuas
df_pca = df_clean %>% select(Amount, Age, Cred_length, Percent_income)   
str(df_pca)

pca <- prcomp(df_pca, center = TRUE, scale. = TRUE)

# Ver la varianza explicada (importancia de componentes)
summary(pca)

plot(pca)

# Ver la matriz de rotación
print(pca$rotation)

# Convertir los datos de PCA a un data frame
pca_data <- as.data.frame(pca$x)

# Añadir las etiquetas 
pca_data$TipoVivienda <- df_clean$Home

# Crear un gráfico de dispersión para analizar El proposito del Prestamo
# en el contexto de las dos primeras componentes PC1 y PC2
ggplot(pca_data, aes(x = PC1, y = PC2, colour = TipoVivienda)) +
  geom_point() +
  labs(title = "PCA del Conjunto de Datos de Prestamos",
       x = "Primer Componente Principal",
       y = "Segundo Componente Principal") +
  theme_minimal()


