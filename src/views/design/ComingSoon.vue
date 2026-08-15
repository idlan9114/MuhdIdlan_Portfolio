<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="flex min-h-screen flex-col items-center justify-center bg-[#ecebeb] px-4 py-16 text-center">
    <router-link
      to="/design"
      class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-600
        transition-colors hover:text-black"
    >
      ← Back to My Design
    </router-link>

    <h1 class="mb-4 text-4xl font-bold text-black md:text-5xl">
      {{ title }}
    </h1>

    <p class="text-neutral-500">Coming soon.</p>
  </section>
</template>
