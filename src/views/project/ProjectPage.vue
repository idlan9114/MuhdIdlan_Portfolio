<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProjectPageLayout from '@/components/Projects/ProjectPageLayout.vue'
import { findProjectPage } from '@/data/projectPages'

const route = useRoute()

const page = computed(() => findProjectPage(String(route.params.slug)))
</script>

<template>
  <ProjectPageLayout
    v-if="page"
    :title="page.title"
    :description="page.description"
    :image="page.image"
    :link="page.link"
    :gallery="page.gallery"
  />
  <section v-else class="min-h-screen bg-[#ecebeb] py-16">
    <div class="container mx-auto max-w-3xl px-4 text-center">
      <router-link
        to="/project"
        class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-black"
      >
        Back to Projects
      </router-link>
      <h1 class="text-4xl font-bold text-black">Project page not found</h1>
    </div>
  </section>
</template>
