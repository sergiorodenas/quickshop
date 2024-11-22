# QuickShop - Static E-commerce Site

A static e-commerce site built with Nuxt 3 and Stripe, optimized for static generation.

## Features

- Fully static site generation
- Stripe integration for payments
- Local storage based cart
- Category-based product organization
- Configurable through JSON files
- Cloudflare image optimization
- GitHub Actions for automated builds and deployments

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your Stripe keys:
   ```
   NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure your site in `config.json`:
   ```json
   {
     "site": {
       "logo": "/images/logo.svg",
       "hero": {
         "image": "/images/hero.jpeg",
         "title": "Welcome to our Shop",
         "subtitle": "Discover our amazing products"
       }
     },
     "categories": {
       "electronics": {
         "image": "/images/categories/electronics.jpg"
       }
     }
   }
   ```

## Development

```bash
# Start development server
npm run dev

# Build for production (includes fetching latest Stripe products)
npm run generate

# Preview production build
npm run preview
```

## Product Configuration

Products are managed in Stripe:
1. Create products with prices in Stripe
2. Add category metadata to products (comma-separated)
3. Add images to products
4. Products are fetched during build time

Example Stripe product metadata:
```json
{
  "category": "electronics, gadgets"
}
```

## Project Structure

```
├── components/          # Vue components
│   ├── ProductCard.vue  # Individual product display
│   └── ProductGrid.vue  # Product grid layout
├── pages/              # Nuxt pages
│   ├── success.vue     # Order success page
│   └── canceled.vue    # Order canceled page
├── plugins/            # Nuxt plugins
│   └── cart.js        # Shopping cart functionality
├── public/             # Static assets
├── scripts/            # Build scripts
│   └── fetch-stripe-products.js  # Stripe data fetching
├── app.config.js       # App configuration
├── nuxt.config.js      # Nuxt configuration
└── config.json         # Site configuration
```

## Deployment

The site is automatically built and deployed through GitHub Actions:
1. Fetches latest product data from Stripe
2. Generates static pages
3. Deploys to GitHub Pages

## Cart Functionality

The cart system uses localStorage for persistence and includes:
- Add/remove items
- Update quantities
- Calculate totals
- Stripe checkout integration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
