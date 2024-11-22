<script setup lang="ts">
interface HeroConfig {
  backgroundImage: string;
  title: string;
  subtitle: string;
  description: string;
  link: {
    text: string;
    url: string;
  };
}

interface Config {
  default: {
    hero: HeroConfig;
  };
}

const config = await import('~/../../config.json') as Config;
const hero = config.default.hero;
</script>

<template>
  <div class="relative mx-auto">
    <NuxtImg
      width="1400"
      height="800"
      class="object-cover w-full h-[420px] lg:h-[560px] xl:h-[640px]"
      :src="hero.backgroundImage"
      :alt="hero.title"
      loading="eager"
      sizes="sm:100vw md:1400px"
      fetchpriority="high"
      preload
      placeholder
      placeholder-class="blur-xl" />
    <div class="container absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-l from-gray-200 md:bg-none">
      <h1 class="text-3xl font-bold md:mb-4 md:text-4xl lg:text-6xl">{{ hero.title }}</h1>
      <h2 class="text-lg font-bold md:mb-4 lg:text-3xl">{{ hero.subtitle }}</h2>
      <div class="max-w-sm mb-8 text-md font-light lg:max-w-md text-balance">
        <p>{{ hero.description }}</p>
      </div>
      <NuxtLink class="px-6 py-3 font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-800" :to="hero.link.url">{{ hero.link.text }}</NuxtLink>
    </div>
  </div>
</template>
