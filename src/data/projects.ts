import projectsData from './projects.json'
import { projectPageSlugs } from './projectPages'

export type ProjectCategory = 'Website' | 'Game' | 'VR'

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  image: string
  link: string
  category: ProjectCategory
  /** Slug of a dedicated project page. Empty uses the external link. */
  projectPageSlug?: string
  pagePath?: string
  /** Extra screenshots for the project page's mosaic layout, once available. */
  gallery?: string[]
}

export const projects = (projectsData.projects as Project[]).map(project => ({
  ...project,
  pagePath: project.projectPageSlug && projectPageSlugs.includes(project.projectPageSlug)
    ? `/projects/${project.projectPageSlug}`
    : '',
}))
