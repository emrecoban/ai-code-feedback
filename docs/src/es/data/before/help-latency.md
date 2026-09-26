---
title: Esperó tras la oferta
items:
  - interactions.help_latency_ms
  - metric.median_help_latency
sample:
  - views/help-latency.json#facts.featuredMedianSec = 27
  - views/help-latency.json#facts.classMedianSec = 30
  - views/help-latency.json#facts.withLatency = 653
  - views/help-latency.json#facts.questions = 928
---

# Esperó tras la oferta

## ¿Qué es la espera tras la oferta? {#what}

La espera es el tiempo entre el momento en que apareció la oferta de ayuda junto a un error y el momento en que el estudiante hizo clic. Muestra cuánto trabajó el estudiante solo sobre el error antes de preguntar.

## Ejemplo con un estudiante {#example}

La mediana de la espera de S07 fue de 27 segundos, cerca de la mediana de la clase, 30 segundos. Muchas veces, S07 leyó el error, probó algo y preguntó al cabo de medio minuto.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="help-latency" /></ClientOnly>
<template #takeaway>La mediana semanal de S07 se mueve alrededor de la de la clase, con grandes saltos en las semanas con pocas preguntas.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Intentan los estudiantes resolverlo solos antes de preguntar, o hacen clic enseguida?
- **Investigación:** ¿Cuánto persisten los estudiantes antes de pedir ayuda y crece ese tiempo con las semanas?

## Muestra de datos brutos {#raw}

Dos preguntas de S07 sobre errores que empezaron desde una oferta visible.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/help-latency.json

### Cómo se mide la espera {#interactions-help-latency-ms}

Momento del clic menos el momento en que apareció por primera vez el icono de la oferta para este diagnóstico, en milisegundos. Está vacío si no hubo oferta visible (todas las preguntas por selección y los errores posteriores al tercero de un archivo). Un valor negativo se guarda vacío.

<FormulaVersion ids="interactions.help_latency_ms" />

### Esperó tras la oferta (mediana, panel) {#metric-median-help-latency}

Mediana de las esperas no vacías de las preguntas hechas en el periodo.

<FormulaVersion ids="metric.median_help_latency" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `median_wait_s` por estudiante, en segundos. Use la mediana, porque unas pocas esperas muy largas (una pausa) distorsionan la media.
- **Análisis de ejemplo:** Compare la mediana de la espera de las semanas 1–2 y 7–8 con una prueba de Wilcoxon y correlacione el cambio con la ganancia de aprendizaje.

**Preguntas de investigación**

<RqList ids="interactions.help_latency_ms,metric.median_help_latency" />

**Frase de ejemplo (Método):** «La latencia de ayuda se definió como el tiempo entre la aparición del enlace de ayuda y la petición del estudiante, resumido por estudiante con la mediana.»

## Lo que estos datos no muestran {#limits}

Una espera larga puede indicar esfuerzo, pero también una pausa o trabajo en otro archivo. Solo tienen valor las preguntas que empezaron desde una oferta visible (653 de 928 en la muestra), así que la medida describe solo preguntas sobre errores. El reloj corre en la extensión, así que un portátil en reposo puede sumar tiempo.

## Para el profesorado {#teacher}

::: tip En clase
Si un estudiante casi siempre pregunta en pocos segundos, sugiera un hábito sencillo: leer el mensaje dos veces y probar un cambio antes de hacer clic.
:::
