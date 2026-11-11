// 1. Product catalogue and internet-hosted product photos.
const products = [
  { id: 1, name: "Everyday headphones", category: "Tech", price: 1899, oldPrice: 2299, badge: "A good pick", description: "Soft cushions, clear sound, and a little quiet when you need it.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=850&q=80" },
  { id: 2, name: "Sunday coffee mug", category: "Home", price: 449, oldPrice: null, badge: "Small joy", description: "A generous ceramic mug for slow mornings and second cups.", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=850&q=80" },
  { id: 3, name: "Classic timepiece", category: "Style", price: 2499, oldPrice: 2899, badge: "Just arrived", description: "A clean, easy-to-wear watch that goes with almost anything.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=850&q=80" },
  { id: 4, name: "Daily carry tote", category: "Style", price: 799, oldPrice: null, badge: "Everyday", description: "Room for the essentials, plus the book you might actually read.", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=850&q=80" },
  { id: 5, name: "Soft glow candle", category: "Home", price: 599, oldPrice: 699, badge: "A little calm", description: "A warm, gentle scent for evenings that need slowing down.", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=850&q=80" },
  { id: 6, name: "Pocket notebook set", category: "Stationery", price: 299, oldPrice: null, badge: "Bestseller", description: "Three handy notebooks for lists, sketches, and passing thoughts.", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=850&q=80" },
  { id: 7, name: "Weekend sneakers", category: "Style", price: 2199, oldPrice: 2599, badge: "Good miles", description: "An easy everyday pair for walks that turn into little adventures.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=850&q=80" },
  { id: 8, name: "Desk-side planter", category: "Home", price: 549, oldPrice: null, badge: "Fresh space", description: "A simple ceramic home for a favourite little green companion.", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=850&q=80" },
  { id: 9, name: "Reusable water bottle", category: "Wellness", price: 699, oldPrice: null, badge: "On the go", description: "A sturdy everyday bottle to keep close at your desk or outdoors.", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=850&q=80" },
  { id: 10, name: "Weekend camera", category: "Tech", price: 3299, oldPrice: 3699, badge: "For memories", description: "A playful compact camera look for capturing ordinary lovely days.", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=850&q=80" },
  { id: 11, name: "Gentle care set", category: "Wellness", price: 999, oldPrice: null, badge: "Feel-good", description: "A simple self-care set for a little reset at the end of the day.", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=850&q=80" },
  { id: 12, name: "Sunny-day shades", category: "Style", price: 1199, oldPrice: 1399, badge: "Sunny side", description: "A timeless pair of sunglasses for bright days outside.", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=850&q=80" }
]; // 2. App settings, saved data, and the current shopping state.
const STORAGE_KEYS = {
  cart: "morrow_cart_v1",
  wishlist: "morrow_wishlist_v1",
  theme: "morrow_theme_v1"
}; const FREE_SHIPPING_AT = 999; const SHIPPING_FEE = 79;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=850&q=80";
   const promoCodes = {
  WELCOME10: { type: "percent", value: 10, message: "10% off your order — welcome to Morrow!" },
  MORROW15: { type: "percent", value: 15, message: "15% off your order. Lovely choice!" },
  FREESHIP: { type: "shipping", value: 0, message: "Delivery is on us!" }
}; const state = {
  cart: loadFromStorage(STORAGE_KEYS.cart, []),
  wishlist: loadFromStorage(STORAGE_KEYS.wishlist, []),
  theme: loadFromStorage(STORAGE_KEYS.theme, "light"),
  category: "All",
  search: "",
  maxPrice: "all",
  sort: "featured",
  showWishlist: false,
  appliedPromo: null,
  lastOrder: null,
  lastFocusedElement: null
}; // 3. Small helpers for storage, prices, totals, and notifications.
function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : fallback; } catch (error) {
    console.warn(`Could not read ${key} from localStorage:`, error); return fallback; }
}
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value)); } catch (error) {
    console.warn(`Could not save ${key} to localStorage:`, error); showToast("Your browser could not save this change. It may not stay after refresh.", "error"); }
}
function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(amount); }
function getProduct(productId) {
  return products.find(product => product.id === Number(productId)); }
function getCartQuantity() {
  return state.cart.reduce((total, item) => total + item.quantity, 0); }
function getSubtotal() {
  return state.cart.reduce((total, item) => {
    const product = getProduct(item.id); return total + (product ? product.price * item.quantity : 0); }, 0); }
function getDiscount(subtotal) {
if (!state.appliedPromo) return 0; const promo = promoCodes[state.appliedPromo];
   if (!promo || promo.type === "shipping") return 0;
   return Math.round(subtotal * (promo.value / 100)); }
function getShipping(subtotal) {
if (subtotal === 0 || subtotal >= FREE_SHIPPING_AT) return 0;
if (state.appliedPromo && promoCodes[state.appliedPromo]?.type === "shipping") return 0;
   return SHIPPING_FEE; }
function getTotal() {
  const subtotal = getSubtotal(); return Math.max(0, subtotal - getDiscount(subtotal) + getShipping(subtotal)); }
function persistShoppingState() {
  saveToStorage(STORAGE_KEYS.cart, state.cart); saveToStorage(STORAGE_KEYS.wishlist, state.wishlist); }
function showToast(message, type = "success") {
  const region = document.getElementById("toastRegion"); const toast = document.createElement("div"); toast.className = `toast ${type === "error" ? "error" : ""}`; toast.textContent = message; region.appendChild(toast); window.setTimeout(() => {
    toast.classList.add("out"); window.setTimeout(() => toast.remove(), 220); }, 2600); }
// 4. Search, filtering, sorting, and product-card rendering.
function getVisibleProducts() {
  let visible = [...products]; if (state.showWishlist) {
    visible = visible.filter(product => state.wishlist.includes(product.id)); }
  if (state.category !== "All") {
    visible = visible.filter(product => product.category === state.category); }
  if (state.search.trim()) {
    const term = state.search.trim().toLowerCase(); visible = visible.filter(product =>
      `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(term)
    ); }
  if (state.maxPrice !== "all") {
    visible = visible.filter(product => product.price <= Number(state.maxPrice)); }
if (state.sort === "low") visible.sort((a, b) => a.price - b.price);
if (state.sort === "high") visible.sort((a, b) => b.price - a.price);
   if (state.sort === "name") visible.sort((a, b) => a.name.localeCompare(b.name)); return visible; }
function renderProducts() {
const grid = document.getElementById("productGrid"); const empty = document.getElementById("noResults");
   const productsToShow = getVisibleProducts(); grid.innerHTML = ""; productsToShow.forEach((product, index) => {
    const isFavorite = state.wishlist.includes(product.id); const card = document.createElement("article"); card.className = "product-card"; card.style.animationDelay = `${Math.min(index * 35, 220)}ms`;
    card.innerHTML = `
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${escapeHTML(product.name)}" loading="lazy">
        <span class="product-badge">${escapeHTML(product.badge)}</span>
        <button class="favorite-button ${isFavorite ? "is-favorite" : ""}" type="button" data-favorite="${product.id}" aria-label="${isFavorite ? "Remove" : "Add"} ${escapeHTML(product.name)} ${isFavorite ? "from" : "to"} wishlist" aria-pressed="${isFavorite}">${isFavorite ? "♥" : "♡"}</button>
        <button class="add-button" type="button" data-add="${product.id}">Add to bag <span aria-hidden="true">＋</span></button>
      </div>
      <div class="product-info">
        <p class="product-category">${escapeHTML(product.category)}</p>
        <div class="product-title-line"><h3 class="product-title">${escapeHTML(product.name)}</h3><span class="product-price">${formatPrice(product.price)}</span></div>
        <p class="product-description">${escapeHTML(product.description)}</p>
      </div>`; const image = card.querySelector("img"); image.addEventListener("error", () => {
      image.src = FALLBACK_IMAGE; image.onerror = () => { image.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Crect width='500' height='500' fill='%23e6e2d6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2372786e' font-family='Arial' font-size='22'%3EMorrow%3C/text%3E%3C/svg%3E"; }; }, { once: true }); grid.appendChild(card); }); empty.hidden = productsToShow.length !== 0; grid.hidden = productsToShow.length === 0; const label = state.showWishlist ? "saved favourites" : "pieces"; document.getElementById("resultsCount").textContent = `Showing ${productsToShow.length} ${label}`; document.getElementById("showAllProducts").hidden = !state.showWishlist; }
function updateCategoryButtons() {
  document.querySelectorAll(".category-chip").forEach(button => {
const active = button.dataset.category === state.category;
button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active));
   }); }
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]); }
// 5. Wishlist and favourites.
function toggleFavorite(productId) {
  const id = Number(productId); if (state.wishlist.includes(id)) {
state.wishlist = state.wishlist.filter(savedId => savedId !== id);
   showToast("Removed from your saved list."); } else {
    state.wishlist.push(id); showToast("Saved for another look. ♥"); }
  saveToStorage(STORAGE_KEYS.wishlist, state.wishlist); renderProducts(); updateHeaderCounts(); }
function showWishlist() {
state.showWishlist = true; state.category = "All"; state.search = "";
state.maxPrice = "all"; document.getElementById("searchInput").value = "";
document.getElementById("priceFilter").value = "all"; updateCategoryButtons();
renderProducts(); document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
   if (state.wishlist.length === 0) showToast("Your saved list is waiting for its first favourite."); }
// 6. Cart actions and live totals.
function addToCart(productId) {
  const product = getProduct(productId); if (!product) return; const existingItem = state.cart.find(item => item.id === product.id); if (existingItem) existingItem.quantity += 1; else state.cart.push({ id: product.id, quantity: 1 }); persistShoppingState(); renderCart(); updateHeaderCounts(); showToast(`${product.name} added to your bag.`); }
function changeQuantity(productId, amount) {
const item = state.cart.find(cartItem => cartItem.id === Number(productId)); if (!item) return; item.quantity += amount;
   if (item.quantity <= 0) {
    state.cart = state.cart.filter(cartItem => cartItem.id !== Number(productId)); }
  persistShoppingState(); renderCart(); updateHeaderCounts(); }
function removeFromCart(productId) {
  const product = getProduct(productId); state.cart = state.cart.filter(item => item.id !== Number(productId)); persistShoppingState(); renderCart(); updateHeaderCounts(); if (product) showToast(`${product.name} removed from your bag.`); }
function updateHeaderCounts() {
  const quantity = getCartQuantity(); document.getElementById("cartCount").textContent = quantity; document.getElementById("drawerItemCount").textContent = `(${quantity})`; document.getElementById("wishlistCount").textContent = state.wishlist.length; document.getElementById("openCart").setAttribute("aria-label", `Open shopping bag, ${quantity} items`); }
function renderCart() {
const container = document.getElementById("cartItems"); const footer = document.getElementById("cartFooter");
   container.innerHTML = ""; if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <span class="empty-illustration" aria-hidden="true">♡</span>
        <h3>Your bag feels light.</h3>
        <p>There are plenty of lovely things waiting to be found. Add a favourite to get started.</p>
        <button class="button button-outline" type="button" id="emptyCartShop">Explore the shop</button>
      </div>`; footer.hidden = true; document.getElementById("emptyCartShop").addEventListener("click", closeCart); } else {
    footer.hidden = false; state.cart.forEach(item => {
const product = getProduct(item.id); if (!product) return; const line = document.createElement("div");
   line.className = "cart-line";
      line.innerHTML = `
        <img src="${product.image}" alt="${escapeHTML(product.name)}">
        <div class="cart-line-info">
          <h3>${escapeHTML(product.name)}</h3>
          <p>${formatPrice(product.price)} each</p>
          <div class="quantity-control" aria-label="Quantity for ${escapeHTML(product.name)}">
            <button type="button" data-quantity="-1" data-id="${product.id}" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-quantity="1" data-id="${product.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cart-line-end"><strong class="cart-line-price">${formatPrice(product.price * item.quantity)}</strong><button class="remove-item" type="button" data-remove="${product.id}">Remove</button></div>`; const cartImage = line.querySelector("img"); cartImage.addEventListener("error", () => { cartImage.src = FALLBACK_IMAGE; }, { once: true }); container.appendChild(line); }); }
  const subtotal = getSubtotal(); const discount = getDiscount(subtotal); const shipping = getShipping(subtotal); const total = subtotal - discount + shipping; document.getElementById("cartSubtotal").textContent = formatPrice(subtotal); document.getElementById("cartDiscount").textContent = `−${formatPrice(discount)}`; document.getElementById("discountRow").hidden = discount === 0; document.getElementById("cartShipping").textContent = shipping === 0 ? "Free" : formatPrice(shipping); document.getElementById("cartTotal").textContent = formatPrice(total); document.getElementById("checkoutButton").disabled = state.cart.length === 0; const remaining = Math.max(0, FREE_SHIPPING_AT - subtotal); document.getElementById("shippingMessage").textContent = subtotal >= FREE_SHIPPING_AT
    ? "Lovely — you've unlocked free shipping!"
    : `You're ${formatPrice(remaining)} away from free shipping.`; document.getElementById("shippingProgress").style.width = `${Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100)}%`; if (state.appliedPromo) {
document.getElementById("promoInput").value = state.appliedPromo;
document.getElementById("promoFeedback").textContent = promoCodes[state.appliedPromo]?.message || "Promo applied.";
   document.getElementById("promoFeedback").classList.remove("error"); } else {
    document.getElementById("promoInput").value = ""; document.getElementById("promoFeedback").textContent = ""; }
  updateHeaderCounts(); }
// 7. Promo code validation and discounts.
function applyPromo(code) {
const normalizedCode = code.trim().toUpperCase(); const feedback = document.getElementById("promoFeedback");
   if (!normalizedCode) {
    feedback.textContent = "Enter a code first."; feedback.classList.add("error"); return; }
  if (getSubtotal() === 0) {
    feedback.textContent = "Add something to your bag before using a code."; feedback.classList.add("error"); return; }
  if (!promoCodes[normalizedCode]) {
state.appliedPromo = null; feedback.textContent = "That code doesn't look right. Try WELCOME10 or FREESHIP.";
feedback.classList.add("error"); renderCart(); feedback.textContent = "That code doesn't look right. Try WELCOME10 or FREESHIP.";
   feedback.classList.add("error"); return; }
  state.appliedPromo = normalizedCode; renderCart(); showToast("Your promo has been applied."); }
// 8. Cart drawer and checkout modal controls.
function openCart() {
state.lastFocusedElement = document.activeElement; const drawer = document.getElementById("cartDrawer");
drawer.inert = false; drawer.setAttribute("aria-hidden", "false");
document.getElementById("screenOverlay").hidden = false;
document.body.classList.add("no-scroll"); requestAnimationFrame(() => drawer.classList.add("is-open"));
   window.setTimeout(() => document.getElementById("closeCart").focus(), 50); }
function closeCart() {
const drawer = document.getElementById("cartDrawer"); drawer.classList.remove("is-open");
   drawer.setAttribute("aria-hidden", "true");
drawer.inert = true; document.getElementById("screenOverlay").hidden = true;
   document.body.classList.remove("no-scroll");
if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === "function") state.lastFocusedElement.focus();
   }
function openCheckout() {
if (state.cart.length === 0) return; closeCart(); renderCheckoutSummary();
const modal = document.getElementById("checkoutModal");
modal.inert = false; modal.setAttribute("aria-hidden", "false");
document.getElementById("screenOverlay").hidden = false;
document.body.classList.add("no-scroll"); requestAnimationFrame(() => modal.classList.add("is-open"));
window.setTimeout(() => document.getElementById("customerName").focus(), 70);
   }
function closeCheckout() {
const modal = document.getElementById("checkoutModal"); modal.classList.remove("is-open");
   modal.setAttribute("aria-hidden", "true");
modal.inert = true; document.getElementById("screenOverlay").hidden = true; document.body.classList.remove("no-scroll");
   document.getElementById("checkoutButton").focus(); }
function openConfirmation() {
const modal = document.getElementById("confirmationModal");
modal.inert = false; modal.setAttribute("aria-hidden", "false");
document.getElementById("screenOverlay").hidden = false;
document.body.classList.add("no-scroll"); requestAnimationFrame(() => modal.classList.add("is-open"));
   window.setTimeout(() => document.getElementById("continueShopping").focus(), 60); }
function closeConfirmation() {
const modal = document.getElementById("confirmationModal");
modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true");
modal.inert = true; document.getElementById("screenOverlay").hidden = true; document.body.classList.remove("no-scroll");
   document.getElementById("shop").scrollIntoView({ behavior: "smooth" }); }
function renderCheckoutSummary() {
const container = document.getElementById("checkoutSummaryItems");
   container.innerHTML = ""; state.cart.forEach(item => {
    const product = getProduct(item.id); if (!product) return; const row = document.createElement("div"); row.className = "summary-item"; row.innerHTML = `<span>${escapeHTML(product.name)} × ${item.quantity}</span><strong>${formatPrice(product.price * item.quantity)}</strong>`; container.appendChild(row); }); const subtotal = getSubtotal(); const discount = getDiscount(subtotal); const shipping = getShipping(subtotal); document.getElementById("checkoutSummaryTotal").textContent = formatPrice(subtotal - discount + shipping); }
// 9. Form validation and simulated order confirmation.
function handleCheckout(event) {
event.preventDefault(); const form = event.currentTarget; const error = document.getElementById("checkoutError");
const fields = [...form.querySelectorAll("input[required]")];
fields.forEach(field => field.classList.toggle("invalid", !field.checkValidity()));
   const invalidField = fields.find(field => !field.checkValidity()); if (invalidField) {
error.textContent = "Please check the highlighted details. A valid email and 6-digit PIN are needed.";
   invalidField.focus(); return; }
  if (state.cart.length === 0) {
    error.textContent = "Your bag is empty. Add an item before checking out."; return; }
  error.textContent = ""; const name = document.getElementById("customerName").value.trim(); const orderId = `MRW-${String(Date.now()).slice(-6)}`; const order = {
    id: orderId,
    name,
    email: document.getElementById("customerEmail").value.trim(),
    items: state.cart.map(item => ({ ...item })),
    total: getTotal(),
    placedAt: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
  }; state.lastOrder = order; document.getElementById("orderNumber").textContent = `ORDER #${orderId}`; document.getElementById("confirmationCopy").textContent = `Thanks, ${name.split(" ")[0]}! Your demo order is confirmed. This is only a local simulation — nothing has been purchased.`; const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0); document.getElementById("confirmationDetails").textContent = `${totalItems} item${totalItems === 1 ? "" : "s"} · ${formatPrice(order.total)} · ${order.placedAt}`; state.cart = []; state.appliedPromo = null; persistShoppingState(); renderCart(); closeCheckout(); openConfirmation(); form.reset(); showToast("Demo order placed. Thank you!"); }
// 10. Dark and light theme.
function applyTheme() {
const dark = state.theme === "dark"; document.body.classList.toggle("dark-mode", dark);
document.querySelector(".theme-icon").textContent = dark ? "☀" : "☾";
document.getElementById("themeToggle").setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
   saveToStorage(STORAGE_KEYS.theme, state.theme); }
// 11. Connect buttons, forms, filters, and keyboard shortcuts.
function setupEventListeners() {
  document.getElementById("productGrid").addEventListener("click", event => {
const addButton = event.target.closest("[data-add]"); const favoriteButton = event.target.closest("[data-favorite]");
if (addButton) addToCart(addButton.dataset.add); if (favoriteButton) toggleFavorite(favoriteButton.dataset.favorite);
   }); document.getElementById("cartItems").addEventListener("click", event => {
const quantityButton = event.target.closest("[data-quantity]");
const removeButton = event.target.closest("[data-remove]");
if (quantityButton) changeQuantity(quantityButton.dataset.id, Number(quantityButton.dataset.quantity));
if (removeButton) removeFromCart(removeButton.dataset.remove);
   }); document.getElementById("categoryFilters").addEventListener("click", event => {
const button = event.target.closest("[data-category]"); if (!button) return; state.category = button.dataset.category;
state.showWishlist = false; updateCategoryButtons(); renderProducts();
   }); document.querySelectorAll("[data-nav-category]").forEach(link => {
    link.addEventListener("click", () => {
state.showWishlist = false; state.category = link.dataset.navCategory; updateCategoryButtons(); renderProducts();
   }); }); document.getElementById("searchInput").addEventListener("input", event => {
state.search = event.target.value; state.showWishlist = false;
document.getElementById("clearSearch").hidden = !state.search;
   renderProducts(); }); document.getElementById("clearSearch").addEventListener("click", () => {
state.search = ""; document.getElementById("searchInput").value = "";
document.getElementById("clearSearch").hidden = true;
renderProducts(); document.getElementById("searchInput").focus();
}); document.getElementById("priceFilter").addEventListener("change", event => { state.maxPrice = event.target.value; renderProducts(); });
document.getElementById("sortSelect").addEventListener("change", event => { state.sort = event.target.value; renderProducts(); });
document.getElementById("resetFilters").addEventListener("click", resetFilters);
document.getElementById("showAllProducts").addEventListener("click", () => { state.showWishlist = false; renderProducts(); });
document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("checkoutButton").addEventListener("click", openCheckout);
document.getElementById("closeCheckout").addEventListener("click", closeCheckout);
document.getElementById("closeConfirmation").addEventListener("click", closeConfirmation);
document.getElementById("continueShopping").addEventListener("click", closeConfirmation);
   document.getElementById("screenOverlay").addEventListener("click", () => {
if (document.getElementById("confirmationModal").classList.contains("is-open")) closeConfirmation();
else if (document.getElementById("checkoutModal").classList.contains("is-open")) closeCheckout();
   else closeCart(); }); document.getElementById("promoForm").addEventListener("submit", event => {
event.preventDefault(); applyPromo(document.getElementById("promoInput").value);
}); document.getElementById("checkoutForm").addEventListener("submit", handleCheckout);
   document.getElementById("checkoutForm").querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
input.classList.toggle("invalid", input.value.length > 0 && !input.checkValidity());
document.getElementById("checkoutError").textContent = "";
}); }); document.getElementById("wishlistShortcut").addEventListener("click", showWishlist);
   document.getElementById("themeToggle").addEventListener("click", () => {
state.theme = state.theme === "dark" ? "light" : "dark";
   applyTheme(); }); document.getElementById("newsletterForm").addEventListener("submit", event => {
event.preventDefault(); const input = document.getElementById("newsletterEmail");
const message = document.getElementById("newsletterMessage");
   if (!input.checkValidity()) {
      message.textContent = "Pop in a valid email address, please."; input.focus(); return; }
message.textContent = "You're on the list — thanks for stopping by! (Demo only.)"; input.value = ""; });
   document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
