export default defineAppConfig({
  siteName: 'QuickShop',
  shortDescription: 'A fast, static e-commerce site built with Nuxt and Stripe',
  description: 'Browse our collection of products with lightning-fast page loads and secure Stripe checkout.',
  storeSettings: {
    // Cart settings
    autoOpenCart: false,
    // Product display settings
    showSKU: true,
    showProductCategories: true,
    showBreadcrumbs: true,
    // Price display
    saleBadge: 'percent',
    // Stripe settings
    enableStripeCheckout: true
  }
});
