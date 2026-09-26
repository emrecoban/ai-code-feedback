---
title: Consentimiento
items:
  - profiles.consent_status
  - profiles.consent_at
  - consent_log.status
  - consent_log.version
sample:
  - views/consent-status.json#facts.featuredTime = 10:07
  - views/consent-status.json#facts.version = 2026-08-v1
  - views/consent-status.json#facts.granted = 27
  - views/consent-status.json#facts.accounts = 28
  - views/consent-status.json#facts.declined = 1
---

# Consentimiento

## ¿Qué es el estado del consentimiento? {#what}

El estado del consentimiento es la respuesta del estudiante al aviso de consentimiento de la extensión: pendiente, otorgado o rechazado. El aviso se abre en el primer inicio de sesión, antes de la primera pregunta. Cada respuesta se guarda también en un registro, junto con la versión del texto del aviso.

## Ejemplo con un estudiante {#example}

S07 inició sesión por primera vez en el primer laboratorio, a las 10:07. Se abrió el aviso de consentimiento y S07 pulsó «Acepto». El perfil indica ahora otorgado, y el registro guarda una fila con la versión del texto 2026-08-v1. Si S07 hubiera cerrado el aviso sin responder, el estado seguiría pendiente y el aviso volvería a abrirse antes de la siguiente pregunta.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="consent-status" /></ClientOnly>
<template #takeaway>En la muestra, 27 de 28 cuentas otorgaron el consentimiento y 1 lo rechazó.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Qué estudiantes han respondido al aviso de consentimiento?
- **Investigación:** ¿Qué cuentas pueden entrar en el análisis y con qué versión del texto de consentimiento?

## Muestra de datos brutos {#raw}

El estado se guarda en dos tablas. Estas filas son de S07.

`profiles` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/consent-status.profiles.json

`consent_log`:

<<< @/../.vitepress/data/sample/snippets/consent-status.consent_log.json

## Uso en la investigación {#research}

- **Etapa:** diseño y análisis (definición de la muestra)
- **Un valor por estudiante para SPSS:** `consent` codificado 1 = otorgado, 2 = rechazado, 3 = pendiente, y `consent_version` como texto.
- **Análisis de ejemplo:** Informe del número de cuentas por estado en el flujo de participantes y conserve solo las cuentas con consentimiento otorgado (regla de limpieza C1).

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «Solo se incluyeron en el análisis los estudiantes que otorgaron su consentimiento en la extensión (versión del texto 2026-08-v1).»

## Lo que estos datos no muestran {#limits}

El estado registra una respuesta al aviso, no si el estudiante lo leyó o lo entendió. Tampoco sustituye al consentimiento firmado del estudio. Antes de cualquier análisis, compruebe qué datos existen de las cuentas que rechazaron o siguen pendientes y elimínelos (regla de limpieza C1).

## Para el profesorado {#teacher}

::: tip En clase
Si algunos estudiantes siguen pendientes, recuerde a la clase que el aviso se abre de nuevo antes de la siguiente pregunta y que ambas respuestas son válidas. No pida a nadie que explique su elección.
:::
