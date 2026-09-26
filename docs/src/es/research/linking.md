---
title: Vinculación con instrumentos externos
---

# Vinculación con instrumentos externos

El pretest, el postest y el cuestionario TAM se recogen fuera de la extensión. Esta página explica cómo unirlos con los datos de la extensión sin que el archivo de análisis contenga nombres.

## La única clave: el nombre de usuario {#key}

La extensión solo conoce a un estudiante por el nombre de usuario que escribió en el primer inicio de sesión. En el sistema no hay número de estudiante, código de asignatura ni otro modo de acceso. Un nombre de usuario nuevo o mal escrito crea en silencio una segunda cuenta.

- Qué se indicó a los estudiantes que usaran como nombre de usuario: <Todo>sin documentar todavía</Todo>
- La tabla de claves vincula cada nombre de usuario con el número de estudiante que figura en los tests. Se guarda fuera de Supabase y fuera del repositorio. <Todo kind="confirm">dónde se guarda y quién puede verla</Todo>

## Pasos de la unión {#steps}

1. Exporte las tablas largas: preguntas, eventos y sesiones.
2. Aplique las [reglas de limpieza](./cleaning).
3. Agregue a una fila por estudiante (formato ancho). Cada página de datos da la regla en «Un valor por estudiante para SPSS».
4. Asigne a cada nombre de usuario su número de estudiante con la tabla de claves.
5. Una las puntuaciones del pretest, del postest y del TAM por el número de estudiante.
6. Dé a cada estudiante un código de participante (S01, S02 …) y borre del archivo de análisis el nombre de usuario y el número de estudiante.

## Ejemplo resuelto con la cohorte sintética {#example}

S07 escribió el nombre de usuario `s07`. La tabla de claves da el número de estudiante `SYN-2030-007`. S12 escribió una vez un nombre de usuario erróneo (`s12x`), así que la tabla de claves tiene dos filas con el mismo número y la regla C3 une las dos cuentas.

<LinkingExample part="key" />

Tras la unión, S07 tiene una fila en el archivo ancho. Esta es una parte:

<LinkingExample part="wide" />

El archivo completo está en las [descargas](./codebook).

## Ítems de los instrumentos {#instrument-items}

El pretest y el postest tienen 28 ítems cada uno (PreQ1 a PreQ28 y PostQ1 a PostQ28), puntuados con 0 o 1. El cuestionario TAM tiene 19 ítems (Item1 a Item19) en cinco constructos: utilidad percibida, norma subjetiva, intención de uso, actitud y uso real.

- Áreas de contenido del test: <Todo>sin documentar todavía</Todo>
- Ítems por constructo del TAM y escala Likert: <Todo>sin documentar todavía</Todo> Los datos sintéticos usan como marcador una escala de 5 puntos y la agrupación 1–5, 6–8, 9–12, 13–16 y 17–19.

## Puntuaciones de los instrumentos {#instrument-scores}

La puntuación del test es la suma de los 28 ítems. La ganancia de aprendizaje es la puntuación del postest menos la del pretest. Cada constructo del TAM es la media de sus ítems.

<FormulaVersion ids="external.pre_total,external.post_total,external.gain,external.tam_pu,external.tam_sn,external.tam_bi,external.tam_att,external.tam_au" />
