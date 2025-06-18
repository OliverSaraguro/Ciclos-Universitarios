#!/bin/bash
for sheetname in 2022 2023 2024
do
     in2csv --sheet $sheetname Base_de_datos_DETENIDOS_ANIO_2016_ABRIL_2024.xlsx > $sheetname.csv
done
