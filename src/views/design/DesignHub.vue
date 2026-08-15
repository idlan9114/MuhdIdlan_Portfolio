<script setup lang="ts">
const designThumb = new URL('@/assets/image/Slider_Image/Ascend.png', import.meta.url).href
const artThumb = new URL('@/assets/image/Hobby/Drawing/Drawing (1).jpg', import.meta.url).href

const categories = [
  { label: 'Design', to: '/design/gallery', image: designThumb },
  { label: 'Art', to: '/design/art', image: artThumb },
  { label: 'Website', to: '/design/website', image: null }
]
</script>

<template>
  <section class="min-h-screen bg-[#ecebeb] py-16">
    <div class="container mx-auto px-4">
      <router-link
        to="/#design"
        class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-600
          transition-colors hover:text-black"
      >
        ← Back
      </router-link>

      <h1 class="mb-12 text-center text-4xl font-bold text-black md:text-5xl">
        My Design
      </h1>

      <div class="mx-auto grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
        <router-link
          v-for="category in categories"
          :key="category.label"
          :to="category.to"
          class="group flex flex-col items-center"
        >
          <div
            class="aspect-[3/4] w-full overflow-hidden rounded-xl bg-white shadow-lg
              transition-transform group-hover:-translate-y-1"
          >
            <img
              v-if="category.image"
              :src="category.image"
              :alt="category.label"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full w-full items-center justify-center text-sm text-neutral-400">
              Coming soon
            </div>
          </div>

          <span class="mt-4 text-lg font-semibold text-black">{{ category.label }}</span>
        </router-link>
      </div>
    </div>
  </section>
</template>
