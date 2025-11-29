
library(dplyr)
library(ggplot2)


getwd()
setwd("/Users/oliversaraguro/Downloads")

df = read.csv("Country-data.csv")

head(df)
summary(df)
names(df)

# Solo dejar las variables continuas 
df_pca = df %>% select(-1)

pca = prcomp(df_pca, center = TRUE, scale. = TRUE)
# center = TRUE -> a cada valor le resta la media y el resultado va a ser con media de 0
# scale. = TRUE -> divide cada variable por su desviacion estandar 

summary(pca)

plot(pca)

# Ver matriz de rotacion
print(pca$rotation)


# Convertir los datos de PCA a un data frame 
pca_data = as.data.frame(pca$x)

# Añadir las etiquetas de los paises 
pca_data$Pais = df$country

# Crear. un grafico de despersion de las dos primeras componentes principales
ggplot(pca_data, aes(x= PC1, y=PC2, label = Pais)) + 
  geom_point() + 
  geom_text(vjust = -0.5, hjust = 0.5) + 
  labs(title = "PCA del conjunto de datos paises",
       x = "Primer componente principal",
       y = "Segundo componente principal") + 
  theme_minimal()
