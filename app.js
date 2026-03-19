// ==========================
// 🔍 BUSCADOR
// ==========================
const buscador = document.getElementById("buscador");
const productos = document.querySelectorAll(".producto");

buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase();

  productos.forEach(producto => {
    const titulo = producto
      .querySelector(".titulo")
      .textContent
      .toLowerCase();

    if (titulo.includes(texto)) {
      producto.style.display = "block";
    } else {
      producto.style.display = "none";
    }
  });
});


// ==========================
// 🛒 CARRITO + LOCALSTORAGE
// ==========================
const botones = document.querySelectorAll(".agregar");
const contador = document.getElementById("contadorCarrito");

// cargar carrito guardado
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// actualizar contador al iniciar
actualizarContador();

botones.forEach(boton => {
  boton.addEventListener("click", (e) => {

    const producto = e.target.closest(".producto");

    const nombre = producto.querySelector(".titulo").textContent;
    const precioTexto = producto.querySelector(".precio").textContent;

const precio = parseFloat(
  precioTexto.replace("S/", "").replace(",", "").trim()
);

    const existente = carrito.find(p => p.nombre === nombre);

    if (existente) {
      existente.cantidad++;
    } else {
      carrito.push({ nombre, precio, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    actualizarContador();
  });
});

function actualizarContador() {
  contador.textContent = carrito.length;
}


// ==========================
// 🧾 MODAL DEL CARRITO
// ==========================
const modal = document.getElementById("modalCarrito");
const icono = document.getElementById("iconoCarrito");
const cerrar = document.getElementById("cerrar");
const lista = document.getElementById("listaCarrito");
const total = document.getElementById("total");
const comprar = document.getElementById("comprar");

// abrir modal
icono.addEventListener("click", () => {
  modal.classList.remove("hidden");
  renderCarrito();
});

// cerrar modal
cerrar.addEventListener("click", () => {
  modal.classList.add("hidden");
});


// ==========================
// 📦 RENDER CARRITO
// ==========================
function renderCarrito() {
  lista.innerHTML = "";

  let suma = 0;

  carrito.forEach((prod, index) => {

    const item = document.createElement("div");
    item.classList.add("flex", "justify-between", "items-center", "mb-3", "border-b", "pb-2");

    item.innerHTML = `
      <div class="flex-1">
        <p class="text-sm">${prod.nombre}</p>
        <p class="text-green-600 font-bold">S/ ${prod.precio}</p>
      </div>

      <div class="flex items-center gap-2">
        <button class="restar bg-gray-200 px-2 rounded">-</button>
        <span>${prod.cantidad}</span>
        <button class="sumar bg-gray-200 px-2 rounded">+</button>
      </div>

      <button class="eliminar text-red-500 ml-2">🗑️</button>
    `;

    // ➖ RESTAR
    item.querySelector(".restar").addEventListener("click", () => {
      if (prod.cantidad > 1) {
        prod.cantidad--;
      } else {
        carrito.splice(index, 1);
      }

      actualizarStorage();
    });

    // ➕ SUMAR
    item.querySelector(".sumar").addEventListener("click", () => {
      prod.cantidad++;
      actualizarStorage();
    });

    // 🗑️ ELIMINAR
    item.querySelector(".eliminar").addEventListener("click", () => {
      carrito.splice(index, 1);
      actualizarStorage();
    });

    lista.appendChild(item);

    suma += prod.precio * prod.cantidad;
  });

  total.textContent = "Total: S/ " + suma.toFixed(2);
}

function actualizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  renderCarrito();
}

// ==========================
// ✅ CONFIRMAR COMPRA
// ==========================
comprar.addEventListener("click", () => {

  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  alert("✅ Compra realizada");

  carrito = [];
  localStorage.removeItem("carrito");

  actualizarContador();
  renderCarrito();
});

function eliminarProducto(index) {
  carrito.splice(index, 1);

  localStorage.setItem("carrito", JSON.stringify(carrito));

  actualizarContador();
  renderCarrito();
}

const vaciar = document.getElementById("vaciar");

vaciar.addEventListener("click", () => {
  carrito = [];

  localStorage.removeItem("carrito");

  actualizarContador();
  renderCarrito();
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

const categorias = document.querySelectorAll(".categoria");

categorias.forEach(cat => {
  cat.addEventListener("click", () => {

    const categoria = cat.dataset.cat;

    filtrarCategoria(categoria);
  });
});

function filtrarCategoria(categoria) {

  if (categoria === "all") {
    renderProductos(productosGlobal);
    return;
  }

  const filtrados = productosGlobal.filter(p =>
    p.category === categoria
  );

  console.log("Filtrados:", filtrados); // 👈 DEBUG

  renderProductos(filtrados);
}

async function obtenerProductos() {
  const res = await fetch("./productos.json");
  const data = await res.json();

  productosGlobal = data;

  renderProductos(data);
}

obtenerProductos();

function renderProductos(productos) {

  const contenedor = document.getElementById("contenedorProductos");

  contenedor.innerHTML = "";

  productos.forEach(prod => {

    const card = document.createElement("div");

    card.classList.add(
      "producto",
      "bg-white",
      "rounded-lg",
      "shadow-sm",
      "hover:shadow-md",
      "transition",
      "p-3",
      "flex",
      "flex-col",
      "justify-between"
    );

    card.innerHTML = `
  <div class="w-full h-40 flex items-center justify-center">
    <img src="${prod.image}" class="max-h-full object-contain">
  </div>

  <h3 class="titulo text-sm mt-2">${prod.title}</h3>

  <p class="precio text-green-600 font-bold">
    S/ ${prod.price}
  </p>

  <button 
    class="verProducto mt-2 bg-blue-500 text-white py-1 rounded"
    data-id="${prod.id}"
  >
    Agregar
  </button>
`;

    contenedor.appendChild(card);
  });

  activarBotones();
}

function activarBotones() {

  const botones = document.querySelectorAll(".verProducto");

  botones.forEach(boton => {
    boton.addEventListener("click", () => {

      const id = boton.dataset.id;

      const producto = productosGlobal.find(p => p.id == id);

      abrirModalProducto(producto);
    });
  });

}

const modalProducto = document.getElementById("modalProducto");
const contenidoModal = document.getElementById("contenidoModalProducto");

function abrirModalProducto(prod) {

  contenidoModal.innerHTML = `
    <img src="${prod.image}" class="w-full h-40 object-contain">

    <h2 class="text-lg font-bold mt-2">
      ${prod.title}
    </h2>

    <p class="text-gray-600 text-sm">
      ${prod.description}
    </p>

    <p class="text-green-600 font-bold text-xl mt-2">
      S/ ${prod.price}
    </p>

    <button 
      id="confirmarAgregar"
      class="w-full mt-3 bg-blue-500 text-white py-2 rounded"
    >
      Añadir al carrito
    </button>
  `;

  modalProducto.classList.remove("hidden");

  // botón agregar al carrito
  document.getElementById("confirmarAgregar")
    .addEventListener("click", () => {

      agregarAlCarritoDesdeModal(prod);

      modalProducto.classList.add("hidden");
    });
}

const cerrarModalProducto = document.getElementById("cerrarModalProducto");

cerrarModalProducto.addEventListener("click", () => {
  modalProducto.classList.add("hidden");
});

// cerrar al hacer click afuera
modalProducto.addEventListener("click", (e) => {
  if (e.target === modalProducto) {
    modalProducto.classList.add("hidden");
  }
});

function agregarAlCarritoDesdeModal(prod) {

  const existente = carrito.find(p => p.nombre === prod.title);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({
      nombre: prod.title,
      precio: prod.price,
      cantidad: 1
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  actualizarContador();
}