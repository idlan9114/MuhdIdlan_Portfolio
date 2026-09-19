<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projects, type Project, type ProjectCategory } from '@/data/projects'

const route = useRoute()
const router = useRouter()

const categoryLabels: Record<string, ProjectCategory> = {
  website: 'Website',
  game: 'Game',
  vr: 'VR'
}

const category = computed(() => categoryLabels[route.params.category as string])

const items = computed(() =>
  projects.filter(project => project.category === category.value)
)

const goToProject = (project: Project) => {
  if (project.hasPage) {
    router.push(`/projects/${project.slug}`)
    return
  }

  if (project.link && project.link !== '#') {
    window.open(project.link, '_blank')
  }
}
</script>

<template>
  <section class="min-h-screen bg-[#ecebeb] py-16">
    <div class="container mx-auto px-4">
      <router-link
        to="/project"
        class="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-600
          transition-colors hover:text-black"
      >
        ← Back to My Project
      </router-link>

      <h1 class="mb-12 text-center text-4xl font-bold text-black md:text-5xl">
        {{ category }}
      </h1>

      <div class="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="project in items"
          :key="project.id"
          class="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg"
        >
          <div class="relative h-56 overflow-hidden bg-gray-200">
            <img :src="project.image" :alt="project.title" loading="lazy" decoding="async" class="h-full w-full object-cover" />
          </div>

          <div class="flex grow flex-col p-6">
            <h3 class="mb-2 text-center text-xl font-bold text-black">
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
  </section>
</template>
