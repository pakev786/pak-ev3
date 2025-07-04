export interface Post {
  id: string
  title: string
  description: string
  price: string
  category: 'ev-parts' | 'ev-kits' | 'triride' | 'ev-batteries' | 'solar-batteries' | 'solar-parts'
  imageUrl: string
  createdAt: string
  updatedAt: string
  featured?: boolean;
  pinned?: boolean;
  highlight?: boolean;
}

export default Post
