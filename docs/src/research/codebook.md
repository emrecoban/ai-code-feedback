---
title: Codebook and downloads
---

# Codebook and downloads

All files below are made by `npm run docs:sample` from the inventory and the synthetic sample. The same seed always gives the same files. **The data files are synthetic and contain no real student data.**

<Downloads />

## The codebook {#codebook}

The codebook has one row for every data item on this site. For each item it gives the variable name, the label in English, Turkish and Spanish, the category, raw or derived, the data type, the allowed values, the value labels, the missing value, the source table and column, the formula version and the page that explains it. The sheet "wide" of the XLSX file lists the variables of the wide file and the items each one comes from.

## Missing values {#missing}

- In the long files, an empty cell means that the database value is empty (NULL). True and false are written as 1 and 0.
- In the wide file, -99 means not applicable, -98 means not measured and -97 means not answered (cleaning rule C8).

## Use in SPSS {#spss}

1. Put the `.sps` file in the same folder as `synthetic_students_wide.csv`, or change the path in the `GET DATA` command.
2. Run `SET UNICODE=ON.` while no data set is open.
3. Run the syntax file in the language you want for the labels.
