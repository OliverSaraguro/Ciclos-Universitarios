# https://datosabiertos.gob.ec/dataset/reporte-movimiento-carga-de-exportacion-febrero-2025/resource/4aa2763b-f3df-4ae0-8242-b76d4c6e62a7

library(dplyr)
getwd()
setwd("/Users/oliversaraguro/Downloads")

df = read.csv("1.-mpceip_deeco_exportaciones_eeuu_2024_01.csv", 
              sep = ",", dec = ".", fileEncoding = "latin1")

dim(df)
colnames(df)
head(df)
str(df)
summary(df)
class(df)

unique(df$Año)
unique(df$Mes)
unique(df$País.Destino)
unique(df$Capítulo)
unique(df$Prod.Principal.N4.PP.N4.BCE..Descrip.)
unique(df$X6D)
unique(df$X8D)
unique(df$TRADICIONAL.Y.NO.TRAD)
unique(df$No.Petrolero.Y.PETRO)
unique(df$Código.Subpartida)
unique(df$Suma.de.FOB..miles.)
unique(df$Suma.de.TM..Peso.Neto.)


# Tipos de variables
# NUMERICAS
## Capítulo, X6D, X8D, Código.Subpartida, Suma.de.FOB..miles., Suma.de.TM..Peso.Neto., 
## Año, Mes

# CATEGORICAS
## País.Destino, Prod.Principal.N4.PP.N4.BCE..Descrip., TRADICIONAL.Y.NO.TRAD
## No.Petrolero.Y.PETRO

# BIMODALES
## 

# Renombrar columnas 
df = df %>% 
  rename(anio = Año,
         mes = Mes,
         paisDestino = País.Destino,
         capitulo = Capítulo,
         producto = Prod.Principal.N4.PP.N4.BCE..Descrip.,
         tradicional = TRADICIONAL.Y.NO.TRAD,
         petrolero = No.Petrolero.Y.PETRO,
         codigoSubpartida = Código.Subpartida,
         totalExportacion_K = Suma.de.FOB..miles.,
         totalPesoNeto_TN = Suma.de.TM..Peso.Neto.
         )


df = df %>%
  mutate(petrolero = case_when(
    petrolero == "No Petrolero" ~ "NO",
    petrolero == "Petrolero" ~ "SI",
    TRUE ~ petrolero
  ))


df = df %>%
  mutate(tradicional = case_when(
    tradicional == "NO TRADICIONAL" ~ "NO",
    tradicional == "TRADICIONAL" ~ "SI",
    TRUE ~ tradicional
  ))


# Filtramos el año 2024 y con los que vamos a realizar el analisis
df = df %>% filter(anio != 2024 & anio > 2019)

# Seleccion de columnas necesarias   
df = df %>% select(-4, -6, -7, -10)

# Tipos de variables
# NUMERICAS
## totalExportacion_K, totalPesoNeto_TN

# CATEGORICAS
## producto, tradicional, petrolero

# BIMODALES
## Año, Mes

# Texto
## paisDestino (Ya que solo tiene EEUU)



### Realizar EDA para variables categóricas. Al menos dos variables.

# Converitr a factores 
df$tradicional = as.factor(df$tradicional)
df$producto = as.factor(df$producto)


# TABLAS DE FRECUENCIA
table(df$tradicional)
table(df$producto)


# GRAFICO DE BARRAS
library(ggplot2)

ggplot(df, aes(x = tradicional)) + 
  geom_bar() +
  labs(title = "Distribucion por productos Tradicionales y No Tradicionales", 
       x = "Tradicional SI / NO",
       y = "Frecuencia")



# Top 10 productos más exportados (por frecuencia)
df %>%
  count(producto, sort = TRUE) %>%
  top_n(10, n) %>%
  ggplot(aes(x = reorder(producto, n), y = n)) +
  geom_col(fill = "orange") +
  coord_flip() +
  labs(title = "Top 10 produc exportados a EEUU",
       x = "Producto",
       y = "Cantidad de registros") +
  theme_minimal()


# Top 10 productos por valor total exportado
df %>%
  group_by(producto) %>%
  summarise(valor_total = sum(totalExportacion_K, na.rm = TRUE)) %>%
  arrange(desc(valor_total)) %>%
  slice(1:10) %>%
  ggplot(aes(x = reorder(producto, valor_total), y = valor_total)) +
  geom_col(fill = "darkgreen") +
  coord_flip() +
  labs(title = "Top 10 productos por valor total exportado",
       x = "Producto",
       y = "Valor FOB total") +
  theme_minimal()





# ============================
# EDA PARA VARIABLES NUMÉRICAS
# ============================
library(corrplot)

# Seleccionar solo variables numéricas
df_num = df %>%
  select(where(is.numeric))

# Ver estructura de variables numéricas seleccionadas
str(df_num)

# Calcular la matriz de correlación (omitiendo NA)
cor_matrix <- cor(df_num, use = "complete.obs")

# Mostrar la matriz en consola
print (cor_matrix)

# Graficar la matriz de correlación
corrplot(cor_matrix, method = "circle",
         tl.col = "black",
         title = "Matriz de Correlación - Exportaciones Ecuador",
         mar = c(0,0,2,0))



#  Medidas estadísticas
summary(df$totalExportacion_K)
summary(df$totalPesoNeto_TN)

mean(df$totalExportacion_K, na.rm = TRUE)       # Media
median(df$totalExportacion_K, na.rm = TRUE)     # Mediana
sd(df$totalExportacion_K, na.rm = TRUE)         # Desviación estándar
var(df$totalExportacion_K, na.rm = TRUE)        # Varianza
max(df$totalExportacion_K, na.rm = TRUE) - min(df$totalExportacion_K, na.rm = TRUE)  # Rango

mean(df$totalPesoNeto_TN, na.rm = TRUE)       # Media
median(df$totalPesoNeto_TN, na.rm = TRUE)     # Mediana
sd(df$totalPesoNeto_TN, na.rm = TRUE)         # Desviación estándar
var(df$totalPesoNeto_TN, na.rm = TRUE)        # Varianza
max(df$totalPesoNeto_TN, na.rm = TRUE) - min(df$totalPesoNeto_TN, na.rm = TRUE)  # Rango

# Cuartiles e IQR
Q1 <- quantile(df$totalPesoNeto_TN, 0.25, na.rm = TRUE)
Q3 <- quantile(df$totalPesoNeto_TN, 0.75, na.rm = TRUE)
IQR <- Q3 - Q1
limite_inf <- Q1 - 1.5 * IQR
limite_sup <- Q3 + 1.5 * IQR

# Outliers
outliers <- df$totalPesoNeto_TN[df$totalPesoNeto_TN < limite_inf | df$totalPesoNeto_TN > limite_sup]
# Total de outliers
length(outliers)                 
# Proporción de outliers
mean(df$totalPesoNeto_TN %in% outliers) 

# Transformación logarítmica
df1 <- df %>%
  mutate(
    totalExportacion_K = log(totalExportacion_K + 1),
    totalPesoNeto_TN = log(totalPesoNeto_TN + 1)
  )

# Grafic
ggplot(df1, aes(x = totalPesoNeto_TN, y = totalExportacion_K)) +
  geom_point(alpha = 0.3, color = "darkgreen") +
  geom_smooth(method = "lm", color = "red", se = FALSE) +
  labs(
    title = "Relación entre Peso Neto y Valor Exportado (log)",
    x = "Log(Peso Neto en toneladas + 1)",
    y = "Log(Valor exportado en miles USD + 1)"
  ) +
  theme_minimal()






























