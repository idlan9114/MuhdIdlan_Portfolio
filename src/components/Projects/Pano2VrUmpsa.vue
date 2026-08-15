<script setup lang="ts">
import { projects } from '@/data/projects'
import ProjectPageLayout from './ProjectPageLayout.vue'

const project = projects.find(p => p.slug === 'pano2vr-umpsa')!
</script>

<template>
  <ProjectPageLayout
    :title="project.title"
    :description="project.description"
    :image="project.image"
    :link="project.link"
    :gallery="project.gallery"
  />
</template>
