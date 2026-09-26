---
title: Solicitudes fallidas
items:
  - event.request_failed
  - event.request_failed.kind
  - event.request_failed.code
  - event.request_failed.retryAfterSeconds
  - metric.failed_requests
  - metric.failure_rate
sample:
  - views/failed-requests.json#facts.failures = 30
  - views/failed-requests.json#facts.questions = 928
  - views/failed-requests.json#facts.ratePct = 3.1
---

# Solicitudes fallidas

## ¿Qué es una solicitud fallida? {#what}

El evento se registra cuando el estudiante pidió ayuda pero no llegó respuesta: ninguna respuesta en 25 segundos, un error del servidor u otro error. El estudiante ve un mensaje de error y no se guarda ninguna pregunta.

## Ejemplo con un estudiante {#example}

En la muestra fallaron 30 peticiones frente a 928 preguntas respondidas, una tasa de fallos del 3,1%. La mayoría de los fallos fueron errores del servicio de IA. Dos peticiones chocaron con el límite de uso.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="failed-requests" /></ClientOnly>
<template #takeaway>Los fallos son poco frecuentes. La mayoría vienen del servicio de IA, no de los estudiantes.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Falló la herramienta cuando los estudiantes la necesitaban?
- **Investigación:** ¿Qué fiabilidad tuvo el servicio y faltan peticiones en los datos de preguntas?

## Muestra de datos brutos {#raw}

Un evento de la muestra.

`events`:

<<< @/../.vitepress/data/sample/snippets/failed-requests.json

### Tipo y código {#event-request-failed-kind}

El tipo es `timeout` (ninguna respuesta en 25 segundos), `backend` (el servidor devolvió un error) o `unknown`. Para `backend` se guarda el código del servidor, por ejemplo `provider_error` o `rate_limited`. Para `rate_limited` el evento guarda además los segundos que faltan para que se reinicie el límite.

<FormulaVersion ids="event.request_failed.kind" />

### Solicitudes fallidas (panel) {#metric-failed-requests}

Eventos de fallo del periodo, agrupados por tipo y código.

<FormulaVersion ids="metric.failed_requests" />

### Tasa de fallos (panel) {#metric-failure-rate}

Fallos divididos entre la suma de preguntas y fallos del periodo.

<FormulaVersion ids="metric.failure_rate" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis (calidad de los datos y sección de Método)
- **Un valor por estudiante para SPSS:** `failed_requests` por estudiante, para comprobar que ningún estudiante se vio mucho más afectado que los demás.
- **Análisis de ejemplo:** Informe de la tasa de fallos en la sección de Método. Sume las peticiones fallidas a las preguntas al contar los intentos de pedir ayuda.

**Preguntas de investigación**

<RqList ids="event.request_failed" />

**Frase de ejemplo (Método):** «Las peticiones de ayuda fallidas se registraron por separado y se contaron como intentos de búsqueda de ayuda.»

## Lo que estos datos no muestran {#limits}

El evento lo envía la extensión, así que un fallo sin conexión de red puede no llegar nunca. Un estudiante que lo intentó dos veces genera dos eventos. El evento no dice sobre qué error o pregunta se preguntó.

## Para el profesorado {#teacher}

::: tip En clase
Si fallan muchas peticiones durante un laboratorio, diga a los estudiantes que esperen un minuto y lo intenten de nuevo. El mensaje de error no significa que su código esté mal.
:::
