
const urlBase = "http://localhost:3000";

const contenedorCategorias = document.getElementById("contenedor-categorias");
const contenedorProductos = document.getElementById("contenedor-productos");
const inputBusqueda = document.getElementById("input-busqueda");
const selectCategoria = document.getElementById("select-categoria");

let productos = [];
let categorias = [];

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await cargarCategorias();
        await cargarProductos();
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error en la carga inicial:", error);
    }
});


// ============================
// 1. CATEGORÍAS
// ============================

async function cargarCategorias() {
    try {
        const respuesta = await fetch(`${urlBase}/categorias`);
        categorias = await respuesta.json();
        console.log("Categorías cargadas:", categorias);

        // Llenar select
        if (selectCategoria) {
            categorias.forEach(categoria => {
                const option = document.createElement("option");
                option.value = categoria.id;
                option.textContent = categoria.nombre;
                selectCategoria.appendChild(option);
            });
        }

        // Mostrar tarjetas visuales
        if (contenedorCategorias) {
            contenedorCategorias.innerHTML = "";
            categorias.forEach(categoria => {
                const col = document.createElement("div");
                col.classList.add("categoria-col");

                const card = document.createElement("div");
                card.classList.add("categoria-card");
                card.dataset.categoriaId = categoria.id;

                card.innerHTML = `
                    <img src="${categoria.imagen}" alt="${categoria.nombre}">
                    <div class="categoria-info">
                        <h6>${categoria.nombre}</h6>
                    </div>
                `;

                card.addEventListener("click", () => {
                    filtrarPorCategoriaId(categoria.id);
                    document.querySelectorAll(".categoria-card").forEach(c => c.classList.remove("active"));
                    card.classList.add("active");
                });

                col.appendChild(card);
                contenedorCategorias.appendChild(col);
            });
        }

    } catch (error) {
        console.error("Error al cargar categorías:", error);
        const mensajeError = document.getElementById("mensajeErrorCategorias");
        if (mensajeError) {
            mensajeError.textContent = "⚠️ No se pudieron cargar las categorías.";
        }
    }
}


// ============================
// 2. FILTRO POR CATEGORÍA
// ============================

function filtrarPorCategoriaId(idCategoria) {
    const filtrados = productos.filter(p => p.categoriaId == idCategoria);
    mostrarProductos(filtrados);
}


// ============================
// 3. PRODUCTOS
// ============================

async function cargarProductos() {
    try {
        const respuesta = await fetch(`${urlBase}/productos`);
        productos = await respuesta.json();
        console.log("Productos cargados:", productos);
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

function mostrarProductos(lista) {
    if (!contenedorProductos) return;

    contenedorProductos.innerHTML = "";

    if (lista.length === 0) {
        contenedorProductos.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    lista.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto-col");

        div.innerHTML = `
            <div class="producto-card">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p class="codigo">Código: ${producto.codigo}</p>
                    <p class="stock">Stock: ${producto.stock}</p>
                    <p class="precio">Precio: S/ ${producto.precio.toFixed(2)}</p>
                </div>
            </div>
        `;

        contenedorProductos.appendChild(div);
    });
}
