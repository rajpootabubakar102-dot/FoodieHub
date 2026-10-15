// ==========================================================================
// FoodHub - Interactive App Logic & Cart Management
// ==========================================================================

const foods = [
  {
    id: 1,
    name: "Classic Beef Burger",
    category: "Burger",
    price: 550,
    rating: "4.9",
    image: "photo-1568901346375-23c9450c58cd",
    description: "Flame-grilled pure beef patty, melted sharp cheddar, crispy lettuce and signature smoky sauce."
  },
  {
    id: 2,
    name: "Artisan Cheese Pizza",
    category: "Pizza",
    price: 1200,
    rating: "4.8",
    image: "photo-1571407970349-bc81e7e96d47",
    description: "Golden wood-fired crust crowned with fresh buffalo mozzarella, aromatic basil and rich tomato puree."
  },
  {
    id: 3,
    name: "Crispy Fried Chicken",
    category: "Chicken",
    price: 650,
    rating: "4.9",
    image: "photo-1626082927389-6cd097cdc6ec",
    description: "Secret blend of 11 herbs & spices, fried to a crunchy golden crust with tender, juicy meat inside."
  },
  {
    id: 4,
    name: "Double Melt Burger",
    category: "Burger",
    price: 750,
    rating: "5.0",
    image: "photo-1571091718767-18b5b1457add",
    description: "Double beef patties, double Swiss & cheddar melt, caramelized onions and spicy garlic aioli."
  },
  {
    id: 5,
    name: "Pepperoni Passion Pizza",
    category: "Pizza",
    price: 1400,
    rating: "4.9",
    image: "photo-1628840042765-356cda07504e",
    description: "Loaded generously with premium crispy beef pepperoni slices and molten mozzarella cheese."
  },
  {
    id: 6,
    name: "Hot Buffalo Chicken Wings",
    category: "Chicken",
    price: 600,
    rating: "4.7",
    image: "photo-1527477396000-e27163b481c2",
    description: "Crispy wings tossed in tangy fiery buffalo glaze, served with cool creamy garlic ranch dip."
  },
  {
    id: 7,
    name: "Fresh Orange Sunshine",
    category: "Drinks",
    price: 250,
    rating: "4.8",
    image: "photo-1600271886742-f049cd451bba",
    description: "100% freshly pressed Valencia oranges, served chilled over ice with zero added sugars."
  },
  {
    id: 8,
    name: "Vanilla Cold Brew Coffee",
    category: "Drinks",
    price: 350,
    rating: "4.9",
    image: "photo-1461023058943-07fcbe16d735",
    description: "Slow-steeped Arabica coffee beans blended with whole milk and natural Madagascar vanilla syrup."
  },
  {
    id: 9,
    name: "Crispy Zinger Chicken Burger",
    category: "Burger",
    price: 520,
    rating: "4.8",
    image: "photo-1606755962773-d324e0a13086",
    description: "Extra-crunchy chicken fillet topped with fresh coleslaw, pickled jalapeños and mayo on a brioche bun."
  }
];

// DOM Elements
const foodGrid = document.getElementById("foodGrid");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCart");
const cartCount = document.getElementById("cartCount");
const cartItemsCountText = document.getElementById("cartItemsCountText");
const cartTotal = document.getElementById("cartTotal");
const cartItems = document.getElementById("cartItems");
const cartMessage = document.getElementById("cartMessage");
const checkoutBtn = document.getElementById("checkoutBtn");

// Checkout Modal Elements
const checkoutOverlay = document.getElementById("checkoutOverlay");
const closeCheckoutBtn = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutDelivery = document.getElementById("checkoutDelivery");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutMessage = document.getElementById("checkoutMessage");
const deliveryBadgeContainer = document.getElementById("deliveryBadgeContainer");

// Success Modal Elements
const orderSuccessModal = document.getElementById("orderSuccessModal");
const orderReceipt = document.getElementById("orderReceipt");
const successDoneBtn = document.getElementById("successDoneBtn");

// State
let cart = [];

// Helper: Build Unsplash Image URL
function imageUrl(photo) {
  return `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=800&q=80`;
}

// Toast Notification
function showToast(message, icon = "🍔") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("removing");
    toast.addEventListener("animationend", () => toast.remove());
  }, 2600);
}

