<script setup lang="ts">
import { ref } from 'vue'

const imageModules = import.meta.glob('@/assets/image-optimized/Slider_Image/*.webp', {
  eager: true,
  import: 'default'
}) as Record<string, string>

const titleize = (fileName: string) =>
  fileName
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()

const items = Object.entries(imageModules)
  .map(([path, url]) => {
    const fileName = path.split('/').pop()?.replace(/\.webp$/, '') ?? ''
    return { title: titleize(fileName), url }
  })
  .sort((a, b) => a.title.localeCompare(b.title))

const activeItem = ref<{ title: string; url: string } | null>(null)

const openPreview = (item: { title: string; url: string }) => {
  activeItem.value = item
}

const closePreview = () => {
  activeItem.value = null
}
</script>

<template>
  <section class="min-h-screen bg-[#ecebeb] py-16">
    <div class="container mx-auto px-4">
      <router-link
        to="/design"
        class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-600
          transition-colors hover:text-black"
      >
        ← Back to My Design
      </router-link>

      <h1 class="mb-12 text-center text-4xl font-bold text-black md:text-5xl">
        Design
      </h1>

      <div class="mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
        <figure v-for="item in items" :key="item.url">
          <div
            class="aspect-[3/4] cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg
              transition-transform hover:scale-[1.02]"
            @click="openPreview(item)"
          >
            <img :src="item.url" :alt="item.title" loading="lazy" decoding="async" class="h-full w-full object-cover" />
          </div>
          <!-- <figcaption class="mt-2 text-center text-sm font-medium text-neutral-700">
            {{ item.title }}
          </figcaption> -->
        </figure>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="activeItem"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          @click="closePreview"
        >
          <button
            class="absolute right-5 top-5 text-3xl leading-none text-white/80 transition-colors
              hover:text-white"
            aria-label="Close preview"
            @click="closePreview"
          >
            &times;
          </button>
          <img
            :src="activeItem.url"
            :alt="activeItem.title"
            decoding="async"
            class="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            @click.stop
          />
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
