---
title: Volvió al código
items:
  - event.returned_to_code
  - event.returned_to_code.level
  - event.returned_to_code.msToReturn
  - metric.reading_back_median
sample:
  - views/back-to-code.json#facts.featuredMedianSec = 24
  - views/back-to-code.json#facts.classMedianSec = 18
---

# Volvió al código

## ¿Qué es la vuelta al código? {#what}

Después de que aparece una explicación o un paso nuevo, la extensión espera la primera actividad en el editor: un cambio en el texto o un movimiento del cursor. El evento guarda cuánto tardó y qué paso estaba en pantalla.

## Ejemplo con un estudiante {#example}

S07 volvió al código tras una mediana de 24 segundos, un poco más tarde que la clase (18 segundos). Tras la corrección (L3), S07 volvió enseguida, probablemente para escribir el cambio.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="back-to-code" /></ClientOnly>
<template #takeaway>La clase vuelve al código unos 15 a 20 segundos después de un paso. S07 tarda más tras L0–L1 y L2 y vuelve rápido tras la corrección.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Se detienen los estudiantes a leer o vuelven a escribir enseguida?
- **Investigación:** ¿Cuánto tiempo dedican los estudiantes a cada paso antes de actuar?

## Muestra de datos brutos {#raw}

Un evento de S07.

`events`:

<<< @/../.vitepress/data/sample/snippets/back-to-code.json

### Cómo se mide el tiempo {#event-returned-to-code-mstoreturn}

Tiempo desde que un paso se hizo visible hasta el primer cambio de texto o movimiento del cursor en cualquier editor, en milisegundos. Tras 10 minutos sin actividad, el evento pasa a ser «Se fue sin actuar».

<FormulaVersion ids="event.returned_to_code.msToReturn" />

### Volvió al código tras (mediana, panel) {#metric-reading-back-median}

Mediana de los tiempos de vuelta en los eventos de las preguntas del periodo.

<FormulaVersion ids="metric.reading_back_median" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `median_return_s` por estudiante, y por paso si estudia la lectura en cada nivel.
- **Análisis de ejemplo:** Compare el tiempo de vuelta tras L0–L1 entre estudiantes con ganancia de aprendizaje alta y baja (U de Mann–Whitney).

**Preguntas de investigación**

<RqList ids="event.returned_to_code.msToReturn,metric.reading_back_median" />

**Frase de ejemplo (Método):** «El tiempo entre la aparición de cada nivel de retroalimentación y la primera actividad posterior en el editor se usó como indicador de implicación con la retroalimentación.»

## Lo que estos datos no muestran {#limits}

Cuenta cualquier cambio o movimiento del cursor, también en otro archivo o documento, así que una vuelta rápida puede ser casual. Un tiempo largo puede ser lectura, reflexión o una pausa. Si se abre un paso nuevo antes de volver, solo se mide el último paso.

## Para el profesorado {#teacher}

::: tip En clase
Si los estudiantes vuelven a escribir pocos segundos después de cada paso, pídales en clase que digan en una frase qué les dijo la explicación antes de cambiar el código.
:::
