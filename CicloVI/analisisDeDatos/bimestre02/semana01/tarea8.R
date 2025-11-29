library(dplyr)
getwd()
setwd("/Users/oliversaraguro/Desktop/CicloVI/analisisDeDatos/bimestre02/semana02")

########################################
# Identificacion de tipos de variables
########################################

# Inspeccionar el conjunto de datos y ajustar los tipos de datos
df <- read.csv("countries_gdp_historical.csv", sep= ";", dec = ",")

dim(df)
colnames(df)
head(df)
str(df)
summary(df)
class(df)
unique(df)

# Identificar los tipos variables
colnames(df)
str(df)
unique(df$country_code)
unique(df$region_name)
unique(df$sub_region_name)
unique(df$intermediate_region)
unique(df$country_name)

unique(df$income_group)
unique(df$year)
unique(df$total_gdp)
unique(df$total_gdp_million)
unique(df$gdp_variation)


# Tipos de variables
# Numericas / Cuantitativas
## total_gdp, total_gdp_million, gdp_variation, year

# Categoricas
## region_name, sub_region_name, intermediate_region, income_group

# Bimodales 
## 

# Variables de texto / no representativas 
## country_code, country_name



# C
# Analizar valores faltantes. Detectar valores faltantes y a alguno de 
# ellos que corresponda a variable numérica imputarle el valor promedio, 
# de acuerdo grupo de ingresos al que pertenezca cada observación.
unique(df$income_group)

# total_gdp
df = df %>%
  mutate(total_gdp = case_when(
    income_group == "Ingreso alto" ~ mean(total_gdp[income_group == "Ingreso alto"], na.rm = TRUE),
    income_group == "Países de ingreso bajo" ~ mean(total_gdp[income_group == "Países de ingreso bajo"], na.rm = TRUE),
    income_group == "Países de ingreso mediano bajo" ~ mean(total_gdp[income_group == "Países de ingreso mediano bajo"], na.rm = TRUE),
    income_group == "Ingreso mediano alto" ~ mean(total_gdp[income_group == "Ingreso mediano alto"], na.rm = TRUE),
    income_group == "No clasificado" ~ mean(total_gdp[income_group == "No clasificado"], na.rm = TRUE),
    TRUE ~ total_gdp
    )
  )

# total_gdp_million
df = df %>%
  mutate(total_gdp_million = case_when(
    income_group == "Ingreso alto" ~ mean(total_gdp_million[income_group == "Ingreso alto"], na.rm = TRUE),
    income_group == "Países de ingreso bajo" ~ mean(total_gdp_million[income_group == "Países de ingreso bajo"], na.rm = TRUE),
    income_group == "Países de ingreso mediano bajo" ~ mean(total_gdp_million[income_group == "Países de ingreso mediano bajo"], na.rm = TRUE),
    income_group == "Ingreso mediano alto" ~ mean(total_gdp_million[income_group == "Ingreso mediano alto"], na.rm = TRUE),
    income_group == "No clasificado" ~ mean(total_gdp_million[income_group == "No clasificado"], na.rm = TRUE),
    TRUE ~ total_gdp_million
    )
  )

# gdp_variation
df = df %>%
  mutate(gdp_variation = case_when(
    income_group == "Ingreso alto" ~ mean(gdp_variation[income_group == "Ingreso alto"], na.rm = TRUE),
    income_group == "Países de ingreso bajo" ~ mean(gdp_variation[income_group == "Países de ingreso bajo"], na.rm = TRUE),
    income_group == "Países de ingreso mediano bajo" ~ mean(gdp_variation[income_group == "Países de ingreso mediano bajo"], na.rm = TRUE),
    income_group == "Ingreso mediano alto" ~ mean(gdp_variation[income_group == "Ingreso mediano alto"], na.rm = TRUE),
    income_group == "No clasificado" ~ mean(gdp_variation[income_group == "No clasificado"], na.rm = TRUE),
    TRUE ~ gdp_variation
    )
  )



# D
# Realizar el análisis univariado de alguna de las variables categóricas. 
# Incluir el análisis de la relación con alguna otra variable categórica.

# region_name, sub_region_name, intermediate_region, income_group
# Converitr a factores 
df$region_name = as.factor(df$region_name)
df$sub_region_name = as.factor(df$sub_region_name)
df$intermediate_region = as.factor(df$intermediate_region)
df$income_group = as.factor(df$income_group)

str(df)

# TABLAS DE FRECUENCIA
table(df$region_name)

prop.table(table(df$region_name)) # Evaluar cuantas observaciones se tiene por categoría


# GRAFICO DE BARRAS
library(ggplot2)

ggplot(df, aes(x = region_name)) + 
  geom_bar() +
  labs(title = "Distribucion por nombre de regiones", 
       x = "Nombre de Region",
       y = "Frecuencia")


# TABLA DE CONTIGENCIA

table(df$region_name, df$income_group)

# Gráfico 1: Barras apiladas - Cantidad de países por región y grupo de ingreso
ggplot(df, aes(x = region_name, fill = income_group)) +
  geom_bar() +
  labs(
    title = "Distribución de países por región y grupo de ingreso",
    x = "Región",
    y = "Cantidad",
    fill = "Grupo de ingreso"
  )



# E
# Realizar el análisis univariado de alguna de las variables númericas. 
# Incluir el análisis de correlación entre variables numéricas
## VARIABLES: total_gdp, total_gdp_million, gdp_variation, year

# Medidas de tendencia central y dispersión para year
mean(df$year, na.rm = TRUE)       # Media
median(df$year, na.rm = TRUE)     # Mediana
sd(df$year, na.rm = TRUE)         # Desviación estándar
var(df$year, na.rm = TRUE)        # Varianza
max(df$year, na.rm = TRUE) - min(df$year, na.rm = TRUE)  # Rango
summary(df$year)                  # Resumen estadístico

# Boxplot de year
boxplot(df$year,
        main = "Boxplot del Año",
        ylab = "Año")


# MATRIZ DE CORRELACION
library(corrplot)

# Seleccionar variables numéricas relevantes
df_num <- df %>% select(total_gdp, total_gdp_million, gdp_variation, year)

# Calcular matriz de correlación (omitimos NA)
cor_matrix <- cor(df_num, use = "complete.obs")

# Mostrar matriz en consola
print(cor_matrix)

# Visualización de la correlación
library(corrplot)
corrplot(cor_matrix, method = "circle")
