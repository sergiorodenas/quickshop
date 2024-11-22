<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
      <div class="mb-6">
        <svg class="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        Thank you for your order!
      </h1>
      <p class="text-gray-600 mb-8">
        Your payment was successful. We'll send you an email with your order details shortly.
      </p>
      <NuxtLink 
        to="/" 
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Continue Shopping
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const { $cart } = useNuxtApp();

// Clear the cart after successful purchase
onMounted(() => {
  $cart.clearCart();
});
</script>
