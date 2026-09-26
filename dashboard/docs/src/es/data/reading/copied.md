---
title: Copió de la explicación
items:
  - event.explanation_copied
  - event.explanation_copied.level
  - metric.copied
sample:
  - views/copied.json#facts.featured = 5
  - views/copied.json#facts.copyEvents = 60
  - views/copied.json#facts.fromFix = 23
---

# Copió de la explicación

## ¿Qué es una copia de la explicación? {#what}

El evento se registra cada vez que el estudiante copia texto del panel de la explicación. Guarda el paso en que empezó la selección (L0 a L3), pero nunca el texto copiado.

## Ejemplo con un estudiante {#example}

S07 copió de 5 explicaciones. En la clase se registraron 60 copias, y 23 vinieron de la corrección (L3).

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="copied" /></ClientOnly>
<template #takeaway>Los estudiantes copian sobre todo de la corrección (L3). Algunas copias empiezan fuera de un paso y no tienen nivel.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Llevan los estudiantes código de las explicaciones a sus programas?
- **Investigación:** ¿Con qué frecuencia se toma la respuesta directamente, algo que el parecido de las ediciones puede no detectar?

## Muestra de datos brutos {#raw}

Una copia de la corrección.

`events`:

<<< @/../.vitepress/data/sample/snippets/copied.json

### Copió de ella (panel) {#metric-copied}

Preguntas distintas del periodo con un evento de copia. El panel cuenta también las copias por nivel.

<FormulaVersion ids="metric.copied" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `copies_fix` = copias de L3 por estudiante, y `copy_share` = preguntas con copia ÷ preguntas.
- **Análisis de ejemplo:** Compare la ganancia de aprendizaje de quienes copian a menudo de L3 con la del resto (U de Mann–Whitney).

**Preguntas de investigación**

<RqList ids="metric.copied" />

**Frase de ejemplo (Método):** «Las acciones de copia en el panel se registraron con el nivel de la pista del que procedían, sin el contenido copiado.»

## Lo que estos datos no muestran {#limits}

Copiar no siempre es pegar en el código: los estudiantes también copian para tomar notas o para buscar. El nivel es el del inicio de la selección, así que una selección de varios pasos solo recibe el primero.

## Para el profesorado {#teacher}

::: tip En clase
Copiar la corrección no es un problema en sí. Pida a los estudiantes que cierren el panel, cambien el código de memoria y luego comparen.
:::
