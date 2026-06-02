// ============================================================
// NOTES MANAGER — app.js
// ============================================================
// Este archivo controla toda la lógica de la app.
// Está dividido en secciones para que sea fácil de leer.
// ============================================================


// ─────────────────────────────────────────────────────────────
// 1. DATA MODEL — donde viven los datos
// ─────────────────────────────────────────────────────────────
//
// 'notes' es un array (lista) de objetos. Cada objeto es una nota:
//   { id: '1700000000000', title: 'Mi nota', content: 'El contenido...' }
//
// 'activeId' guarda el id de la nota que está abierta en el editor.

let notes = [];
let activeId = null;


// ─────────────────────────────────────────────────────────────
// 2. SELECCIÓN DE ELEMENTOS DEL DOM
// ─────────────────────────────────────────────────────────────
//
// querySelector() busca un elemento en el HTML usando selectores CSS.
// Si usas '#id' busca por id, si usas '.clase' busca por clase.
// Guardamos cada elemento en una variable para no repetir la búsqueda.

const sidebar     = document.querySelector('#sidebar');
const hamburger   = document.querySelector('#hamburger');
const notesList   = document.querySelector('#notes-list');
const addBtn      = document.querySelector('#add-btn');
const noteTitle   = document.querySelector('#note-title');
const noteContent = document.querySelector('#note-content');
const noteEditor  = document.querySelector('#note-editor');
const emptyState  = document.querySelector('#empty-state');
const exportBtn   = document.querySelector('#export-btn');
const importInput = document.querySelector('#import-input');


// ─────────────────────────────────────────────────────────────
// 3. FUNCIONES — los bloques de lógica reutilizables
// ─────────────────────────────────────────────────────────────

// generateId()
// Genera un ID único para cada nota.
// Date.now() devuelve el tiempo actual en milisegundos — siempre diferente.
// .toString() lo convierte de número a string (texto).
function generateId() {
    return Date.now().toString();
}

// ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

// createNote()
// Crea una nota nueva vacía, la agrega al array, y la abre en el editor.
function createNote() {
    const newNote = {
        id:      generateId(),
        title:   '',
        content: ''
    };

    notes.push(newNote);       // .push() agrega un elemento al final del array
    saveToStorage();            // guarda el estado actualizado en localStorage
    renderSidebar();            // re-dibuja el sidebar con la nueva nota incluida
    activateNote(newNote.id);   // abre la nueva nota en el editor
}

// ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

// activateNote(id)
// Abre una nota en el editor y la marca como activa en el sidebar.
// Recibe el 'id' de la nota que queremos abrir.
function activateNote(id) {
    activeId = id;

    // .find() recorre el array y devuelve el primer objeto que cumpla la condición.
    // Acá buscamos la nota cuyo .id sea igual al id que recibimos.
    const note = notes.find(n => n.id === id);
    if (!note) return; // si no existe, no hace nada

    // Muestra el editor, esconde el mensaje de "seleccioná una nota"
    emptyState.classList.add('hidden');
    noteEditor.classList.remove('hidden');

    // Carga el título y contenido de la nota en los inputs del editor
    noteTitle.value   = note.title;
    noteContent.value = note.content;
    noteTitle.focus(); // mueve el cursor al campo título

    // Actualiza el estilo de las cards: solo la activa tiene la clase 'active'
    // querySelectorAll devuelve TODAS las cards (no solo la primera)
    // .forEach() las recorre una por una
    document.querySelectorAll('.note-card').forEach(card => {
        // classList.toggle(clase, condición): 
        //   agrega la clase si la condición es true, la quita si es false
        card.classList.toggle('active', card.dataset.id === id);
        // dataset.id lee el atributo data-id del HTML: <div data-id="123">
    });
}

// ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

// saveCurrentNote()
// Lee lo que hay en el editor y lo guarda en la nota activa del array.
// Esta función se llama cada vez que el usuario escribe (auto-save).
function saveCurrentNote() {
    if (!activeId) return; // si no hay nota activa, no hace nada

    const note = notes.find(n => n.id === activeId);
    if (!note) return;

    // Lee los valores actuales de los inputs y los guarda en el objeto nota
    note.title   = noteTitle.value;
    note.content = noteContent.value;

    saveToStorage(); // guarda en localStorage

    // Actualiza solo el texto de la card activa en el sidebar
    // (sin re-dibujar todo, para no perder el foco del input)
    const activeCard = document.querySelector(`.note-card[data-id="${activeId}"]`);
    if (activeCard) {
        activeCard.querySelector('.note-card-title').textContent   = note.title   || 'Untitled';
        activeCard.querySelector('.note-card-preview').textContent = note.content || 'No content';
    }
}

// ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──

