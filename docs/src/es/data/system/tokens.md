---
title: Tokens usados
items:
  - interactions.prompt_tokens
  - interactions.completion_tokens
  - metric.tokens_used
sample:
  - views/tokens.json#facts.total = 1977570
  - views/tokens.json#facts.prompt = 1502433
  - views/tokens.json#facts.completion = 475137
  - views/tokens.json#facts.perAnswer = 2302
---

# Tokens usados

## ¿Qué son los tokens? {#what}

Los tokens son las unidades con las que un proveedor de IA cuenta el texto. Cada respuesta guarda los tokens de la petición (prompt) y de la respuesta (completion), tal como los informó el proveedor. El coste del servicio depende de ellos.

## Ejemplo con un estudiante {#example}

En la muestra, la clase usó 1.977.570 tokens: 1.502.433 para las peticiones y 475.137 para las respuestas. Una respuesta generada usó 2302 tokens de media.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="tokens" /></ClientOnly>
<template #takeaway>Los tokens siguen al número de preguntas: más en la semana 3 y menos en la semana 8.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Cuánto cuesta el servicio para mi clase?
- **Investigación:** ¿Cuáles son los costes de funcionamiento, para un informe sobre la viabilidad del enfoque?

## Muestra de datos brutos {#raw}

Una respuesta generada de S07.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/tokens.json

### Tokens usados (panel) {#metric-tokens-used}

Suma de los tokens de petición y de respuesta de las preguntas del periodo, también por franja de tiempo y por proveedor.

<FormulaVersion ids="metric.tokens_used" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis (calidad de los datos y sección de Método)
- **Un valor por estudiante para SPSS:** No es necesario por estudiante. Informe del total y de la media por respuesta.
- **Análisis de ejemplo:** Estime el coste por estudiante y asignatura a partir del precio por token del proveedor.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «El uso de tokens informado por el proveedor de IA se usó para estimar el coste de funcionamiento por estudiante.»

## Lo que estos datos no muestran {#limits}

Solo se guarda la última llamada con éxito, así que una llamada de reparación o una primera llamada fallida no se cuentan y el coste real es mayor. El proveedor de respaldo puede contar los tokens de otra forma. Los resúmenes de aprendizaje de IA no se incluyen.

## Para el profesorado {#teacher}

::: tip En clase
Esta página es sobre todo para quienes gestionan el servicio. Para la docencia es más útil el número de preguntas.
:::
