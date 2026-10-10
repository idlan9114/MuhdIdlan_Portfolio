<script setup lang="ts">
import componentsData from '@/data/components.json'

type LogoItem = {
  name: string
  image: string
  alt?: string
}

const logos = (componentsData.logoCarousel ?? []) as LogoItem[]
const repeatCount = logos.length > 0 ? Math.max(2, Math.ceil(12 / logos.length)) : 0
const logoSet = Array.from({ length: repeatCount }, () => logos).flat()
const carouselLogos = [...logoSet, ...logoSet]
</script>

<template>
  <section v-if="carouselLogos.length" class="w-full overflow-hidden bg-black" aria-label="Logo carousel">
    <div
      class="flex w-max items-center gap-0 [animation:logo-scroll_14s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none"
    >
      <div
        v-for="(logo, index) in carouselLogos"
        :key="`${logo.image}-${index}`"
        class="grid h-24 w-32 shrink-0 place-items-center"`
      >
        <img
          :src="logo.image"
          :alt="logo.alt || logo.name"
          class="h-20 w-20 object-contain brightness-0 invert"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
</template>

<style>
@keyframes logo-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}
</style>
