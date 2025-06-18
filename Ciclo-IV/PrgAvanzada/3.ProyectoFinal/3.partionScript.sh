#!/bin/bash
for sheetname in 2022 2023 2024
do
     in2csv --sheet $sheetname BaseDatosProgramacion.xlsx > $sheetname.csv
done
