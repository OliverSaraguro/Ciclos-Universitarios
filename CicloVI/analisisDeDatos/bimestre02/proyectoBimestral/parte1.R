
library(dplyr)
library(tidyr)

getwd()
setwd("/Users/oliversaraguro/Desktop/CicloVI/analisisDeDatos/dataset")

# Vector: Paises de latinoamerica
paises_latam <- c("Haiti", "Honduras", "Peru", "Republica Dominicana", "Argentina", "Chile", "Panama",
                  "Ecuador", "Paraguay", "Venezuela", "Costa Rica", "Colombia", "Mexico", "Uruguay",
                  "Nicaragua", "Bolivia", "Brasil", "El Salvador", "Guatemala")

################################
# Dataset: pbi_per_capita
################################

df = read.csv("PIB_latinoamerica.csv")

str(df)

unique(df$Country.Name)

# Filtrar solo esos países (ojo con tildes y nombres distintos)
# Primero corregimos manualmente algunos nombres para que coincidan
df <- df %>%
  mutate(Country.Name = case_when(
    Country.Name == "República Dominicana" ~ "Republica Dominicana",
    Country.Name == "Brasil" ~ "Brasil",
    Country.Name == "México" ~ "Mexico",
    Country.Name == "Panamá" ~ "Panama",
    Country.Name == "Haití" ~ "Haiti",
    Country.Name == "Perú" ~ "Peru",
    TRUE ~ Country.Name
  ))

# Filtrar países deseados
df_filtrado_pib <- df %>% filter(Country.Name %in% paises_latam)

unique(df_filtrado_pib$Country.Name)

# Convertir de ancho a largo (solo columnas con años)
df_filtrado_pib <- df_filtrado_pib %>%
  pivot_longer(cols = starts_with("X"),
               names_to = "anio",
               names_prefix = "X",
               values_to = "pib_per_capita") %>%
  mutate(anio = as.integer(anio)) %>%
  filter(anio >= 2014 & anio <= 2023) %>%
  select(Country.Name, anio, pib_per_capita)

# Añadir valores venezuela
# Tenia faltantes
df_filtrado_pib = df_filtrado_pib %>%
  mutate(pib_per_capita = case_when(
    anio == 2015 & Country.Name == "Venezuela" ~ 6747.67,
    anio == 2016 & Country.Name == "Venezuela" ~ 6195.22,
    anio == 2017 & Country.Name == "Venezuela" ~ 4725.13,
    anio == 2018 & Country.Name == "Venezuela" ~ 3404.48,
    anio == 2019 & Country.Name == "Venezuela" ~ 2624.44,
    anio == 2020 & Country.Name == "Venezuela" ~ 1566.63,
    anio == 2021 & Country.Name == "Venezuela" ~ 2090.42,
    anio == 2022 & Country.Name == "Venezuela" ~ 3421.78,
    anio == 2023 & Country.Name == "Venezuela" ~ 3474.29,
    anio == 2021 & Country.Name == "Cuba" ~ 6828.4,
    anio == 2022 & Country.Name == "Cuba" ~ 7146.7,
    anio == 2023 & Country.Name == "Cuba" ~ 7727.9,
    TRUE ~ pib_per_capita 
  ))

# Verificar resultado
glimpse(df_filtrado_pib)

sapply(df_filtrado_pib, function(x) mean(is.na(x) | !nzchar(x))) # Media de valores faltantes y nulos


###################################
# Dataset: poblacion_latinoamerica
###################################
df2 = read.csv("poblacion_latinoamerica.csv")

# Filtrar solo esos países (ojo con tildes y nombres distintos)
# Primero corregimos manualmente algunos nombres para que coincidan
df2 <- df2 %>%
  mutate(Country.Name = case_when(
    Country.Name == "República Dominicana" ~ "Republica Dominicana",
    Country.Name == "Brasil" ~ "Brasil",
    Country.Name == "México" ~ "Mexico",
    Country.Name == "Panamá" ~ "Panama",
    Country.Name == "Haití" ~ "Haiti",
    Country.Name == "Perú" ~ "Peru",
    TRUE ~ Country.Name
  ))

# Filtrar países deseados
df_filtrado_pobl <- df2 %>% filter(Country.Name %in% paises_latam)

unique(df_filtrado_pobl$Country.Name)

