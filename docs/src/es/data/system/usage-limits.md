---
title: Límites de uso
items:
  - usage_counters.requests
  - usage_counters.total_tokens
  - rate_limits.hourly
  - rate_limits.daily
  - metric.quota_today
sample:
  - views/usage-limits.json#facts.defaultHourly = 40
  - views/usage-limits.json#facts.defaultDaily = 200
  - views/usage-limits.json#facts.maxPerHour = 9
  - views/usage-limits.json#facts.hours = 368
---

# Límites de uso

## ¿Qué son los límites de uso? {#what}

Cada estudiante puede hacer un número limitado de preguntas por hora y por día. El servidor cuenta las respuestas generadas de cada estudiante por hora. Una persona administradora puede cambiar los dos límites en el panel.

## Ejemplo con un estudiante {#example}

En la muestra los límites eran los predeterminados: 40 peticiones por hora y 200 por día. Ningún estudiante se acercó: el valor más alto en una hora fue de 9 peticiones. Los contadores tienen 368 filas, una por estudiante y hora con al menos una respuesta.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="usage-limits" /></ClientOnly>
<template #takeaway>La mayoría de las horas por estudiante tienen solo una o dos respuestas, muy por debajo del límite.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Es el límite lo bastante alto para un laboratorio, y hay alguien que pregunta muy a menudo?
- **Investigación:** ¿Restringieron los límites la búsqueda de ayuda durante el estudio?

## Muestra de datos brutos {#raw}

Dos horas de S07.

`usage_counters`:

<<< @/../.vitepress/data/sample/snippets/usage-limits.json

### Cómo se cuentan las peticiones {#usage-counters-requests}

Sube uno por cada respuesta generada en la hora UTC. Las respuestas de la caché no cuentan.

<FormulaVersion ids="usage_counters.requests" />

### Límites {#rate-limits-daily}

Una persona administradora fija el límite por hora y por día en el panel. Hasta entonces, el servidor usa sus propios valores predeterminados (40 y 200). El día empieza a las 00:00 UTC.

<FormulaVersion ids="rate_limits.daily" />

### Límites de uso de hoy (panel) {#metric-quota-today}

Para los diez estudiantes más activos: peticiones en la hora UTC actual, y peticiones y tokens desde las 00:00 UTC.

<FormulaVersion ids="metric.quota_today" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis (calidad de los datos y sección de Método)
- **Un valor por estudiante para SPSS:** `max_requests_hour` por estudiante, para mostrar que nadie quedó bloqueado a menudo.
- **Análisis de ejemplo:** Informe de los límites en la sección de Método junto al número de fallos `rate_limited`.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «Cada estudiante podía pedir un número fijo de respuestas de IA por hora y por día, y los límites rara vez se alcanzaron.»

## Lo que estos datos no muestran {#limits}

Los contadores usan horas y días UTC, que no coinciden con las horas locales de laboratorio. Solo cuentan las respuestas generadas, así que las peticiones fallidas y las respuestas de la caché no están en los contadores. La tabla solo guarda los límites actuales. Los valores anteriores están en el registro de auditoría del panel.

## Para el profesorado {#teacher}

::: tip En clase
Si un estudiante alcanza el límite en un laboratorio, hable con él o ella. Preguntas muy frecuentes pueden indicar prueba y error sin leer las pistas.
:::
