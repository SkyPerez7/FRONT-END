/* ==========================================================
   UTILIDADES DE SEGURIDAD — PREVENCIÓN XSS
   Sanitiza cualquier texto antes de insertarlo en el DOM.
   - sanitizeText : escapa caracteres HTML peligrosos
   - setTextSafe  : asigna texto limpio a textContent (no interpreta HTML)
   - createElSafe : crea un elemento y le asigna texto sanitizado
========================================================== */

/**
 * Escapa los 5 caracteres HTML especiales de una cadena.
 * Úsalo siempre que debas mostrar datos del usuario en el DOM.
 * @param {string} str - Cadena a sanitizar
 * @returns {string} Cadena con caracteres peligrosos escapados
 */
function sanitizeText(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

/**
 * Asigna texto a un elemento usando textContent (nunca innerHTML).
 * textContent no interpreta HTML, por lo que es seguro por sí solo;
 * esta función lo hace explícito y documentado.
 * @param {HTMLElement} el  - Elemento destino
 * @param {string}      str - Texto a asignar
 */
function setTextSafe(el, str) {
    el.textContent = typeof str === 'string' ? str : '';
}


(function () {

    // ── 1. TEMA ──────────────────────
    const temaGuardado = localStorage.getItem('tema');
    const prefierOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const temaInicial = temaGuardado || (prefierOscuro ? 'oscuro' : 'claro');

    document.documentElement.setAttribute('data-tema', temaInicial);


    // ── 2. SWITCH FLOTANTE ──────────────────────
    const btnTema = document.createElement('button');
    btnTema.id = 'btn-tema';
    btnTema.setAttribute('aria-label', 'Cambiar modo de color');

    // SEGURIDAD: se construye con DOM en lugar de innerHTML
    // para evitar inyección de HTML en caso de que esta cadena
    // provenga de una fuente externa en el futuro.
    const switchTrack = document.createElement('span');
    switchTrack.className = 'switch-track';
    const switchThumb = document.createElement('span');
    switchThumb.className = 'switch-thumb';
    switchTrack.appendChild(switchThumb);
    btnTema.appendChild(switchTrack);

    document.body.appendChild(btnTema);

    function actualizarSwitch() {
        const esOscuro = document.documentElement.getAttribute('data-tema') === 'oscuro';
        btnTema.classList.toggle('activo', esOscuro);
        btnTema.setAttribute('aria-pressed', String(esOscuro));
    }

    actualizarSwitch();

    btnTema.addEventListener('click', () => {
        const actual = document.documentElement.getAttribute('data-tema');
        const nuevo = actual === 'oscuro' ? 'claro' : 'oscuro';

        document.documentElement.setAttribute('data-tema', nuevo);
        localStorage.setItem('tema', nuevo);

        actualizarSwitch();
    });


    // ── 3. DEFINICIÓN DE ENLACES ──────────────────────
    const enlaces = [
        { texto: '¿Quiénes somos?', href: '#quienes-somos', clase: 'opcion' },
        { texto: '¿Qué hacemos?', href: '#que-hacemos', clase: 'opcion' },
        { texto: '¿Dónde lo hacemos?', href: '#donde-hacemos', clase: 'opcion' },
        { texto: 'Iniciar sesión', href: '#', clase: 'login' },
    ];


    // ── 4. CONSTRUIR BOTÓN HAMBURGUESA ──────────────────────
    const btnHamburguesa = document.createElement('button');
    btnHamburguesa.id = 'btn-hamburguesa';
    btnHamburguesa.className = 'hamburguesa';
    btnHamburguesa.setAttribute('aria-label', 'Abrir menú');
    btnHamburguesa.setAttribute('aria-expanded', 'false');

    for (let i = 0; i < 3; i++) {
        const linea = document.createElement('span');
        linea.classList.add('linea');
        btnHamburguesa.appendChild(linea);
    }


    // ── 5. CONSTRUIR NAV ──────────────────────
    const nav = document.createElement('nav');
    nav.id = 'nav-menu';

    enlaces.forEach(({ texto, href, clase }) => {
        const a = document.createElement('a');
        a.href = href;
        a.classList.add(clase);

        const span = document.createElement('span');
        // SEGURIDAD: textContent no interpreta HTML; previene XSS
        // si el array de enlaces llega a ser dinámico/externo.
        setTextSafe(span, texto);

        a.appendChild(span);
        nav.appendChild(a);
    });


    // ── 6. INYECTAR EN HEADER ──────────────────────
    const header = document.querySelector('header');

    header.appendChild(btnHamburguesa);
    header.appendChild(nav);


    // ── 7. CREAR OVERLAY ──────────────────────
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);


    // ── 8. BREAKPOINT MÓVIL ──────────────────────
    const mqMobile = window.matchMedia('(max-width: 768px)');

    function esMobile() {
        return mqMobile.matches;
    }


    // ── 9. FUNCIONES MENÚ ──────────────────────
    function abrirMenu() {
        nav.classList.add('nav-abierto');
        overlay.classList.add('overlay-visible');
        btnHamburguesa.classList.add('activo');
        btnHamburguesa.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function cerrarMenu() {
        nav.classList.remove('nav-abierto');
        overlay.classList.remove('overlay-visible');
        btnHamburguesa.classList.remove('activo');
        btnHamburguesa.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    mqMobile.addEventListener('change', (e) => {
        if (!e.matches) {
            cerrarMenu();
        }
    });


    // ── 10. EVENTOS DEL MENÚ ──────────────────────
    btnHamburguesa.addEventListener('click', () => {
        if (!esMobile()) return;

        if (nav.classList.contains('nav-abierto')) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });

    overlay.addEventListener('click', cerrarMenu);

    nav.querySelectorAll('a').forEach(enlace => {
        enlace.addEventListener('click', () => {
            if (!esMobile()) return;

            document.body.style.overflow = '';
            setTimeout(cerrarMenu, 50);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarMenu();
        }
    });


    // ── 11. CARRUSEL ──────────────────────
    const imagenes = document.querySelectorAll('.carrusel-track img');

    if (imagenes.length > 0) {
        let actual = 0;

        imagenes[actual].classList.add('activa');

        setInterval(() => {
            imagenes[actual].classList.remove('activa');
            actual = (actual + 1) % imagenes.length;
            imagenes[actual].classList.add('activa');
        }, 3000);
    }


    // ── 12. TARJETAS DEL EQUIPO ──────────────────────
    const equipo = [
        {
            nombre: 'Juan Navarro',
            cargo: 'Jefe de Abastecimiento',
            icono: '📋',
            imagen: 'img/Funcionarios/imagen de prueba.jpg',
            descripcion: 'Más de 45 años gestionando el inventario de insumos médicos del hospital.'
        },
        {
            nombre: 'Jefe de Bodega',
            cargo: 'Control de Stock',
            icono: '📦',
            imagen: 'img/Funcionarios/imagen de prueba.jpg',
            descripcion: 'Supervisa entradas y salidas de productos y coordina con proveedores.'
        },
        {
            nombre: 'Equipo de Abastecimiento',
            cargo: 'Coordinación',
            icono: '👤👤👤',
            imagen: 'img/Funcionarios/imagen de prueba.jpg',
            descripcion: 'Asegura la entrega oportuna de materiales a todas las áreas clínicas.'
        },
        {
            nombre: 'Equipo de Bodega',
            cargo: 'Operaciones',
            icono: '👤👤👤',
            imagen: 'img/Funcionarios/imagen de prueba.jpg',
            descripcion: 'Gestiona el almacenamiento y despacho diario de insumos médicos.'
        },
    ];

    function crearTarjeta(miembro) {
        const escena = document.createElement('div');
        escena.classList.add('escena');

        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');

        const caraFrente = document.createElement('div');
        caraFrente.classList.add('cara', 'cara-frente');

        const img = document.createElement('img');
        img.src = miembro.imagen;
        img.alt = miembro.nombre;

        // SEGURIDAD: todos los campos del objeto "miembro" se insertan
        // con textContent / setTextSafe — nunca con innerHTML —
        // para que un valor malicioso no pueda ejecutar scripts.
        const hint = document.createElement('div');
        hint.classList.add('hint');
        setTextSafe(hint, '↻');

        const etiqueta = document.createElement('div');
        etiqueta.classList.add('etiqueta');
        setTextSafe(etiqueta, miembro.nombre);

        caraFrente.appendChild(img);
        caraFrente.appendChild(hint);
        caraFrente.appendChild(etiqueta);

        const caraReverso = document.createElement('div');
        caraReverso.classList.add('cara', 'cara-reverso');

        const icono = document.createElement('div');
        icono.classList.add('icono-grande');
        setTextSafe(icono, miembro.icono);

        const h3 = document.createElement('h3');
        setTextSafe(h3, miembro.nombre);

        const sep = document.createElement('div');
        sep.classList.add('separador');

        const p = document.createElement('p');
        setTextSafe(p, miembro.descripcion);

        caraReverso.appendChild(icono);
        caraReverso.appendChild(h3);
        caraReverso.appendChild(sep);
        caraReverso.appendChild(p);

        tarjeta.appendChild(caraFrente);
        tarjeta.appendChild(caraReverso);
        escena.appendChild(tarjeta);

        return escena;
    }

    const contenedor = document.getElementById('equipo-container');

    if (contenedor) {
        equipo.forEach(miembro => {
            contenedor.appendChild(crearTarjeta(miembro));
        });
    }

})();

/* ==========================================================
   LOGIN MODAL EMERGENTE
========================================================== */

/* ==========================================================
   LOGIN MODAL EMERGENTE
   SEGURIDAD: se construye íntegramente con la DOM API en lugar
   de innerHTML, eliminando cualquier superficie de inyección HTML.
========================================================== */

const modalLogin = document.createElement("div");
modalLogin.id = "modal-login";

// — Contenedor interior —
const modalContenido = document.createElement("div");
modalContenido.className = "modal-contenido";

// — Botón de cierre —
const spanCerrar = document.createElement("span");
spanCerrar.className = "cerrar-modal";
setTextSafe(spanCerrar, "×");   // entidad segura, no innerHTML

// — Título —
const modalTitulo = document.createElement("h2");
setTextSafe(modalTitulo, "Iniciar Sesión");

// — Formulario —
const formLogin = document.createElement("form");
formLogin.id = "form-login";
formLogin.setAttribute("novalidate", "");

// Campo correo
const grupoCorreo = document.createElement("div");
grupoCorreo.className = "grupo-campo";

const labelCorreo = document.createElement("label");
labelCorreo.setAttribute("for", "correo-login");
setTextSafe(labelCorreo, "Correo electrónico");

const inputCorreo = document.createElement("input");
inputCorreo.type = "email";
inputCorreo.id = "correo-login";
inputCorreo.placeholder = "ejemplo@correo.com";
// SEGURIDAD: maxlength limita la superficie de ataque en la entrada
inputCorreo.maxLength = 254;
inputCorreo.autocomplete = "email";

grupoCorreo.appendChild(labelCorreo);
grupoCorreo.appendChild(inputCorreo);

// Campo contraseña
const grupoPassword = document.createElement("div");
grupoPassword.className = "grupo-campo";

const labelPassword = document.createElement("label");
labelPassword.setAttribute("for", "password-login");
setTextSafe(labelPassword, "Contraseña");

const inputPassword = document.createElement("input");
inputPassword.type = "password";
inputPassword.id = "password-login";
inputPassword.placeholder = "Ingrese su contraseña";
// SEGURIDAD: maxlength razonable para no aceptar payloads gigantes
inputPassword.maxLength = 128;
inputPassword.autocomplete = "current-password";

grupoPassword.appendChild(labelPassword);
grupoPassword.appendChild(inputPassword);

// Zona de mensajes de error/éxito
const divMensaje = document.createElement("div");
divMensaje.id = "mensaje-login";

// Botón submit
const btnSubmit = document.createElement("button");
btnSubmit.type = "submit";
btnSubmit.className = "btn-login";
setTextSafe(btnSubmit, "Ingresar");

// Ensamblar formulario
formLogin.appendChild(grupoCorreo);
formLogin.appendChild(grupoPassword);
formLogin.appendChild(divMensaje);
formLogin.appendChild(btnSubmit);

// Ensamblar modal
modalContenido.appendChild(spanCerrar);
modalContenido.appendChild(modalTitulo);
modalContenido.appendChild(formLogin);
modalLogin.appendChild(modalContenido);

document.body.appendChild(modalLogin);


/* ==========================================================
   ABRIR MODAL
========================================================== */

document.addEventListener("click", (e) => {

    const login = e.target.closest(".login");

    if (!login) return;

    e.preventDefault();

    modalLogin.style.display = "flex";
});


/* ==========================================================
   CERRAR MODAL
========================================================== */

// SEGURIDAD: se usa la variable directa en lugar de querySelector,
// evitando que un atacante inyecte otro .cerrar-modal en el DOM.
spanCerrar.addEventListener("click", () => {
    modalLogin.style.display = "none";
});

window.addEventListener("click", (e) => {

    if (e.target === modalLogin) {
        modalLogin.style.display = "none";
    }

});


/* ==========================================================
   VALIDACIÓN FORMULARIO
   SEGURIDAD: los mensajes de error/éxito se escriben con
   setTextSafe (textContent) — nunca con innerHTML —
   para que un atacante no pueda inyectar HTML a través de
   los valores del formulario ni de la lógica de mensajes.
========================================================== */

/**
 * Muestra un mensaje de validación en el modal.
 * @param {HTMLElement} el    - Elemento #mensaje-login
 * @param {string}      texto - Texto a mostrar (se sanitiza internamente)
 * @param {'error'|'ok'} tipo - Controla el color
 */
function mostrarMensaje(el, texto, tipo) {
    setTextSafe(el, texto);               // SEGURIDAD: textContent, no innerHTML
    el.style.color = tipo === 'ok' ? 'green' : 'red';
}

formLogin.addEventListener("submit", (e) => {

    e.preventDefault();

    // SEGURIDAD: .trim() elimina espacios sobrantes antes de validar
    const correo   = inputCorreo.value.trim();
    const password = inputPassword.value.trim();
    const mensaje  = document.getElementById("mensaje-login");

    // Limpiar mensaje anterior
    setTextSafe(mensaje, '');

    if (correo === "") {
        mostrarMensaje(mensaje, "Debe ingresar un correo electrónico.", 'error');
        return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(correo)) {
        mostrarMensaje(mensaje, "Ingrese un correo electrónico válido.", 'error');
        return;
    }

    if (password === "") {
        mostrarMensaje(mensaje, "Debe ingresar una contraseña.", 'error');
        return;
    }

    if (password.length < 6) {
        mostrarMensaje(mensaje, "La contraseña debe tener al menos 6 caracteres.", 'error');
        return;
    }

    mostrarMensaje(mensaje, "Inicio de sesión exitoso.", 'ok');

    setTimeout(() => {
        modalLogin.style.display = "none";
        formLogin.reset();
        // Limpiar mensaje al cerrar para no filtrar info en próxima apertura
        setTextSafe(mensaje, '');
    }, 1500);

});

/* ==========================================================
   NARRADOR DE ACCESIBILIDAD — Web Speech API
   Lee en voz alta el contenido al hacer clic (modo activo)
   o al pasar el cursor (modo hover) cuando está habilitado.
   
   SEGURIDAD: todo texto extraído del DOM se pasa a
   SpeechSynthesisUtterance como string plano; la API no
   interpreta HTML, por lo que no hay riesgo de inyección.
========================================================== */

(function () {

    // ── Verificar soporte del navegador ──────────────────────
    if (!('speechSynthesis' in window)) {
        console.warn('Narrador: Web Speech API no disponible en este navegador.');
        return;
    }

    // ── Estado ──────────────────────
    let narradorActivo = false;
    const STORAGE_KEY = 'narrador-activo';

    // ── Región live para anuncios de estado (ARIA) ──────────────────────
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'assertive');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'narrador-live-region';
    document.body.appendChild(liveRegion);

    // ── Función principal de narración ──────────────────────
    function narrar(texto) {
        if (!texto || !narradorActivo) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'es-CL';
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Preferir voz en español si está disponible
        const voces = window.speechSynthesis.getVoices();
        const vozEspanol = voces.find(v =>
            v.lang.startsWith('es') && v.localService
        ) || voces.find(v => v.lang.startsWith('es'));

        if (vozEspanol) utterance.voice = vozEspanol;

        window.speechSynthesis.speak(utterance);
    }

    // ── Extrae texto legible de un elemento ──────────────────────
    function extraerTexto(el) {
        // Prioridad: aria-label > alt > textContent visible
        if (el.getAttribute('aria-label')) return el.getAttribute('aria-label');
        if (el.tagName === 'IMG' && el.alt) return el.alt;

        // Para tarjetas flip, leer nombre + descripción
        const escena = el.closest('.escena');
        if (escena) {
            const nombre = escena.querySelector('h3');
            const desc   = escena.querySelector('.cara-reverso p');
            const cargo  = escena.querySelector('.cara-reverso .separador');
            let txt = '';
            if (nombre) txt += nombre.textContent.trim() + '. ';
            if (desc)   txt += desc.textContent.trim();
            return txt;
        }

        // Para enlaces de navegación
        if (el.closest('nav')) {
            return el.textContent.trim();
        }

        // Texto general: hasta 300 caracteres para no saturar
        const raw = el.textContent.trim().replace(/\s+/g, ' ');
        return raw.length > 300 ? raw.slice(0, 300) + '…' : raw;
    }

    // ── Manejador de clic global ──────────────────────
    function manejarClic(e) {
        if (!narradorActivo) return;

        const el = e.target.closest(
            'p, h1, h2, h3, h4, li, a, button, label, img, ' +
            '.escena, section, .footer-col, [aria-label]'
        );

        if (!el) return;

        // Evitar narrar el propio botón del narrador (tiene su propio mensaje)
        if (el.id === 'btn-narrador' || el.closest('#btn-narrador')) return;

        const texto = extraerTexto(el);
        if (texto) narrar(texto);
    }

    document.addEventListener('click', manejarClic);

    // ── Detener narración al presionar Escape ──────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.speechSynthesis.cancel();
        }
    });

    // ── Botón flotante del narrador ──────────────────────
    const btnNarrador = document.createElement('button');
    btnNarrador.id = 'btn-narrador';
    btnNarrador.setAttribute('aria-label', 'Activar narrador de accesibilidad');
    btnNarrador.setAttribute('aria-pressed', 'false');
    btnNarrador.title = 'Narrador de accesibilidad';

    // Ícono SVG de altavoz (inline, sin dependencias externas)
    const svgActivo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>`;

    const svgSilencio = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>`;

    btnNarrador.innerHTML = svgSilencio;
    document.body.appendChild(btnNarrador);

    // ── Lógica de activar / desactivar ──────────────────────
    function actualizarEstadoNarrador() {
        btnNarrador.classList.toggle('narrador-activo', narradorActivo);
        btnNarrador.setAttribute('aria-pressed', String(narradorActivo));
        btnNarrador.setAttribute(
            'aria-label',
            narradorActivo ? 'Desactivar narrador' : 'Activar narrador de accesibilidad'
        );
        btnNarrador.innerHTML = narradorActivo ? svgActivo : svgSilencio;

        // Anunciar cambio de estado por la región live (para lectores de pantalla)
        liveRegion.textContent = narradorActivo
            ? 'Narrador activado. Haga clic en cualquier elemento para escucharlo.'
            : 'Narrador desactivado.';
        setTimeout(() => { liveRegion.textContent = ''; }, 3000);
    }

    btnNarrador.addEventListener('click', (e) => {
        e.stopPropagation(); // evitar que dispare manejarClic
        narradorActivo = !narradorActivo;
        localStorage.setItem(STORAGE_KEY, narradorActivo ? '1' : '0');

        if (narradorActivo) {
            narrar('Narrador activado. Haga clic en cualquier elemento para escucharlo.');
        } else {
            window.speechSynthesis.cancel();
        }

        actualizarEstadoNarrador();
    });

    // ── Restaurar preferencia guardada ──────────────────────
    if (localStorage.getItem(STORAGE_KEY) === '1') {
        narradorActivo = true;
        actualizarEstadoNarrador();
    }

    // ── Pausar síntesis cuando la pestaña pierde el foco ──────────────────────
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) window.speechSynthesis.cancel();
    });

})();
