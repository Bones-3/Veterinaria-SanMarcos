/* =========================================================
   admin.js — Mantenedores de Productos y Usuarios (mock)
   Persisten en localStorage. Sin backend en esta entrega.
   ========================================================= */

const USUARIOS_KEY = "vsm_usuarios";

function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(USUARIOS_KEY) || "[]");
}
function guardarUsuarios(lista) {
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(lista));
}

/* ---------- Productos ---------- */
function renderTablaProductos(contenedorId) {
  const productos = obtenerProductos();
  const cont = document.getElementById(contenedorId);
  cont.innerHTML = `
    <table class="tabla-admin">
      <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
      <tbody>
        ${productos.map(p => `
          <tr>
            <td>${p.codigo}</td>
            <td>${p.nombre}</td>
            <td>${p.categoria}</td>
            <td>${formatoCLP(p.precio)}</td>
            <td class="${p.stock <= p.stockCritico ? "stock-critico" : ""}">${p.stock}${p.stock <= p.stockCritico ? " ⚠" : ""}</td>
            <td class="acciones-tabla">
              <button class="boton-secundario" onclick="location.href='producto-form.html?id=${p.id}'">Editar</button>
              <button class="boton-peligro" data-id="${p.id}" class="btn-borrar-producto">Eliminar</button>
            </td>
          </tr>`).join("")}
      </tbody>
    </table>`;
  cont.querySelectorAll("[data-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (confirm("¿Eliminar este producto?")) {
        const lista = obtenerProductos().filter(p => p.id !== Number(btn.dataset.id));
        guardarProductos(lista);
        renderTablaProductos(contenedorId);
      }
    });
  });
}

function cargarFormularioProducto() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  if (!id) return;
  const producto = obtenerProductos().find(p => p.id === id);
  if (!producto) return;
  document.getElementById("idProducto").value = producto.id;
  document.getElementById("codigo").value = producto.codigo;
  document.getElementById("nombre").value = producto.nombre;
  document.getElementById("descripcion").value = producto.descripcion || "";
  document.getElementById("precio").value = producto.precio;
  document.getElementById("stock").value = producto.stock;
  document.getElementById("stockCritico").value = producto.stockCritico || "";
  document.getElementById("categoria").value = producto.categoria;
  document.getElementById("tituloFormulario").textContent = "Editar producto";
}

function guardarFormularioProducto(evento) {
  evento.preventDefault();
  if (!validarProducto()) return;
  const idInput = document.getElementById("idProducto").value;
  const lista = obtenerProductos();
  const datos = {
    codigo: document.getElementById("codigo").value.trim(),
    nombre: document.getElementById("nombre").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    precio: Number(document.getElementById("precio").value),
    stock: Number(document.getElementById("stock").value),
    stockCritico: Number(document.getElementById("stockCritico").value || 0),
    categoria: document.getElementById("categoria").value,
    imagen: "https://placehold.co/400x300/1F3D34/f3f2e7?text=Producto",
  };
  if (idInput) {
    const i = lista.findIndex(p => p.id === Number(idInput));
    lista[i] = { ...lista[i], ...datos };
  } else {
    const nuevoId = lista.length ? Math.max(...lista.map(p => p.id)) + 1 : 1;
    lista.push({ id: nuevoId, ...datos });
  }
  guardarProductos(lista);
  window.location.href = "productos.html";
}

/* ---------- Usuarios ---------- */
function renderTablaUsuarios(contenedorId) {
  const usuarios = obtenerUsuarios();
  const cont = document.getElementById(contenedorId);
  if (usuarios.length === 0) {
    cont.innerHTML = "<p>Aún no hay usuarios registrados. Prueba creando uno nuevo.</p>";
    return;
  }
  cont.innerHTML = `
    <table class="tabla-admin">
      <thead><tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Tipo</th><th>Región</th><th>Acciones</th></tr></thead>
      <tbody>
        ${usuarios.map(u => `
          <tr>
            <td>${u.run}</td>
            <td>${u.nombre} ${u.apellidos}</td>
            <td>${u.correo}</td>
            <td>${u.tipoUsuario}</td>
            <td>${u.region}</td>
            <td class="acciones-tabla"><button class="boton-peligro" data-id="${u.run}">Eliminar</button></td>
          </tr>`).join("")}
      </tbody>
    </table>`;
  cont.querySelectorAll("[data-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      guardarUsuarios(obtenerUsuarios().filter(u => u.run !== btn.dataset.id));
      renderTablaUsuarios(contenedorId);
    });
  });
}

function guardarFormularioUsuario(evento, esAdmin = true) {
  evento.preventDefault();
  if (!validarRegistroUsuario(esAdmin)) return;
  const usuarios = obtenerUsuarios();
  const nuevo = {
    run: document.getElementById("run").value.trim().toUpperCase(),
    nombre: document.getElementById("nombre").value.trim(),
    apellidos: document.getElementById("apellidos").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    fechaNacimiento: document.getElementById("fechaNacimiento")?.value || "",
    tipoUsuario: document.getElementById("tipoUsuario")?.value || "Cliente",
    region: document.getElementById("region").value,
    comuna: document.getElementById("comuna").value,
    direccion: document.getElementById("direccion").value.trim(),
  };
  usuarios.push(nuevo);
  guardarUsuarios(usuarios);
  if (esAdmin) {
    window.location.href = "usuarios.html";
  } else {
    const mensaje = document.getElementById("mensajeOk");
    if (mensaje) mensaje.classList.remove("oculto");
    evento.target.reset();
  }
}
