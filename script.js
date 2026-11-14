// =========================================================================
// 1. CONFIGURACIÓN PRINCIPAL DE SILVER STYLE
// =========================================================================
const TELEFONO_WHATSAPP = "59177954453"; // Teléfono oficial: 77954453

// INSTRUCCIÓN PARA TU IMAGEN QR EN VISUAL STUDIO CODE:
// Si guardas tu imagen QR dentro de esta carpeta con el nombre "qr.png",
// simplemente reemplaza el valor de abajo por: const CODIGO_IMAGEN_QR = "qr.png";
const CODIGO_IMAGEN_QR = "data:image/svg+xml;utf8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="210" height="210">
        <rect width="200" height="200" fill="#ffffff"/>
        <rect x="15" y="15" width="50" height="50" fill="none" stroke="#111" stroke-width="8"/>
        <rect x="28" y="28" width="24" height="24" fill="#111"/>
        <rect x="135" y="15" width="50" height="50" fill="none" stroke="#111" stroke-width="8"/>
        <rect x="148" y="28" width="24" height="24" fill="#111"/>
        <rect x="15" y="135" width="50" height="50" fill="none" stroke="#111" stroke-width="8"/>
        <rect x="28" y="148" width="24" height="24" fill="#111"/>
        <rect x="80" y="20" width="12" height="12" fill="#111"/>
        <rect x="105" y="35" width="12" height="25" fill="#111"/>
        <rect x="80" y="75" width="40" height="40" rx="6" fill="#111"/>
        <text x="100" y="99" font-family="Arial" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">SILVER</text>
        <rect x="20" y="85" width="25" height="12" fill="#111"/>
        <rect x="140" y="85" width="35" height="12" fill="#111"/>
        <rect x="80" y="135" width="15" height="45" fill="#111"/>
        <rect x="110" y="145" width="30" height="15" fill="#111"/>
        <rect x="155" y="135" width="25" height="45" fill="#111"/>
    </svg>
`);

// =========================================================================
// 2. CATÁLOGO DE PRODUCTOS
// =========================================================================
const productos = [
    {
        id: 1,
        nombre: "Polera Blanca Clásica",
        categoria: "poleras",
        precio: 85.00,
        descripcion: "Algodón 100% peinado, corte cómodo y acabado minimalista.",
        imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
        fallback: "https://placehold.co/600x600/ffffff/111111?text=Polera+Blanca"
    },
    {
        id: 2,
        nombre: "Polera Negra Esencial",
        categoria: "poleras",
        precio: 85.00,
        descripcion: "Algodón suave de alta resistencia en tono negro profundo.",
        imagen: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80",
        fallback: "https://placehold.co/600x600/111111/ffffff?text=Polera+Negra"
    },
    {
        id: 3,
        nombre: "Pantalón Jean Urbano",
        categoria: "pantalones",
        precio: 180.00,
        descripcion: "Denim azul clásico resistente con calce moderno para uso diario.",
        imagen: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
        fallback: "https://placehold.co/600x600/2b547e/ffffff?text=Pantalon+Jean"
    },
    {
        id: 4,
        nombre: "Pantalón Negro Baggy",
        categoria: "pantalones",
        precio: 210.00,
        descripcion: "Corte holgado (Baggy Fit) color negro, máximo confort y estilo urbano.",
        imagen: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80",
        fallback: "https://placehold.co/600x600/141416/ffffff?text=Negro+Baggy"
    }
];

let carrito = [];

function inicializarTienda() {
    renderizarProductos("todos");
    const imgQr = document.getElementById("QR.jpeg");
    if (imgQr) {
        imgQr.src = CODIGO_IMAGEN_QR;
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarTienda);
} else {
    inicializarTienda();
}

// =========================================================================
// 3. RENDERIZADO Y FILTROS DEL CATÁLOGO
// =========================================================================
function renderizarProductos(filtro) {
    const contenedor = document.getElementById("lista-productos");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    const filtrados = filtro === "todos"
        ? productos
        : productos.filter(p => p.categoria === filtro);

    filtrados.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card-producto";
        card.innerHTML = `
            <div class="imagen-wrapper">
                <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.onerror=null;this.src='${prod.fallback}';">
            </div>
            <div class="info-producto">
                <div>
                    <h3>${prod.nombre}</h3>
                    <p>${prod.descripcion}</p>
                </div>
                <div>
                    <div class="precio-talla">
                        <span class="precio">Bs. ${prod.precio.toFixed(2)}</span>
                        <select id="talla-${prod.id}" class="select-talla">
                            <option value="S">Talla S</option>
                            <option value="M" selected>Talla M</option>
                            <option value="L">Talla L</option>
                            <option value="XL">Talla XL</option>
                        </select>
                    </div>
                    <button type="button" class="btn-agregar" onclick="agregarAlCarrito(${prod.id})">
                        <i class="fas fa-cart-plus"></i> Agregar al carrito
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

