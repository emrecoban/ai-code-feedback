---
title: Valoración
items:
  - interactions.helpful_rating
  - metric.rated_helpful_pct
sample:
  - views/helpful-rating.json#facts.featuredUp = 18
  - views/helpful-rating.json#facts.featuredDown = 2
  - views/helpful-rating.json#facts.ratedHelpfulPct = 81
---

# Valoración

## ¿Qué es la valoración de utilidad? {#what}

Bajo cada explicación, el estudiante puede responder con un clic a «¿Te ha servido?»: Sí (1) o No mucho (−1). La respuesta es opcional. Sin respuesta, el valor queda vacío.

## Ejemplo con un estudiante {#example}

S07 valoró 18 explicaciones como útiles y 2 como no útiles, y dejó el resto sin responder. En la clase, el 81% de las valoraciones fueron «Útil».

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="helpful-rating" /></ClientOnly>
<template #takeaway>Aproximadamente la mitad de las respuestas no reciben valoración. Cuando los estudiantes valoran, la mayoría dicen «Útil».</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Encuentran útiles los estudiantes las explicaciones?
- **Investigación:** ¿Cómo juzgan los estudiantes la retroalimentación y se relaciona su juicio con lo que hicieron después?

## Muestra de datos brutos {#raw}

Dos preguntas valoradas de S07.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/helpful-rating.json

### Valorado útil (panel) {#metric-rated-helpful-pct}

Valoraciones de 1 divididas entre todas las valoraciones dadas (1 y −1) del periodo. Las preguntas sin valoración quedan fuera.

<FormulaVersion ids="metric.rated_helpful_pct" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y después
- **Un valor por estudiante para SPSS:** `helpful_share` = valoraciones de 1 ÷ valoraciones dadas, y `rating_rate` = valoraciones dadas ÷ preguntas, por estudiante. Valor perdido: −97 si no hubo valoración.
- **Análisis de ejemplo:** Correlacione la proporción de útiles con la puntuación TAM de utilidad percibida (Spearman).

**Preguntas de investigación**

<RqList ids="interactions.helpful_rating,metric.rated_helpful_pct" />

**Frase de ejemplo (Método):** «Tras cada explicación, los estudiantes podían valorar su utilidad con un clic, y las valoraciones no respondidas se trataron como datos perdidos.»

## Lo que estos datos no muestran {#limits}

La valoración es opcional, así que los estudiantes y los momentos con valoración pueden diferir del resto. La respuesta no tiene marca de tiempo, y una respuesta posterior desde el historial sustituye a la primera. «Útil» es una percepción, no un resultado de aprendizaje.

## Para el profesorado {#teacher}

::: tip En clase
Lea en el panel las explicaciones valoradas como «No útil». Un patrón, como un tema concreto, puede mostrar dónde su propia explicación en clase aporta más.
:::
