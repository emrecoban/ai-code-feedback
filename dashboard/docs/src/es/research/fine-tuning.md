---
title: Datos de ajuste fino
---

# Datos de ajuste fino

Desde la migración 0025, cada respuesta que escribe el modelo se guarda también como datos de entrenamiento. Esta página explica qué se guarda, cómo una pregunta se convierte en ejemplos de entrenamiento y cómo exportarlos. Estos datos nunca son públicos. Solo las personas administradoras del panel pueden verlos o exportarlos.

## Qué se guarda {#kept}

Por cada respuesta nueva, la función del servidor explain escribe una fila en [training_samples](../reference/training-samples):

- el mensaje de sistema y el mensaje de usuario tal como los recibió el modelo,
- la misma solicitud en campos separados: el código con datos sensibles eliminados, la línea de foco, todos los diagnósticos, los idiomas, la pregunta y las notas privadas sobre el estudiante,
- la respuesta en bruto del modelo y las comprobaciones que pasó,
- el modelo, los ajustes de muestreo y una versión del prompt.

Las respuestas de la caché no se guardan, porque se escribieron para otra solicitud. Las etiquetas tampoco se guardan. Se calculan a partir de lo que hizo el estudiante después, cada vez que se leen los datos.

## Tres tipos de pregunta {#capture}

| Tipo | Qué es | Qué puede enseñar |
|---|---|---|
| `full` | La solicitud se guardó | La respuesta completa y cada nivel de pista |
| `reduced` | Una pregunta sobre un error hecha antes de guardar las solicitudes | Solo L0 y L2, desde el mensaje de error |
| `none` | Una respuesta de la caché, o una pregunta sobre una selección hecha antes de guardar las solicitudes | Nada |

L0 y L2 nunca dependen del código del estudiante, así que se pueden reconstruir solo con el mensaje de error. L1 y L3 señalan el código, así que necesitan la solicitud completa.

## Vistas de entrenamiento {#views}

- **Respuesta completa** (`sft`): los mensajes de producción, con la respuesta completa como objetivo, en el orden del esquema de salida.
- **Por nivel** (`levels`): un ejemplo para cada uno de L0, L1, L2 y L3. El mensaje de usuario indica el nivel que hay que escribir y lista los niveles que el estudiante ya vio.
- **Ejemplo bueno o malo** (`kto`): el mismo prompt y la misma respuesta con una etiqueta, para entrenamiento por preferencias.

Cada línea de una exportación es un objeto JSON (JSONL). Con metadata activada, la línea lleva también un campo `metadata`: el id de la pregunta, un seudónimo del estudiante (`group`), una partición fija (`split`: train, validation o test, por estudiante), la versión del prompt, el modelo y todas las etiquetas.

## Etiquetas {#labels}

| Etiqueta | Regla |
|---|---|
| Leyó la respuesta | En pantalla al menos 5 segundos, o el estudiante volvió al código |
| El error desapareció | La extensión informó de que el error salió del archivo. "No" solo después de un día |
| El mismo error en menos de 10 min | Volvió a preguntar por el mismo error en menos de 10 minutos |
| El mismo concepto en menos de 7 días | Otra pregunta sobre el mismo concepto en menos de 7 días |
| Nivel más bajo que bastó | El error desapareció después, sin repetición rápida y sin deshacer |
| Ejemplo: bueno o malo | Malo si se valoró como poco útil, si siguió atascado, si volvió a preguntar en menos de 10 minutos o si deshizo la corrección. Si no, bueno si se valoró como útil, si lo resolvió o si el error desapareció tras una respuesta leída |

Las etiquetas pueden cambiar durante los 7 días siguientes a la pregunta. La exportación puede omitir las etiquetas que aún no son definitivas.

## Qué queda fuera {#excluded}

- las preguntas de estudiantes que no dieron su consentimiento,
- las respuestas de la caché,
- las respuestas en las que el modelo dijo que el contexto no bastaba,
- las respuestas cuyos L2 y L3 se quitaron tras fallar las comprobaciones. Su L0 y su L1 siguen en la vista por nivel,
- las respuestas que se sabe que fallaron. Se quedan en la vista de ejemplos buenos o malos como ejemplos malos, pero nunca como ejemplo que imitar.

## Cómo exportar {#export}

En el panel, abre Resumen, luego Exportar y "Datos de ajuste fino (.jsonl)". Elige la vista y descarga el archivo del periodo seleccionado. Cada exportación queda en el registro de actividad. Para revisar antes una sola pregunta, ábrela y despliega "Datos de ajuste fino" al final.

## Privacidad {#privacy}

Los mensajes contienen el código del estudiante después de que la extensión quitara claves, tokens y direcciones de correo. Los nombres en comentarios o cadenas no se quitan. Las notas privadas sobre el estudiante forman parte del mensaje de usuario. Quita la metadata antes de que un archivo salga del equipo de investigación, y revisa el código que contiene antes de publicarlo.
