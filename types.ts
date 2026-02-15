
export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  REFUNDED = 'Refunded'
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'admin' | 'staff';
  created_at: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  category: string;
  isFreeDelivery?: boolean;
}

export interface Order {
  id?: string;
  orderId: string; // Human readable short ID (Token)
  fullName: string;
  email: string;
  phone: string;
  district: string;
  upazila: string;
  address: string;
  items: CartItem[];
  
  // Legacy fields
  city?: string;
  productName?: string;
  price?: number;

  deliveryCharge: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: number;
}

export type Category = 'T-Shirt' | 'Shirt' | 'Hoodie' | 'Jacket' | 'Pants' | 'Sweater' | 'Accessories';

export interface Product {
  id?: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  category: Category;
  stock: number;
  createdAt: number;
  discountPercentage?: number;
  isFreeDelivery?: boolean;
}

export interface Review {
  id?: string;
  name: string;
  rating: number; // 1-5
  message: string;
  createdAt: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  createdAt: number;
}
