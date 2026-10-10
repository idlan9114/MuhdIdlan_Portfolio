<script setup lang="ts">
import { onBeforeUnmount, onMounted, type ComponentPublicInstance } from 'vue'
import skillsContent from '@/data/skills.json'
import '@/assets/css/fade-in-top.css'

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

const skillGroups = skillsContent.groups
</script>

<template>
  <section id="skills" class="bg-[#ecebeb] py-20">
    <div class="container mx-auto">
      <div class="mb-14 text-center">
        <h1 class="text-center text-[40px] font-sans text-black">{{ skillsContent.title }}</h1>
        <p class="mt-4 text-[20px] text-black">
          {{ skillsContent.subtitle }}
        </p>
      </div>

      <div class="grid gap-8 lg:grid-cols-3">
        <div
          v-for="(group, index) in skillGroups"
          :key="group.title"
          :ref="setCardRef"
          :style="{ transitionDelay: `${index * STAGGER_MS}ms` }"
          class="fade-in-top rounded-[30px] bg-[#1b1b1b] p-7 shadow-[0_18px_40px_rgba(19,19,19,0.10)]"
        >
          <div class="mb-8 flex items-center gap-4 text-white justify-center">
            <span :class="['text-[20px]', group.accent]">{{ group.icon }}</span>
            <h3 class="text-[24px] text-center font-bold leading-none font-sans">{{ group.title }}</h3>
          </div>

          <div class="flex flex-wrap gap-3 justify-center">
            <span
              v-for="item in group.items"
              :key="item"
              class="inline-flex items-center rounded-full border border-[#505050] bg-[#444343] px-4 py-2 text-[18px] font-medium text-white"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
