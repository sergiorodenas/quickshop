<script lang="ts" setup>

const  { $useGql2 }  = useNuxtApp();
const { data } = $useGql2("getProductCategories");

console.log('data', data);
console.log('productCategories', data.value.productCategories?.nodes);

const productCategories = data.value.productCategories?.nodes as ProductCategory[];


useHead({
  title: `Categories`,
  meta: [{ name: 'description', content: 'All product categories' }],
  link: [{ rel: 'canonical', href: 'https://v3.woonuxt.com/categories' }],
});
</script>

<template>
  <main class="container">
    <div v-if="productCategories?.length" class="grid grid-cols-2 gap-4 my-6 md:grid-cols-3 lg:gap-8 xl:grid-cols-4">
      <CategoryCard v-for="(category, i) in productCategories" :key="i" :node="category" :image-loading="i <= 2 ? 'eager' : 'lazy'" />
    </div>
  </main>
</template>
