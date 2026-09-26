---
title: Deshizo el cambio
items:
  - event.fix_undone
  - metric.after_undone
sample:
  - views/fix-undone.json#facts.featuredUndone = 1
  - views/fix-undone.json#facts.undone = 15
  - views/fix-undone.json#facts.edited = 194
---

# Deshizo el cambio

## ¿Qué es un cambio deshecho? {#what}

El evento se registra cuando el estudiante usa Deshacer en el mismo archivo en los dos minutos siguientes a la primera edición tras la corrección. Es una señal de que el cambio no funcionó o no se entendió.

## Ejemplo con un estudiante {#example}

S07 deshizo 1 vez un cambio tras una corrección en las ocho semanas. En toda la clase, 15 de las 194 ediciones tras una corrección se deshicieron en menos de dos minutos.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="fix-undone" /></ClientOnly>
<template #takeaway>Deshacer una corrección es poco frecuente. Basta una tabla pequeña para mostrarlo.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Falló una corrección para algunos estudiantes?
- **Investigación:** ¿Con qué frecuencia actuar según la corrección termina en una marcha atrás rápida?

## Muestra de datos brutos {#raw}

Un evento de la muestra. No tiene datos adicionales.

`events`:

<<< @/../.vitepress/data/sample/snippets/fix-undone.json

### Deshizo el cambio (panel) {#metric-after-undone}

Preguntas distintas del periodo con este evento.

<FormulaVersion ids="metric.after_undone" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** `undo_count` por estudiante. Los números son pequeños, así que úselos de forma descriptiva.
- **Análisis de ejemplo:** Informe de la tasa de correcciones deshechas junto al resultado autoinformado de las mismas preguntas.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «Un deshacer en el mismo archivo en los dos minutos posteriores a la primera edición tras la retroalimentación se registró como reversión de la corrección aplicada.»

## Lo que estos datos no muestran {#limits}

Un deshacer también puede borrar una errata cometida al escribir la corrección. Solo se observa la primera edición tras la corrección. El evento es poco frecuente, así que no puede sostener un análisis por sí solo.

## Para el profesorado {#teacher}

::: tip En clase
Si varios estudiantes deshacen la misma corrección, puede que el cambio sugerido no encaje con la tarea. Revise la explicación en el panel.
:::
