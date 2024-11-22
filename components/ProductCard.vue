<template>
  <div class="group relative bg-white rounded-lg shadow-md overflow-hidden">
    <div class="aspect-w-4 aspect-h-3 bg-gray-200">
      <img 
        :src="product.images[0]" 
        :alt="product.name"
        class="w-full h-full object-cover object-center"
      />
    </div>
    <div class="p-4">
      <h3 class="text-sm font-medium text-gray-900">{{ product.name }}</h3>
      <p class="mt-1 text-sm text-gray-500">{{ product.description }}</p>
      <div class="mt-2 flex items-center justify-between">
        <p class="text-lg font-medium text-gray-900">
          {{ formatPrice(product.price.amount) }}
        </p>
        <button
          @click="addToCart(product)"
          class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const { $cart } = useNuxtApp();

const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const addToCart = (product) => {
  $cart.addToCart(product);
};
</script>
