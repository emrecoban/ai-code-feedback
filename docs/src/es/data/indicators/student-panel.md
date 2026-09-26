---
title: Panel del estudiante
items:
  - metric.ext_explanations_asked
  - metric.ext_errors_worked_out
  - metric.ext_days_using
  - metric.ext_activity_totals
sample:
  - views/student-panel.json#facts.explanationsAskedFor = 37
  - views/student-panel.json#facts.daysUsingThis = 11
  - views/student-panel.json#facts.totalActiveHours = 11.7
  - views/student-panel.json#facts.errorsWorkedOutYourself = 22
  - views/student-panel.json#facts.errorsFixedWithoutAsking = 52
---

# Panel del estudiante

## ¿Qué es el panel del estudiante? {#what}

La barra lateral de la extensión muestra a cada estudiante algunos números sobre su propio trabajo. La extensión los calcula en el ordenador del estudiante a partir de sus propias filas. Para este panel no se guarda nada nuevo.

## Ejemplo con un estudiante {#example}

El panel de S07 al final de la muestra indica 37 explicaciones solicitadas, 11 días de uso y 11,7 horas de tiempo activo. Dos números se confunden con facilidad: «Errores que resolviste tú mismo/a» (22) cuenta las preguntas en las que S07 no abrió la regla ni la corrección, y «Errores que arreglaste sin preguntar» (52) cuenta los errores que desaparecieron sin ninguna pregunta.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="student-panel" /></ClientOnly>
<template #takeaway>La tabla recoge todos los números del panel de S07. Cada número se describe en su propia página de datos.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Qué ve un estudiante sobre su propio progreso?
- **Investigación:** ¿Qué retroalimentación sobre su propio comportamiento recibieron los estudiantes, que a su vez puede cambiar ese comportamiento?

## Muestra de datos brutos {#raw}

El panel no guarda nada. Lee las filas del estudiante en `interactions` y `coding_sessions`, que se describen en las demás páginas de datos.

### Explicaciones solicitadas {#metric-ext-explanations-asked}

Todas las preguntas del estudiante.

<FormulaVersion ids="metric.ext_explanations_asked" />

### Errores que resolviste tú mismo/a {#metric-ext-errors-worked-out}

Preguntas del estudiante que terminaron en L0–L1. El estudiante sí pidió una explicación.

<FormulaVersion ids="metric.ext_errors_worked_out" />

### Días usando esto {#metric-ext-days-using}

Fechas distintas de los inicios de sesión, en la zona horaria del ordenador del estudiante.

<FormulaVersion ids="metric.ext_days_using" />

### Totales de todas las sesiones {#metric-ext-activity-totals}

Sumas de todas las sesiones del estudiante: tiempo activo (en horas), líneas añadidas, líneas borradas, archivos creados y errores corregidos sin preguntar.

<FormulaVersion ids="metric.ext_activity_totals" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención (parte del tratamiento)
- **Un valor por estudiante para SPSS:** Ninguno. Los mismos valores pueden calcularse con los datos brutos de las demás páginas.
- **Análisis de ejemplo:** Describa el panel en la sección de Método como parte de la intervención.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «La extensión mostraba a cada estudiante un panel resumen con sus propias estadísticas de uso, que formaba parte de la intervención.»

## Lo que estos datos no muestran {#limits}

Los dos números de errores tienen nombres parecidos pero miden cosas distintas. «Días usando esto» puede diferir del panel del profesorado porque usa la zona horaria del estudiante. El panel muestra totales de todo el tiempo, así que no puede mostrar el cambio a lo largo de las semanas.

## Para el profesorado {#teacher}

::: tip En clase
Explique una vez a la clase los dos números de errores. Si no, los estudiantes pueden entender «Errores que resolviste tú mismo/a» como errores resueltos sin la herramienta.
:::
