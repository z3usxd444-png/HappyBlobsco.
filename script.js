// Happy Blobs Co. — cart + products (no backend; perfect for GitHub Pages)
const PRICE_EACH = 8.99;
const BUNDLES = [
  { n: 5, price: 38.99 },
  { n: 3, price: 22.99 },
  { n: 2, price: 15.99 },
  { n: 1, price: 8.99 },
];

const products = [
  // Seasonal / themed
  { id: "festive-tree", name: "Festive — Christmas Tree", scent: "Pine + sugar", texture: "Thick & Glossy", color: "Evergreen", tags: ["seasonal"], swatch: "linear-gradient(135deg, #57e7c5, #ffd34d)" },
  { id: "festive-present", name: "Festive — Wrapped Present", scent: "Vanilla", texture: "Butter", color: "Pastel mix", tags: ["seasonal", "dessert"], swatch: "linear-gradient(135deg, #b7a5ff, #ff6fae)" },
  { id: "haunted-house", name: "Haunted House", scent: "Spooky berries", texture: "Jelly Cube", color: "Midnight", tags: ["seasonal"], swatch: "linear-gradient(135deg, #2c2c5a, #35b6ff)" },
  { id: "love", name: "Love", scent: "Cherry blossom", texture: "Fluffy", color: "Pink", tags: ["cozy"], swatch: "linear-gradient(135deg, #ff6fae, #ffb27d)" },

  // Cozy / cute
  { id: "pillow-fort", name: "Pillow Fort", scent: "Lavender", texture: "Cloud", color: "Lavender", tags: ["cozy"], swatch: "linear-gradient(135deg, #b7a5ff, #ffffff)" },
  { id: "baby-blanket", name: "Baby Blanket", scent: "Vanilla", texture: "Icee", color: "Baby blue", tags: ["cozy"], swatch: "linear-gradient(135deg, #35b6ff, #ffffff)" },
  { id: "warm-socks", name: "Warm Socks", scent: "Cinnamon", texture: "Butter", color: "Cream", tags: ["cozy", "dessert"], swatch: "linear-gradient(135deg, #ffd34d, #ffffff)" },
  { id: "moon-milk", name: "Moon Milk", scent: "Vanilla + lavender", texture: "Thick & Glossy", color: "Milky", tags: ["cozy"], swatch: "linear-gradient(135deg, #ffffff, #b7a5ff)" },
  { id: "star-puddle", name: "Star Puddle", scent: "Sugar cookie", texture: "Clear", color: "Sparkly", tags: ["cozy", "dessert"], swatch: "linear-gradient(135deg, rgba(255,211,77,.9), rgba(53,182,255,.55))" },

  // Fruity + desserts
  { id: "strawberry-milk", name: "Strawberry Milk", scent: "Strawberry", texture: "Thick & Glossy", color: "Pink", tags: ["fruit", "dessert"], swatch: "linear-gradient(135deg, #ff6fae, #ffd1e5)" },
  { id: "peach-yogurt", name: "Peach Yogurt", scent: "Peach", texture: "Butter", color: "Peach", tags: ["fruit", "dessert"], swatch: "linear-gradient(135deg, #ffb27d, #fff0e5)" },
  { id: "blueberry-jam", name: "Blueberry Jam", scent: "Blueberry", texture: "Jelly Cube", color: "Blue", tags: ["fruit"], swatch: "linear-gradient(135deg, #35b6ff, #b7a5ff)" },
  { id: "honey-toast", name: "Honey Toast", scent: "Honey", texture: "Butter", color: "Golden", tags: ["dessert"], swatch: "linear-gradient(135deg, #ffd34d, #ffb27d)" },
  { id: "banana-milk", name: "Banana Milk", scent: "Banana", texture: "Icee", color: "Pale yellow", tags: ["fruit", "dessert"], swatch: "linear-gradient(135deg, #ffd34d, #fff7c7)" },
  { id: "matcha-latte", name: "Matcha Latte", scent: "Matcha", texture: "Thick & Glossy", color: "Green", tags: ["dessert"], swatch: "linear-gradient(135deg, #57e7c5, #d6fff3)" },
  { id: "marshmallow-cream", name: "Marshmallow Cream", scent: "Marshmallow", texture: "Fluffy", color: "White", tags: ["dessert", "cozy"], swatch: "linear-gradient(135deg, #ffffff, #ffd1e5)" },
  { id: "lemon-sugar-cookie", name: "Lemon Sugar Cookie", scent: "Lemon", texture: "Butter", color: "Lemon", tags: ["dessert"], swatch: "linear-gradient(135deg, #ffd34d, #ff6fae)" },
];

