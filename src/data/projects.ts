export type ProjectCategory = 'Website' | 'Game' | 'VR'

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  image: string
  link: string
  category: ProjectCategory
  /** Has a dedicated in-site project page instead of linking straight out. */
  hasPage: boolean
  /** Extra screenshots for the project page's mosaic layout, once available. */
  gallery?: string[]
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'vr-farming',
    title: 'VR - Farming Training System',
    description:
      'Immersive VR application designed to revolutionize agricultural education',
    image: new URL('@/assets/image-optimized/Projects/Farming.webp', import.meta.url).href,
    link: 'https://drive.google.com/drive/folders/1QqpKveb8wNkz2kLTfN4hgcMqI0RaRkPR',
    category: 'VR',
    hasPage: true
  },
  {
    id: '2',
    slug: 'memoir-of-malaya',
    title: 'Memoir of Malaya',
    description:
      '3D interactive educational game exploring Malaysia history through gameplay quiz.',
    image: new URL('@/assets/image-optimized/Projects/Mom.webp', import.meta.url).href,
    link: 'https://drive.google.com/drive/folders/1hKPjVA_ZHx6FZ8nKK518v8tq2f4ylOf9',
    category: 'Game',
    hasPage: true
  },
  {
    id: '3',
    slug: 'nameless-temple',
    title: 'Nameless Temple',
    description:
      '3D third-person survival escape game, an archaeologist trapped in ancient ruins.',
    image: new URL('@/assets/image-optimized/Projects/Nameless.webp', import.meta.url).href,
    link: 'https://drive.google.com/drive/folders/1Sfrz1pv4NDwiD_aVzcqjBDBKijcP5Smm?usp=sharing',
    category: 'Game',
    hasPage: true
  },
  {
    id: '4',
    slug: 'pejuang-slime',
    title: 'Pejuang Slime',
    description:
      '2D action-adventure platformer deeply rooted in Malay folklore and culture.',
    image: new URL('@/assets/image-optimized/Projects/PejuangSlime.webp', import.meta.url).href,
    link: 'https://drive.google.com/drive/folders/1-bpVyODZ-fp6jKvbHKImex7EQXXJparG?usp=sharing',
    category: 'Game',
    hasPage: true
  },
  {
    id: '5',
    slug: 'pano2vr-umpsa',
    title: 'Pano2VR UMPSA',
    description:
      'Panorama view of Universiti Malaysia Pahang Al-Sultan Abdullah.',
    image: new URL('@/assets/image-optimized/Projects/UMPSA.webp', import.meta.url).href,
    link: 'https://drive.google.com/drive/folders/1odfQe7sbWcj6A0K8KvWztX76LwDDycnn',
    category: 'VR',
    hasPage: true
  },
  {
    id: '6',
    slug: 'virtual-tour-of-pekan',
    title: 'Virtual Tour Of pekan',
    description:
      'Website showing interesting locations at Pekan Pahang with 360° view.',
    image: new URL('@/assets/image-optimized/Projects/VirtualTour.webp', import.meta.url).href,
    link: 'https://virtualtourofpekan.netlify.app/',
    category: 'Website',
    hasPage: false
  },
  {
    id: '7',
    slug: 'fk-park-management-system',
    title: 'FK Park Management System',
    description:
      'Parking system website for Faculty Computer — admin, staff, and student roles.',
    image: new URL('@/assets/image-optimized/Projects/FKPark.webp', import.meta.url).href,
    link: 'https://drive.google.com/drive/folders/1vIBV2sBTFoYhrN-x3GKumZ8wHV3hU4VQ',
    category: 'Website',
    hasPage: true
  },
  {
    id: '8',
    slug: 'jc3',
    title: 'JC3',
    description: 'The Joint Committee on Climate Change (JC3).',
    image: new URL('@/assets/image-optimized/Projects/JC3.webp', import.meta.url).href,
    link: 'https://www.jc3malaysia.com/',
    category: 'Website',
    hasPage: false
  }
]
