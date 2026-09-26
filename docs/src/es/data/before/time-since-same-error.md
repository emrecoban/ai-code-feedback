---
title: Tiempo desde el mismo error
items:
  - interactions.ms_since_previous_same_error
  - metric.quick_repeats
sample:
  - views/time-since-same-error.json#facts.featuredRepeats = 10
  - views/time-since-same-error.json#facts.featuredQuick = 1
  - views/time-since-same-error.json#facts.quickPct = 12.3
---

# Tiempo desde el mismo error

## ¿Qué es el tiempo desde el mismo error? {#what}

En un error repetido, es el tiempo transcurrido desde la última vez que el estudiante preguntó por el mismo error normalizado. Un tiempo corto indica que la última explicación no funcionó. Un tiempo largo indica que el error volvió más tarde.

## Ejemplo con un estudiante {#example}

S07 repitió un error anterior 10 veces. Solo 1 de ellas llegaron en los diez minutos siguientes a la pregunta anterior. La mayoría llegaron días después, cuando una tarea parecida trajo de vuelta el mismo error.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="time-since-same-error" /></ClientOnly>
<template #takeaway>En la clase, el 12,3% de las repeticiones llegó en menos de diez minutos.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Sirvió la última explicación o el estudiante volvió a preguntar enseguida?
- **Investigación:** ¿Pueden las repeticiones rápidas servir como señal de una explicación fallida, distinta del olvido con el tiempo?

## Muestra de datos brutos {#raw}

Una pregunta de S07 sobre un error repetido.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/time-since-same-error.json

### Cómo se calcula el tiempo {#interactions-ms-since-previous-same-error}

Momento de la nueva pregunta menos el de la pregunta anterior más reciente con el mismo mensaje normalizado, en milisegundos. Vacío en la primera aparición y en las preguntas por selección.

<FormulaVersion ids="interactions.ms_since_previous_same_error" />

### Volvió a preguntar en menos de 10 minutos (panel) {#metric-quick-repeats}

Preguntas del periodo con un tiempo desde el mismo error de 600.000 ms (10 minutos) como máximo.

<FormulaVersion ids="metric.quick_repeats" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `quick_repeats` = número de repeticiones en menos de 10 minutos por estudiante, y `quick_repeat_share` = repeticiones rápidas ÷ repeticiones.
- **Análisis de ejemplo:** Compare la tasa de repeticiones rápidas entre las preguntas que terminaron en L0–L1 y las que llegaron a L3 (prueba de chi cuadrado).

**Preguntas de investigación**

<RqList ids="metric.quick_repeats" />

**Frase de ejemplo (Método):** «Una repetición en los diez minutos siguientes a la petición anterior por el mismo error se tomó como señal de que la explicación anterior no había resuelto el problema.»

## Lo que estos datos no muestran {#limits}

Dos errores distintos con el mismo mensaje normalizado cuentan como el mismo error, así que una «repetición» rápida puede ser un problema nuevo pero parecido. El límite de diez minutos es una elección fija del panel, no un umbral probado.

## Para el profesorado {#teacher}

::: tip En clase
Una repetición rápida es un buen momento para hablar en persona: la explicación en pantalla no sirvió, así que es probable que otra forma de explicarlo funcione mejor.
:::
