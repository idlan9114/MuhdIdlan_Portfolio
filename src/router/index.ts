import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import DesignHub from '@/views/design/DesignHub.vue'
import DesignGallery from '@/views/design/DesignGallery.vue'
import ArtGallery from '@/views/design/ArtGallery.vue'
import WebsiteGallery from '@/views/design/WebsiteGallery.vue'
import ProjectHub from '@/views/project/ProjectHub.vue'
import ProjectCategory from '@/views/project/ProjectCategory.vue'
import VRFarming from '@/components/Projects/VRFarming.vue'
import MemoirOfMalaya from '@/components/Projects/MemoirOfMalaya.vue'
import NamelessTemple from '@/components/Projects/NamelessTemple.vue'
import PejuangSlime from '@/components/Projects/PejuangSlime.vue'
import Pano2VrUmpsa from '@/components/Projects/Pano2VrUmpsa.vue'
import FKParkManagementSystem from '@/components/Projects/FKParkManagementSystem.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/design', name: 'design-hub', component: DesignHub },
    { path: '/design/gallery', name: 'design-gallery', component: DesignGallery },
    { path: '/design/art', name: 'design-art', component: ArtGallery },
    { path: '/design/website', name: 'design-website', component: WebsiteGallery },
    { path: '/project', name: 'project-hub', component: ProjectHub },
    { path: '/project/:category', name: 'project-category', component: ProjectCategory },
    { path: '/projects/vr-farming', name: 'vr-farming', component: VRFarming },
    { path: '/projects/memoir-of-malaya', name: 'memoir-of-malaya', component: MemoirOfMalaya },
    { path: '/projects/nameless-temple', name: 'nameless-temple', component: NamelessTemple },
    { path: '/projects/pejuang-slime', name: 'pejuang-slime', component: PejuangSlime },
    { path: '/projects/pano2vr-umpsa', name: 'pano2vr-umpsa', component: Pano2VrUmpsa },
    {
      path: '/projects/fk-park-management-system',
      name: 'fk-park-management-system',
      component: FKParkManagementSystem
    }
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }

    return savedPosition ?? { top: 0 }
  }
})

export default router
