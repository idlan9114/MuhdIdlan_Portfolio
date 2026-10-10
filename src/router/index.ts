import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue')
const DesignHub = () => import('@/views/design/DesignHub.vue')
const DesignGallery = () => import('@/views/design/DesignGallery.vue')
const ArtGallery = () => import('@/views/design/ArtGallery.vue')
const WebsiteGallery = () => import('@/views/design/WebsiteGallery.vue')
const ProjectHub = () => import('@/views/project/ProjectHub.vue')
const ProjectCategory = () => import('@/views/project/ProjectCategory.vue')
const ProjectPage = () => import('@/views/project/ProjectPage.vue')
const PrivacyPolicy = () => import('@/views/PrivacyPolicy.vue')

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
    { path: '/projects/:slug', name: 'project-page', component: ProjectPage },
    { path: '/privacy-policy', name: 'privacy-policy', component: PrivacyPolicy }
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }

    return savedPosition ?? { top: 0 }
  }
})

export default router
