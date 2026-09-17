<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    coverArt: string
    autoPlay?: boolean
  }>(),
  {
    autoPlay: false,
  },
)

const isPlaying = ref(props.autoPlay)
const isMobileOpen = ref(false)
const touchStartX = ref(0)
const audioRef = ref<HTMLAudioElement | null>(null)
const iframeRef = ref<HTMLIFrameElement | null>(null)

const youtubeId = computed(() => {
  const match = props.src.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/,
  )

  return match?.[1] ?? null
})

function sendYoutubeCommand(command: 'playVideo' | 'pauseVideo') {
  iframeRef.value?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func: command, args: [] }),
    '*',
  )
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
}

function toggleMobileOpen() {
  isMobileOpen.value = !isMobileOpen.value
}

function handleTouchStart(event: TouchEvent) {
  touchStartX.value = event.touches[0]?.clientX ?? 0
}

function handleTouchEnd(event: TouchEvent) {
  const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.value
  const swipeDistance = touchEndX - touchStartX.value

  if (swipeDistance < -30) {
    isMobileOpen.value = true
  }

  if (swipeDistance > 30) {
    isMobileOpen.value = false
  }
}

watch(isPlaying, async (playing) => {
  if (youtubeId.value) {
    sendYoutubeCommand(playing ? 'playVideo' : 'pauseVideo')
    return
  }

  if (playing) {
    try {
      await audioRef.value?.play()
    } catch {
      isPlaying.value = false
    }

    return
  }

  audioRef.value?.pause()
})

onBeforeUnmount(() => {
  audioRef.value?.pause()
  sendYoutubeCommand('pauseVideo')
})
</script>

