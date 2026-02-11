
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
  image: string;
  quantity: number;
  category: string;
}

export interface Order {
  id?: string;
  orderId: string; // Human readable short ID (Token)
  fullName: string;
  email: string;
  phone: string;
  city: 'Dhaka' | 'Outside Dhaka';
  address: string;
  items: CartItem[]; // Changed from single productName to array of items
  
  // Legacy fields
  productName?: string;
  price?: number;

  deliveryCharge: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: number;
}

export type Category = 'T-Shirt' | 'Hoodie' | 'Jacket' | 'Pants' | 'Sweater' | 'Accessories';

export interface Product {
  id?: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  category: Category;
  stock: number;
  createdAt: number;
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
