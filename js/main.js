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


    // ── 9. CARGA DINÁMICA DE TARJETAS DEL EQUIPO ─────────────────
    // Los datos del equipo viven aquí como arreglo de objetos.
    // Para agregar un miembro, solo agrega un objeto al arreglo.
    const equipo = [
        {
            nombre:  'Juan Navarro',
            cargo:   'Jefe de Abastecimiento',
            icono:   '📋',
            imagen:  'img/Funcionarios/imagen de prueba.jpg',
            descripcion: 'Más de 45 años gestionando el inventario de insumos médicos del hospital.'
        },
        {
            nombre:  'Jefe de Bodega',
            cargo:   'Control de Stock',
            icono:   '📦',
            imagen:  'img/Funcionarios/imagen de prueba.jpg',
            descripcion: 'Supervisa entradas y salidas de productos y coordina con proveedores.'
        },
        {
            nombre:  'Equipo de Abastecimiento',
            cargo:   'Coordinación',
            icono:   '👤👤👤',
            imagen:  'img/Funcionarios/imagen de prueba.jpg',
            descripcion: 'Asegura la entrega oportuna de materiales a todas las áreas clínicas.'
        },
        {
            nombre:  'Equipo de Bodega',
            cargo:   'Operaciones',
            icono:   '👤👤👤',
            imagen:  'img/Funcionarios/imagen de prueba.jpg',
            descripcion: 'Gestiona el almacenamiento y despacho diario de insumos médicos.'
        },
    ];

    // Función que construye UNA tarjeta a partir de un objeto del arreglo
    function crearTarjeta(miembro) {

        // Contenedor exterior .escena
        const escena = document.createElement('div');
        escena.classList.add('escena');

        // .tarjeta (wrapper del flip)
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');

        // ── CARA FRENTE ──────────────────────────────
        const caraFrente = document.createElement('div');
        caraFrente.classList.add('cara', 'cara-frente');

        const img = document.createElement('img');
        img.src = miembro.imagen;
        img.alt = miembro.nombre;

        const hint = document.createElement('div');
        hint.classList.add('hint');
        hint.textContent = '↻';

        const etiqueta = document.createElement('div');
        etiqueta.classList.add('etiqueta');
        etiqueta.textContent = miembro.nombre;

        caraFrente.appendChild(img);
        caraFrente.appendChild(hint);
        caraFrente.appendChild(etiqueta);

        // ── CARA REVERSO ─────────────────────────────
        const caraReverso = document.createElement('div');
        caraReverso.classList.add('cara', 'cara-reverso');

        const icono = document.createElement('div');
        icono.classList.add('icono-grande');
        icono.textContent = miembro.icono;

        const h3 = document.createElement('h3');
        h3.textContent = miembro.nombre;

        const separador = document.createElement('div');
        separador.classList.add('separador');

        const p = document.createElement('p');
        p.textContent = miembro.descripcion;

        caraReverso.appendChild(icono);
        caraReverso.appendChild(h3);
        caraReverso.appendChild(separador);
        caraReverso.appendChild(p);

        // ── ENSAMBLAR ────────────────────────────────
        tarjeta.appendChild(caraFrente);
        tarjeta.appendChild(caraReverso);
        escena.appendChild(tarjeta);

        return escena;
    }

    // Recorrer el arreglo y agregar cada tarjeta al contenedor
    const contenedor = document.getElementById('equipo-container');

    if (contenedor) {
        equipo.forEach(miembro => {
            const tarjeta = crearTarjeta(miembro);
            contenedor.appendChild(tarjeta);
        });
    }

})();