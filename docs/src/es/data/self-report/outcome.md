---
title: Resultado
items:
  - interactions.self_reported_outcome
sample:
  - views/outcome.json#facts.featuredSolved = 21
  - views/outcome.json#facts.featuredStuck = 2
  - views/outcome.json#facts.answeredPct = 44.8
---

# Resultado

## ¿Qué es el resultado autoinformado? {#what}

Bajo cada explicación, el estudiante puede responder con un clic a «¿Cómo te fue?»: Lo resolví o Sigo atascado/a. Es la visión del propio estudiante sobre el resultado, junto al comportamiento que mide el sistema.

## Ejemplo con un estudiante {#example}

S07 respondió «Lo resolví» 21 veces y «Sigo atascado/a» 2 veces. En la clase, el 44,8% de las preguntas recibió respuesta.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="outcome" /></ClientOnly>
<template #takeaway>Las preguntas que llegaron a la corrección tienen la mayor proporción de «Sigue atascado».</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Qué estudiantes dicen que siguen atascados después de una explicación?
- **Investigación:** ¿Coinciden las señales de comportamiento, como la desaparición del error, con lo que informan los estudiantes?

## Muestra de datos brutos {#raw}

Dos preguntas respondidas de S07.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/outcome.json

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis (validación)
- **Un valor por estudiante para SPSS:** `solved_share` = resueltas ÷ respondidas, por estudiante. Valor perdido: −97 si no hubo respuesta.
- **Análisis de ejemplo:** Cruce la respuesta con «Error resuelto tras explicar» en las preguntas sobre errores e informe del acuerdo (kappa de Cohen).

**Preguntas de investigación**

<RqList ids="interactions.self_reported_outcome" />

**Frase de ejemplo (Método):** «Los resultados autoinformados se compararon con la desaparición del diagnóstico para validar el indicador de comportamiento.»

## Lo que estos datos no muestran {#limits}

Los estudiantes responden en momentos distintos, unos enseguida y otros más tarde, y el momento de la respuesta no se guarda. La respuesta se puede cambiar desde el historial. Quienes están atascados pueden irse sin responder.

## Para el profesorado {#teacher}

::: tip En clase
«Sigo atascado/a» es una petición directa de ayuda. El panel muestra a estos estudiantes en «Requieren atención», así que revíselo durante el laboratorio.
:::
