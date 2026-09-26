---
title: Flujo de datos
---

# Flujo de datos

El sistema tiene tres partes: la extensión de VS Code en el ordenador del estudiante, un proyecto de Supabase en la región de la UE y el panel para el profesorado y la investigación. Un proveedor externo de IA escribe las explicaciones.

## Diagrama {#diagram}

<DataFlow part="diagram" />

- La extensión escribe directamente las filas propias del estudiante: la cuenta, las respuestas de consentimiento y las sesiones de programación con sus contadores de actividad.
- Las peticiones de ayuda van a la función del servidor `explain`. Antes de que el código salga del ordenador, la extensión enmascara posibles secretos como claves, contraseñas y direcciones de correo. Después, el servidor pregunta al proveedor de IA y guarda la respuesta.
- Los eventos de investigación van a la función del servidor `log-event`. Solo llevan medidas como tiempos, recuentos y proporciones, nunca código ni texto escrito.
- El panel lee los datos solo a través de funciones de la base de datos que comprueban su propio token de sesión. Cuando cambian los datos, una señal breve en directo con el nombre de la tabla le indica que vuelva a cargar.

## Dónde está cada categoría {#table}

<DataFlow part="table" />
