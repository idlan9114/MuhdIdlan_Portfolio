<script setup lang="ts">
import privacyContent from '@/data/privacy.json'
</script>

<template>
  <section class="min-h-screen bg-[#ecebeb] py-16">
    <div class="container mx-auto max-w-4xl px-4">
      <div class="mb-8 flex items-center justify-between">
        <router-link
        to="/#contact"
        class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-600
          transition-colors hover:text-black"
      >
        ← Back to Contact
      </router-link>
      </div>

      <article class="rounded-2xl border border-[#e0d8ce] bg-white px-6 py-8 shadow-sm sm:px-10 lg:px-12 lg:py-12">
        <header class="border-b border-[#eee7df] pb-8">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b8175]">
            Last updated: {{ privacyContent.lastUpdated }}
          </p>
          <h1 class="mt-4 text-4xl font-bold text-black lg:text-5xl">{{ privacyContent.title }}</h1>
          <p class="mt-5 max-w-3xl text-base leading-8 text-[#4e4539] lg:text-lg">{{ privacyContent.intro }}</p>
        </header>

        <div class="mt-8 divide-y divide-[#eee7df]">
          <section v-for="section in privacyContent.sections" :key="section.heading" class="py-7 first:pt-0 last:pb-0">
            <h2 class="text-xl font-semibold text-black">{{ section.heading }}</h2>
            <p class="mt-3 text-base leading-8 text-[#4e4539]">{{ section.body }}</p>
          </section>
        </div>
      </article>
    </div>
  </section>
</template>
