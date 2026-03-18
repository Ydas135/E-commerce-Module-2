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
    const precio = producto.querySelector(".precio").textContent;

    const nuevoProducto = {
      nombre,
      precio: parseFloat(precio)
    };

    carrito.push(nuevoProducto);

    // guardar en localStorage
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
    item.classList.add("flex", "justify-between", "mb-2");

    item.innerHTML = `
      <span>${prod.nombre}</span>
      <span>S/ ${prod.precio}</span>
    `;

    lista.appendChild(item);

    suma += prod.precio;
  });

  total.textContent = "Total: S/ " + suma.toFixed(2);
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