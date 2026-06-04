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

    btnTema.innerHTML = `
        <span class="switch-track">
            <span class="switch-thumb"></span>
        </span>
    `;

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
        span.textContent = texto;

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

        const hint = document.createElement('div');
        hint.classList.add('hint');
        hint.textContent = '↻';

        const etiqueta = document.createElement('div');
        etiqueta.classList.add('etiqueta');
        etiqueta.textContent = miembro.nombre;

        caraFrente.appendChild(img);
        caraFrente.appendChild(hint);
        caraFrente.appendChild(etiqueta);

        const caraReverso = document.createElement('div');
        caraReverso.classList.add('cara', 'cara-reverso');

        const icono = document.createElement('div');
        icono.classList.add('icono-grande');
        icono.textContent = miembro.icono;

        const h3 = document.createElement('h3');
        h3.textContent = miembro.nombre;

        const sep = document.createElement('div');
        sep.classList.add('separador');

        const p = document.createElement('p');
        p.textContent = miembro.descripcion;

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

const modalLogin = document.createElement("div");
modalLogin.id = "modal-login";

modalLogin.innerHTML = `
<div class="modal-contenido">

    <span class="cerrar-modal">&times;</span>

    <h2>Iniciar Sesión</h2>

    <form id="form-login" novalidate>

        <div class="grupo-campo">
            <label for="correo-login">Correo electrónico</label>
            <input
                type="email"
                id="correo-login"
                placeholder="ejemplo@correo.com">
        </div>

        <div class="grupo-campo">
            <label for="password-login">Contraseña</label>
            <input
                type="password"
                id="password-login"
                placeholder="Ingrese su contraseña">
        </div>

        <div id="mensaje-login"></div>

        <button type="submit" class="btn-login">
            Ingresar
        </button>

    </form>

</div>
`;

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

const cerrarModal =
    modalLogin.querySelector(".cerrar-modal");

cerrarModal.addEventListener("click", () => {
    modalLogin.style.display = "none";
});

window.addEventListener("click", (e) => {

    if (e.target === modalLogin) {
        modalLogin.style.display = "none";
    }

});


/* ==========================================================
   VALIDACIÓN FORMULARIO
========================================================== */

const formularioLogin =
    document.getElementById("form-login");

formularioLogin.addEventListener("submit", (e) => {

    e.preventDefault();

    const correo =
        document.getElementById("correo-login")
        .value
        .trim();

    const password =
        document.getElementById("password-login")
        .value
        .trim();

    const mensaje =
        document.getElementById("mensaje-login");

    mensaje.textContent = "";
    mensaje.style.color = "red";

    if (correo === "") {

        mensaje.textContent =
            "Debe ingresar un correo electrónico.";

        return;
    }

    const regexCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(correo)) {

        mensaje.textContent =
            "Ingrese un correo electrónico válido.";

        return;
    }

    if (password === "") {

        mensaje.textContent =
            "Debe ingresar una contraseña.";

        return;
    }

    if (password.length < 6) {

        mensaje.textContent =
            "La contraseña debe tener al menos 6 caracteres.";

        return;
    }

    mensaje.style.color = "green";

    mensaje.textContent =
        "Inicio de sesión exitoso.";

    setTimeout(() => {

        modalLogin.style.display = "none";

        formularioLogin.reset();

    }, 1500);

});