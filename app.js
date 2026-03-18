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
    const precio = parseFloat(producto.querySelector(".precio").textContent);

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

  renderProductos(filtrados);
}