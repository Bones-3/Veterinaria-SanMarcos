/* =========================================================
   validaciones.js — Funciones reutilizables de validación
   y mensajes de error en tiempo real para formularios.
   ========================================================= */

const DOMINIOS_CORREO_VALIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

function mostrarError(campoId, mensaje) {
  const input = document.getElementById(campoId);
  const errorSpan = document.getElementById("error-" + campoId);
  input.closest(".campo").classList.add("con-error");
  if (errorSpan) errorSpan.textContent = mensaje;
}

function limpiarError(campoId) {
  const input = document.getElementById(campoId);
  const errorSpan = document.getElementById("error-" + campoId);
  input.closest(".campo").classList.remove("con-error");
  if (errorSpan) errorSpan.textContent = "";
}

function esRequerido(valor) {
  return valor !== null && valor.trim().length > 0;
}

function longitudValida(valor, min, max) {
  const largo = valor.trim().length;
  return largo >= min && largo <= max;
}

function correoValido(valor) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!patron.test(valor)) return false;
  const dominio = valor.split("@")[1]?.toLowerCase();
  return DOMINIOS_CORREO_VALIDOS.includes(dominio);
}

function rangoNumericoValido(valor, min, max) {
  const num = Number(valor);
  if (Number.isNaN(num)) return false;
  return num >= min && (max === null || num <= max);
}

function esEnteroValido(valor) {
  return /^-?\d+$/.test(String(valor).trim());
}

// Validación de RUN chileno (sin puntos ni guion, ej: 19011022K)
function runValido(valor) {
  const run = valor.trim().toUpperCase();
  if (!/^[0-9]+[0-9K]$/.test(run)) return false;
  if (run.length < 7 || run.length > 9) return false;
  const cuerpo = run.slice(0, -1);
  const dv = run.slice(-1);
  let suma = 0, multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dv === dvEsperado;
}

/* ---------- Validadores de formularios completos ---------- */

function validarLogin() {
  let ok = true;
  const correo = document.getElementById("correo").value;
  const clave = document.getElementById("clave").value;

  if (!esRequerido(correo) || !correoValido(correo)) {
    mostrarError("correo", "Ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com), máx. 100 caracteres.");
    ok = false;
  } else if (!longitudValida(correo, 1, 100)) {
    mostrarError("correo", "El correo no puede superar los 100 caracteres.");
    ok = false;
  } else limpiarError("correo");

  if (!esRequerido(clave) || !longitudValida(clave, 4, 10)) {
    mostrarError("clave", "La contraseña debe tener entre 4 y 10 caracteres.");
    ok = false;
  } else limpiarError("clave");

  return ok;
}

function validarContacto() {
  let ok = true;
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const comentario = document.getElementById("comentario").value;

  if (!esRequerido(nombre) || !longitudValida(nombre, 1, 100)) {
    mostrarError("nombre", "El nombre es obligatorio (máx. 100 caracteres).");
    ok = false;
  } else limpiarError("nombre");

  if (esRequerido(correo) && (!correoValido(correo) || !longitudValida(correo, 1, 100))) {
    mostrarError("correo", "Correo inválido o dominio no permitido (máx. 100 caracteres).");
    ok = false;
  } else limpiarError("correo");

  if (!esRequerido(comentario) || !longitudValida(comentario, 1, 500)) {
    mostrarError("comentario", "El comentario es obligatorio (máx. 500 caracteres).");
    ok = false;
  } else limpiarError("comentario");

  return ok;
}

