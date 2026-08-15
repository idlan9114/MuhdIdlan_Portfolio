<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const toggleEnvelope = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <section class="mt-12 w-full flex justify-center">
    <div class="card w-full flex justify-center">
      <button
        type="button"
        @click="toggleEnvelope"
        :aria-expanded="isOpen"
        aria-label="Toggle envelope"
        class="relative bg-black w-[min(100%,400px)] lg:w-[450px] aspect-video flex items-center justify-center cursor-pointer"
      >
        <div
          :class="isOpen ? '-translate-y-16 duration-1000' : 'duration-300'"
          class="transition-all flex flex-col items-center py-5 justify-start bg-white w-full h-full absolute"
        >
          <p class="text-xl lg:text-2xl font-semibold text-gray-500 font-serif">
            Thank You
          </p>
          <p class="px-10 text-[10px] lg:text-[12px] text-gray-700 text-center">
            It’s so nice that you had the time to view this idea
          </p>
          <p class="font-serif text-[10px] lg:text-[12px] text-gray-700 text-center">
            Wishing you a fantastic day ahead!
          </p>
          <p class="font-sans text-[10px] text-gray-700 pt-5">MUHAMMAD IDLAN</p>
        </div>

        <span
          :class="isOpen ? 'opacity-0 scale-0 rotate-180' : ''"
          class="seal transition-all duration-1000 bg-[rgb(255,211,68)] text-black w-15 aspect-square rounded-full z-40 text-[10px] flex items-center justify-center font-semibold [clip-path:polygon(50%_0%,_80%_10%,_100%_35%,_100%_70%,_80%_90%,_50%_100%,_20%_90%,_0%_70%,_0%_35%,_20%_10%)] border-4 border-[rgb(207,169,43)]"
        >
          IDLAN
        </span>

        <div
          :class="isOpen ? '[clip-path:polygon(50%_0%,_100%_0,_0_0)] duration-100' : '[clip-path:polygon(50%_50%,_100%_0,_0_0)] duration-1000'"
          class="tp transition-all absolute bg-neutral-800 w-full h-full"
        ></div>
        <div class="lft transition-all duration-700 absolute w-full h-full bg-neutral-900 [clip-path:polygon(50%_50%,_0_0,_0_100%)]"></div>
        <div class="rgt transition-all duration-700 absolute w-full h-full bg-neutral-800 [clip-path:polygon(50%_50%,_100%_0,_100%_100%)]"></div>
        <div class="btm transition-all duration-700 absolute w-full h-full bg-neutral-900 [clip-path:polygon(50%_50%,_100%_100%,_0_100%)]"></div>
      </button>
    </div>
  </section>
</template>