const els = {
  grid: document.getElementById("productGrid"),
  cartCount: document.getElementById("cartCount"),
  openCart: document.getElementById("openCart"),
  closeCart: document.getElementById("closeCart"),
  drawer: document.getElementById("cartDrawer"),
  overlay: document.getElementById("overlay"),
  cartItems: document.getElementById("cartItems"),
  summaryItems: document.getElementById("summaryItems"),
  summaryBundles: document.getElementById("summaryBundles"),
  summarySavings: document.getElementById("summarySavings"),
  summaryTotal: document.getElementById("summaryTotal"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  clearCartBtn: document.getElementById("clearCartBtn"),
  toast: document.getElementById("toast"),
  year: document.getElementById("year"),
};

els.year.textContent = new Date().getFullYear();

function money(x){ return `$${x.toFixed(2)}`; }

function loadCart(){
  try{ return JSON.parse(localStorage.getItem("hbc_cart") || "[]"); }
  catch{ return []; }
}

function saveCart(cart){
  localStorage.setItem("hbc_cart", JSON.stringify(cart));
}

let cart = loadCart();

function cartQty(){
  return cart.reduce((sum, it) => sum + it.qty, 0);
}

function showToast(msg){
  els.toast.textContent = msg;
  els.toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { els.toast.hidden = true; }, 1400);
}

