rm(list = ls())

# Instalamos las librerias
install.packages("DBI")
install.packages("RMySQL") 

library("DBI")
library("RMySQL")

# Conectamos y se configura la conexion para la bd en MySql
con <- dbConnect(RMySQL::MySQL(),
                  dbname = "classicmodels",
                  host = "localhost",
                  port = 3306,
                  user = "root",
                  password = "oliversaraguro")
vista <- paste0(
  "SELECT ",
  "c.customerNumber as NumeroCliente, ",
  "c.customerName as NombreCliente, ",
  "c.country as Pais, ",
  "c.city as Ciudad, ",
  "c.state as Estado, ",
  "o.orderNumber as NumeroOrden, ",
  "o.orderDate as FechaOrden, ",
  "o.status as EstadoPedido, ",
  "od.productCode as CodigoProducto, ",
  "p.productName as NombreProducto, ",
  "p.productLine as LineaDeProducto, ",
  "p.quantityInStock as CantidadStock, ",
  "p.buyPrice as PrecioCompra, ",
  "od.quantityOrdered as CantidadOrden, ",
  "od.priceEach as PrecioUnitario, ",
  "e.employeeNumber AS representanteID, ",
  "e.firstName AS Nombre, ",
  "e.lastName AS Apellido, ",
  "ofi.city AS ciudadOficina, ",
  "ofi.country AS paisOficina ",
  "FROM customers c ",
  "JOIN orders o ON c.customerNumber = o.customerNumber ",
  "JOIN orderdetails od ON o.orderNumber = od.orderNumber ",
  "JOIN products p ON od.productCode = p.productCode ",
  "LEFT JOIN employees e ON c.salesRepEmployeeNumber = e.employeeNumber ",
  "LEFT JOIN offices ofi ON e.officeCode = ofi.officeCode;"
)

# 1 FORMA
practica2 <- dbGetQuery(con, vista)
# 2 FORMA
practica2.1 <- dbGetQuery(con, "SELECT * FROM vista_ventas")




# Atributos derivados 
library("dplyr")
# 1
practica2 <- practica2 %>%
  mutate(TotalVenta = CantidadOrden * PrecioUnitario)

# 2
practica2 <- practica2 %>%
  mutate(
    ClasificacionVenta = case_when(
      TotalVenta <= 2000 ~ "Baja",
      TotalVenta <= 5000 ~ "Media",
      TRUE ~ "Alta"
    )
  )

# Estadistica 
practica2 %>% distinct(Pais)

# 1 # 1 Pais
practica2 %>%
  group_by(Pais) %>%
  summarise(VentaTotal = sum(TotalVenta)) %>%
  arrange(desc(VentaTotal)) %>%
  filter(VentaTotal > 200000) %>%
  select(Pais, VentaTotal)

# 2
practica2 %>%
  group_by(NombreProducto) %>%
  summarise(TotalCantidad = sum(CantidadOrden)) %>%
  arrange(desc(TotalCantidad)) %>%
  slice(1:5)

# 3 
practica2 %>%
  filter(Pais == "USA") %>%
  group_by(representanteID, Nombre, Apellido) %>%
  summarise(TotalVendido = sum(TotalVenta)) %>%
  arrange(desc(TotalVendido))

# 4 
practica2 %>%
  mutate(GananciaUnitario = round(PrecioUnitario - PrecioCompra, 2)) %>%
  group_by(NombreProducto) %>%
  summarise(GananciaPromedio = mean(GananciaUnitario)) %>%
  arrange(desc(GananciaPromedio)) %>%
  slice(1:5)

# 5
practica2 %>%
  group_by(LineaDeProducto) %>%
  summarise(TotalIngresos = sum(TotalVenta)) %>%
  arrange(desc(TotalIngresos)) %>%
  slice(1:3)

