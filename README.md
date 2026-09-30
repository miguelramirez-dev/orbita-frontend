# Orbita | Gestor de proyectos

Aplicacion web de portafolio construida con HTML, CSS, Bootstrap y JavaScript. Permite organizar tareas, revisar avances y consultar un directorio mediante una API REST.

Proyecto demostrativo con datos ficticios. No representa un cliente ni experiencia laboral real.

## Abrir el proyecto

Abre `index.html` en tu navegador. No requiere instalar dependencias ni compilar.

Para desarrollar, abre esta carpeta en Visual Studio Code y utiliza la extension Live Server sobre `index.html`. Tambien puedes usar cualquier servidor estatico. Solo la consulta del directorio externo requiere Internet; las fuentes y bibliotecas estan incluidas.

## Estructura

```text
orbita-github/
  index.html
  README.md
  .gitignore
  .nojekyll
  css/
    styles.css
    fonts.css
  js/
    app.js
  assets/
    fonts/
    images/
      favicon.svg
    vendor/
      bootstrap/
        bootstrap.min.css
      lucide/
        lucide.min.js
  docs/
    caso-de-estudio.html
    PRUEBAS.md
```

## Funciones

- Crear, editar y eliminar tareas.
- Cambiar estado, responsable, prioridad y fecha de entrega.
- Buscar y combinar filtros de proyecto y prioridad.
- Cambiar entre tablero y lista.
- Ver indicadores y avance por proyecto.
- Consultar contactos ficticios con estados de carga, error y reintento.
- Conservar las tareas en este navegador mediante localStorage.

## Tecnologias y decisiones

| Requisito | Implementacion |
| --- | --- |
| HTML | Estructura semantica, formularios y tablas |
| Bootstrap 5.3.3 | Estilos de formularios, botones, tablas y progreso |
| JavaScript | Estado, eventos, filtros, validacion y almacenamiento |
| SPA | Navegacion por hash: `#tablero`, `#resumen`, `#equipo` |
| Accesibilidad | Etiquetas, foco visible, dialogo nativo y anuncios de estado |
| Responsive | Tablero adaptable a una, dos o cuatro columnas |
| REST | GET a `https://jsonplaceholder.typicode.com/users` |

`js/app.js` contiene los datos iniciales, la validacion de registros, las funciones de renderizado, los eventos del formulario y la consulta asincrona. `css/styles.css` define el aspecto visual y los puntos de adaptacion a diferentes pantallas.


## Alcance y limites

Las operaciones de tareas son locales: no existe backend CRUD, autenticacion propia ni sincronizacion entre personas o dispositivos. La API REST es de lectura. Los datos pueden perderse al borrar el almacenamiento del navegador. Se incluyen medidas de accesibilidad, pero no una certificacion WCAG.

Estudia y adapta el codigo para poder explicar sus decisiones y realizar cambios durante una entrevista.

## Dependencias de terceros

Bootstrap, Lucide, DM Sans y Manrope pertenecen a sus respectivos autores. Las bibliotecas conservan sus avisos originales; los archivos de licencia acompanian a los recursos en `assets/`. No se incluyen credenciales ni configuraciones del servicio de alojamiento anterior.