# Convertir columnas de años a formato largo
df_filtrado_pobl <- df_filtrado_pobl %>%
  pivot_longer(
    cols = starts_with("X"),           # columnas como X1960, X1961, ...
    names_to = "anio",                 
    names_prefix = "X",                # elimina la X para dejar solo el año
    values_to = "poblacion"
  ) %>%
  mutate(anio = as.integer(anio)) %>%
  filter(anio >= 2014 & anio <= 2023)  %>% # solo años deseados
  select(Country.Name, anio, poblacion)

# Verificar resultado
glimpse(df_filtrado_pobl)

sapply(df_filtrado_pobl, function(x) mean(is.na(x) | !nzchar(x))) # Media de valores faltantes y nulos


###################################
# Dataset: desempleo_latinoamerica
###################################

df3 = read.csv("desempleo_latinoamerica.csv")

# Filtrar solo esos países (ojo con tildes y nombres distintos)
# Primero corregimos manualmente algunos nombres para que coincidan
df3 <- df3 %>%
  mutate(Country.Name = case_when(
    Country.Name == "República Dominicana" ~ "Republica Dominicana",
    Country.Name == "Brasil" ~ "Brasil",
    Country.Name == "México" ~ "Mexico",
    Country.Name == "Panamá" ~ "Panama",
    Country.Name == "Haití" ~ "Haiti",
    Country.Name == "Perú" ~ "Peru",
    TRUE ~ Country.Name
  ))

# Filtrar países deseados
df_filtrado_desem <- df3 %>% filter(Country.Name %in% paises_latam)

unique(df_filtrado_desem$Country.Name)

# Convertir columnas de años a formato largo
df_filtrado_desem <- df_filtrado_desem %>%
  pivot_longer(
    cols = starts_with("X"),           # columnas como X1960, X1961, ...
    names_to = "anio",                 
    names_prefix = "X",                # elimina la X para dejar solo el año
    values_to = "desempleo"
  ) %>%
  mutate(anio = as.integer(anio)) %>%
  filter(anio >= 2014 & anio <= 2023)  %>% # solo años deseados
  select(Country.Name, anio, "desempleo")


# Verificar resultado
glimpse(df_filtrado_desem)

sapply(df_filtrado_desem, function(x) mean(is.na(x) | !nzchar(x))) # Media de valores faltantes y nulos


# Union Dataset
# PIB per cápita y población por país y año
df_union <- df_filtrado_pib %>%
  left_join(df_filtrado_pobl, by = c("Country.Name", "anio"))

df_union <- df_union %>%
  mutate(pib_total = round(pib_per_capita * poblacion, 2))

df_union <- df_union %>%
  left_join(df_filtrado_desem, by = c("Country.Name", "anio"))

df_union = df_union %>%
  rename(nombrePais = Country.Name)

str(df_union)


##############################
# Union con el dataSet Final
##############################
str(dataSet)
str(df_union)

# Eliminamos poblacion para mejorar los datos de esa variable 
dataSet = dataSet %>% select(-poblacion)

# Hacemos el join
df_union_fn <- dataSet %>%
  left_join(df_union, by = c("nombrePais", "anio"))

colnames(df_union_fn)

# Media de valores faltantes y nulos
sapply(df_union_fn, function(x) mean(is.na(x) | !nzchar(x))) 

# Verificamos en que unidad se encuentran los datos 
# Para dejar en un solo tipo de unidad
unique(df_union_fn$unidad)

# Filtramos las filas con tasas por cada 100,000 personas
df_union_fn %>% filter(unidad == "Rate per 100,000 population")

# Convertimos los valores en tasa a conteos absolutos (Counts)
# Multiplicamos la tasa por la población y dividimos entre 100,000
# Luego redondeamos el resultado y estandarizamos la unidad como "Counts"
df_union_fn <- df_union_fn %>%
  mutate(
    valorIndicador = ifelse(
      unidad == "Rate per 100,000 population",
      round((valorIndicador * poblacion) / 100000),
      valorIndicador
    ),
    unidad = "Counts"
  )

# Verificamos
str(df_union_fn)
unique(df_union_fn$unidad)

# Exportamos
write.csv(df_union_fn, "df_union_fn.csv", row.names = FALSE, fileEncoding = "UTF-8")

