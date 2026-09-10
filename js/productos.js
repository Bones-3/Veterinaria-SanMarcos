/* =========================================================
   productos.js — Renderizado de catálogo y detalle
   ========================================================= */

function formatoCLP(valor) {
  return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

function tarjetaProductoHTML(p, base) {
  return `
  <article class="tarjeta-producto">
    <a href="${base}producto-detalle.html?id=${p.id}"><img src="${p.imagen}" alt="${p.nombre}"></a>
    <div class="info">
      <span class="etiqueta-categoria">${p.categoria}</span>
      <a href="${base}producto-detalle.html?id=${p.id}"><strong>${p.nombre}</strong></a>
      <span class="precio">${formatoCLP(p.precio)}</span>
      <button data-id="${p.id}" class="btn-agregar">Añadir al carrito</button>
    </div>
  </article>`;
}

function renderGrid(contenedorId, base = "", limite = null) {
  let productos = obtenerProductos();
  if (limite) productos = productos.slice(0, limite);
  const cont = document.getElementById(contenedorId);
  cont.innerHTML = productos.map(p => tarjetaProductoHTML(p, base)).join("");
  cont.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", () => {
      agregarAlCarrito(Number(btn.dataset.id), 1);
      btn.textContent = "Añadido ✓";
      setTimeout(() => (btn.textContent = "Añadir al carrito"), 1200);
    });
  });
}

function renderDetalle(contenedorId) {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const producto = obtenerProductos().find(p => p.id === id);
  const cont = document.getElementById(contenedorId);
  if (!producto) {
    cont.innerHTML = `<p>Producto no encontrado. <a href="productos.html">Volver al catálogo</a></p>`;
    return;
  }
  cont.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start;">
      <img src="${producto.imagen}" alt="${producto.nombre}" style="border-radius:12px;">
      <div>
        <span class="etiqueta-categoria">${producto.categoria}</span>
        <h1>${producto.nombre}</h1>
        <p class="precio" style="font-size:1.4rem;">${formatoCLP(producto.precio)}</p>
        <p>${producto.descripcion}</p>
        <p><small>Código: ${producto.codigo} — Stock disponible: ${producto.stock}</small></p>
        <div class="campo" style="max-width:160px;">
          <label for="cantidad">Cantidad</label>
          <input type="number" id="cantidad" value="1" min="1" max="${producto.stock}">
        </div>
        <button id="btnAgregarDetalle">Añadir al carrito</button>
      </div>
    </div>`;
  document.getElementById("btnAgregarDetalle").addEventListener("click", () => {
    const cant = Math.max(1, Number(document.getElementById("cantidad").value) || 1);
    agregarAlCarrito(producto.id, cant);
    document.getElementById("btnAgregarDetalle").textContent = "Añadido ✓";
  });
}
