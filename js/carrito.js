/* =========================================================
   carrito.js — Carrito de compras persistido en localStorage
   Estructura guardada: [{ id, cantidad }, ...]
   ========================================================= */

const CARRITO_KEY = "vsm_carrito";

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem(CARRITO_KEY) || "[]");
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

function obtenerCantidadCarrito() {
  return obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
}

function agregarAlCarrito(idProducto, cantidad) {
  const carrito = obtenerCarrito();
  const existente = carrito.find(item => item.id === idProducto);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ id: idProducto, cantidad });
  }
  guardarCarrito(carrito);
  const badge = document.getElementById("badgeCarrito");
  if (badge) badge.textContent = obtenerCantidadCarrito();
}

function actualizarCantidadCarrito(idProducto, cantidad) {
  let carrito = obtenerCarrito();
  if (cantidad <= 0) {
    carrito = carrito.filter(item => item.id !== idProducto);
  } else {
    const item = carrito.find(i => i.id === idProducto);
    if (item) item.cantidad = cantidad;
  }
  guardarCarrito(carrito);
}

function eliminarDelCarrito(idProducto) {
  const carrito = obtenerCarrito().filter(item => item.id !== idProducto);
  guardarCarrito(carrito);
}

function renderCarrito(contenedorId, resumenId) {
  const carrito = obtenerCarrito();
  const productos = obtenerProductos();
  const cont = document.getElementById(contenedorId);

  if (carrito.length === 0) {
    cont.innerHTML = `<p>Tu carrito está vacío. <a href="productos.html">Ver productos</a></p>`;
    document.getElementById(resumenId).innerHTML = "";
    return;
  }

  let total = 0;
  cont.innerHTML = carrito.map(item => {
    const p = productos.find(prod => prod.id === item.id);
    if (!p) return "";
    const subtotal = p.precio * item.cantidad;
    total += subtotal;
    return `
    <div class="fila-carrito">
      <img src="${p.imagen}" alt="${p.nombre}">
      <div><strong>${p.nombre}</strong><br><small>${formatoCLP(p.precio)} c/u</small></div>
      <input type="number" min="1" max="${p.stock}" value="${item.cantidad}" data-id="${p.id}" class="input-cantidad" style="width:70px;">
      <strong>${formatoCLP(subtotal)}</strong>
      <button class="boton-peligro btn-eliminar" data-id="${p.id}">Eliminar</button>
    </div>`;
  }).join("");

  document.getElementById(resumenId).innerHTML = `
    <p>Total: <strong>${formatoCLP(total)}</strong></p>
    <button id="btnVaciar" class="boton-secundario">Vaciar carrito</button>
    <button id="btnPagar">Pagar (demo)</button>`;

  cont.querySelectorAll(".input-cantidad").forEach(input => {
    input.addEventListener("change", () => {
      actualizarCantidadCarrito(Number(input.dataset.id), Number(input.value));
      renderCarrito(contenedorId, resumenId);
    });
  });
  cont.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", () => {
      eliminarDelCarrito(Number(btn.dataset.id));
      renderCarrito(contenedorId, resumenId);
    });
  });
  document.getElementById("btnVaciar").addEventListener("click", () => {
    guardarCarrito([]);
    renderCarrito(contenedorId, resumenId);
  });
  document.getElementById("btnPagar").addEventListener("click", () => {
    guardarCarrito([]);
    cont.innerHTML = `<p class="mensaje-exito">¡Gracias por tu compra! (flujo de pago simulado — se implementará con backend en próximas entregas)</p>`;
    document.getElementById(resumenId).innerHTML = "";
  });
}
