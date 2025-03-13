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

  const cart = useState<Cart | null>('cart', () => null);
  const isShowingCart = useState<boolean>('isShowingCart', () => false);
  const isUpdatingCart = useState<boolean>('isUpdatingCart', () => false);
  const { logGQLError, clearAllCookies } = useHelpers();
  /** Refesh the cart from the server
   * @returns {Promise<boolean>} - A promise that resolves
   * to true if the cart was successfully refreshed
   */
  if (localStorage.getItem('cart') !== null) {
    cart.value = JSON.parse(localStorage.getItem('cart') as string) as Cart;
  }

  async function refreshCart(): Promise<boolean> {
    try {
      const { cart, customer, viewer } = getCartJson.data;

      if (cart) updateCart(cart);

      return true; // Cart was successfully refreshed
    } catch (error: any) {
      logGQLError(error);
      clearAllCookies();
      resetInitialState();

      return false;
    }
  }

  function resetInitialState() {
    cart.value = null;
  }

  function updateCart(payload?: Cart | null): void {
    cart.value = payload || null;
  }

  // toggle the cart visibility
  function toggleCart(state: boolean | undefined = undefined): void {
    isShowingCart.value = state ?? !isShowingCart.value;
  }

  // add an item to the cart
  async function addToCart(input: any): Promise<void> {
    isUpdatingCart.value = true;

    try {
      // Get the product information from the data
      const product = productsJson.data.value.products.nodes.find((product) => product.id === input.productId);

      if (!product) {
        console.error("Product not found:", input.productId);
        return;
      }

      // Get the current cart from localStorage or initialize from template
      let currentCart = localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart') as string)
        : structuredClone(addToCartJson.data.addToCart.cart);

      // Check if product already exists in cart
      const existingItemIndex = currentCart.contents.nodes.findIndex(
        (node: any) => node.product?.node?.databaseId === input.productId
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const existingItem = currentCart.contents.nodes[existingItemIndex];
        existingItem.quantity += input.quantity || 1;

        // Update cart totals
        currentCart.contents.itemCount += input.quantity || 1;
        // Don't increase product count for existing items
      } else {
        // Add new item to cart
        const newItem = {
          quantity: input.quantity || 1,
          key: `item_${Date.now()}`,
          product: {
            node: product
          },
          variation: null
        };

        currentCart.contents.nodes.push(newItem);

        // Update cart totals
        currentCart.contents.itemCount += input.quantity || 1;
        currentCart.contents.productCount += 1;
      }

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(currentCart));

      // Update the reactive state
      cart.value = currentCart;

      // Auto open the cart when an item is added
      if (storeSettings.autoOpenCart && !isShowingCart.value) {
        toggleCart(true);
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
    } finally {
      isUpdatingCart.value = false;
    }
  }

  // remove an item from the cart
  async function removeItem(key: string) {
    isUpdatingCart.value = true;
    const { updateItemQuantities } = await GqlUpDateCartQuantity({ key, quantity: 0 });
    // const { updateItemQuantities } = nuxtApp.$useGql2('updateCartQuantity', { key, quantity: 0 }).data;
    updateCart(updateItemQuantities?.cart);
  }

  // empty the cart
  async function emptyCart(): Promise<void> {
    try {
      isUpdatingCart.value = true;
      // const { emptyCart } = await GqlEmptyCart();
      const { emptyCart } = emptyCartJson.data;
      localStorage.removeItem('cart');
      updateCart(emptyCart?.cart);
    } catch (error: any) {
      logGQLError(error);
    }
  }

  // Stop the loading spinner when the cart is updated
  watch(cart, (val) => {
    isUpdatingCart.value = false;
  });

  // Check if all products in the cart are virtual
  const allProductsAreVirtual = computed(() => {
    const nodes = cart.value?.contents?.nodes || [];
    return nodes.length === 0 ? false : nodes.every((node) => (node.product?.node as SimpleProduct)?.virtual === true);
  });

  // Check if the billing address is enabled
  const isBillingAddressEnabled = computed(() => (storeSettings.hideBillingAddressForVirtualProducts ? !allProductsAreVirtual.value : true));

  return {
    cart,
    isShowingCart,
    isUpdatingCart,
    isBillingAddressEnabled,
    updateCart,
    refreshCart,
    toggleCart,
    addToCart,
    removeItem,
    emptyCart,
  };
}
