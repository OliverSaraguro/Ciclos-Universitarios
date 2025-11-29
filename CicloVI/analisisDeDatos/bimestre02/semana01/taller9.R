getwd()
setwd("/Users/oliversaraguro/Desktop/CicloVI/analisisDeDatos/bimestre02/semana
03")

datos <- read.csv("laptop_data_cleaned.csv", sep = ";", dec = ",")

str(datos)

unique(datos$Company) # Categorica
unique(datos$TypeName) # Categorica
unique(datos$Ram) # Bimodal
unique(datos$Weight) # Numerica
unique(datos$Price) # Numerica
unique(datos$TouchScreen) # Categorica
unique(datos$Ips) # Categorica
unique(datos$Ppi) # Numerica
unique(datos$Cpu_brand) # Categorica
unique(datos$HDD) # Bimodal
unique(datos$SSD) # Bimodal
unique(datos$Gpu_brand) # Categorica
unique(datos$Os) # Categorica
datos$TypeName <- as.factor(datos$TypeName)
datos$Ram <- as.factor(datos$Ram)
datos$Cpu_brand <- as.factor(datos$Cpu_brand)
datos$SSD <- as.factor(datos$SSD)

model <- lm(Price ~ TypeName + Ram + Ppi + Cpu_brand + SSD, data = datos)
summary(model)