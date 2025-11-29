
getwd()
setwd("/Users/oliversaraguro/Desktop/Ciclo VI/AnalisisDeDatos/bimestre01/semana03")

# Carga de datos desde CSV
?read.table()
datosPractica1 <- read.csv("sri_ventas_2025.csv", sep = '|', dec = ",", fileEncoding = "latin1")

str(datosPractica1)


# dataset derivado
datosDerivados <- datosPractica1 %>%
  filter(VENTAS_NETAS_TARIFA_GRAVADA > 50000) %>%
  select(PROVINCIA, CANTON, TOTAL_VENTAS, TOTAL_COMPRAS, VENTAS_NETAS_TARIFA_GRAVADA) %>%
  mutate(Porcentaje_Venta_Gravada = (VENTAS_NETAS_TARIFA_GRAVADA / TOTAL_VENTAS) * 100) %>%
  mutate(Porcentaje_Venta_Gravada = round(Porcentaje_Venta_Gravada, 2)) %>%
  arrange(desc(TOTAL_VENTAS))
  
  
# Estadistica 1
estadistica1 = datosDerivados %>%
  group_by(PROVINCIA) %>%
  summarise(
    TotalVentas = sum(TOTAL_VENTAS, na.rm = TRUE),
    TotalCompras = sum(TOTAL_COMPRAS, na.rm = TRUE),
    PromedioVentas = mean(TOTAL_VENTAS, na.rm = TRUE),
    NroCantones = n_distinct(CANTON)
  ) %>%
  filter(TotalVentas > 1000000) %>%
  arrange(desc(TotalVentas))


# Estadistica 2
estadistica2 <- datosDerivados %>%
  group_by(CANTON) %>%
  summarise(TotalCompras = sum(TOTAL_COMPRAS, na.rm = TRUE)) %>%
  slice_max(order_by = TotalCompras, n = 3)
