<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import homeContent from '@/data/home.json'

const socialLinks = homeContent.socialLinks

function getMalaysiaTime() {
  const now = new Date()
  const malaysiaNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }))

  return malaysiaNow.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kuala_Lumpur',
  })
}

const malaysiaTime = ref(getMalaysiaTime())
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    malaysiaTime.value = getMalaysiaTime()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    window.clearInterval(timer)
  }
})
</script>

<template>
  <section class="bg-[#ecebeb]">
    <div id="home" class="flex flex-col lg:flex-row gap-4 container mx-auto py-[40px] lg:py-[80px] ">
      <div class="flex w-full lg:w-1/2 items-center justify-center h-auto lg:h-[500px]">
        <div class="bg-black w-full rounded-[60px] overflow-hidden h-auto lg:h-[500px]">
          <div>
            <img :src="homeContent.profileImage" :alt="homeContent.profileImageAlt" fetchpriority="high" decoding="async" class="object-cover rounded-[60px] w-full h-auto lg:h-[500px]" />
          </div>
        </div>
      </div>

      <div class="mt-6 lg:mt-0 ml-0 lg:ml-8 flex w-full lg:w-1/2 flex-col gap-4 h-auto lg:h-[500px]">
        <div>
          <h1 class="text-center lg:text-start text-[32px] lg:text-[80px] text-black">{{ homeContent.name }}</h1>
        </div>

        <div class="flex flex-1 flex-col">
          <div class="flex flex-col lg:flex-row items-center justify-between">
            <div class="intro-line flex">
              <span class="text-black text-[18px] lg:text-[24px] hidden lg:flex">I am</span>
              <span class="word-switch text-[24px] text-center lg:text-start mb-4 lg:mb-0">
                <span v-for="role in homeContent.roles" :key="role">{{ role }}</span>
              </span>
            </div>

            <div class="flex items-center gap-4">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.href"
                target="_blank"
                rel="noreferrer"
                :aria-label="social.name"
                class="flex h-12 w-12 items-center justify-center rounded-full bg-[#f4f0eb] transition hover:-translate-y-1 hover:bg-[#e9dfd2]"
              >
                <img :src="social.icon" :alt="social.name" class="h-6 w-6" />
              </a>
            </div>
          </div>

          <div class="pt-4 flex flex-1 flex-col justify-between">
            <p class="text-center lg:text-start text-[16px] leading-relaxed">
              {{ homeContent.description }}
            </p>

            <div class="flex flex-col pt-8 lg:pt-0 gap-4 lg:gap-0 lg:flex-row items-center justify-between">
              <div class="flex items-center gap-4">
                <a
                  :href="homeContent.resumeFile"
                  :download="homeContent.resumeDownloadName"
                  class="flex w-full lg:w-auto justify-center cursor-pointer px-6 py-2 bg-[#4e4539] text-white rounded-full hover:bg-[#5e5850] hover:text-white transition-colors"
                >
                  {{ homeContent.resumeLabel }}

                  <img :src="homeContent.resumeIcon" alt="Arrow Right" class="ml-2 h-6 w-6 invert" />
                </a>
              </div>
              <div class="flex items-center justify-end gap-2 text-end text-[16px] leading-relaxed">
                <span>{{ homeContent.metaText }}</span>
                <span class="text-black/70">&bull;</span>
                <span>{{ malaysiaTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
