<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'
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
    { threshold: 0.2 }
  )

  if (imageEl.value) observer.observe(imageEl.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <section id="about-me" class="bg-[#444343]">
    <div class="container mx-auto py-[80px]">
        <div>
            <div>
            <h1 class="text-center text-[40px] text-white">About Me</h1>
            </div>
        </div>
        <div class="flex flex-col lg:flex-row gap-8">
            <div>
                <div class="text-white text-[30px] mt-6 font-semibold text-center lg:text-start">
                    Designer & <span class="text-[#B39977] font-semibold">Developer</span>
                </div>
                <div class="text-center lg:text-start text-white text-[16px] gap-4 mt-6 flex flex-col gap-8">
                    <div>
                    I am currently pursuing a Bachelor of Computer Science with a specialization in Graphics & Multimedia Technology. I have a strong interest in virtual reality, game development and interactive visual design with hands-on experience in transforming creative ideas into functional systems and engaging digital experiences.
                    </div>
                    <div>
                    In addition to programming, I actively develop my design skills using Adobe Photoshop and Illustrator, allowing me to produce visually polished and user-focused projects. I am eager to apply my technical and creative abilities in a practical internship environment and contribute to real-world projects.
                    </div>
                </div>
            </div>
            <div>
                <img
                    :ref="setImageRef"
                    src="@/assets/image/About_me.jpg"
                    alt="About Me"
                    class="fade-in-top object-cover rounded-full w-full h-full object-[10%_center]"
                />
            </div>
        </div>
      <div class="flex justify-center lg:justify-start">
        <a href="#design" class="mt-12 lg:mt-6 px-8 py-2 bg-white text-[#4e4539] rounded-full hover:bg-[#b4a899] hover:text-white transition-colors">
            My Design
        </a>
      </div>
    </div>
  </section>
</template>
