import { ref, watch } from 'vue';

export default defineNuxtPlugin(() => {
  // Create a global cart state
  const cart = ref({
    items: [],
    total: 0
  });

  // Load cart from localStorage on client side
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        cart.value = parsedCart;
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
        localStorage.removeItem('cart');
      }
    }

    // Watch for cart changes and save to localStorage
    watch(() => cart.value, (newCart) => {
      localStorage.setItem('cart', JSON.stringify(newCart));
    }, { deep: true });
  }

  const updateTotal = () => {
    cart.value.total = cart.value.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
  };

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.value.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.value.items.push({
        id: product.id,
        name: product.name,
        price: product.price.amount,
        quantity
      });
    }
    
    updateTotal();
  };

  const removeFromCart = (productId) => {
    cart.value.items = cart.value.items.filter(item => item.id !== productId);
    updateTotal();
  };

  const updateQuantity = (productId, quantity) => {
    const item = cart.value.items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      updateTotal();
    }
  };

  const clearCart = () => {
    cart.value.items = [];
    cart.value.total = 0;
  };

  return {
    provide: {
      cart: {
        items: cart,
        total: cart.value.total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }
    }
  };
});
