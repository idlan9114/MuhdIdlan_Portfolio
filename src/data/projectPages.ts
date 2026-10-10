export interface ProjectPage {
  slug: string
  title: string
  description: string
  image: string
  link: string
  gallery?: string[]
}

const modules = import.meta.glob('./project-pages/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, ProjectPage>

export const projectPages = Object.values(modules)

export const projectPageSlugs = projectPages.map(page => page.slug)

export const projectPagePaths = projectPages.map(page => `/projects/${page.slug}`)

export const findProjectPage = (slug: string) =>
  projectPages.find(page => page.slug === slug)
