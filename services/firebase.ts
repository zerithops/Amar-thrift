import { supabase } from '../lib/supabaseClient';
import { Order, OrderStatus, PaymentStatus, Product, Review } from '../types';

export const firebaseService = {
  // --- HELPERS ---
  
  // Convert Supabase timestamp to number (for app compatibility)
  toTimestamp(isoString: string): number {
    return new Date(isoString).getTime();
  },

  // --- STORAGE ---
  async uploadFile(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  },

  // --- ORDERS ---
  async addOrder(orderData: Omit<Order, 'id' | 'status' | 'paymentStatus' | 'createdAt' | 'orderId'>): Promise<Order> {
    const orderId = Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        order_id: orderId,
        full_name: orderData.fullName,
        email: orderData.email,
        phone: orderData.phone,
        city: orderData.city,
        address: orderData.address,
        product_name: orderData.productName,
        price: orderData.price,
        delivery_charge: orderData.deliveryCharge,
        total: orderData.total,
        status: OrderStatus.PENDING,
        payment_status: PaymentStatus.PENDING
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      ...orderData,
      id: data.id,
      orderId: data.order_id,
      status: data.status as OrderStatus,
      paymentStatus: data.payment_status as PaymentStatus,
      createdAt: this.toTimestamp(data.created_at)
    };
  },

  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];

    return data.map((o: any) => ({
      id: o.id,
      orderId: o.order_id,
      fullName: o.full_name,
      email: o.email,
      phone: o.phone,
      city: o.city,
      address: o.address,
      productName: o.product_name,
      price: o.price,
      deliveryCharge: o.delivery_charge,
      total: o.total,
      status: o.status as OrderStatus,
      paymentStatus: o.payment_status as PaymentStatus,
      createdAt: this.toTimestamp(o.created_at)
    }));
  },

  async getOrderForTracking(orderId: string, phone: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId.toUpperCase())
      .eq('phone', phone)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      orderId: data.order_id,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      address: data.address,
      productName: data.product_name,
      price: data.price,
      deliveryCharge: data.delivery_charge,
      total: data.total,
      status: data.status as OrderStatus,
      paymentStatus: data.payment_status as PaymentStatus,
      createdAt: this.toTimestamp(data.created_at)
    };
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<void> {
    // Map camelCase updates to snake_case db columns
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.paymentStatus) dbUpdates.payment_status = updates.paymentStatus;
    if (updates.deliveryCharge) dbUpdates.delivery_charge = updates.deliveryCharge;
    if (updates.total) dbUpdates.total = updates.total;

    await supabase.from('orders').update(dbUpdates).eq('id', id);
  },

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];

    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      images: p.images || [],
      description: p.description,
      category: p.category,
      stock: p.stock,
      createdAt: this.toTimestamp(p.created_at)
    }));
  },

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        stock: product.stock,
        images: product.images
      }])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.price) dbUpdates.price = updates.price;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.stock) dbUpdates.stock = updates.stock;
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.images) dbUpdates.images = updates.images;

    await supabase.from('products').update(dbUpdates).eq('id', id);
  },

  async deleteProduct(id: string): Promise<void> {
    await supabase.from('products').delete().eq('id', id);
  },

  // --- REVIEWS ---
  async getReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];

    return data.map((r: any) => ({
      id: r.id,
      name: r.name,
      rating: r.rating,
      message: r.message,
      createdAt: this.toTimestamp(r.created_at)
    }));
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<void> {
    await supabase.from('reviews').insert([{
      name: review.name,
      rating: review.rating,
      message: review.message
    }]);
  },

  async deleteReview(id: string): Promise<void> {
    await supabase.from('reviews').delete().eq('id', id);
  },

  // --- STATS ---
  async getStats() {
    const [ordersRes, productsRes, reviewsRes] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true })
    ]);

    const { count: pendingCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', OrderStatus.PENDING);
    const { count: deliveredCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', OrderStatus.DELIVERED);

    return {
      totalOrders: ordersRes.count || 0,
      totalProducts: productsRes.count || 0,
      totalReviews: reviewsRes.count || 0,
      pendingOrders: pendingCount || 0,
      deliveredOrders: deliveredCount || 0
    };
  }
};
