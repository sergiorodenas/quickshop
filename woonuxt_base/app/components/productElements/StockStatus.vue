<script setup lang="ts">
defineProps({
  stockStatus: { type: String, required: false },
});
</script>

<template>
  <span v-if="stockStatus === 'IN_STOCK'" class="text-green-600">{{ $t('messages.shop.inStock') }}</span>
  <span v-else-if="stockStatus === 'OUT_OF_STOCK'" class="text-red-600">{{ $t('messages.shop.outOfStock') }}</span>
  <span v-else-if="stockStatus === 'ON_BACKORDER'" class="text-yellow-600">{{ $t('messages.shop.onBackorder') }}</span>
  <span v-else class="text-gray-600">Loading</span>
</template>
