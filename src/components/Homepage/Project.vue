<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { projects, type Project } from '@/data/projects'

const router = useRouter()

const TRANSITION_DURATION = 500
const AUTOPLAY_INTERVAL = 5000
const MIN_SWIPE_DISTANCE = 50

const isTablet = ref(false)
const isDesktop = ref(false)
const trackRef = ref<HTMLElement | null>(null)

let tabletQuery: MediaQueryList | null = null
let desktopQuery: MediaQueryList | null = null
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const updateScreenSize = () => {
  isTablet.value = tabletQuery?.matches ?? false
  isDesktop.value = desktopQuery?.matches ?? false
}

const projectsPerView = computed(() => {
  if (isDesktop.value) return 3
  if (isTablet.value) return 2
  return 1
})

const carouselProjects = computed(() => [...projects, ...projects, ...projects])

const currentIndex = ref(projects.length)
const isAnimating = ref(false)
const transitionEnabled = ref(true)

const slidePercentage = computed(() => 100 / projectsPerView.value)

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * slidePercentage.value}%)`,
  transition: transitionEnabled.value
    ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
    : 'none'
}))

const activeDot = computed(() => {
  return (
    ((currentIndex.value - projects.length) % projects.length + projects.length) %
    projects.length
  )
})

const waitForTransitionEnd = () =>
  new Promise<void>(resolve => {
    const track = trackRef.value

    if (!track) {
      resolve()
      return
    }

    const onEnd = (event: TransitionEvent) => {
      if (event.target !== track || event.propertyName !== 'transform') return
      track.removeEventListener('transitionend', onEnd)
      resolve()
    }

    track.addEventListener('transitionend', onEnd)
  })

const startAutoplay = () => {
  stopAutoplay()
  autoplayTimer = setInterval(() => {
    step(1)
  }, AUTOPLAY_INTERVAL)
}

const stopAutoplay = () => {
  if (autoplayTimer !== null) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const step = async (direction: 1 | -1) => {
  if (isAnimating.value) return

  isAnimating.value = true
  transitionEnabled.value = true
  currentIndex.value += direction

  await waitForTransitionEnd()

  const pastEnd = currentIndex.value >= projects.length * 2
  const pastStart = currentIndex.value < projects.length

  if (pastEnd || pastStart) {
    currentIndex.value += pastEnd ? -projects.length : projects.length
    transitionEnabled.value = false
    await nextTick()

    trackRef.value?.offsetHeight

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        transitionEnabled.value = true
      })
    })
  }

  isAnimating.value = false
}

const nextProject = () => step(1)
const prevProject = () => step(-1)

const goToDot = async (index: number) => {
  if (isAnimating.value || index === activeDot.value) return

  isAnimating.value = true
  transitionEnabled.value = true
  currentIndex.value = projects.length + index

  await waitForTransitionEnd()
  isAnimating.value = false
}

const touchStartX = ref(0)

const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0]?.clientX ?? 0
  stopAutoplay()
}

const handleTouchEnd = (event: TouchEvent) => {
  const touchEndX = event.changedTouches[0]?.clientX ?? 0
  const swipeDistance = touchStartX.value - touchEndX

  if (swipeDistance > MIN_SWIPE_DISTANCE) {
    nextProject()
  } else if (swipeDistance < -MIN_SWIPE_DISTANCE) {
    prevProject()
  }

  startAutoplay()
}

const goToProject = (project: Project) => {
  if (project.hasPage) {
    router.push(`/projects/${project.slug}`)
    return
  }

  if (project.link && project.link !== '#') {
    window.open(project.link, '_blank')
  }
}

onMounted(() => {
  tabletQuery = window.matchMedia('(min-width: 768px)')
  desktopQuery = window.matchMedia('(min-width: 1024px)')
  updateScreenSize()
  tabletQuery.addEventListener('change', updateScreenSize)
  desktopQuery.addEventListener('change', updateScreenSize)

  startAutoplay()
})

onUnmounted(() => {
  tabletQuery?.removeEventListener('change', updateScreenSize)
  desktopQuery?.removeEventListener('change', updateScreenSize)
  stopAutoplay()
})
</script>

<template>
  <section id="project" class="relative overflow-hidden bg-[#444343] py-20">
    <div class="container mx-auto">
      <div class="mb-10 text-center">
        <h2 class="text-[40px] font-sans text-white">Projects</h2>
      </div>

      <div
        class="relative w-full"
        @mouseenter="stopAutoplay"
        @mouseleave="startAutoplay"
      >
        <div
          class="overflow-hidden touch-pan-y"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <div ref="trackRef" class="flex" :style="trackStyle">
            <div
              v-for="(project, index) in carouselProjects"
              :key="`${project.id}-${index}`"
              class="w-full shrink-0 px-3 md:w-1/2 lg:w-1/3"
            >
              <div class="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg">
                <div class="relative h-64 overflow-hidden bg-gray-200">
                  <img
                    :src="project.image"
                    :alt="project.title"
                    class="h-full w-full object-cover"
                  />
                </div>

                <div class="flex grow flex-col p-6">
                  <h3 class="mb-2 text-center text-2xl font-bold text-black">
                    {{ project.title }}
                  </h3>

                  <p class="mb-4 grow text-center text-sm text-gray-600">
                    {{ project.description }}
                  </p>

                  <button
                    @click="goToProject(project)"
                    class="w-full rounded-lg bg-black px-4 py-2 font-medium text-white
                      transition-colors duration-200 hover:bg-gray-800"
                  >
                    View Project Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          @click="prevProject"
          :disabled="isAnimating"
          class="hidden lg:flex absolute left-2 top-1/2 z-10 h-10 w-10 -translate-x-8 -translate-y-1/2
            items-center justify-center rounded-full bg-black text-white transition-colors
            hover:bg-gray-800 disabled:cursor-default disabled:hover:bg-black lg:-translate-x-16 lg:left-0"
          aria-label="Previous project"
        >
          ❮
        </button>

        <button
          @click="nextProject"
          :disabled="isAnimating"
          class="hidden lg:flex absolute right-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 translate-x-8
            items-center justify-center rounded-full bg-black text-white transition-colors
            hover:bg-gray-800 disabled:cursor-default disabled:hover:bg-black lg:right-0 lg:translate-x-16"
          aria-label="Next project"
        >
          ❯
        </button>

        <div class="mt-6 flex justify-center gap-2">
          <button
            v-for="(project, index) in projects"
            :key="project.id"
            @click="goToDot(index)"
            :aria-label="`Go to ${project.title}`"
            :aria-current="index === activeDot"
            class="h-2 rounded-full transition-all duration-300"
            :class="index === activeDot ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'"
          />
        </div>
      </div>

      <div class="mt-10 text-center lg:text-end">
        <router-link
          to="/project"
          class="inline-block rounded-full border border-[#5e5850] bg-white px-8 py-3 text-sm
            font-semibold text-[#4e4539] shadow-[0_18px_32px_rgba(0,0,0,0.14)] transition
            duration-150 ease-in-out hover:-translate-y-0.5 hover:bg-[#4e4539] hover:text-white"
        >
          More Project
        </router-link>
      </div>
    </div>
  </section>
</template>
