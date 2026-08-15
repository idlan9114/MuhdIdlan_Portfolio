<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com', src: new URL('@/assets/icon/ig.svg', import.meta.url).href },
  { name: 'Facebook', href: 'https://facebook.com', src: new URL('@/assets/icon/fb.svg', import.meta.url).href },
  { name: 'LinkedIn', href: 'https://linkedin.com', src: new URL('@/assets/icon/linkedin.svg', import.meta.url).href },
  { name: 'GitHub', href: 'https://github.com', src: new URL('@/assets/icon/github.svg', import.meta.url).href },
]

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
                    <img src="@/assets/image/Self.png" alt="Profile Picture" class="object-cover rounded-[60px] w-full h-auto lg:h-[500px]" />
                    </div>
                </div>
                </div>

                <div class="mt-6 lg:mt-0 ml-0 lg:ml-8 flex w-full lg:w-1/2 flex-col gap-4 h-auto lg:h-[500px]">
                <div>
                    <h1 class="text-center lg:text-start text-[32px] lg:text-[80px] text-black">Muhammad Idlan</h1>
                </div>

                <div class="flex flex-1 flex-col">
                    <div class="flex flex-col lg:flex-row items-center justify-between">
                    <div class="intro-line flex">
                        <span class="text-black text-[18px] lg:text-[24px] hidden lg:flex">I am</span>
                        <span class="word-switch text-[24px] text-center lg:text-start mb-4 lg:mb-0">
                        <span>Illustrator</span>
                        <span>Game Developer</span>
                        <span>Web Designer</span>
                        <span>UMPSA Student</span>
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
                        <img :src="social.src" :alt="social.name" class="h-6 w-6" />
                        </a>
                    </div>
                    </div>

                    <div class="pt-4 flex flex-1 flex-col justify-between">
                    <p class="text-center lg:text-start text-[16px] leading-relaxed">
                        Graduate student in Bachelor of Computer Science (Graphics & Multimedia Technology)
                        with Honours at University Malaysia Pahang. Passionate about Game Development, VR and Web Development
                    </p>

                    <div class="flex flex-col pt-8 lg:pt-0 gap-4 lg:gap-0 lg:flex-row items-center justify-between"> 
                        <div class="flex items-center gap-4">
                            <button class="flex w-full lg:w-auto justify-center cursor-pointer px-6 py-2 bg-[#4e4539] text-white rounded-full hover:bg-[#5e5850] hover:text-white transition-colors">
                            Download CV

                            <img src="@/assets/image/cv.png" alt="Arrow Right" class="ml-2 h-6 w-6 invert" />
                            </button>
                        </div>
                        <div class="flex items-center justify-end gap-2 text-end text-[16px] leading-relaxed">
                            <span>23 years old, from Malaysia</span>
                            <span class="text-black/70">•</span>
                            <span>{{ malaysiaTime }}</span>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