<template>
  <div class="relative inline-flex flex-col items-center lg:fixed lg:bottom-6 lg:right-12 lg:z-50">
    <iframe
      v-if="youtubeId"
      ref="iframeRef"
      class="pointer-events-none absolute h-px w-px opacity-0"
      :src="`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=${autoPlay ? 1 : 0}&controls=0`"
      allow="autoplay"
      title="Music player audio"
    />

    <audio
      v-else
      ref="audioRef"
      :src="src"
      class="hidden"
      @ended="isPlaying = false"
    />

    <button
      type="button"
      class="relative hidden h-24 w-24 cursor-pointer select-none rounded-full outline-none transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-black/20 lg:block"
      :aria-label="isPlaying ? 'Pause music' : 'Play music'"
      :title="isPlaying ? 'Pause' : 'Play'"
      @click="togglePlay"
    >
      <div
        class="pointer-events-none absolute right-[-10%] top-[-5%] z-20 h-[15%] w-[60%] origin-top-right transition-transform duration-500 ease-in-out sm:right-[-15%] sm:top-[-8%]"
        :style="{ transform: `rotate(${isPlaying ? -20 : 10}deg)` }"
      >
        <div class="absolute right-0 top-0 z-10 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-200 bg-zinc-400 shadow-md md:h-5 md:w-5" />
        <div class="absolute right-[6px] top-0 flex h-1.5 w-[90%] origin-right -rotate-12 items-center justify-start rounded-full bg-zinc-400 shadow-sm sm:right-[8px]">
          <div class="h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-zinc-800 shadow-md md:h-3 md:w-3" />
        </div>
      </div>

      <div
        class="relative h-full w-full animate-spin overflow-hidden rounded-full border-4 border-black/10 bg-black shadow-xl shadow-black/30"
        :style="{ animationDuration: '4s', animationPlayState: isPlaying ? 'running' : 'paused' }"
      >
        <div
          class="absolute inset-0 bg-cover bg-center opacity-90 transition-opacity"
          :style="{ backgroundImage: `url(${coverArt})` }"
        />

        <div
          class="absolute inset-0 rounded-full border border-black/20"
          style="background: radial-gradient(circle, transparent 20%, rgba(0,0,0,0.4) 21%, transparent 22%, transparent 35%, rgba(0,0,0,0.5) 36%, transparent 37%, transparent 50%, rgba(0,0,0,0.3) 51%, transparent 52%, transparent 65%, rgba(0,0,0,0.6) 66%, transparent 67%, transparent 80%, rgba(0,0,0,0.4) 81%, transparent 82%)"
        />

        <div
          class="pointer-events-none absolute inset-0 rounded-full"
          style="background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.2) 100%)"
        />

        <div class="absolute left-1/2 top-1/2 flex h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 shadow-inner">
          <div class="h-2 w-2 rounded-full border border-black/40 bg-zinc-300 shadow-inner md:h-2.5 md:w-2.5" />
        </div>
      </div>
    </button>

    <div
      class="fixed bottom-5 right-0 z-50 flex items-center transition-transform duration-300 ease-out lg:hidden"
      :style="{ transform: isMobileOpen ? 'translateX(0)' : 'translateX(calc(100% - 34px))' }"
      @touchstart.passive="handleTouchStart"
      @touchend.passive="handleTouchEnd"
    >
      <button
        type="button"
        class="flex h-20 w-[34px] items-center justify-center rounded-l-xl border border-r-0 border-black/10 bg-[#f4f0eb] text-[#4e4539] shadow-lg"
        :aria-label="isMobileOpen ? 'Hide music player' : 'Show music player'"
        @click="toggleMobileOpen"
      >
        <span class="h-8 w-1.5 rounded-full bg-[#4e4539]/70" />
      </button>

      <div class="rounded-l-none rounded-r-2xl border border-black/10 bg-[#f4f0eb] p-3 shadow-xl">
        <button
          type="button"
          class="relative h-20 w-20 cursor-pointer select-none rounded-full outline-none transition-transform active:scale-95 focus-visible:ring-4 focus-visible:ring-black/20"
          :aria-label="isPlaying ? 'Pause music' : 'Play music'"
          :title="isPlaying ? 'Pause' : 'Play'"
          @click="togglePlay"
        >
          <div
            class="pointer-events-none absolute right-[-10%] top-[-5%] z-20 h-[15%] w-[60%] origin-top-right transition-transform duration-500 ease-in-out"
            :style="{ transform: `rotate(${isPlaying ? -20 : 10}deg)` }"
          >
            <div class="absolute right-0 top-0 z-10 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-200 bg-zinc-400 shadow-md" />
            <div class="absolute right-[6px] top-0 flex h-1.5 w-[90%] origin-right -rotate-12 items-center justify-start rounded-full bg-zinc-400 shadow-sm">
              <div class="h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-zinc-800 shadow-md" />
            </div>
          </div>

          <div
            class="relative h-full w-full animate-spin overflow-hidden rounded-full border-4 border-black/10 bg-black shadow-xl shadow-black/30"
            :style="{ animationDuration: '4s', animationPlayState: isPlaying ? 'running' : 'paused' }"
          >
            <div
              class="absolute inset-0 bg-cover bg-center opacity-90 transition-opacity"
              :style="{ backgroundImage: `url(${coverArt})` }"
            />

            <div
              class="absolute inset-0 rounded-full border border-black/20"
              style="background: radial-gradient(circle, transparent 20%, rgba(0,0,0,0.4) 21%, transparent 22%, transparent 35%, rgba(0,0,0,0.5) 36%, transparent 37%, transparent 50%, rgba(0,0,0,0.3) 51%, transparent 52%, transparent 65%, rgba(0,0,0,0.6) 66%, transparent 67%, transparent 80%, rgba(0,0,0,0.4) 81%, transparent 82%)"
            />

            <div
              class="pointer-events-none absolute inset-0 rounded-full"
              style="background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.2) 100%)"
            />

            <div class="absolute left-1/2 top-1/2 flex h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 shadow-inner">
              <div class="h-2 w-2 rounded-full border border-black/40 bg-zinc-300 shadow-inner" />
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
