<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'
import aboutContent from '@/data/about.json'
import '@/assets/css/fade-in-top.css'

let observer: IntersectionObserver | null = null
const imageEl = ref<Element | null>(null)

const setImageRef = (el: Element | ComponentPublicInstance | null) => {
  imageEl.value = el instanceof Element ? el : null
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

  if (imageEl.value) observer.observe(imageEl.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <section id="about-me" class="relative overflow-hidden bg-[#444343]">
    <div class="container relative mx-auto overflow-hidden py-[80px]">
      <div class="relative z-10">
        <div>
          <div>
            <h1 class="text-center text-[40px] text-white">{{ aboutContent.title }}</h1>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row gap-8">
          <div>
            <div class="text-white text-[30px] mt-6 font-semibold text-center lg:text-start">
              {{ aboutContent.headline.prefix }} <span class="text-[#B39977] font-semibold">{{ aboutContent.headline.highlight }}</span>
            </div>
            <div class="text-center lg:text-start text-white text-[16px] mt-6 flex flex-col gap-8">
              <div v-for="paragraph in aboutContent.paragraphs" :key="paragraph">
                {{ paragraph }}
              </div>
            </div>
          </div>
          <div>
            <img
              :ref="setImageRef"
              :src="aboutContent.image"
              :alt="aboutContent.imageAlt"
              loading="lazy"
              decoding="async"
              class="fade-in-top object-cover rounded-full w-full h-full object-[10%_center]"
            />
          </div>
        </div>
        <div class="flex justify-center lg:justify-start">
          <a :href="aboutContent.buttonHref" class="mt-12 lg:mt-6 px-8 py-2 bg-white text-[#4e4539] rounded-full hover:bg-[#b4a899] hover:text-white transition-colors">
            {{ aboutContent.buttonLabel }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
