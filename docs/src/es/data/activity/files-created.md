---
title: Archivos creados
items:
  - coding_sessions.files_created
sample:
  - views/files-created.json#facts.featured = 5
  - views/files-created.json#facts.classMedian = 6
---

# Archivos creados

## ¿Qué son los archivos creados? {#what}

El contador sube uno por cada archivo que el estudiante crea desde VS Code, por ejemplo con «Nuevo archivo» en el explorador. Aquí no se guardan los nombres de archivo.

## Ejemplo con un estudiante {#example}

S07 creó 5 archivos en ocho semanas. La mediana de la clase fue 6.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="files-created" /></ClientOnly>
<template #takeaway>La mayoría de los estudiantes crearon entre tres y ocho archivos en ocho semanas. S07 está en el grupo de 3–5.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Empiezan los estudiantes un archivo nuevo para cada tarea?
- **Investigación:** ¿Cómo organizan los estudiantes su trabajo?

## Muestra de datos brutos {#raw}

Dos sesiones de S07.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/files-created.json

### Cómo se cuenta {#coding-sessions-files-created}

La extensión suma al contador mientras el estudiante trabaja y lo añade a la fila de la sesión cada 3 minutos.

<FormulaVersion ids="coding_sessions.files_created" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** `files_created` por estudiante.
- **Análisis de ejemplo:** Solo de forma descriptiva. Úselo para comprobar si los estudiantes siguieron la estructura de tareas de la asignatura.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «El número de archivos creados en el editor se registró como indicador descriptivo de cómo organizaban los estudiantes su trabajo.»

## Lo que estos datos no muestran {#limits}

No se cuentan los archivos creados en el terminal, con otro programa o copiando una carpeta. Tampoco los archivos que da el profesorado. El número no dice nada sobre el contenido de los archivos.

## Para el profesorado {#teacher}

::: tip En clase
Si sus tareas esperan un archivo por ejercicio, un número muy bajo puede explicar por qué los estudiantes pierden de vista soluciones anteriores.
:::
