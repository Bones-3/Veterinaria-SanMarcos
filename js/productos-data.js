/* =========================================================
   productos-data.js
   "Base de datos" temporal de productos (arreglo en JS).
   Se guarda una copia editable en localStorage para que el
   panel administrador pueda añadir/editar/eliminar productos.
   ========================================================= */

const PRODUCTOS_INICIALES = [
  { id: 1, codigo: "ALM-001", nombre: "Alimento seco Adulto 12kg", categoria: "Alimento",     precio: 42990, stock: 18, stockCritico: 4,  descripcion: "Alimento balanceado para perros adultos, todas las razas.", imagen: "/img/bravery_lamb.webp" },
  { id: 2, codigo: "ALM-002", nombre: "Alimento gato Esterilizado 7kg", categoria: "Alimento", precio: 15990, stock: 25, stockCritico: 5,  descripcion: "Fórmula para gatos esterilizados, control de peso.", imagen: "/img/BRAVERY-STERILIZED.webp" },
  { id: 3, codigo: "ACC-001", nombre: "Correa ajustable 4.5m", categoria: "Accesorios",       precio: 8990,  stock: 30, stockCritico: 6,  descripcion: "Correa resistente con mango acolchado.", imagen: "/img/correa_gato.webp" },
  { id: 4, codigo: "ACC-002", nombre: "Cama acolchada M", categoria: "Accesorios",             precio: 21990, stock: 10, stockCritico: 3,  descripcion: "Cama lavable, talla mediana, hasta 15kg.", imagen: "/img/cama_m.webp" },
  { id: 5, codigo: "HIG-001", nombre: "Shampoo antipulgas 400ml", categoria: "Higiene",        precio: 6990,  stock: 22, stockCritico: 5,  descripcion: "Shampoo dermoprotector con acción antipulgas.", imagen: "/img/SHAMPOO-ANTIPULGAS-GATOS.webp" },
  { id: 6, codigo: "HIG-002", nombre: "Arena sanitaria 10L", categoria: "Higiene",             precio: 7490,  stock: 40, stockCritico: 8,  descripcion: "Arena aglomerante de bajo polvo.", imagen: "/img/arena.webp" },
  { id: 7, codigo: "SAL-001", nombre: "Antiparasitario externo (pipeta) Nex Guard", categoria: "Salud",  precio: 9990,  stock: 15, stockCritico: 4,  descripcion: "Protección contra pulgas y garrapatas, 1 aplicación mensual.", imagen: "/img/nexgard.webp" },
  { id: 8, codigo: "JUG-001", nombre: "Pelota interactiva sonora", categoria: "Juguetes",      precio: 5490,  stock: 28, stockCritico: 6,  descripcion: "Juguete resistente a mordidas, sonido incorporado.", imagen:"/img/juegogato.webp" },
];

function obtenerProductos() {
  const guardados = localStorage.getItem("vsm_productos");
  if (!guardados) {
    localStorage.setItem("vsm_productos", JSON.stringify(PRODUCTOS_INICIALES));
    return [...PRODUCTOS_INICIALES];
  }
  return JSON.parse(guardados);
}

function guardarProductos(lista) {
  localStorage.setItem("vsm_productos", JSON.stringify(lista));
}
