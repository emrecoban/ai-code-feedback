---
title: Respondido desde caché
items:
  - interactions.cache_hit
  - explanations.reuse_count
  - metric.cache_rate
sample:
  - views/cache.json#facts.hits = 69
  - views/cache.json#facts.questions = 928
  - views/cache.json#facts.ratePct = 7.4
  - views/cache.json#facts.cacheRows = 868
  - views/cache.json#facts.reusedRows = 63
---

# Respondido desde caché

## ¿Qué es una respuesta de la caché? {#what}

Cuando ya existe una respuesta anterior para el mismo idioma, tipo de pregunta, error y código, el servidor vuelve a enviar esa respuesta en lugar de preguntar al modelo de IA. En el error se sustituyen antes los números y el texto entre comillas. En el código se quitan antes los comentarios y los espacios de más.

## Ejemplo con un estudiante {#example}

En la muestra, 69 de 928 preguntas (7,4%) se respondieron desde la caché. La caché tenía 868 respuestas, y 63 se reutilizaron al menos una vez.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="cache" /></ClientOnly>
<template #takeaway>Pocas respuestas salen de la caché, porque el código de los estudiantes rara vez es idéntico.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Recibieron los estudiantes la misma respuesta que un compañero?
- **Investigación:** ¿Qué respuestas no se personalizaron? Esto importa para las notas privadas y para el análisis.

## Muestra de datos brutos {#raw}

Una respuesta guardada en la caché (no se muestra el texto de la respuesta).

`explanations` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/cache.json

### Veces reutilizada {#explanations-reuse-count}

Sube uno con cada respuesta de la caché. Los usos anteriores a la migración 0022 (una corrección de un fallo) no se contaron.

<FormulaVersion ids="explanations.reuse_count" />

### Respondido desde caché (panel) {#metric-cache-rate}

Preguntas del periodo respondidas desde la caché, divididas entre todas las preguntas del periodo, también por proveedor.

<FormulaVersion ids="metric.cache_rate" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis (calidad de los datos y sección de Método)
- **Un valor por estudiante para SPSS:** `cache_share` por estudiante, si quiere controlar las respuestas no personalizadas.
- **Análisis de ejemplo:** Haga un análisis de sensibilidad sin las respuestas de la caché.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «Las respuestas servidas desde la caché se identificaron y se excluyeron en un análisis de sensibilidad.»

## Lo que estos datos no muestran {#limits}

Una respuesta de la caché se escribió para otra pregunta, quizá de otro estudiante, y no usa las notas privadas del estudiante actual. Las respuestas de la caché no cuentan para la siguiente reescritura de las notas. Los usos anteriores a la corrección del fallo faltan en el recuento.

## Para el profesorado {#teacher}

::: tip En clase
Si varios estudiantes reciben la misma respuesta, probablemente cometieron el mismo error en la misma tarea. Puede merecer una explicación para toda la clase.
:::
