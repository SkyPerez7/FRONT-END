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