function filtrarProductos(categoria, boton) {
    document.querySelectorAll(".filtro-btn").forEach(btn => btn.classList.remove("activo"));
    if (boton) boton.classList.add("activo");
    renderizarProductos(categoria);
}

// =========================================================================
// 4. LÓGICA DEL CARRITO DE COMPRAS
// =========================================================================
let timeoutToast;
function mostrarAviso(texto) {
    const toast = document.getElementById("toast-aviso");
    if (!toast) return;

    toast.textContent = texto;
    toast.style.display = "block";
    clearTimeout(timeoutToast);
    timeoutToast = setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}

function toggleCarrito() {
    const panel = document.getElementById("panel-carrito");
    const overlay = document.getElementById("overlay-carrito");
    if (!panel || !overlay) return;

    panel.classList.toggle("abierto");
    overlay.style.display = panel.classList.contains("abierto") ? "block" : "none";
}

function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (!producto) return;

    const selectTalla = document.getElementById(`talla-${idProducto}`);
    const talla = selectTalla ? selectTalla.value : "M";

    const existente = carrito.find(item => item.id === idProducto && item.talla === talla);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            talla: talla,
            cantidad: 1
        });
    }

    actualizarCarritoUI();
    mostrarAviso(`✓ ${producto.nombre} (Talla ${talla}) añadido. Abre el Carrito al terminar.`);
}

function cambiarCantidad(index, cambio) {
    if (!carrito[index]) return;

    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const contenedorItems = document.getElementById("items-carrito");
    const contador = document.getElementById("contador-carrito");
    const totalElemento = document.getElementById("total-carrito");
    if (!contenedorItems || !contador || !totalElemento) return;

    contenedorItems.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    if (carrito.length === 0) {
        contenedorItems.innerHTML = `<p class="carrito-vacio">Aún no has seleccionado prendas.</p>`;
    } else {
        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            totalItems += item.cantidad;

            const div = document.createElement("div");
            div.className = "item-carrito";
            div.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}" onerror="this.onerror=null;this.src='${item.fallback}';">
                <div class="item-info">
                    <h4>${item.nombre}</h4>
                    <small>Talla: <strong>${item.talla}</strong> | Unit: Bs. ${item.precio.toFixed(2)}</small>
                    <span class="item-subtotal">Subtotal: Bs. ${subtotal.toFixed(2)}</span>
                </div>
                <div class="controles-cantidad">
                    <button type="button" class="btn-cant" onclick="cambiarCantidad(${index}, -1)">-</button>
                    <span><strong>${item.cantidad}</strong></span>
                    <button type="button" class="btn-cant" onclick="cambiarCantidad(${index}, 1)">+</button>
                </div>
            `;
            contenedorItems.appendChild(div);
        });
    }

    contador.textContent = totalItems;
    totalElemento.textContent = `Bs. ${total.toFixed(2)}`;
}

// =========================================================================
// 5. MODAL DE PAGO POR QR Y ENVÍO POR WHATSAPP
// =========================================================================
function abrirModalPago() {
    if (carrito.length === 0) {
        mostrarAviso("Tu carrito está vacío. Agrega productos primero.");
        return;
    }

    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    document.getElementById("monto-modal").textContent = `Bs. ${total.toFixed(2)}`;

    toggleCarrito();
    document.getElementById("modal-pago").style.display = "flex";
}

function cerrarModalPago() {
    document.getElementById("modal-pago").style.display = "none";
}

window.addEventListener("click", function (event) {
    const modal = document.getElementById("modal-pago");
    if (event.target === modal) {
        cerrarModalPago();
    }
});

function enviarPedidoWhatsApp() {
    let mensaje = "Hola *Silver Style*! 👋 Acabo de realizar el pago por QR de mi pedido:\n\n";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `▪️ ${item.cantidad}x ${item.nombre} (Talla ${item.talla}) - Bs. ${subtotal.toFixed(2)}\n`;
    });

    mensaje += `\n*Total Pagado: Bs. ${total.toFixed(2)}*\n`;
    mensaje += "Adjunto mi comprobante de transferencia QR:";

    const url = `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}
