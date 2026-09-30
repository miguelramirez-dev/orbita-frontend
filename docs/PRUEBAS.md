# Verificacion manual

1. Abrir `index.html`: deben aparecer diez tareas de muestra en un navegador sin datos previos.
2. Crear una tarea, editarla y cambiarla de estado.
3. Recargar: la tarea debe conservarse.
4. Combinar busqueda, proyecto y prioridad; comprobar tambien un resultado vacio.
5. Cambiar entre tablero y lista sin perder los filtros.
6. Abrir Resumen y comprobar que los indicadores reflejan las tareas actuales.
7. Abrir Equipo, consultar el directorio y comprobar los contactos.
8. Desconectar la red y volver a consultar: debe aparecer un mensaje de error. Reconectar y reintentar.
9. Navegar con Tab, abrir el formulario y cerrarlo con Escape.
10. Comprobar escritorio y movil: no debe haber desbordamiento horizontal de la pagina.
11. Eliminar una tarea y aceptar la confirmacion.
12. Abrir el caso de estudio desde el pie de pagina y volver al tablero.

## Pruebas de la version original

Playwright con Edge: creacion, edicion, eliminacion, cambio de estado, persistencia, busqueda, listado, rutas, REST simulado con exito y error, y anchos de 390, 768 y 1440 pixeles. Consulta real del endpoint: diez contactos. No se realizo una auditoria completa de accesibilidad.
