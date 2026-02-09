
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'T001',
    name: 'Vintage Oversized Blazer',
    price: 4500,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A classic wool blend blazer with a modern oversized fit. Perfect for layering.',
    category: 'Jacket',
    stock: 5,
    createdAt: Date.now()
  },
  {
    id: 'T002',
    name: 'Retro Denim Jacket',
    price: 3200,
    images: [
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516257984-b1b4d8c9230c?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Authentic 90s wash denim, perfectly worn in with a heavy feel.',
    category: 'Jacket',
    stock: 3,
    createdAt: Date.now()
  },
  {
    id: 'T003',
    name: 'Silk Evening Shirt',
    price: 2800,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603252109303-2751440eeade?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Smooth minimal silk shirt in deep charcoal. Elegant and breathable.',
    category: 'T-Shirt',
    stock: 2,
    createdAt: Date.now()
  },
  {
    id: 'T004',
    name: 'Wide Leg Cargo Pants',
    price: 2400,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517445312582-541806bc220d?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Utility meets style with these premium heavyweight cotton cargos.',
    category: 'Pants',
    stock: 8,
    createdAt: Date.now()
  },
  {
    id: 'T005',
    name: 'Corduroy Trench Coat',
    price: 6500,
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Rare find. Heavy corduroy with a dramatic silhouette and deep pockets.',
    category: 'Jacket',
    stock: 1,
    createdAt: Date.now()
  },
  {
    id: 'T006',
    name: 'Hand-Knit Wool Sweater',
    price: 3500,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Cozy, authentic wool sweater in a neutral palette. Handcrafted quality.',
    category: 'Sweater',
    stock: 4,
    createdAt: Date.now()
  }
];

export const ADMIN_CREDENTIALS = {
  username: 'Admin1',
  password: 'Akhgulabi69'
};
