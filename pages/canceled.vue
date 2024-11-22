<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
      <div class="mb-6">
        <svg class="mx-auto h-12 w-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        Order Canceled
      </h1>
      <p class="text-gray-600 mb-8">
        Your order has been canceled and no payment has been processed.
        Your cart items are still saved if you'd like to try again.
      </p>
      <div class="space-y-4">
        <NuxtLink 
          to="/" 
          class="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Return to Shop
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed for the canceled page
</script>
