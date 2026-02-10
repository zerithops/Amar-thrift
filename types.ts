
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

export interface Order {
  id?: string;
  orderId: string; // Human readable short ID (Token)
  fullName: string;
  email: string;
  phone: string;
  city: 'Dhaka' | 'Outside Dhaka';
  address: string;
  productName: string;
  price: number;
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
  images: string[]; // Changed to array of strings
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
