install.packages("tidyr")
library("tidyr")
library("dplyr")

getwd()

setwd("/Users/oliversaraguro/Desktop/CicloVI/analisisDeDatos/bimestre01/semana07")

datos = read.csv("UCL_Finals.csv", sep = ",", quote = '"')


str(datos)
names(datos)

# Renombrar variables (LIMPIEZA)
df = datos %>%
  rename(temporada = Season,
         paisGanador = Country,
         equipoGanador = Winners,
         resultado = Score,
         equipoPerdedor = Runners.up,
         paisPerdedor = Country.1,
         lugar = Venue,
         asistencia = Attend.ance,
         notas = Notes)

names(df)

# Correguir inconsitencias (LIMPIEZA)
df = df %>%
  mutate(asistencia = ifelse(asistencia == "NoS", 0, asistencia))

# Eliminar duplicados (LIMPIEZA)
df %>%
  group_by(temporada) %>%
  summarise(t = n()) %>%
  filter(t > 1)


df %>%
  distinct(temporada, .keep_all = TRUE)

df = df %>%
  mutate(id = row_number()) %>%
  arrange(temporada, desc(id)) %>%
  distinct(temporada, .keep_all = TRUE)


# Separar valores compuestos (TRANSFORMACION)
df = df %>%
  separate(col = resultado,
           c("golesGnador", "golesPerdedor"),
           sep = "–")


df = df %>%
  separate(col = lugar,
           c("finalEstadio", "finalCiudad", "finalPais"),
           sep = ",")

# Eliminar espacios en blanco 
df = df %>%
  mutate(finalCiudad = trimws(finalCiudad),
         finalPais = trimws(finalPais))
str(df)


# Convertir tipos de datos
df = df %>%
  mutate(golesGnador = as.integer(golesGnador),
         golesPerdedor = as.integer(golesPerdedor),
         asistencia = as.integer(gsub(",","", asistencia)))


# Agregar campos derivados (ENRIQUECIMIENTO)
df = df %>%
  rename(golesGanador = golesGnador) %>%
  mutate(diferenciaGoles = golesGanador - golesPerdedor,
         campeon = paste0(equipoGanador, " (", paisGanador, ")"))


df %>%
  distinct(notas)


df = df %>%
  mutate(tipoDefinicion = case_when(
    grepl("extra", notas) ~ "Tiempo Extra",
    grepl("replay", notas) ~ "Repetición",
    grepl("panalty", notas) ~ "Via Penales",
    TRUE ~ "Tiempo Regular"
  ))


# Reducir dimencionalidad (TRANFORMACION)
df = df %>%
  select(-c(notas, id))


####################
# LEER EL OTRO CSV 
# Combinar con datos externos (ENRIQUECIMIENTO)

paisesEuropa = read.csv("Countries_Europe.csv", sep = ",")


df = df %>%
  left_join(paisesEuropa, by = join_by(finalPais == Country))

# df %>%
#  mutate(EU = ifelse(is.Na(EU), N, EU))

df = df %>%
  mutate(EU = replace_na(EU, "N"))%>%
  rename(unionEuropea = EU)

