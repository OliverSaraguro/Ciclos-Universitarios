#################
# PRACTICA 4
# CoinGecko
#################

library("tidyr")
library("dplyr")




# =====================================================================
# Requerimiento 1 -> Obtener el ranking de monedas según capitalización
# =====================================================================
urlApi = "https://api.coingecko.com/api/v3/coins/markets"
moneda = "usd"
orden = "market_cap_dsc"
observaciones = 50
grafica_7d = "true"

url = paste0(urlApi,
             "?vs_currency=", moneda,
             "&order=", orden,
             "&per_page=", observaciones,
             "&sparkline=", grafica_7d)

rpta = GET(url)

class(rpta)

status_code(rpta)

cntApi = content(rpta, "text", encoding = "UTF-8")

cnt = fromJSON(cntApi, flatten = TRUE)

str(cnt)

# Reducir dimencionalidad (TRANFORMACION)
cnt = cnt %>%
  select(symbol, name, image, current_price, market_cap, market_cap_rank, 
         high_24h, low_24h, price_change_24h, circulating_supply, last_updated,
         sparkline_in_7d.price)

# Renombrar variables (LIMPIEZA)
cnt = cnt %>%
  rename(simbolo = symbol,
         nombre = name,
         imagen = image,
         precioActual = current_price,
         capitalizacion = market_cap,
         rankingCapitalizacion = market_cap_rank,
         max24H = high_24h,
         min24H = low_24h,
         variacion24H = price_change_24h,
         monedasCirculacion = circulating_supply, 
         fechaActualizacion = last_updated,
         precios7D = sparkline_in_7d.price)

# ENRIQUECIMIENTO DE DATOS 
# Agregar el valor max, min, promedio de la semana 
cnt = cnt %>% 
  mutate(max7d = sapply(precios7D, max),
         min7d = sapply(precios7D, min),
         promedio7d = sapply(precios7D, mean))%>%
  select(-precios7D) 


# LIMPIEZA
cnt = cnt %>%
  mutate(fechaActualizacion = gsub("T", "", fechaActualizacion),
         fechaActualizacion = gsub("Z", "", fechaActualizacion),
         fechaActualizacion = as.POSIXct(fechaActualizacion, format = "%Y-%m-%d %H:%M:%S"))

# TRANSFORMACION
cnt = cnt %>%
  mutate(
    precioActual = round(precioActual, 2),
    capitalizacion = round(capitalizacion, 2),
    max24H = round(max24H, 2),
    min24H = round(min24H, 2),
    variacion24H = round(variacion24H, 2),
    monedasCirculacion = round(monedasCirculacion, 2),
    max7d = round(max7d, 2),
    min7d = round(min7d, 2),
    promedio7d = round(promedio7d, 2)
  )


# =================================================
# Requerimiento 2 -> criptomonedas populares hoy
# =================================================

urlApi2 = "https://api.coingecko.com/api/v3/search/trending"

rpta2 <- GET(urlApi2)

class(rpta2)

status_code(rpta2)

cntApi2 <- content(rpta2, "text", encoding = "UTF-8")

cnt2 <- fromJSON(cntApi2, flatten = TRUE)

cnt2 = cnt2[[1]]

# Reducir dimencionalidad (TRANFORMACION)
cnt2 = cnt2 %>%
  select(item.id, item.name, item.symbol, item.market_cap_rank, item.thumb, 
         item.data.price_btc, item.score, item.data.price, item.data.market_cap, 
         item.data.total_volume)

# Renombrar variables (LIMPIEZA)
cnt2 = cnt2 %>%
  rename(
    id = item.id,
    nombre = item.name,
    simbolo = item.symbol,
    rankingCapMercado = item.market_cap_rank,
    imagen = item.thumb,
    precioBtc = item.data.price_btc,
    puntuacion = item.score,
    precioUSD = item.data.price,
    capitalizacionMercado = item.data.market_cap,
    volumenTotal = item.data.total_volume
  )


str(cnt2)

# LIMPIEZA
cnt2 = cnt2 %>%
  mutate(capitalizacionMercado = gsub("[\\$,]", "", capitalizacionMercado),
         volumenTotal = gsub("[\\$,]", "", volumenTotal))

# TRANFORMACION
cnt2 = cnt2 %>%
  mutate(precioUSD = round(precioUSD,3), 
         capitalizacionMercado = as.numeric(capitalizacionMercado),
         volumenTotal = as.numeric(volumenTotal))

