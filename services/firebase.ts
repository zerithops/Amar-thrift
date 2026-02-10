
import { Order, OrderStatus, PaymentStatus, Product, Review } from '../types';
import { PRODUCTS } from '../constants';

const ORDERS_KEY = 'amar_thrift_orders';
const PRODUCTS_KEY = 'amar_thrift_products';
const REVIEWS_KEY = 'amar_thrift_reviews';

// Helper to initialize products if empty or migrate old data
const initProducts = () => {
  const existing = localStorage.getItem(PRODUCTS_KEY);
  if (!existing) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(PRODUCTS));
  } else {
    // Migration logic: if products have 'image' string, convert to 'images' array
    const parsed = JSON.parse(existing);
    if (parsed.length > 0 && !parsed[0].images) {
        const migrated = parsed.map((p: any) => ({
            ...p,
            images: p.images || (p.image ? [p.image] : [])
        }));
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(migrated));
    }
  }
};

initProducts();

export const firebaseService = {
  // --- ORDERS ---
  async addOrder(orderData: Omit<Order, 'id' | 'status' | 'paymentStatus' | 'createdAt' | 'orderId'>): Promise<Order> {
    const orderId = Math.random().toString(36).substr(2, 6).toUpperCase(); // Generate 6-char ID
    
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substr(2, 9),
      orderId: orderId,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      createdAt: Date.now()
    };
    
    const orders = await this.getOrders();
    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return newOrder;
  },

  async getOrders(): Promise<Order[]> {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data).sort((a: any, b: any) => b.createdAt - a.createdAt) : [];
  },

  async getOrderForTracking(orderId: string, phone: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find(o => o.orderId === orderId.toUpperCase() && o.phone === phone) || null;
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<void> {
    const orders = await this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  },

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data).sort((a: any, b: any) => b.createdAt - a.createdAt) : [];
  },

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    const products = await this.getProducts();
    products.push(newProduct);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return newProduct.id!;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  },

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  },

  // --- REVIEWS ---
  async getReviews(): Promise<Review[]> {
    const data = localStorage.getItem(REVIEWS_KEY);
    return data ? JSON.parse(data).sort((a: any, b: any) => b.createdAt - a.createdAt) : [];
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<void> {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    const reviews = await this.getReviews();
    reviews.push(newReview);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  },

  async deleteReview(id: string): Promise<void> {
    const reviews = await this.getReviews();
    const filtered = reviews.filter(r => r.id !== id);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(filtered));
  },

  // --- STATS ---
  async getStats() {
    const orders = await this.getOrders();
    const products = await this.getProducts();
    const reviews = await this.getReviews();
    return {
      totalOrders: orders.length,
      totalProducts: products.length,
      totalReviews: reviews.length,
      pendingOrders: orders.filter(o => o.status === OrderStatus.PENDING).length,
      deliveredOrders: orders.filter(o => o.status === OrderStatus.DELIVERED).length
    };
  }
};
