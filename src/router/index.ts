import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue')
const DesignHub = () => import('@/views/design/DesignHub.vue')
const DesignGallery = () => import('@/views/design/DesignGallery.vue')
const ArtGallery = () => import('@/views/design/ArtGallery.vue')
const WebsiteGallery = () => import('@/views/design/WebsiteGallery.vue')
const ProjectHub = () => import('@/views/project/ProjectHub.vue')
const ProjectCategory = () => import('@/views/project/ProjectCategory.vue')
const VRFarming = () => import('@/components/Projects/VRFarming.vue')
const MemoirOfMalaya = () => import('@/components/Projects/MemoirOfMalaya.vue')
const NamelessTemple = () => import('@/components/Projects/NamelessTemple.vue')
const PejuangSlime = () => import('@/components/Projects/PejuangSlime.vue')
const Pano2VrUmpsa = () => import('@/components/Projects/Pano2VrUmpsa.vue')
const FKParkManagementSystem = () => import('@/components/Projects/FKParkManagementSystem.vue')

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
