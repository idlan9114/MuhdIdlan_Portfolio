<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import MusicPlayer from '@/components/ui/MusicPlayer.vue'
import './card.css'
import './fonts.css'
import './home.css'

const musicCoverArt = new URL('@/assets/image/PR.jpg', import.meta.url).href
</script>

<template>
  <div class="min-h-screen">
    <Navbar class="sticky top-0 z-50"/>

    <main>
      <router-view />
    </main>

    <Footer />

    <MusicPlayer
      src="https://www.youtube.com/watch?v=m7pDnJzOtpI&list=RDm7pDnJzOtpI&start_radio=1"
      :cover-art="musicCoverArt"
    />
  </div>
</template>
