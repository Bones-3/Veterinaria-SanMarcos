/* =========================================================
   components.js
   Header y footer reutilizables (se inyectan por JS puro).
   "base" = "" cuando la página está en la raíz,
            "../" cuando está dentro de /paginas o /admin
   ========================================================= */

const ENLACES_NAV = [
  { texto: "Inicio",    href: "index.html",              clave: "home" },
  { texto: "Productos", href: "paginas/productos.html",  clave: "productos" },
  { texto: "Nosotros",  href: "paginas/nosotros.html",   clave: "nosotros" },
  { texto: "Blog",      href: "paginas/blogs.html",      clave: "blogs" },
  { texto: "Contacto",  href: "paginas/contacto.html",   clave: "contacto" },
];

// Renderiza el header de la página
function renderHeader(paginaActiva, base) {
  const enlaces = ENLACES_NAV.map(item => {
    const activo = item.clave === paginaActiva ? "activo" : "";
    return `<li><a class="${activo}" href="${base}${item.href}">${item.texto}</a></li>`;
  }).join("");

  const html = `
  <div class="contenedor">
    <a class="logo" href="${base}index.html"><img src="img/Logo_SanMarcos.png" alt="Veterinaria San Marcos"></a>
    <button class="menu-hamburguesa" id="btnMenu" aria-label="Abrir menú">☰</button>
    <nav class="nav-principal" id="navPrincipal">
      <ul class="nav-links">${enlaces}</ul>
      <div class="nav-acciones">
        <a href="${base}paginas/login.html" title="Ingresar">Ingresar</a>
      </div>
    </nav>
  </div>`;

  const contenedor = document.getElementById("site-header");
  contenedor.classList.add("encabezado");
  contenedor.innerHTML = html;
  contenedor.querySelector("#btnMenu").addEventListener("click", () => {
    contenedor.querySelector("#navPrincipal").classList.toggle("abierto");
  });
}

// Renderiza el footer de la página
function renderFooter(base) {
  const html = `
  <div class="contenedor">
    <div class="pie-marca">
      <img src="img/Logo_SanMarcos.png" alt="Veterinaria San Marcos">
      <div>
        <h4>Veterinaria San Marcos</h4>
        <p>Santiago, Región Metropolitana.<br>Atención de mascotas desde 2009.</p>
      </div>
    </div>
    <div>
      <h4>Enlaces</h4>
      <p><a href="${base}paginas/productos.html">Productos</a></p>
      <p><a href="${base}paginas/nosotros.html">Nosotros</a></p>
      <p><a href="${base}paginas/contacto.html">Contacto</a></p>
    </div>
    <div>
      <h4>Contacto</h4>
      <p>contacto@veterinariasanmarcos.cl<br>+56 9 0000 0000</p>
    </div>
  </div>
  <small>&copy; ${new Date().getFullYear()} Veterinaria San Marcos — Derechos reservados</small>`;
  const pie = document.getElementById("site-footer");
  pie.classList.add("pie");
  pie.innerHTML = html;
}

// Inicializa el layout de la página (header y footer)
function initLayout(paginaActiva, base = "") {
  renderHeader(paginaActiva, base);
  renderFooter(base);
}