//import type { AddToCartInput } from '#gql';
import getCartJson from '../data/getCart.json';
import addToCartJson from '../data/addToCart.json';
import emptyCartJson from '../data/emptyCart.json';
import productsJson from '../data/getProducts.json';
/**
 * @name useCart
 * @description A composable that handles the cart in local storage
 */
export function useCart() {
  const { storeSettings } = useAppConfig();

  // State
  const cart = useState<Cart | null>('cart', () => null);
  const isShowingCart = useState<boolean>('isShowingCart', () => false);
  const isUpdatingCart = useState<boolean>('isUpdatingCart', () => false);
  
  // Initialize cart from localStorage if available
  if (process.client && localStorage.getItem('cart') !== null) {
    cart.value = JSON.parse(localStorage.getItem('cart') as string) as Cart;
  }

  // Watch cart changes to update loading state
  watch(cart, () => {
    isUpdatingCart.value = false;
  });

  // ==================== Helper Functions ====================

  /**
   * Get cart from localStorage or create a new one
   */
  function getCartFromStorage(): any {
    return process.client && localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart') as string)
      : structuredClone(addToCartJson.data.addToCart.cart);
  }

  /**
   * Save cart to localStorage and update reactive state
   */
  function saveCart(cartData: any): void {
    process.client && localStorage.setItem('cart', JSON.stringify(cartData));
    cart.value = cartData;
  }

  /**
   * Remove cart from localStorage and reset state
   */
  function clearCart(): void {
    process.client && localStorage.removeItem('cart');
    cart.value = null;
  }

  /**
   * Handle operation errors consistently
   */
  function handleError(operation: string, error: any): void {
    console.error(`Error during ${operation}:`, error);
  }

  /**
   * Recalculate cart totals based on items
   */
  function recalculateCartTotals(cartData: any): void {
    if (!cartData?.contents?.nodes) return;

    // Calculate subtotal from items
    let subtotalValue = 0;

    for (const item of cartData.contents.nodes) {
      const price = parseFloat(item.product?.node?.rawRegularPrice || "0");
      subtotalValue += price * item.quantity;
    }

    // Update cart values
    cartData.subtotal = `€${subtotalValue.toFixed(2)}`;
    cartData.rawTotal = subtotalValue.toFixed(2);
    cartData.total = `€${subtotalValue.toFixed(2)}`;
  }

  /**
   * Check if cart is empty and update isEmpty flag
   */
  function updateEmptyState(cartData: any): void {
    if (!cartData?.contents?.nodes) return;
    cartData.isEmpty = cartData.contents.nodes.length === 0;
  }

  // ==================== Main Cart Functions ====================

  /**
   * Update the cart with new data
   */
  function updateCart(payload?: Cart | null): void {
    cart.value = payload || null;

    if (cart.value) {
      saveCart(cart.value);
    } else {
      clearCart();
    }
  }

  /**
   * Reset cart to initial state
   */
  function resetInitialState(): void {
    clearCart();
  }

  /**
   * Refresh cart from server data
   */
  async function refreshCart(): Promise<boolean> {
    try {
      const { cart: serverCart } = getCartJson.data;

      if (serverCart) {
        updateCart(serverCart);
      }

      return true;
    } catch (error: any) {
      handleError('refreshCart', error);
      resetInitialState();
      return false;
    }
  }

  /**
   * Toggle cart visibility
   */
  function toggleCart(state: boolean | undefined = undefined): void {
    isShowingCart.value = state ?? !isShowingCart.value;
  }

  /**
   * Add an item to the cart
   */
  async function addToCart(input: any): Promise<void> {
    isUpdatingCart.value = true;

    try {
      // Get product data
      const product = productsJson.data.value.products.nodes.find(
        (p) => p.id === input.productId
      );

      if (!product) {
        console.error('Product not found:', input.productId);
        return;
      }

      // Get or initialize cart
      const currentCart = getCartFromStorage();
      const quantity = input.quantity || 1;

      // Find existing item
      const existingItemIndex = currentCart.contents.nodes.findIndex(
        (node: any) => node.product?.node?.databaseId === input.productId
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        const existingItem = currentCart.contents.nodes[existingItemIndex];
        existingItem.quantity += quantity;
        currentCart.contents.itemCount += quantity;
      } else {
        // Add new item
        const newItem = {
          quantity,
          key: `item_${Date.now()}`,
          product: { node: product },
          variation: null,
        };

        currentCart.contents.nodes.push(newItem);
        currentCart.contents.itemCount += quantity;
        currentCart.contents.productCount += 1;
      }

      // Update cart state
      updateEmptyState(currentCart);
      recalculateCartTotals(currentCart);
      saveCart(currentCart);

      // Auto open cart if enabled
      if (storeSettings.autoOpenCart && !isShowingCart.value) {
        toggleCart(true);
      }
    } catch (error: any) {
      handleError('addToCart', error);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  /**
   * Update item quantity in cart
   */
  async function updateItemQuantity(key: string, quantity: number): Promise<void> {
    isUpdatingCart.value = true;

    try {
      const currentCart = getCartFromStorage();
      if (!currentCart) return;

      const itemIndex = currentCart.contents.nodes.findIndex(
        (node: any) => node.key === key
      );

      if (itemIndex === -1) return;

      const item = currentCart.contents.nodes[itemIndex];
      const oldQuantity = item.quantity;

      if (quantity <= 0) {
        // Remove item
        currentCart.contents.nodes.splice(itemIndex, 1);
        currentCart.contents.itemCount -= oldQuantity;
        currentCart.contents.productCount -= 1;
      } else {
        // Update quantity
        item.quantity = quantity;
        currentCart.contents.itemCount = currentCart.contents.itemCount - oldQuantity + quantity;
      }

      // Update cart state
      updateEmptyState(currentCart);
      recalculateCartTotals(currentCart);
      saveCart(currentCart);
    } catch (error: any) {
      handleError('updateItemQuantity', error);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  /**
   * Remove an item from cart
   */
  async function removeItem(key: string): Promise<void> {
    // Reuse updateItemQuantity with quantity 0 to remove item
    return updateItemQuantity(key, 0);
  }

  /**
   * Empty the cart
   */
  async function emptyCart(): Promise<void> {
    isUpdatingCart.value = true;

    try {
      const { emptyCart: emptyCartData } = emptyCartJson.data;
      clearCart();

      if (emptyCartData?.cart) {
        updateCart(emptyCartData.cart);
      }
    } catch (error: any) {
      handleError('emptyCart', error);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  // Return public API
  return {
    // State
    cart,
    isShowingCart,
    isUpdatingCart,

    // Methods
    updateCart,
    refreshCart,
    toggleCart,
    addToCart,
    updateItemQuantity,
    removeItem,
    emptyCart,
  };
}
