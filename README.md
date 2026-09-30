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

## Subir a GitHub desde la web

1. Crea un repositorio en GitHub, por ejemplo `orbita-frontend`.
2. Selecciona **Add file > Upload files**.
3. Arrastra el contenido de esta carpeta, manteniendo las subcarpetas. `index.html` debe quedar en la raiz del repositorio.
4. Confirma con **Commit changes**.

El ZIP sirve para transportar el proyecto. Extraelo antes de subir los archivos; no subas solamente el ZIP.

## Subir con Git

Desde una terminal abierta en esta carpeta:

```bash
git init
git add .
git commit -m "Agregar proyecto Orbita"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/orbita-frontend.git
git push -u origin main
```

Sustituye `TU-USUARIO` por tu usuario y crea primero un repositorio vacio. Si Git pide tu identidad, configura tu nombre y correo antes del commit. Esta entrega no esta vinculada a ninguna cuenta ni repositorio remoto.

## Publicar en GitHub Pages

En el repositorio, abre **Settings > Pages**, selecciona **Deploy from a branch**, elige la rama `main` y la carpeta `/(root)`, y guarda. GitHub mostrara el enlace cuando termine la publicacion. Las rutas relativas permiten alojar el proyecto bajo el nombre del repositorio.

## Demostracion en entrevista

1. Crea una tarea y cambiala a En revision.
2. Combina los filtros y muestra la vista de lista.
3. Recarga para demostrar el guardado local.
4. Explica como se calculan los indicadores de Resumen.
5. Consulta contactos en Equipo y demuestra el manejo de un fallo de red.
6. Recorre el formulario con el teclado y cierra con Escape.

Consulta `docs/caso-de-estudio.html` para presentar el problema y la solucion, y `docs/PRUEBAS.md` para el recorrido de verificacion.

## Alcance y limites

Las operaciones de tareas son locales: no existe backend CRUD, autenticacion propia ni sincronizacion entre personas o dispositivos. La API REST es de lectura. Los datos pueden perderse al borrar el almacenamiento del navegador. Se incluyen medidas de accesibilidad, pero no una certificacion WCAG.

Estudia y adapta el codigo para poder explicar sus decisiones y realizar cambios durante una entrevista.

## Dependencias de terceros

Bootstrap, Lucide, DM Sans y Manrope pertenecen a sus respectivos autores. Las bibliotecas conservan sus avisos originales; los archivos de licencia acompanian a los recursos en `assets/`. No se incluyen credenciales ni configuraciones del servicio de alojamiento anterior.
