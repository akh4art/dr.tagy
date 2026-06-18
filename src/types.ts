export interface Product {
  id: string;
  name: string;
  englishName: string;
  description: string;
  detailDescription: string;
  ingredients: string;
  benefit: string;
  price: number;
  originalPrice: number;
  image: string; // Vite imported image URL
  size: string;
  activeSubst: string;
}

export interface Order {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  selectedOffer: 'bundle' | 'single';
  selectedProductId?: string;
  selectedProductName?: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  status: 'new' | 'confirmed' | 'cancelled' | 'pending';
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
  verified: boolean;
}
