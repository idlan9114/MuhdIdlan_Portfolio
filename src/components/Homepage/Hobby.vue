<script setup lang="ts">
import { onBeforeUnmount, onMounted, type ComponentPublicInstance } from 'vue'
import hobbyContent from '@/data/hobby.json'
import '@/assets/css/middle-in.css'

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
    { threshold: 0.2 },
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
        <h1 class="text-center text-[40px] font-sans text-white">{{ hobbyContent.title }}</h1>
        <div class="hidden lg:flex flex-col items-end text-right text-white/70 text-[16px] uppercase tracking-[0.2em]">
          <span>{{ hobbyContent.kickerLines[0] }}</span>
          <span>{{ hobbyContent.kickerLines[1] }}</span>
          <span class="text-[#B39977]">{{ hobbyContent.kickerLines[2] }}</span>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 auto-rows-[140px] lg:auto-rows-[160px] grid-flow-dense gap-4">
        <div
          v-for="(photo, index) in hobbyContent.photos"
          :key="photo.id"
          :ref="setCardRef"
          :class="['middle-in overflow-hidden', photo.class]"
          :style="{ transitionDelay: `${index * STAGGER_MS}ms` }"
        >
          <img
            :src="photo.url"
            :alt="photo.alt"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover transition duration-300 ease-in-out hover:scale-[1.05]"
          />
        </div>
      </div>
    </div>
  </section>
</template>
