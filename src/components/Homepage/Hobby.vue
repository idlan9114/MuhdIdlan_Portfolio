<script setup lang="ts">
import { onBeforeUnmount, onMounted, type ComponentPublicInstance } from 'vue'
import '@/assets/css/middle-in.css'

interface HobbyPhoto {
  id: string
  url: string
  alt: string
  class: string
  type?: 'image' | 'video'
}

const photos: HobbyPhoto[] = [
  { id: '1', url: new URL('@/assets/image/Hobby/Hiking/Hike (2).JPG', import.meta.url).href, alt: 'Hike1', class: 'col-span-2 row-span-2' },
  { id: '2', url: new URL('@/assets/image/Hobby/Hiking/Hike (10).jpg', import.meta.url).href, alt: 'Darwisy Blur', class: 'col-span-1 row-span-2' },
  { id: '3', url: new URL('@/assets/image/Hobby/Hiking/Hike (6).jpg', import.meta.url).href, alt: 'Self', class: 'col-span-1 row-span-1' },
  { id: '4', url: new URL('@/assets/image/Hobby/Hiking/Hike (1).jpg', import.meta.url).href, alt: 'Evening', class: 'col-span-1 row-span-2' },
  { id: '5', url: new URL('@/assets/image/Hobby/Hiking/Dance.MP4', import.meta.url).href, alt: 'Draw15', class: 'col-span-1 row-span-1', type: 'video' },
  { id: '6', url: new URL('@/assets/image/Hobby/Hiking/Hike (9).jpg', import.meta.url).href, alt: 'Hike8', class: 'col-span-2 row-span-2' },
  { id: '7', url: new URL('@/assets/image/Hobby/Hiking/Hike (11).jpg', import.meta.url).href, alt: 'Hike8', class: 'col-span-1 row-span-1' },
  { id: '8', url: new URL('@/assets/image/Hobby/Hiking/Hike (12).jpg', import.meta.url).href, alt: 'Hike8', class: 'col-span-1 row-span-1' },
]

const STAGGER_MS = 150

let observer: IntersectionObserver | null = null
const cardEls: Element[] = []

const setCardRef = (el: Element | ComponentPublicInstance | null) => {
  if (el instanceof Element) cardEls.push(el)
}

onMounted(() => {
  observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.2 }
  )

  cardEls.forEach(el => observer?.observe(el))
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <section id="hobby" class="bg-black py-20">
    <div class="container mx-auto">
      <div class="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <h1 class="text-center text-[40px] font-sans text-white">Hobbies</h1>
        <div class="hidden lg:flex flex-col items-end text-right text-white/70 text-[16px] uppercase tracking-[0.2em]">
          <span>When I'm Not</span>
          <span>Coding Or</span>
          <span class="text-[#B39977]">Designing</span>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 auto-rows-[140px] lg:auto-rows-[160px] grid-flow-dense gap-4">
        <div
          v-for="(photo, index) in photos"
          :key="photo.id"
          :ref="setCardRef"
          :class="['middle-in overflow-hidden', photo.class]"
          :style="{ transitionDelay: `${index * STAGGER_MS}ms` }"
        >
          <video
            v-if="photo.type === 'video'"
            :src="photo.url"
            :aria-label="photo.alt"
            class="h-full w-full object-cover transition duration-300 ease-in-out hover:scale-[1.05]"
            autoplay
            loop
            muted
            playsinline
            preload="metadata"
          />
          <img
            v-else
            :src="photo.url"
            :alt="photo.alt"
            loading="lazy"
            class="h-full w-full object-cover transition duration-300 ease-in-out hover:scale-[1.05]"
          />
        </div>
      </div>
    </div>
  </section>
</template>
