const fs = require('fs').promises;
const path = require('path');
const Stripe = require('stripe');

async function fetchStripeProducts() {
  const stripe = new Stripe(process.env.STRIPE_API_KEY);
  
  // Fetch all products with their prices
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price']
  });

  // Transform products into the required format
  const transformedProducts = products.data.map(product => {
    const price = product.default_price;
    const categories = (product.metadata.category || '')
      .toLowerCase()
      .split(',')
      .map(cat => cat.trim())
      .filter(Boolean);

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      images: product.images,
      price: {
        amount: price.unit_amount / 100,
        currency: price.currency
      },
      categories,
      metadata: product.metadata
    };
  });

  // Group products by category
  const productsByCategory = {};
  transformedProducts.forEach(product => {
    product.categories.forEach(category => {
      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }
      productsByCategory[category].push(product);
    });
  });

  // Write the static data files
  await fs.mkdir(path.join(process.cwd(), 'static', 'data'), { recursive: true });
  
  await fs.writeFile(
    path.join(process.cwd(), 'static', 'data', 'products.json'),
    JSON.stringify(transformedProducts, null, 2)
  );

  await fs.writeFile(
    path.join(process.cwd(), 'static', 'data', 'categories.json'),
    JSON.stringify(productsByCategory, null, 2)
  );
}

fetchStripeProducts().catch(console.error);
