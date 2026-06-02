# Lessons of the Project — Notes Manager

## Lo que construí
Una app de notas de una sola página con sidebar navegable, auto-guardado en localStorage, e importación/exportación en JSON.

---

## CSS que ya sabía antes de este proyecto
- `display: flex` y `flex-direction`
- `border-radius`, `padding`, `margin`
- `cursor: pointer` para elementos interactivos
- `box-sizing: border-box`
- Selectores básicos por tag, id y clase

---

## CSS nuevo que aprendí en este proyecto

### Variables CSS (`--nombre: valor`)
Definís un valor una sola vez y lo usás en todo el archivo.
Si después querés cambiar el color de acento, cambiás un solo lugar.
```css
:root {
    --accent: #e8a020;
    --bg-main: #111009;
}

.active { color: var(--accent); }
```

### `flex: 1`
En lugar de poner un ancho o alto fijo en píxeles, `flex: 1` le dice al elemento
"ocupá todo el espacio disponible dentro del contenedor flex".
Es la clave para layouts que funcionan en cualquier pantalla.
```css
main { flex: 1; } /* ocupa todo lo que el sidebar no usa */
```

### `height: 100vh`
`vh` = viewport height. `100vh` = el alto completo de la pantalla.
Mucho mejor que poner `height: 850px` que se rompe en otras pantallas.

### Truncar texto con "..."
Estos tres CSS juntos son necesarios para cortar texto largo con puntos suspensivos:
```css
white-space: nowrap;       /* no permite saltos de línea */
overflow: hidden;          /* oculta lo que desborda */
text-overflow: ellipsis;   /* agrega "..." al final */
```

### `classList.toggle(clase)`
Agrega una clase CSS si no existe, la quita si ya existe.
Ideal para el botón hamburger que abre/cierra el sidebar.

---

## JavaScript que aprendí en este proyecto

### querySelector
Selecciona un elemento del HTML con selectores CSS:
```js
const btn = document.querySelector('#add-btn');   // por id
const cards = document.querySelectorAll('.note-card'); // todos los que tengan esa clase
```

### addEventListener
Ejecuta una función cuando el usuario hace algo:
```js
btn.addEventListener('click', () => {
    console.log('el usuario hizo click');
});
```
Eventos comunes: `'click'`, `'input'` (al escribir), `'change'`.

### Arrays y objetos
Las notas se guardan como un array de objetos:
```js
let notes = [
    { id: '1700000', title: 'Mi nota', content: 'El contenido...' }
];
```

### Métodos de array más usados
```js
notes.push(nuevaNota);              // agrega al final
notes.find(n => n.id === '123');    // busca y devuelve el primer match
notes.forEach(n => console.log(n)); // recorre todos
```

### Crear elementos HTML dinámicamente
Así es como JS crea HTML sin tocarlo directamente:
```js
const card = document.createElement('div'); // crea <div> en memoria
card.className = 'note-card';               // le asigna clase
card.innerHTML = `<h3>${nota.title}</h3>`; // define su contenido
contenedor.appendChild(card);              // lo inserta en el DOM
```

### dataset — atributos data-*
Guardar datos extras en elementos HTML para usarlos desde JS:
```html
<div data-id="123"></div>
```
```js
card.dataset.id = '123'; // setear
card.dataset.id;         // leer: '123'
```

### classList
```js
elemento.classList.add('hidden');        // agrega clase
elemento.classList.remove('hidden');     // quita clase
elemento.classList.toggle('collapsed');  // agrega si no está, quita si está
elemento.classList.toggle('active', condicion); // agrega si es true, quita si es false
```

### localStorage
El navegador guarda datos entre sesiones. Solo acepta strings:
```js
// Guardar
localStorage.setItem('mi-app', JSON.stringify(notes));

// Cargar
const guardado = localStorage.getItem('mi-app');
const notes = JSON.parse(guardado);
```

---

## Errores que cometí y corregí
- `background-color: solid gray 1px` → la propiedad correcta es `border: solid gray 1px`
- Alturas fijas en píxeles (`height: 850px`) → en proyectos reales usar `100vh` y `flex: 1`

---

## Estructura del proyecto
```
notes-manager/
├── manual/          ← lo que hice yo mismo, aprendiendo
│   ├── index.html
│   └── aside.css
├── vibe-coding/     ← versión completa con ayuda de IA
│   ├── index.html
│   ├── style.css
│   └── app.js
└── lessons-of-the-project.md   ← este archivo
```

---

## Lo que haría diferente la próxima vez
- Empezar con `height: 100vh` y `flex: 1` desde el inicio, no con píxeles fijos
- Definir las variables CSS al principio, antes de escribir cualquier color o fuente
- Subir el repositorio a GitHub desde el primer día, aunque esté vacío

---

## Estrategia GitHub
- Subí aunque sea un archivo vacío con el nombre correcto
- El repo no es una vitrina, es un historial de progreso
- No esperes a tener algo "perfecto" para publicar — publicá y mejorá
