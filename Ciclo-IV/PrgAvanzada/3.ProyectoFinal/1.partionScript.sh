#!/bin/bash
for sheetname in 2016 2017 2018
do
     in2csv --sheet $sheetname BaseDatosProgramacion.xlsx > $sheetname.csv
done
cat 2016.csv <( tail -n+2 2017.csv ) >temp1.csv
cat temp1.csv <( tail -n+2 2018.csv ) >data1_1.csv
