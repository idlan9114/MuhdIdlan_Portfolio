<template>
  <header class="bg-[#ecebeb]/90 backdrop-blur-sm">
    <nav class="container flex items-center justify-between py-3">
      <router-link :to="{ path: '/', hash: '#home' }" class="flex items-center gap-3">
        <img src="@/assets/image-optimized/Logo.webp" alt="Logo" class="w-10 h-10" />
      </router-link>

      <!-- Desktop links -->
      <div class="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-700">
        <router-link
          v-for="item in navItems"
          :key="item.hash"
          :to="{ path: '/', hash: item.hash }"
          class="transition-colors hover:text-black"
          :class="activeHash === item.hash ? 'text-black font-semibold' : ''"
        >
          {{ item.label }}
        </router-link>
      </div>

      <!-- Mobile hamburger (fixed top-right) -->
      <button
        @click="open = !open"
        aria-label="Toggle menu"
        class="lg:hidden fixed top-3 right-4 z-50 inline-flex items-center justify-center p-2 rounded-md bg-[#4e4539] text-white"
      >
        <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Mobile drawer (slides down from top) with outside-click backdrop -->
      <div v-if="open" class="fixed inset-0 z-50 lg:hidden">
        <div class="absolute inset-0 bg-black/30" @click="open = false"></div>

        <transition name="slide">
          <div class="absolute left-0 right-0 top-0 bg-white/95 flex flex-col items-center gap-6 h-[60vh] pt-6 overflow-auto" @click.stop>
            <router-link
              v-for="item in navItems"
              :key="item.hash + '-mobile'"
              :to="{ path: '/', hash: item.hash }"
              @click="open = false"
              class="text-2xl font-semibold text-[#4e4539]"
              :class="activeHash === item.hash ? 'underline underline-offset-4' : ''"
            >
              {{ item.label }}
            </router-link>
            <button @click="open = false" class="mt-4 px-6 py-3 rounded-full bg-[#4e4539] text-white">Close</button>
          </div>
        </transition>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const open = ref(false)
const activeHash = ref('')

const navItems = [
  { label: 'Home', hash: '#home' },
  { label: 'About Me', hash: '#about-me' },
  { label: 'Skills', hash: '#skills' },
  { label: 'Hobby', hash: '#hobby' },
  { label: 'Design', hash: '#design' },
  { label: 'Project', hash: '#project' },
  { label: 'Contact', hash: '#contact' },
]

let observer: IntersectionObserver | null = null

const teardownObserver = () => {
  observer?.disconnect()
  observer = null
}

const setupObserver = async () => {
  teardownObserver()

  if (route.path !== '/') {
    activeHash.value = ''
    return
  }

  await nextTick()

  observer = new IntersectionObserver(
    entries => {
      const visible = entries.find(entry => entry.isIntersecting)
      if (visible) activeHash.value = `#${visible.target.id}`
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  )

  navItems.forEach(item => {
    const el = document.getElementById(item.hash.slice(1))
    if (el) observer?.observe(el)
  })
}

watch(() => route.path, setupObserver, { immediate: true })

onBeforeUnmount(teardownObserver)
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 280ms ease, opacity 220ms ease; }
.slide-enter-from { transform: translateY(-100%); opacity: 0; }
.slide-enter-to { transform: translateY(0); opacity: 1; }
.slide-leave-from { transform: translateY(0); opacity: 1; }
.slide-leave-to { transform: translateY(-100%); opacity: 0; }
</style>