if (document.getElementById("confirmationModal").classList.contains("is-open")) closeConfirmation();
else if (document.getElementById("checkoutModal").classList.contains("is-open")) closeCheckout();
else if (document.getElementById("cartDrawer").classList.contains("is-open")) closeCart();
   }
  }); }
// 12. Reset filters and start the shop.
function resetFilters() {
state.category = "All"; state.search = ""; state.maxPrice = "all"; state.sort = "featured"; state.showWishlist = false;
document.getElementById("searchInput").value = ""; document.getElementById("priceFilter").value = "all";
document.getElementById("sortSelect").value = "featured"; document.getElementById("clearSearch").hidden = true;
   updateCategoryButtons(); renderProducts(); }
function initializeShop() {
state.cart = Array.isArray(state.cart) ? state.cart.filter(item => getProduct(item.id) && Number.isInteger(item.quantity) && item.quantity > 0) : [];
state.wishlist = Array.isArray(state.wishlist) ? state.wishlist.filter(id => getProduct(id)).map(Number) : [];
state.theme = state.theme === "dark" ? "dark" : "light"; setupEventListeners(); applyTheme(); updateCategoryButtons();
   renderProducts(); renderCart(); updateHeaderCounts(); }
document.addEventListener("DOMContentLoaded", initializeShop);