// Render Menu Cards
function renderFoods(category = "All") {
  const filtered = category === "All"
    ? foods
    : foods.filter(food => food.category === category);

  foodGrid.innerHTML = filtered.map(food => `
    <article class="food-card" data-id="${food.id}">
      <div class="food-image-box">
        <img src="${imageUrl(food.image)}"
             alt="${food.name}"
             loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80'">
        <span class="food-category-badge">${food.category}</span>
        <span class="food-rating-badge">★ ${food.rating}</span>
      </div>
      <div class="food-info">
        <h3>${food.name}</h3>
        <p>${food.description}</p>
        <div class="food-bottom">
          <div class="food-price-box">
            <span class="food-price-prefix">Price</span>
            <span class="food-price">Rs. ${food.price}</span>
          </div>
          <button class="add-button" data-add="${food.id}" aria-label="Add ${food.name} to cart">
            <span>+ Add</span>
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// Category Filter Handling
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    renderFoods(button.dataset.category);
  });
});

// Add to Cart via Event Delegation
foodGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const id = Number(button.dataset.add);
  const foodItem = foods.find(food => food.id === id);
  if (!foodItem) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...foodItem, quantity: 1 });
  }

  // Visual button feedback
  const originalText = button.innerHTML;
  button.innerHTML = "<span>✓ Added</span>";
  button.style.background = "var(--primary-gradient)";
  button.style.color = "#ffffff";
  setTimeout(() => {
    button.innerHTML = originalText;
    button.style.background = "";
    button.style.color = "";
  }, 900);

  // Bump Badge
  cartCount.classList.remove("bump");
  void cartCount.offsetWidth; // trigger reflow
  cartCount.classList.add("bump");

  showToast(`${foodItem.name} added to cart!`, "🛒");
  renderCart();
});

// Render Cart Drawer
function renderCart() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalQuantity;
  if (cartItemsCountText) cartItemsCountText.textContent = totalQuantity;
  cartTotal.textContent = subtotal.toLocaleString();

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🍽️</div>
        <h3>Your Cart is Hungry</h3>
        <p>Looks like you haven't added anything yet. Explore our mouthwatering menu!</p>
        <button class="primary-button" id="browseMenuBtn" style="padding: 10px 20px; font-size: 14px;">
          Browse Menu
        </button>
      </div>
    `;

    const browseBtn = document.getElementById("browseMenuBtn");
    if (browseBtn) {
      browseBtn.addEventListener("click", () => {
        closeCart();
        const menuSec = document.getElementById("menu");
        if (menuSec) menuSec.scrollIntoView({ behavior: "smooth" });
      });
    }

    if (cartMessage) cartMessage.textContent = "";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${imageUrl(item.image)}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-title" title="${item.name}">${item.name}</div>
        <div class="cart-item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
      </div>
      <div class="cart-item-controls">
        <div class="qty-pill">
          <button class="qty-btn" data-minus="${item.id}" aria-label="Decrease quantity">−</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" data-plus="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-btn" data-remove="${item.id}" aria-label="Remove item">🗑️</button>
      </div>
    </div>
  `).join("");
}

// Cart Item Actions (Plus, Minus, Remove)
cartItems.addEventListener("click", event => {
  const btn = event.target.closest("button");
  if (!btn) return;

  const id = Number(btn.dataset.minus || btn.dataset.plus || btn.dataset.remove);
  const item = cart.find(food => food.id === id);
  if (!item) return;

  if (btn.dataset.plus) {
    item.quantity++;
  } else if (btn.dataset.minus) {
    item.quantity--;
    if (item.quantity <= 0) {
      cart = cart.filter(food => food.id !== id);
    }
  } else if (btn.dataset.remove) {
    cart = cart.filter(food => food.id !== id);
  }

  renderCart();
});

// Cart Drawer Open & Close
function openCart() {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
  cartOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
  cartOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Checkout Modal Open & Close
function openCheckout() {
  if (cart.length === 0) {
    if (cartMessage) {
      cartMessage.textContent = "Please add items to your cart before proceeding.";
    }
    return;
  }

  closeCart();
  populateCheckoutSummary();
  checkoutOverlay.classList.add("show");
  checkoutOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  
  // Clear previous validation errors
  clearValidationErrors();
}

function closeCheckout() {
  checkoutOverlay.classList.remove("show");
  checkoutOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

checkoutBtn.addEventListener("click", openCheckout);
closeCheckoutBtn.addEventListener("click", closeCheckout);

checkoutOverlay.addEventListener("click", event => {
  if (event.target === checkoutOverlay) {
    closeCheckout();
  }
});

// Keyboard Accessibility
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (checkoutOverlay.classList.contains("show")) closeCheckout();
    if (cartPanel.classList.contains("open")) closeCart();
    if (orderSuccessModal.classList.contains("show")) closeSuccessModal();
  }
});

// Calculate and Populate Checkout Summary
function populateCheckoutSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 2000 ? 0 : 150;
  const grandTotal = subtotal + deliveryFee;

  checkoutItems.innerHTML = cart.map(item => `
    <div class="checkout-item-row">
      <span>${item.name} <strong>× ${item.quantity}</strong></span>
      <span>Rs. ${(item.price * item.quantity).toLocaleString()}</span>
    </div>
  `).join("");

  checkoutSubtotal.textContent = subtotal.toLocaleString();
  
  if (deliveryFee === 0) {
    deliveryBadgeContainer.innerHTML = `<span style="color: #10b981; font-weight: 800;">FREE (Orders > 2000)</span>`;
  } else {
    deliveryBadgeContainer.innerHTML = `Rs. <span id="checkoutDelivery">150</span>`;
  }

  checkoutTotal.textContent = grandTotal.toLocaleString();
}

// Payment Option Selection Styling
document.querySelectorAll(".payment-option").forEach(option => {
  option.addEventListener("click", () => {
    document.querySelectorAll(".payment-option").forEach(o => o.classList.remove("selected"));
    option.classList.add("selected");
  });
});

// Form Validation Helpers
function clearValidationErrors() {
  document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
  document.querySelectorAll(".form-group input, .form-group select, .form-group textarea").forEach(el => {
    el.classList.remove("error");
  });
  if (checkoutMessage) checkoutMessage.textContent = "";
}

// Form Submission & Order Processing
checkoutForm.addEventListener("submit", event => {
  event.preventDefault();
  clearValidationErrors();

  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");
  const cityInput = document.getElementById("customerCity");
  const addressInput = document.getElementById("customerAddress");
  const emailInput = document.getElementById("customerEmail");
  const notesInput = document.getElementById("deliveryNotes");
  const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');

  let isValid = true;

  // Validate Name
  if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
    document.getElementById("nameError").textContent = "Please enter your full name (minimum 3 characters).";
    nameInput.classList.add("error");
    isValid = false;
  }

  // Validate Mobile (Pakistani 11-digit mobile: 03XXXXXXXXX)
  const phoneClean = phoneInput.value.trim().replace(/[-\s]/g, "");
  const pakPhoneRegex = /^03\d{9}$/;
  if (!pakPhoneRegex.test(phoneClean)) {
    document.getElementById("phoneError").textContent = "Enter valid 11-digit mobile starting with 03 (e.g. 03001234567).";
    phoneInput.classList.add("error");
    isValid = false;
  }

  // Validate City
  if (!cityInput.value) {
    document.getElementById("cityError").textContent = "Please select your delivery city.";
    cityInput.classList.add("error");
    isValid = false;
  }

  // Validate Address
  if (!addressInput.value.trim() || addressInput.value.trim().length < 8) {
    document.getElementById("addressError").textContent = "Please provide complete street address with landmarks.";
    addressInput.classList.add("error");
    isValid = false;
  }

  if (!isValid) return;

  // Process Simulated Order
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  const originalBtnHTML = placeOrderBtn.innerHTML;
  placeOrderBtn.disabled = true;
  placeOrderBtn.innerHTML = `<span>Placing Your Order...</span>`;

  setTimeout(() => {
    const orderNumber = `FH-${Math.floor(100000 + Math.random() * 900000)}`;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 2000 ? 0 : 150;
    const grandTotal = subtotal + deliveryFee;
    const payment = paymentMethodInput ? paymentMethodInput.value : "Cash on Delivery";

    // Build Receipt Details
    orderReceipt.innerHTML = `
      <div class="receipt-row">
        <span>Order Number:</span>
        <strong style="color: var(--primary); font-family: var(--font-heading);">${orderNumber}</strong>
      </div>
      <div class="receipt-row">
        <span>Customer:</span>
        <span>${nameInput.value.trim()}</span>
      </div>
      <div class="receipt-row">
        <span>Contact:</span>
        <span>${phoneClean}</span>
      </div>
      <div class="receipt-row">
        <span>Destination:</span>
        <span>${cityInput.value} (${addressInput.value.trim()})</span>
      </div>
      <div class="receipt-row">
        <span>Payment Mode:</span>
        <span>${payment}</span>
      </div>
      <div class="receipt-row">
        <span>Ordered Items:</span>
        <span>${cart.reduce((s, i) => s + i.quantity, 0)} items (${cart.map(i => `${i.name} × ${i.quantity}`).join(", ")})</span>
      </div>
      <div class="receipt-row">
        <span>Estimated Delivery:</span>
        <span style="color: #10b981; font-weight: 700;">⚡ 30 - 40 Mins</span>
      </div>
      <div class="receipt-row">
        <span>Grand Total (COD):</span>
        <span style="color: var(--primary); font-size: 18px; font-weight: 900;">Rs. ${grandTotal.toLocaleString()}</span>
      </div>
    `;

    // Reset button
    placeOrderBtn.disabled = false;
    placeOrderBtn.innerHTML = originalBtnHTML;

    // Close checkout and open success
    closeCheckout();
    orderSuccessModal.classList.add("show");
    orderSuccessModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Clear cart and form
    cart = [];
    renderCart();
    checkoutForm.reset();
  }, 900);
});

// Success Modal Close
function closeSuccessModal() {
  orderSuccessModal.classList.remove("show");
  orderSuccessModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

successDoneBtn.addEventListener("click", () => {
  closeSuccessModal();
  const menuSec = document.getElementById("menu");
  if (menuSec) menuSec.scrollIntoView({ behavior: "smooth" });
});

orderSuccessModal.addEventListener("click", event => {
  if (event.target === orderSuccessModal) {
    closeSuccessModal();
  }
});

// Initial Render
renderFoods();
renderCart();
