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
  isMainPromo?: boolean; // ہوم پیج کی سب سے بڑی پرومو پوسٹ
  promoSlot?: 1 | 2 | 3 | 4 | null; // ہوم پیج کے چار چھوٹے پرومو سلاٹس
}

export default Post
