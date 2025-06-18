#!/bin/bash
for sheetname in 2019 2020 2021
do
     in2csv --sheet $sheetname BaseDatosProgramacion.xlsx > $sheetname.csv
done
cat 2019.csv <( tail -n+2 2020.csv ) >temp2.csv
cat temp2.csv <( tail -n+2 2021.csv ) >data1_2.csv