function validarRegistroUsuario(esAdmin = false) {
  let ok = true;
  const campos = {
    run: document.getElementById("run").value,
    nombre: document.getElementById("nombre").value,
    apellidos: document.getElementById("apellidos").value,
    correo: document.getElementById("correo").value,
    direccion: document.getElementById("direccion").value,
    region: document.getElementById("region").value,
    comuna: document.getElementById("comuna").value,
  };

  if (!esRequerido(campos.run) || !runValido(campos.run) || !longitudValida(campos.run, 7, 9)) {
    mostrarError("run", "RUN inválido. Sin puntos ni guion, ej: 19011022K.");
    ok = false;
  } else limpiarError("run");

  if (!esRequerido(campos.nombre) || !longitudValida(campos.nombre, 1, 50)) {
    mostrarError("nombre", "El nombre es obligatorio (máx. 50 caracteres).");
    ok = false;
  } else limpiarError("nombre");

  if (!esRequerido(campos.apellidos) || !longitudValida(campos.apellidos, 1, 100)) {
    mostrarError("apellidos", "Los apellidos son obligatorios (máx. 100 caracteres).");
    ok = false;
  } else limpiarError("apellidos");

  if (!esRequerido(campos.correo) || !correoValido(campos.correo) || !longitudValida(campos.correo, 1, 100)) {
    mostrarError("correo", "Correo inválido o dominio no permitido (máx. 100 caracteres).");
    ok = false;
  } else limpiarError("correo");

  if (!esRequerido(campos.direccion) || !longitudValida(campos.direccion, 1, 300)) {
    mostrarError("direccion", "La dirección es obligatoria (máx. 300 caracteres).");
    ok = false;
  } else limpiarError("direccion");

  if (!esRequerido(campos.region)) { mostrarError("region", "Selecciona una región."); ok = false; } else limpiarError("region");
  if (!esRequerido(campos.comuna)) { mostrarError("comuna", "Selecciona una comuna."); ok = false; } else limpiarError("comuna");

  // Contraseña solo en el registro público de la tienda
  const claveInput = document.getElementById("clave");
  if (claveInput) {
    if (!esRequerido(claveInput.value) || !longitudValida(claveInput.value, 4, 10)) {
      mostrarError("clave", "La contraseña debe tener entre 4 y 10 caracteres.");
      ok = false;
    } else limpiarError("clave");
  }

  return ok;
}

function validarProducto() {
  let ok = true;
  const codigo = document.getElementById("codigo").value;
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const precio = document.getElementById("precio").value;
  const stock = document.getElementById("stock").value;
  const stockCritico = document.getElementById("stockCritico").value;
  const categoria = document.getElementById("categoria").value;

  if (!esRequerido(codigo) || !longitudValida(codigo, 3, 999)) {
    mostrarError("codigo", "El código es obligatorio, mínimo 3 caracteres."); ok = false;
  } else limpiarError("codigo");

  if (!esRequerido(nombre) || !longitudValida(nombre, 1, 100)) {
    mostrarError("nombre", "El nombre es obligatorio (máx. 100 caracteres)."); ok = false;
  } else limpiarError("nombre");

  if (esRequerido(descripcion) && !longitudValida(descripcion, 0, 500)) {
    mostrarError("descripcion", "Máximo 500 caracteres."); ok = false;
  } else limpiarError("descripcion");

  if (!esRequerido(precio) || !rangoNumericoValido(precio, 0, null)) {
    mostrarError("precio", "El precio es obligatorio y debe ser 0 o mayor."); ok = false;
  } else limpiarError("precio");

  if (!esRequerido(stock) || !esEnteroValido(stock) || !rangoNumericoValido(stock, 0, null)) {
    mostrarError("stock", "El stock es obligatorio, entero y 0 o mayor."); ok = false;
  } else limpiarError("stock");

  if (esRequerido(stockCritico) && (!esEnteroValido(stockCritico) || !rangoNumericoValido(stockCritico, 0, null))) {
    mostrarError("stockCritico", "Debe ser un entero 0 o mayor."); ok = false;
  } else limpiarError("stockCritico");

  if (!esRequerido(categoria)) {
    mostrarError("categoria", "Selecciona una categoría."); ok = false;
  } else limpiarError("categoria");

  return ok;
}