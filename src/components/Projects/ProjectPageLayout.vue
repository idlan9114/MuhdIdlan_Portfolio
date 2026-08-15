<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description: string
    image: string
    link: string
    /** Extra screenshots that tile alongside the description, mosaic-style. */
    gallery?: string[]
  }>(),
  { gallery: () => [] }
)
</script>

<template>
  <section class="min-h-screen bg-[#ecebeb] py-16">
    <div class="container mx-auto max-w-4xl px-4">
      <router-link
        to="/#project"
        class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-600
          transition-colors hover:text-black"
      >
        ← Back to Projects
      </router-link>

      <h1 class="mb-8 text-center text-3xl font-bold text-black md:text-5xl">
        {{ title }}
      </h1>

      <div class="mx-auto mb-12 max-w-xs overflow-hidden rounded-2xl shadow-lg">
        <img :src="image" :alt="title" class="h-auto w-full object-cover" />
      </div>
      <div
        class="mb-12 grid gap-8"
        :class="gallery.length ? 'md:grid-cols-2 md:items-center' : ''"
      >
        <p class="text-[16px] leading-relaxed text-neutral-700">
          {{ description }}
        </p>

        <div
          v-for="(photo, index) in gallery"
          :key="photo"
          class="overflow-hidden rounded-2xl shadow-lg"
          :class="index === 0 ? '' : 'md:order-first'"
        >
          <img :src="photo" :alt="`${title} screenshot ${index + 1}`" class="h-full w-full object-cover" />
        </div>
      </div>

      <div class="flex justify-end">
        <a
          :href="link"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-lg border-2 border-black px-8 py-3 font-medium text-black
            transition-colors hover:bg-black hover:text-white"
        >
          View Project
        </a>
      </div>
    </div>
  </section>
</template>
