<script setup lang="ts">
const { cart, toggleCart, isUpdatingCart } = await useCart();
const redirectToStripe = async () => {
  const stripe = window.Stripe("pk_live_uY0a26JeTs4kSuavmpUg3aWz");
  const {error} = await stripe.redirectToCheckout({
    lineItems: cart.value.contents.nodes.map(item => ({
      price: item.product.node.price_id,
      quantity: item.quantity
    })),
    mode: 'payment',
    successUrl: 'https://ide-preview-js.sergiorodenas.com/success',
    cancelUrl: 'https://ide-preview-js.sergiorodenas.com/cancel',
    billingAddressCollection: 'required',
    shippingAddressCollection: {
      allowedCountries: ['ES'],
    }
  })
};
</script>

<template>
  <div class="fixed top-0 bottom-0 right-0 z-50 flex flex-col w-11/12 max-w-lg overflow-x-hidden bg-white shadow-lg">
    <Icon name="ion:close-outline" class="absolute p-1 rounded-lg shadow-lg top-6 left-6 md:left-8 cursor-pointer" size="34" @click="toggleCart(false)" />
    <EmptyCart v-if="cart && !cart.isEmpty" class="rounded-lg shadow-lg p-1.5 hover:bg-red-400 hover:text-white" />

    <div class="mt-8 text-center">
      {{ $t('messages.shop.cart') }}
      <span v-if="cart?.contents?.productCount"> ({{ cart?.contents?.productCount }}) </span>
    </div>

    <ClientOnly>
      <template v-if="cart && !cart.isEmpty">
        <ul class="flex flex-col flex-1 gap-4 p-6 overflow-y-scroll md:p-8">
          <CartCard v-for="item in cart.contents?.nodes" :key="item.key" :item />
        </ul>
        <div class="px-8 mb-8">
          <!-- @click.prevent="toggleCart()" -->
          <a
            class="block w-full p-3 text-lg text-center text-white bg-gray-800 rounded-lg shadow-md justify-evenly hover:bg-gray-900"
            @click="redirectToStripe"
            target="_blank"
          >
            <span class="mx-2">{{ $t('messages.shop.checkout') }}</span>
            <span v-html="cart.total" />
          </a>
        </div>
      </template>
      <!-- Empty Cart Message -->
      <EmptyCartMessage v-else-if="cart && cart.isEmpty" />
      <!-- Cart Loading -->
      <div v-else class="flex flex-col items-center justify-center flex-1 mb-20">
        <LoadingIcon />
      </div>
    </ClientOnly>
    <!-- Cart Loading Overlay -->
    <div v-if="isUpdatingCart" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-25">
      <LoadingIcon />
    </div>
  </div>
</template>
