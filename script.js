const products = [
  { id: 1, name: "Everyday headphones", category: "Tech", price: 1899, badge: "BESTSELLER", description: "Comfortable sound for daily listening.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80" },
  { id: 2, name: "Sunday coffee mug", category: "Home", price: 449, badge: "LITTLE JOY", description: "A simple mug for slow mornings.", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80" },
  { id: 3, name: "Canvas tote bag", category: "Style", price: 599, badge: "EVERYDAY", description: "A handy bag for all your essentials.", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80" },
  { id: 4, name: "Soft desk lamp", category: "Home", price: 1299, badge: "NEW", description: "Warm light for work and reading.", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80" },
  { id: 5, name: "Daily journal", category: "Stationery", price: 299, badge: "GOOD NOTES", description: "A little space for big thoughts.", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=80" },
  { id: 6, name: "Classic wrist watch", category: "Style", price: 1599, badge: "TIMELESS", description: "A clean look for every day.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80" },
  { id: 7, name: "Ceramic vase", category: "Home", price: 799, badge: "HAND PICKED", description: "A calm detail for your favourite corner.", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=80" },
  { id: 8, name: "Wireless speaker", category: "Tech", price: 1499, badge: "GOOD SOUND", description: "Bring your favourite music along.", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80" },
  { id: 9, name: "Care kit", category: "Wellness", price: 699, badge: "SELF CARE", description: "Small essentials for a fresh start.", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80" },
  { id: 10, name: "Steel water bottle", category: "Wellness", price: 499, badge: "DAILY USE", description: "A reusable bottle for busy days.", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80" },
  { id: 11, name: "Pocket notebook set", category: "Stationery", price: 199, badge: "SET OF 2", description: "Keep small ideas close at hand.", image: "https://images.unsplash.com/photo-1531346878377-a5be20888eab?auto=format&fit=crop&w=700&q=80" },
  { id: 12, name: "Everyday sunglasses", category: "Style", price: 899, badge: "SUN READY", description: "An easy finishing touch.", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80" }
];
function loadSavedData(key, defaultValue) {
  try {
    const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
}
let cart = loadSavedData("morrow_cart_v1", []); let wishlist = loadSavedData("morrow_wishlist_v1", []); let theme = localStorage.getItem("morrow_theme_v1") || "light"; let promo = ""; let category = "All"; let searchText = ""; let showSavedOnly = false; const freeShipping = 999; const promoCodes = { WELCOME10: 10, MORROW15: 15, FREESHIP: 0 };
function findProduct(id) {
  return products.find(product => product.id === Number(id));
}
function money(amount) {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}
function saveData() {
  localStorage.setItem("morrow_cart_v1", JSON.stringify(cart)); localStorage.setItem("morrow_wishlist_v1", JSON.stringify(wishlist));
}
function showMessage(message) {
  const box = document.getElementById("toastRegion"); box.textContent = message; box.className = "toast-region toast"; setTimeout(() => box.className = "toast-region", 2300);
}
function showProducts() {
  let list = products.slice();
  if (showSavedOnly) {
    list = list.filter(product => wishlist.includes(product.id));
  }
  if (category !== "All") {
    list = list.filter(product => product.category === category);
  }
  if (searchText !== "") {
    list = list.filter(product =>
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText)
    );
  }
  const maxPrice = document.getElementById("priceFilter").value;
  if (maxPrice !== "all") {
    list = list.filter(product => product.price <= Number(maxPrice));
  }
  const sort = document.getElementById("sortSelect").value; if (sort === "low") list.sort((a, b) => a.price - b.price); if (sort === "high") list.sort((a, b) => b.price - a.price); if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name)); const grid = document.getElementById("productGrid"); grid.innerHTML = "";
  list.forEach(product => {
    const card = document.createElement("div"); card.className = "product-card"; const saved = wishlist.includes(product.id);
    card.innerHTML = `
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.badge}</span>
        <button class="favorite-button ${saved ? "is-favorite" : ""}" data-favorite="${product.id}" type="button">${saved ? "♥" : "♡"}</button>
        <button class="add-button" data-add="${product.id}" type="button">Add to bag ＋</button>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <div class="product-title-line"><h3 class="product-title">${product.name}</h3><span class="product-price">${money(product.price)}</span></div>
        <p class="product-description">${product.description}</p>
      </div>`;
    const image = card.querySelector("img");
    image.onerror = function () {
      this.src = "https://placehold.co/600x600/f0eee6/344d3f?text=Morrow";
    }; grid.appendChild(card);
  }); document.getElementById("noResults").hidden = list.length !== 0; document.getElementById("productGrid").hidden = list.length === 0; document.getElementById("resultsCount").textContent = "Showing " + list.length + " products"; document.getElementById("showAllProducts").hidden = !showSavedOnly;
  document.querySelectorAll(".category-chip").forEach(button => {
    button.classList.toggle("active", button.dataset.category === category);
  });
}
function changeWishlist(id) {
  id = Number(id);
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id); showMessage("Removed from saved list.");
  } else {
    wishlist.push(id); showMessage("Added to your wishlist.");
  }
  saveData(); showProducts(); updateCounts();
}
function showWishlist() {
  showSavedOnly = true; category = "All"; searchText = ""; document.getElementById("searchInput").value = ""; showProducts(); document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
}
function addToCart(id) {
  id = Number(id); const item = cart.find(row => row.id === id);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ id: id, quantity: 1 });
  }
  saveData(); showCart(); updateCounts(); showMessage("Product added to your bag.");
}
function updateQuantity(id, change) {
  const item = cart.find(row => row.id === Number(id)); if (!item) return; item.quantity += change;
  if (item.quantity <= 0) {
    cart = cart.filter(row => row.id !== Number(id));
  }
  saveData(); showCart(); updateCounts();
}
function removeFromCart(id) {
  cart = cart.filter(row => row.id !== Number(id)); saveData(); showCart(); updateCounts(); showMessage("Product removed.");
}
function cartSubtotal() {
  return cart.reduce((total, item) => {
    const product = findProduct(item.id); return total + (product ? product.price * item.quantity : 0);
  }, 0);
}
function updateCounts() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0); document.getElementById("cartCount").textContent = count; document.getElementById("drawerItemCount").textContent = "(" + count + ")"; document.getElementById("wishlistCount").textContent = wishlist.length;
}
function showCart() {
  const area = document.getElementById("cartItems"); const footer = document.getElementById("cartFooter"); area.innerHTML = "";
  if (cart.length === 0) {
    area.innerHTML = `<div class="cart-empty"><span class="empty-illustration">♡</span><h3>Your bag is empty.</h3><p>Add a product to get started.</p><button class="button button-outline" id="emptyCartShop" type="button">Explore the shop</button></div>`; footer.hidden = true; document.getElementById("emptyCartShop").onclick = closeCart; return;
  }
  footer.hidden = false;
  cart.forEach(item => {
    const product = findProduct(item.id); if (!product) return; const row = document.createElement("div"); row.className = "cart-line";
    row.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="cart-line-info">
        <h3>${product.name}</h3><p>${money(product.price)} each</p>
        <div class="quantity-control">
          <button data-id="${product.id}" data-change="-1" type="button">−</button>
          <span>${item.quantity}</span>
          <button data-id="${product.id}" data-change="1" type="button">+</button>
        </div>
      </div>
      <div class="cart-line-end"><strong class="cart-line-price">${money(product.price * item.quantity)}</strong><button class="remove-item" data-remove="${product.id}" type="button">Remove</button></div>`;
    area.appendChild(row);
  }); let subtotal = cartSubtotal(); let discount = 0; if (promo === "WELCOME10") discount = subtotal * 0.10; if (promo === "MORROW15") discount = subtotal * 0.15; let shipping = subtotal >= freeShipping || promo === "FREESHIP" ? 0 : 60; let total = subtotal - discount + shipping; document.getElementById("cartSubtotal").textContent = money(subtotal); document.getElementById("cartDiscount").textContent = "-" + money(discount); document.getElementById("discountRow").hidden = discount === 0; document.getElementById("cartShipping").textContent = shipping === 0 ? "Free" : money(shipping); document.getElementById("cartTotal").textContent = money(total); document.getElementById("checkoutButton").disabled = false;
  document.getElementById("shippingMessage").textContent =
    subtotal >= freeShipping ? "You have free shipping!" : money(freeShipping - subtotal) + " away from free shipping.";
  document.getElementById("shippingProgress").style.width =
    Math.min(100, subtotal / freeShipping * 100) + "%";
}
function applyPromo(code) {
  code = code.trim().toUpperCase(); const feedback = document.getElementById("promoFeedback");
  if (cart.length === 0) {
    feedback.textContent = "Add a product before using a code."; feedback.classList.add("error");
  } else if (promoCodes[code] === undefined) {
    feedback.textContent = "That code is not valid."; feedback.classList.add("error");
  } else {
    promo = code; feedback.textContent = code === "FREESHIP" ? "Free delivery applied!" : promoCodes[code] + "% discount applied!"; feedback.classList.remove("error"); showMessage("Promo code applied.");
  }
  showCart();
  if (promo) document.getElementById("promoFeedback").textContent =
    promo === "FREESHIP" ? "Free delivery applied!" : promoCodes[promo] + "% discount applied!";
}
function openCart() {
  document.getElementById("cartDrawer").classList.add("is-open"); document.getElementById("screenOverlay").hidden = false; document.body.classList.add("no-scroll");
}
function closeCart() {
  document.getElementById("cartDrawer").classList.remove("is-open"); document.getElementById("screenOverlay").hidden = true; document.body.classList.remove("no-scroll");
}
function openCheckout() {
  document.getElementById("checkoutSummaryItems").innerHTML = "";
  cart.forEach(item => {
    const product = findProduct(item.id); const line = document.createElement("p"); line.className = "summary-item"; line.innerHTML = `<span>${product.name} × ${item.quantity}</span><strong>${money(product.price * item.quantity)}</strong>`; document.getElementById("checkoutSummaryItems").appendChild(line);
  }); document.getElementById("checkoutSummaryTotal").textContent = document.getElementById("cartTotal").textContent; closeCart(); document.getElementById("checkoutModal").classList.add("is-open"); document.getElementById("screenOverlay").hidden = false; document.body.classList.add("no-scroll");
}
function closeCheckout() {
  document.getElementById("checkoutModal").classList.remove("is-open"); document.getElementById("screenOverlay").hidden = true; document.body.classList.remove("no-scroll");
}
function placeOrder(event) {
  event.preventDefault(); const form = document.getElementById("checkoutForm");
  if (!form.checkValidity()) {
    document.getElementById("checkoutError").textContent = "Please fill all fields correctly. PIN must have 6 digits."; form.reportValidity(); return;
  }
  const name = document.getElementById("customerName").value.trim(); const orderNumber = "MRW-" + Date.now().toString().slice(-6); const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0); document.getElementById("orderNumber").textContent = "ORDER #" + orderNumber;
  document.getElementById("confirmationCopy").textContent =
    "Thank you, " + name + "! Your demo order is confirmed.";
  document.getElementById("confirmationDetails").textContent =
    itemCount + " items · " + document.getElementById("cartTotal").textContent;
  cart = []; promo = ""; saveData(); showCart(); updateCounts(); closeCheckout(); document.getElementById("confirmationModal").classList.add("is-open"); document.getElementById("screenOverlay").hidden = false; document.body.classList.add("no-scroll"); document.getElementById("checkoutForm").reset(); showMessage("Demo order placed!");
}
function closeConfirmation() {
  document.getElementById("confirmationModal").classList.remove("is-open"); document.getElementById("screenOverlay").hidden = true; document.body.classList.remove("no-scroll");
}
function changeTheme() {
  theme = theme === "dark" ? "light" : "dark"; document.body.classList.toggle("dark-mode", theme === "dark"); document.querySelector(".theme-icon").textContent = theme === "dark" ? "☀" : "☾"; localStorage.setItem("morrow_theme_v1", theme);
}
document.getElementById("productGrid").addEventListener("click", function (event) {
  const addButton = event.target.closest("[data-add]"); const heartButton = event.target.closest("[data-favorite]"); if (addButton) addToCart(addButton.dataset.add); if (heartButton) changeWishlist(heartButton.dataset.favorite);
});
document.getElementById("cartItems").addEventListener("click", function (event) {
  const quantityButton = event.target.closest("[data-change]"); const removeButton = event.target.closest("[data-remove]"); if (quantityButton) updateQuantity(quantityButton.dataset.id, Number(quantityButton.dataset.change)); if (removeButton) removeFromCart(removeButton.dataset.remove);
});
document.getElementById("categoryFilters").addEventListener("click", function (event) {
  const button = event.target.closest("[data-category]"); if (!button) return; category = button.dataset.category; showSavedOnly = false; showProducts();
});
document.getElementById("searchInput").addEventListener("input", function () {
  searchText = this.value.toLowerCase().trim(); showSavedOnly = false; document.getElementById("clearSearch").hidden = searchText === ""; showProducts();
});
document.getElementById("clearSearch").onclick = function () {
  document.getElementById("searchInput").value = ""; searchText = ""; this.hidden = true; showProducts();
}; document.getElementById("priceFilter").onchange = showProducts; document.getElementById("sortSelect").onchange = showProducts;
document.getElementById("resetFilters").onclick = function () {
  category = "All"; searchText = ""; showSavedOnly = false; document.getElementById("searchInput").value = ""; document.getElementById("priceFilter").value = "all"; document.getElementById("sortSelect").value = "featured"; showProducts();
};
document.getElementById("showAllProducts").onclick = function () {
  showSavedOnly = false; showProducts();
}; document.getElementById("openCart").onclick = openCart; document.getElementById("closeCart").onclick = closeCart; document.getElementById("checkoutButton").onclick = openCheckout; document.getElementById("closeCheckout").onclick = closeCheckout; document.getElementById("closeConfirmation").onclick = closeConfirmation; document.getElementById("continueShopping").onclick = closeConfirmation; document.getElementById("wishlistShortcut").onclick = showWishlist; document.getElementById("themeToggle").onclick = changeTheme;
document.getElementById("promoForm").onsubmit = function (event) {
  event.preventDefault(); applyPromo(document.getElementById("promoInput").value);
}; document.getElementById("checkoutForm").onsubmit = placeOrder;
document.getElementById("newsletterForm").onsubmit = function (event) {
  event.preventDefault(); document.getElementById("newsletterMessage").textContent = "Thanks for joining us! (Demo only.)"; this.reset();
};
document.getElementById("screenOverlay").onclick = function () {
  closeCart(); closeCheckout(); closeConfirmation();
};
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeCart(); closeCheckout(); closeConfirmation();
  }
}); if (!Array.isArray(cart)) cart = []; if (!Array.isArray(wishlist)) wishlist = []; cart = cart.filter(item => findProduct(item.id) && item.quantity > 0); wishlist = wishlist.filter(id => findProduct(id)); document.body.classList.toggle("dark-mode", theme === "dark"); document.querySelector(".theme-icon").textContent = theme === "dark" ? "☀" : "☾"; showProducts(); showCart(); updateCounts();
