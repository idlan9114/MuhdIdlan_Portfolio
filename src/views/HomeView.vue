<script setup lang="ts">
import Home from '@/components/Homepage/Home.vue'
import AboutMe from '@/components/Homepage/AboutMe.vue'
import Skills from '@/components/Homepage/Skills.vue'
import Hobby from '@/components/Homepage/Hobby.vue'
import Design from '@/components/Homepage/Design.vue'
import Project from '@/components/Homepage/Project.vue'
import Contact from '@/components/Homepage/Contact.vue'
import MusicPlayer from '@/components/ui/MusicPlayer.vue'

const musicCoverArt = new URL('@/assets/image/Slider_Image/Music.png', import.meta.url).href
</script>

<template>
  <div>
    <Home />
    <AboutMe />
    <Skills />
    <Hobby />
    <Design />
    <Project />
    <Contact />

    <MusicPlayer
      src="https://www.youtube.com/watch?v=m7pDnJzOtpI&list=RDm7pDnJzOtpI&start_radio=1"
      :cover-art="musicCoverArt"
    />
  </div>
</template>
