// ===========================
// ENTRE ROTOS — JS
// Tienda Nube API + Carrito
// ===========================

const STORE_ID = '27372763138';
const TN_API = `https://api.tiendanube.com/v1/${STORE_ID}`;

// ===========================
// CARRITO (estado local)
// ===========================

let cart = [];

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartLink = document.querySelector('.nav-cart a');
  if (cartLink) cartLink.textContent = `carrito (${total})`;
}

// ===========================
// TIENDA NUBE — PRODUCTOS
// ===========================

async function loadProducts() {
  try {
    const res = await fetch(`${TN_API}/products?per_page=6`, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'EntreRotos/1.0'
      }
    });

    if (!res.ok) throw new Error('No se pudieron cargar los productos');

    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    // Si falla la API mantenemos los placeholders
    console.log('Usando placeholders hasta conectar la API:', err.message);
  }
}

function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  if (!grid || !products.length) return;

  grid.innerHTML = products.map(product => {
    const name = product.name?.es || product.name || 'Producto';
    const price = product.variants?.[0]?.price || '—';
    const img = product.images?.[0]?.src || null;
    const tag = product.categories?.[0]?.name?.es || '';

    return `
      <div class="product-card">
        <div class="product-img-wrap">
          ${img
            ? `<img src="${img}" alt="${name}" loading="lazy">`
            : `<div class="product-img-placeholder"><span>foto</span></div>`
          }
          ${tag ? `<div class="product-tag">${tag.toLowerCase()}</div>` : ''}
        </div>
        <div class="product-info">
          <h3 class="product-name">${name.toLowerCase()}</h3>
          <p class="product-price">$${Number(price).toLocaleString('es-AR')}</p>
          <button class="btn-add" onclick='addToCart(${JSON.stringify({ id: product.id, name, price })})'>
            agregar al carrito
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ===========================
// MERCADO LIBRE — PRODUCTOS
// (links manuales por ahora)
// ===========================

const mlProducts = [
  // Agregá acá tus links de ML cuando los tengas
  // { name: 'Nombre producto', url: 'https://articulo.mercadolibre.com.ar/...' }
];

function renderMLProducts() {
  const grid = document.getElementById('ml-grid');
  if (!grid || !mlProducts.length) return;

  grid.innerHTML = mlProducts.map(p => `
    <div class="ml-card">
      <div class="product-img-placeholder small"><span>${p.name.toLowerCase()}</span></div>
      <span class="ml-name">${p.name.toLowerCase()}</span>
      <a href="${p.url}" class="ml-link" target="_blank">ver en mercado libre →</a>
    </div>
  `).join('');
}

// ===========================
// SUSCRIPCION — MERCADO PAGO
// ===========================

const MP_PUBLIC_KEY = 'TU_PUBLIC_KEY_ACA';

document.getElementById('btn-suscribirse')?.addEventListener('click', () => {
  // Redirige al checkout de suscripción de Mercado Pago
  // Cuando tengas el preapproval_plan_id de MP, reemplazá esta URL
  alert('¡Próximamente! La suscripción estará disponible muy pronto. 🖤');
});

// ===========================
// INIT
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  renderMLProducts();
});
