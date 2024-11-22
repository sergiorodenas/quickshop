<script lang="ts" setup>
import { ProductsOrderByEnum } from '#woo';
const { siteName, description, shortDescription, siteImage } = useAppConfig();

interface Brand {
  name: string;
  logo: string;
}

interface Category {
  id: number;
  name: string;
  imageUrl: string;
  slug: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface ConfigData {
  brands: Brand[];
  categories: Category[];
  features: Feature[];
}

interface Config {
  default: ConfigData;
}

interface ProductNode {
  name: string;
  type: string;
  databaseId: string;
  id: string;
  slug: string;
  description: string;
  shortDescription: string;
  regularPrice: string;
  image: {
    sourceUrl: string;
    altText: string;
    title: string;
  };
  [key: string]: any;
}

interface GetProductsData {
  data: {
    value: {
      products: {
        nodes: ProductNode[];
      };
    };
  };
}

const configData = await import('~/../../config.json') as Config;
const { brands, categories, features } = configData.default;

// Import products directly from getProducts.json
const productsData = await import('../data/getProducts.json') as GetProductsData;
const popularProducts = computed(() => 
  productsData.data.value.products.nodes || []
);

useSeoMeta({
  title: `Home`,
  ogTitle: siteName,
  description: description,
  ogDescription: shortDescription,
  ogImage: siteImage,
  twitterCard: `summary_large_image`,
});
</script>

<template>
  <main>
    <HeroBanner />

    <div
      class="container flex flex-wrap items-center justify-center my-16 text-center gap-x-8 gap-y-4 brand lg:justify-between">
      <img v-for="brand in brands" 
           :key="brand.name" 
           :src="brand.logo" 
           :alt="brand.name" 
           width="132" 
           height="35" />
    </div>

    <section class="container my-16">
      <div class="flex items-end justify-between">
        <h2 class="text-lg font-semibold md:text-2xl">{{ $t('messages.shop.shopByCategory') }}</h2>
        <NuxtLink class="text-primary" to="/categories">{{ $t('messages.general.viewAll') }}</NuxtLink>
      </div>
      <div class="grid justify-center grid-cols-2 gap-4 mt-8 md:grid-cols-3 lg:grid-cols-4">
        <NuxtLink v-for="category in categories" 
                 :key="category.id" 
                 :to="`/product-category/${category.slug}`"
                 class="relative overflow-hidden group rounded-xl">
          <img :src="category.imageUrl" 
               :alt="category.name"
               class="object-cover w-full aspect-square transition-transform duration-300 group-hover:scale-110" />
          <div class="absolute inset-0 flex items-center justify-center bg-black/30">
            <h3 class="text-xl font-semibold text-white">{{ category.name }}</h3>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="container grid gap-4 my-24 md:grid-cols-2 lg:grid-cols-4">
      <div v-for="feature in features" 
           :key="feature.title" 
           class="flex items-center gap-8 p-8 bg-white rounded-lg">
        <img :src="feature.icon" 
             width="60" 
             height="60" 
             :alt="feature.title" 
             loading="lazy" />
        <div>
          <h3 class="text-xl font-semibold">{{ feature.title }}</h3>
          <p class="text-sm">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <section class="container my-16" v-if="popularProducts.length">
      <div class="flex items-end justify-between">
        <h2 class="text-lg font-semibold md:text-2xl">{{ $t('messages.shop.popularProducts') }}</h2>
        <NuxtLink class="text-primary" to="/products">{{ $t('messages.general.viewAll') }}</NuxtLink>
      </div>
      <ProductRow :products="popularProducts" class="grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mt-8" />
    </section>
  </main>
</template>

<style scoped>
.brand img {
  max-height: min(8vw, 120px);
  object-fit: contain;
  object-position: center;
}
</style>
