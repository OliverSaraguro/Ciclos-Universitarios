
# Establecer la ruta para trabajar 
getwd()
setwd("/Users/oliversaraguro/Desktop/Ciclo VI/AnalisisDeDatos/bimestre01/semana03")


# Carga de datos desde CSV
?read.table()
datosPractica1 <- read.csv("sri_ventas_2025.csv", sep = '|', dec = ",", fileEncoding = "latin1")

# Inspeccion de Datos 
print(datosPractica1)
head(datosPractica1) # Primeras filas
str(datosPractica1) # Estructura resumida
summary(datosPractica1) # Resumen estadístico
dim(datosPractica1) # Dimensiones (filas, columnas)
class(datosPractica1) # Tipo de objeto
mode(datosPractica1) # Representación en memoria 


# VARIABLES DERIVADAS 
datosPractica1$PorcentajeVentasGravadas <- (
  datosPractica1$VENTAS_NETAS_TARIFA_GRAVADA / datosPractica1$TOTAL_VENTAS) * 100

datosPractica1$PorcentajeExportaciones <- (
  datosPractica1$EXPORTACIONES / datosPractica1$TOTAL_VENTAS) * 100

datosPractica1$RentabilidadComercial <- ((
  datosPractica1$TOTAL_VENTAS - datosPractica1$TOTAL_COMPRAS) / datosPractica1$TOTAL_VENTAS) * 100

head(datosPractica1[, c("PROVINCIA","PorcentajeVentasGravadas", "PorcentajeExportaciones", "RentabilidadComercial")])

# SUBCONJUNTO 
# Crear el subconjunto
subconjunto <- subset(datosPractica1, 
                      PROVINCIA == "LOJA" & 
                        CANTON == "CATAMAYO" & 
                        MES == 2, 
                      c(PROVINCIA, CODIGO_SECTOR_N1, CANTON, TOTAL_VENTAS, TOTAL_COMPRAS))
subconjunto


# ESTADISTICAS

mean(datosPractica1$TOTAL_VENTAS[datosPractica1$MES==1], na.rm = TRUE)

median(datosPractica1$TOTAL_VENTAS, na.rm = TRUE)

names(sort(table(datosPractica1$TOTAL_VENTAS[datosPractica1$TOTAL_VENTAS != 0]), decreasing = TRUE))[1]

var(datosPractica1$TOTAL_VENTAS, na.rm = TRUE)

sd(datosPractica1$TOTAL_VENTAS, na.rm = TRUE)

range(datosPractica1$TOTAL_VENTAS, na.rm = TRUE)

sum(datosPractica1$EXPORTACIONES[datosPractica1$MES == 2], na.rm = TRUE)

max(datosPractica1$EXPORTACIONES[datosPractica1$MES == 2 & datosPractica1$PROVINCIA == "LOJA"], na.rm = TRUE)


# Qué es estadísticas mediante agrupamientos"?
# Consta en agrupar los datos por una categoría (por ejemplo, PROVINCIA o CANTON).
# Y calcular estadísticas (como media, mediana, etc.) para cada grupo.
# No calcular una sola media para todo Ecuador, sino una media para cada provincia o cantón.

# EJEMPLO 1: Media de TOTAL_VENTAS por PROVINCIA
install.packages("dplyr")
library(dplyr)

media_total_ventas_provincia <- datosPractica1 %>%
  filter(MES == 1) %>%
  group_by(PROVINCIA) %>%
  summarise(Media_TOTAL_VENTAS = mean(TOTAL_VENTAS, na.rm = TRUE)) %>%
  arrange(PROVINCIA)
media_total_ventas_provincia

# EJEMPLO 2: Mediana de TOTAL_COMPRAS por CANTON
mediana_total_compras_canton <- datosPractica1 %>%
  filter(PROVINCIA == 'LOJA' & MES == 2) %>%
  group_by(CANTON) %>%
  summarise(Mediana_TOTAL_COMPRAS = median(TOTAL_COMPRAS, na.rm = TRUE))
mediana_total_compras_canton

# EJEMPLO 3: Máximo de EXPORTACIONES por PROVINCIA
max_exportaciones_provincia <- datosPractica1 %>%
  filter(MES == 2) %>%
  group_by(PROVINCIA) %>%
  summarise(Maximo_EXPORTACIONES = max(EXPORTACIONES, na.rm = TRUE)) %>%
  arrange(desc(Maximo_EXPORTACIONES))
max_exportaciones_provincia