// renderSidebar()
// Limpia el sidebar y lo re-dibuja con todas las notas del array.
// Esta es la función más importante para entender cómo JS crea HTML dinámico.
function renderSidebar() {
    notesList.innerHTML = ''; // limpia el contenido actual del sidebar

    if (notes.length === 0) {
        notesList.innerHTML = '<p style="color:#5a5548;font-size:12px;text-align:center;padding:24px 0;">No notes yet</p>';
        return;
    }

    // Por cada nota en el array, creamos una card en el HTML
    notes.forEach(note => {

        // 1. Crear el elemento
        const card = document.createElement('div'); // crea un <div> nuevo en memoria

        // 2. Asignarle clase e id
        card.className = 'note-card';
        card.dataset.id = note.id; // esto crea data-id="..." en el HTML

        // 3. Definir su contenido interno con template literals (backticks ` `)
        const titleText   = note.title   || 'Untitled';
        const previewText = note.content || 'No content';

        card.innerHTML = `
            <div class="note-card-title">${titleText}</div>
            <div class="note-card-preview">${previewText}</div>
        `;

        // 4. Si es la nota activa, marcarla visualmente
        if (note.id === activeId) {
            card.classList.add('active');
        }

        // 5. Escuchar el click: al hacer click, activa esa nota
        card.addEventListener('click', () => activateNote(note.id));

        // 6. Insertar la card en el DOM (en el sidebar)
        notesList.appendChild(card);
    });
}


// ─────────────────────────────────────────────────────────────
// 4. LOCALSTORAGE — persistencia entre sesiones
// ─────────────────────────────────────────────────────────────
//
// El navegador tiene localStorage: un diccionario clave → valor
// que se mantiene guardado aunque cierres la pestaña.
//
// Solo acepta strings. Por eso:
//   - Para guardar: JSON.stringify(array) → convierte array a texto
//   - Para cargar:  JSON.parse(texto)     → convierte texto a array

function saveToStorage() {
    localStorage.setItem('notes-manager', JSON.stringify(notes));
}

function loadFromStorage() {
    const stored = localStorage.getItem('notes-manager');
    if (stored) {
        notes = JSON.parse(stored);
    }
}


// ─────────────────────────────────────────────────────────────
// 5. EXPORT / IMPORT JSON
// ─────────────────────────────────────────────────────────────

// exportJSON()
// Convierte el array de notas a un archivo .json y lo descarga.
function exportJSON() {
    // JSON.stringify con (null, 2) formatea el JSON con indentación legible
    const json = JSON.stringify(notes, null, 2);

    // Blob es un "archivo en memoria" del navegador
    const blob = new Blob([json], { type: 'application/json' });

    // URL.createObjectURL genera una URL temporal que apunta a ese archivo
    const url = URL.createObjectURL(blob);

    // Truco estándar para descargar: crear link invisible, clickearlo, eliminarlo
    const link    = document.createElement('a');
    link.href     = url;
    link.download = 'my-notes.json';
    link.click();

    URL.revokeObjectURL(url); // libera la memoria de la URL temporal
}

// importJSON(event)
// Lee un archivo .json del disco y reemplaza las notas actuales.
// 'event' es el objeto que describe lo que pasó (qué archivo eligió el usuario)
function importJSON(event) {
    const file = event.target.files[0]; // el primer archivo seleccionado
    if (!file) return;

    // FileReader es una API del navegador para leer archivos locales
    const reader = new FileReader();

    // .onload se ejecuta cuando el archivo termina de leerse
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                notes = imported;
                saveToStorage();
                renderSidebar();
                // Muestra el empty state y cierra el editor
                emptyState.classList.remove('hidden');
                noteEditor.classList.add('hidden');
                activeId = null;
            }
        } catch {
            alert('El archivo no es un JSON válido.');
        }
    };

    reader.readAsText(file); // inicia la lectura del archivo
    event.target.value = ''; // resetea el input para poder importar de nuevo
}


// ─────────────────────────────────────────────────────────────
// 6. EVENT LISTENERS — conectar acciones del usuario con funciones
// ─────────────────────────────────────────────────────────────
//
// addEventListener(evento, función) escucha un evento en un elemento.
// Cuando el evento ocurre, ejecuta la función.
// Los eventos más comunes: 'click', 'input', 'change', 'keydown'

// Hamburger → colapsar/expandir sidebar
hamburger.addEventListener('click', () => {
    // classList.toggle agrega la clase si no existe, la quita si ya existe
    sidebar.classList.toggle('collapsed');
});

// Botón + Nueva nota
addBtn.addEventListener('click', createNote);

// Auto-save: guardar mientras el usuario escribe
// El evento 'input' se dispara en cada tecla presionada
noteTitle.addEventListener('input', saveCurrentNote);
noteContent.addEventListener('input', saveCurrentNote);

// Export e Import
exportBtn.addEventListener('click', exportJSON);
importInput.addEventListener('change', importJSON);


// ─────────────────────────────────────────────────────────────
// 7. INICIALIZACIÓN — lo que corre cuando carga la página
// ─────────────────────────────────────────────────────────────

function init() {
    loadFromStorage(); // carga notas guardadas (si las hay)
    renderSidebar();   // dibuja el sidebar

    // Si había notas guardadas, abre la primera automáticamente
    if (notes.length > 0) {
        activateNote(notes[0].id);
    }
}

init(); // arranca la app
