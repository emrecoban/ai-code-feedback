---
title: Tiempo de respuesta de la IA
items:
  - interactions.model_used
  - interactions.latency_ms
  - metric.ai_response_time_avg
  - metric.response_time_median
sample:
  - views/response-time.json#facts.avgSec = 4.5
  - views/response-time.json#facts.p50Sec = 4.3
  - views/response-time.json#facts.p95Sec = 7.6
  - views/response-time.json#facts.cacheHits = 69
---

# Tiempo de respuesta de la IA

## ¿Qué es el tiempo de respuesta de la IA? {#what}

Es el tiempo que el servidor esperó al modelo de IA para una respuesta, en milisegundos. La misma fila guarda también qué proveedor de IA respondió.

## Ejemplo con un estudiante {#example}

En la muestra, el tiempo medio de respuesta fue de 4,5 segundos. La mitad de las respuestas tardó menos de 4,3 segundos, y el 95% menos de 7,6. Las 69 respuestas de la caché no tienen tiempo de respuesta.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="response-time" /></ClientOnly>
<template #takeaway>La mayoría de las respuestas tardan entre 3 y 6 segundos. Pocas tardan más de 8 segundos.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Esperan mucho los estudiantes una respuesta?
- **Investigación:** ¿Fue el servicio lo bastante rápido y estable durante el estudio, como condición de la intervención?

## Muestra de datos brutos {#raw}

Una respuesta generada y una respuesta de la caché.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/response-time.json

### Cómo se mide el tiempo {#interactions-latency-ms}

Tiempo dentro de la función del servidor desde antes de la primera llamada al modelo hasta después de la última comprobación, incluida una llamada de reparación si la primera respuesta no pasó una comprobación. Vacío en las respuestas de la caché.

<FormulaVersion ids="interactions.latency_ms" />

### Proveedor de IA {#interactions-model-used}

El identificador del tipo de proveedor que respondió (por ejemplo `openai_compatible`), no el nombre del modelo. En una respuesta de la caché es el proveedor de la respuesta guardada.

<FormulaVersion ids="interactions.model_used" />

### Tiempo de respuesta de la IA (panel) {#metric-ai-response-time-avg}

Tiempo medio de respuesta de las preguntas del periodo, sin las respuestas de la caché.

<FormulaVersion ids="metric.ai_response_time_avg" />

### Tiempo de respuesta (mediana, panel) {#metric-response-time-median}

Mediana y percentil 95 de los mismos tiempos.

<FormulaVersion ids="metric.response_time_median" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis (calidad de los datos y sección de Método)
- **Un valor por estudiante para SPSS:** No es necesario por estudiante. Informe de la mediana y del percentil 95 de todo el estudio.
- **Análisis de ejemplo:** Compruebe que el tiempo de respuesta no cambió entre semanas o grupos, para que no pueda explicar diferencias de uso.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «Se registró la mediana del tiempo de respuesta del servicio de retroalimentación de IA en el servidor para documentar las condiciones de la intervención.»

## Lo que estos datos no muestran {#limits}

No es la espera que vio el estudiante: la red y la extensión añaden tiempo. Las peticiones fallidas no tienen fila, así que faltan las peticiones lentas que agotaron el tiempo. El campo del proveedor no nombra el modelo exacto.

## Para el profesorado {#teacher}

::: tip En clase
Si los estudiantes dicen que la herramienta va lenta, revise esta parte del panel durante el laboratorio. Tiempos largos para todos apuntan al servicio de IA, no a los ordenadores de los estudiantes.
:::
