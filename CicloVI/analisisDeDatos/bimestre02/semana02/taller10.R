
getwd()
df = read.csv("Penguins_Species.csv")

str(df)

head(df)
summary(df)
names(df)

# Filtramos los ques sean diferentes a NA y en donde flipper_length_mm sea 
# diferente a 5000 ya que es un valor atipico 
df = df %>%
  filter(!is.na(culmen_length_mm),
         !is.na(sex),
         flipper_length_mm != 5000,
         flipper_length_mm != -132)

# Solo dejar las variables continuas 
df_pca = df %>% select(-5)


pca = prcomp(df_pca, center = TRUE, scale. = TRUE)

summary(pca)

plot(pca)

# Ver matriz de rotacion
print(pca$rotation)

# Convertir los datos de PCA a un data frame 
pca_data = as.data.frame(pca$x)

# Añadir las etiquetas de sexo 
pca_data$Sex = df$sex 


# Crear. un grafico de despersion de las dos primeras componentes principales
ggplot(pca_data, aes(x= PC1, y=PC2, colour = Sex)) + 
  geom_point() + 
  labs(title = "PCA del conjunto de datos pinguinos",
       x = "Primer componente principal",
       y = "Segundo componente principal") + 
  theme_minimal()

