---
title: Ética y protección de datos
---

# Ética y protección de datos

::: warning Borrador
Esta página aún no está publicada. Algunos puntos siguen abiertos y están marcados como PENDIENTE o POR CONFIRMAR.
:::

Esta página explica con palabras sencillas qué registra sobre usted la extensión AI Code Feedback, para qué, dónde se guarda y quién puede verlo.

## Qué se registra y para qué {#what}

- **Su cuenta:** el nombre de usuario que escribe en el primer inicio de sesión, el idioma de las explicaciones y su respuesta a la pregunta de consentimiento.
- **Sus preguntas:** cada vez que pide ayuda, el mensaje de error, el nombre del archivo, el tamaño del código seleccionado, los pasos de la explicación que abrió y sus respuestas a las preguntas breves de debajo (si le sirvió, si lo resolvió, si podría hacerlo solo). Si escribe su propia pregunta, se guarda su texto (como máximo 300 caracteres). Su código se envía al proveedor de IA para escribir la explicación, pero no se guarda. La explicación puede citar partes de él.
- **Cómo trabaja:** recuentos y tiempos, por ejemplo el tiempo activo, las líneas añadidas, los guardados, las pausas y los errores que desaparecieron. Para esto, la extensión no envía su código.
- **Resúmenes:** textos breves que la IA escribe sobre sus preguntas recientes.

Los datos tienen dos fines: darle una mejor retroalimentación y estudiar cómo cambia la ayuda a demanda la manera de aprender a programar. La página [Los datos de un vistazo](./data-at-a-glance) recoge cada dato.

## Marco legal {#law}

El estudio sigue el Reglamento General de Protección de Datos (RGPD) para los datos recogidos en España y la Ley turca de Protección de Datos Personales (KVKK) para los datos recogidos en Turquía.

- Responsable del tratamiento: <Todo kind="confirm">según la solicitud ética</Todo>
- Aprobación del comité de ética en España: <Todo>nombre del comité y número de aprobación</Todo>
- Aprobación del comité de ética en Turquía: <Todo>nombre del comité y número de aprobación</Todo>

## Dónde se guardan los datos {#where}

- Los datos se guardan en un proyecto de Supabase en la Unión Europea.
- Para escribir una explicación, el servidor envía su pregunta y el código enmascarado al proveedor de IA Doubleword.ai. Antes de que el código salga de su ordenador, la extensión enmascara posibles secretos como claves, contraseñas y direcciones de correo. <Todo kind="confirm">dónde trata Doubleword.ai los datos (dentro o fuera de la UE)</Todo>
- Plazo de conservación y borrado: <Todo>según la solicitud ética</Todo>

## Quién puede verlos {#access}

- Usted puede ver sus propias preguntas, resúmenes y estadísticas en la extensión.
- El profesorado y el equipo de investigación ven los datos en el panel. Las cuentas del panel tienen el rol de administrador o de lector. <Todo>quién tiene cada rol</Todo>
- El panel muestra su nombre de usuario. En los archivos de análisis, el nombre de usuario se sustituye por un código como S07 (véase [Vinculación con instrumentos externos](./research/linking)).
- Una explicación se guarda en una caché compartida y puede mostrarse a otro estudiante que haga la misma pregunta. La caché no tiene id de estudiante, pero una explicación puede citar partes de un mensaje de error o de código.

## Consentimiento y retirada {#consent}

- Cómo se obtuvo el consentimiento: <Todo>sin documentar todavía</Todo>
- La extensión pide su consentimiento en el primer inicio de sesión y registra su respuesta con la versión del texto. <Todo>I-01</Todo>
- Puede retirarse desde el panel de la extensión en cualquier momento, y la retirada borra su historial de interacciones guardado. <Todo>I-02</Todo>

## Contacto {#contact}

Emre Çoban, e.coban.2024@alumnos.urjc.es. Delegado de protección de datos: <Todo>contacto institucional</Todo>
