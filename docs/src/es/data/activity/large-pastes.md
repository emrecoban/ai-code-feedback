---
title: Pegados grandes
items:
  - coding_sessions.large_paste_count
  - coding_sessions.large_paste_lines
sample:
  - views/large-pastes.json#facts.featured = 2
  - views/large-pastes.json#facts.withAny = 17
  - views/large-pastes.json#facts.maxStudent = 10
  - views/large-pastes.json#facts.lines = 2538
---

# Pegados grandes

## ¿Qué es un pegado grande? {#what}

Un pegado grande es una edición que añade más de 20 líneas de una vez y quita como mucho una línea. VS Code no indica si una edición fue un pegado, así que es una estimación. El texto pegado no se envía.

## Ejemplo con un estudiante {#example}

S07 hizo 2 pegados grandes en ocho semanas. En la clase, 17 de 25 estudiantes hicieron al menos uno, y un estudiante hizo 10. En total, la clase pegó 2538 líneas de esta forma.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="large-pastes" /></ClientOnly>
<template #takeaway>La mayoría de los estudiantes pegan un bloque grande solo unas pocas veces en ocho semanas. Un estudiante destaca con muchos pegados grandes.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Entra código en las tareas desde fuera?
- **Investigación:** ¿Cuánto código no se tecleó, lo que puede afectar a las demás medidas de actividad?

## Muestra de datos brutos {#raw}

Una sesión de la muestra con un pegado grande.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/large-pastes.json

### Cómo se detecta un pegado grande {#coding-sessions-large-paste-count}

Un evento de edición con exactamente un cambio que añade más de 20 líneas y quita como mucho 1 línea.

<FormulaVersion ids="coding_sessions.large_paste_count" />

### Líneas de pegados grandes {#coding-sessions-large-paste-lines}

Suma de las líneas añadidas de esas ediciones.

<FormulaVersion ids="coding_sessions.large_paste_lines" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** `large_pastes` por estudiante, y `paste_share` = líneas de pegados grandes ÷ (líneas añadidas + líneas de pegados grandes).
- **Análisis de ejemplo:** Úselo como control o para un análisis de sensibilidad: repita el análisis principal sin los estudiantes con una proporción alta de pegados.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «Las ediciones únicas que añadían más de 20 líneas se contaron como pegados grandes y se usaron en un análisis de sensibilidad.»

## Lo que estos datos no muestran {#limits}

Se desconoce el origen del pegado: puede ser código antiguo del propio estudiante, una plantilla del profesorado o código de internet. Una plantilla de código de otra extensión puede verse igual. Los pegados de 20 líneas o menos no se cuentan aquí.

## Para el profesorado {#teacher}

::: tip En clase
No trate un pegado grande como copia de otros. Si da código de partida, es normal un pegado al inicio del laboratorio.
:::
