---
title: Libro de códigos y descargas
---

# Libro de códigos y descargas

Todos los archivos de abajo los genera `npm run docs:sample` a partir del inventario y de la muestra sintética. La misma semilla produce siempre los mismos archivos. **Los archivos de datos son sintéticos y no contienen datos reales de estudiantes.**

<Downloads />

## El libro de códigos {#codebook}

El libro de códigos tiene una fila por cada dato de este sitio. Para cada dato da el nombre de la variable, la etiqueta en inglés, turco y español, la categoría, si es bruto o derivado, el tipo de dato, los valores permitidos, las etiquetas de valores, el valor perdido, la tabla y la columna de origen, la versión de la fórmula y la página que lo explica. La hoja «wide» del archivo XLSX recoge las variables del archivo ancho y los datos de los que procede cada una.

## Valores perdidos {#missing}

- En los archivos largos, una celda vacía significa que el valor de la base de datos está vacío (NULL). Verdadero y falso se escriben como 1 y 0.
- En el archivo ancho, -99 significa no aplicable, -98 no medido y -97 sin respuesta (regla de limpieza C8).

## Uso en SPSS {#spss}

1. Ponga el archivo `.sps` en la misma carpeta que `synthetic_students_wide.csv`, o cambie la ruta en la orden `GET DATA`.
2. Ejecute `SET UNICODE=ON.` sin ningún conjunto de datos abierto.
3. Ejecute el archivo de sintaxis en el idioma que quiera para las etiquetas.
