<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import './card.css'
import './fonts.css'
import './home.css'
</script>

<template>
  <div class="min-h-screen">
    <Navbar class="sticky top-0 z-50"/>

    <main>
      <router-view />
    </main>

    <Footer />
  </div>
</template>
