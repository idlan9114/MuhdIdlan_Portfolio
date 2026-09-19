<script setup lang="ts">
interface CarouselImage {
  id: string
  name: string
  url: string
}

const modelImage = new URL('@/assets/image-optimized/model.webp', import.meta.url).href

const images: CarouselImage[] = [
  { id: '1', name: 'Ascend', url: new URL('@/assets/image-optimized/Slider_Image/Ascend.webp', import.meta.url).href },
  { id: '2', name: 'Darwisy Blur', url: new URL('@/assets/image-optimized/Slider_Image/DarwisyBlur.webp', import.meta.url).href },
  { id: '3', name: 'Evening', url: new URL('@/assets/image-optimized/Slider_Image/Evening.webp', import.meta.url).href },
  { id: '4', name: 'Girl Green', url: new URL('@/assets/image-optimized/Slider_Image/GirlGreen.webp', import.meta.url).href },
  { id: '5', name: 'House', url: new URL('@/assets/image-optimized/Slider_Image/House.webp', import.meta.url).href },
  { id: '6', name: 'Water Frog', url: new URL('@/assets/image-optimized/Slider_Image/WaterFrog.webp', import.meta.url).href },
  { id: '7', name: 'Waiting', url: new URL('@/assets/image-optimized/Slider_Image/Waiting.webp', import.meta.url).href },
  { id: '8', name: 'Music', url: new URL('@/assets/image-optimized/Slider_Image/Music.webp', import.meta.url).href },
]
</script>

<template>
  <section id="design" class="relative overflow-hidden bg-[#ecebeb] py-20">
    <div class="container mx-auto">
      <div class="relative h-[30rem] w-full">
        <div class="relative z-20 text-center -top-18 lg:absolute lg:top-auto lg:bottom-0 lg:left-0 lg:text-left lg:w-auto w-full mt-4 lg:mt-0">
            <h2 class="design-heading text-[50px] lg:text-[100px] font-sans">
                Design
            </h2>
        </div>
        
        <img :src="modelImage" alt="Model" loading="lazy" decoding="async" class="design-model" />

        <div class="image-3d-carousel" :style="{ '--quantity': images.length }">
          <div
            v-for="(img, index) in images"
            :key="img.id"
            class="image-3d-carousel__item"
            :style="{ '--position': index + 1 }"
          >
            <img :src="img.url" :alt="img.name" loading="lazy" decoding="async" />
          </div>
        </div>

        <router-link
          to="/design"
          class="absolute left-1/2 -bottom-8 z-10 border border-white -translate-x-1/2 rounded-full bg-[#4e4539] px-8 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(0,0,0,0.14)] transition duration-150 ease-in-out hover:-translate-y-0.5 hover:bg-[#5e5850] cursor-pointer lg:left-auto lg:translate-x-0 lg:right-0 lg:bottom-0"
        >
          More Design
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.design-model {
  position: absolute;
  left: 50%;
  bottom: -100px;
  width: 300px;
  max-width: 80%;
  height: auto;
  transform: translateX(-50%);
  z-index: 1;
  object-fit: contain;
}

.image-3d-carousel {
  position: absolute;
  width: 130px;
  height: 180px;
  top: 8%;
  left: calc(50% - 65px);
  transform-style: preserve-3d;
  transform: perspective(1200px) rotateX(-14deg);
  animation: image3dAutoRun 20s linear infinite;
  z-index: 2;
}

.design-heading {
  color: #ecebeb;
  -webkit-text-stroke: 2px #000;
  text-stroke: 2px #000;
  background: rgba(255, 255, 255, 0.2);
  -webkit-background-clip: text;
  background-clip: text;
}

@keyframes image3dAutoRun {
  from {
    transform: perspective(1200px) rotateX(-14deg) rotateY(0deg);
  }
  to {
    transform: perspective(1200px) rotateX(-14deg) rotateY(360deg);
  }
}

.image-3d-carousel__item {
  position: absolute;
  inset: 0;
  transform: rotateY(calc((var(--position) - 1) * (360 / var(--quantity)) * 1deg)) translateZ(210px);
}

.image-3d-carousel__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
  border: 2px solid rgba(255, 255, 255, 0.22);
}

@media (min-width: 1024px) {
  .image-3d-carousel {
    width: 200px;
    height: 280px;
    left: calc(50% - 100px);
  }

  .image-3d-carousel__item {
    transform: rotateY(calc((var(--position) - 1) * (360 / var(--quantity)) * 1deg)) translateZ(460px);
  }
}
</style>