function renderProducts(filter="all"){
  els.grid.innerHTML = "";
  const list = filter === "all" ? products : products.filter(p => p.tags.includes(filter));

  if(list.length === 0){
    els.grid.innerHTML = `<div class="muted">No slimes found for this filter.</div>`;
    return;
  }

  for(const p of list){
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card__top">
        <div>
          <div class="card__name">${escapeHtml(p.name)}</div>
          <div class="card__meta">
            <span>Texture: ${escapeHtml(p.texture)}</span>
            <span>Scent: ${escapeHtml(p.scent)}</span>
          </div>
        </div>
        <div class="tag">${p.tags.includes("seasonal") ? "Seasonal" : (p.tags.includes("fruit") ? "Fruity" : (p.tags.includes("dessert") ? "Dessert" : "Cozy"))}</div>
      </div>

      <div class="swatch" style="background:${p.swatch}"></div>

      <div class="card__actions">
        <div class="price">${money(PRICE_EACH)}</div>
        <button class="btn primary" data-add="${p.id}">Add to cart</button>
      </div>
    `;
    els.grid.appendChild(card);
  }

  els.grid.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.add));
  });
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  })[c]);
}

function addToCart(productId, qty=1, customLabel=null){
  const key = customLabel ? `custom:${customLabel}` : productId;
  const existing = cart.find(it => it.key === key);
  if(existing){
    existing.qty += qty;
  }else{
    const p = products.find(x => x.id === productId);
    cart.push({
      key,
      id: productId,
      name: customLabel ? customLabel : p?.name || "Item",
      meta: customLabel ? "Custom slime" : `${p.texture} • ${p.scent}`,
      unit: PRICE_EACH,
      qty
    });
  }
  saveCart(cart);
  updateCartUI();
  showToast("Added to cart ✨");
}

function removeKey(key){
  cart = cart.filter(it => it.key !== key);
  saveCart(cart);
  updateCartUI();
}

function changeQty(key, delta){
  const it = cart.find(x => x.key === key);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0){
    removeKey(key);
    return;
  }
  saveCart(cart);
  updateCartUI();
}

function computeBestBundleTotal(totalQty){
  // Greedy using descending bundle sizes (works here because prices are sensible and small set)
  let remaining = totalQty;
  let total = 0;
  const used = [];

  for(const b of BUNDLES){
    if(remaining <= 0) break;
    const k = Math.floor(remaining / b.n);
    if(k > 0){
      total += k * b.price;
      remaining -= k * b.n;
      used.push({ n: b.n, k, price: b.price });
    }
  }

  return { total, used };
}

function updateCartUI(){
  const qty = cartQty();
  els.cartCount.textContent = qty;

  if(qty === 0){
    els.cartItems.innerHTML = `<p class="muted">Your cart is empty. Add some happy blobs! 🫧</p>`;
  }else{
    els.cartItems.innerHTML = "";
    for(const it of cart){
      const row = document.createElement("div");
      row.className = "cartItem";
      row.innerHTML = `
        <div>
          <div class="cartItem__name">${escapeHtml(it.name)}</div>
          <div class="cartItem__meta">${escapeHtml(it.meta)}</div>
          <div class="cartItem__meta">Unit: ${money(it.unit)}</div>
        </div>

        <div class="qty">
          <button aria-label="Decrease quantity" data-dec="${escapeHtml(it.key)}">−</button>
          <span aria-label="Quantity">${it.qty}</span>
          <button aria-label="Increase quantity" data-inc="${escapeHtml(it.key)}">+</button>
          <button class="iconBtn" aria-label="Remove item" data-rm="${escapeHtml(it.key)}">Remove</button>
        </div>
      `;
      els.cartItems.appendChild(row);
    }

    els.cartItems.querySelectorAll("[data-dec]").forEach(b => b.addEventListener("click", () => changeQty(b.dataset.dec, -1)));
    els.cartItems.querySelectorAll("[data-inc]").forEach(b => b.addEventListener("click", () => changeQty(b.dataset.inc, +1)));
    els.cartItems.querySelectorAll("[data-rm]").forEach(b => b.addEventListener("click", () => removeKey(b.dataset.rm)));
  }

  els.summaryItems.textContent = String(qty);

  const regularTotal = qty * PRICE_EACH;
  const bundle = computeBestBundleTotal(qty);

  const savings = Math.max(0, regularTotal - bundle.total);

  if(qty === 0){
    els.summaryBundles.textContent = "—";
    els.summarySavings.textContent = money(0);
    els.summaryTotal.textContent = money(0);
  }else{
    els.summaryBundles.textContent = bundle.used.map(u => `${u.k}×${u.n}`).join(" + ");
    els.summarySavings.textContent = money(savings);
    els.summaryTotal.textContent = money(bundle.total);
  }
}

function openCart(){
  els.drawer.hidden = false;
  els.overlay.hidden = false;
  document.body.style.overflow = "hidden";
  els.closeCart.focus();
}
function closeCart(){
  els.drawer.hidden = true;
  els.overlay.hidden = true;
  document.body.style.overflow = "";
  els.openCart.focus();
}

els.openCart.addEventListener("click", openCart);
els.closeCart.addEventListener("click", closeCart);
els.overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && !els.drawer.hidden) closeCart();
});

els.clearCartBtn.addEventListener("click", () => {
  cart = [];
  saveCart(cart);
  updateCartUI();
  showToast("Cart cleared");
});

els.checkoutBtn.addEventListener("click", () => {
  const qty = cartQty();
  if(qty === 0){
    showToast("Your cart is empty");
    return;
  }

  const bundle = computeBestBundleTotal(qty);
  const items = cart.map(it => `${it.qty}× ${it.name}`).join("\n");
  alert(
`Happy Blobs Co. — Demo Checkout

Items:
${items}

Bundle total: ${money(bundle.total)}

(This is a demo — no payment is collected.)`
  );
});

document.getElementById("customForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const texture = document.getElementById("customTexture").value;
  const scent = document.getElementById("customScent").value;
  const color = document.getElementById("customColor").value;
  const notes = document.getElementById("customNotes").value.trim();

  const label = `Custom Slime — ${texture}, ${scent}, ${color}${notes ? ` (${notes})` : ""}`;
  addToCart("custom", 1, label);
  e.target.reset();
});

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("is-on"));
    chip.classList.add("is-on");
    renderProducts(chip.dataset.filter);
  });
});

renderProducts("all");
updateCartUI();
