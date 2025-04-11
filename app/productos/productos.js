
const urlBase = "http://localhost:3000";

const contenedorProductos = document.getElementById("contenedor-productos");
const inputBusqueda = document.getElementById("input-busqueda");
const selectCategoria = document.getElementById("select-categoria");
const contenedorCategorias = document.getElementById("contenedor-categorias");

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

async function cargarCategorias() {
    try {
        const respuesta = await fetch(`${urlBase}/categorias`);
        categorias = await respuesta.json();
        console.log("Categorías cargadas:", categorias);

        // Llenar select (si existe)
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
                col.classList.add("col-6", "col-md-4", "col-lg-2");

                const card = document.createElement("div");
                card.classList.add("card", "h-100", "shadow-sm", "border-0", "categoria-card");
                card.dataset.categoriaId = categoria.id;

                card.innerHTML = `
                    <img src="${categoria.imagen}" class="card-img-top" alt="${categoria.nombre}" style="object-fit: cover; height: 100px;">
                    <div class="card-body p-2 text-center">
                        <h6 class="card-title mb-0">${categoria.nombre}</h6>
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

    // Mostrar mensaje en pantalla
    const mensajeError = document.getElementById("mensajeErrorCategorias");
    if (mensajeError) {
        mensajeError.textContent = "⚠️ No se pudieron cargar las categorías. Por favor, verifica tu conexión o intenta más tarde.";
    }
    }
}

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
        div.classList.add("col-md-4", "mb-4");

        div.innerHTML = `
            <div class="card card-producto h-100 shadow-sm">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h3>${producto.nombre}</h3>
                    <p>Código: ${producto.codigo}</p>
                    <p>Stock: ${producto.stock}</p>
                    <p class="precio">Precio: S/ ${producto.precio.toFixed(2)}</p>
                </div>
            </div>
        `;

        contenedorProductos.appendChild(div);
    });
}

function filtrarPorCategoriaId(idCategoria) {
    const filtrados = productos.filter(p => p.categoriaId == idCategoria);
    mostrarProductos(filtrados);
}


