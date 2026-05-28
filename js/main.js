// ═══════════════════════════════════════════════════════════════
//  menu.js — Menú de navegación generado dinámicamente con JS
//  El <button> hamburguesa y el <nav> NO existen en index.html;
//  este archivo los construye desde cero y los inyecta en el DOM.
// ═══════════════════════════════════════════════════════════════

// Script corre al final del body, el DOM ya está disponible
(function() {

    // ── 1. DEFINICIÓN DE ENLACES ─────────────────────────────────
    // Para agregar o quitar secciones del menú, solo edita este arreglo.
    const enlaces = [
        { texto: '¿Quiénes somos?',    href: '#quienes-somos', clase: 'opcion' },
        { texto: '¿Qué hacemos?',      href: '#que-hacemos',   clase: 'opcion' },
        { texto: '¿Dónde lo hacemos?', href: '#donde-hacemos', clase: 'opcion' },
        { texto: 'Iniciar sesión',     href: '#',              clase: 'login'  },
    ];


    // ── 2. CONSTRUIR BOTÓN HAMBURGUESA ───────────────────────────
    // Se crea el <button> con sus 3 líneas desde JavaScript puro.
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


    // ── 3. CONSTRUIR EL <NAV> CON SUS ENLACES ────────────────────
    // Se recorre el arreglo y se crea cada <a> dinámicamente.
    const nav = document.createElement('nav');
    nav.id = 'nav-menu';

    enlaces.forEach(({ texto, href, clase }) => {
        const a = document.createElement('a');
        a.href = href;
        a.classList.add(clase);

        const span = document.createElement('span');
        span.textContent = texto;
        a.appendChild(span);

        nav.appendChild(a);
    });


    // ── 4. INYECTAR EN EL HEADER ─────────────────────────────────
    const header = document.querySelector('header');
    header.appendChild(btnHamburguesa);
    header.appendChild(nav);


    // ── 5. CREAR OVERLAY ─────────────────────────────────────────
    // Fondo oscuro generado por JS y agregado al <body>.
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);


    // ── 6. FUNCIONES ABRIR / CERRAR ──────────────────────────────
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


    // ── 7. EVENTOS DEL MENÚ ──────────────────────────────────────

    // Click en el botón: alternar menú
    btnHamburguesa.addEventListener('click', () => {
        nav.classList.contains('nav-abierto') ? cerrarMenu() : abrirMenu();
    });

    // Click en el overlay: cerrar
    overlay.addEventListener('click', cerrarMenu);

    // Click en cualquier enlace: cerrar y navegar
    nav.querySelectorAll('a').forEach(enlace => {
        enlace.addEventListener('click', cerrarMenu);
    });

    // Tecla Escape: cerrar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarMenu();
    });


    // ── 8. CARRUSEL ──────────────────────────────────────────────
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

})();