
import { supabase } from '../lib/supabaseClient';
import { Order, OrderStatus, PaymentStatus, Product, Review } from '../types';

export const firebaseService = {
  // --- HELPERS ---
  
  toTimestamp(isoString: string): number {
    return new Date(isoString).getTime();
  },

  // --- STORAGE (Product Images) ---
  async uploadFile(file: File): Promise<string> {
    try {
      // Preserve extension (e.g., .png, .jpg)
      const fileExt = file.name.split('.').pop() || 'png';
      // Sanitize filename to prevent issues with special characters
      const fileNameRaw = file.name.substring(0, file.name.lastIndexOf('.'));
      const sanitizedName = fileNameRaw.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50); // Limit length
      const fileName = `${Date.now()}-${sanitizedName}.${fileExt}`;
      
      // Path inside the bucket
      const filePath = `${fileName}`;

      // Upload to 'product-images' bucket
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Supabase Upload Error:', error);
      throw new Error(`Upload failed for ${file.name}: ${error.message || 'Unknown error'}`);
    }
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

    if (error) {
      console.error("Error creating order:", error);
      throw error;
    }

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

    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }

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
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.paymentStatus) dbUpdates.payment_status = updates.paymentStatus;
    if (updates.deliveryCharge) dbUpdates.delivery_charge = updates.deliveryCharge;
    if (updates.total) dbUpdates.total = updates.total;

    const { error } = await supabase.from('orders').update(dbUpdates).eq('id', id);
    if (error) console.error("Error updating order:", error);
  },

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      // Handle both array and potential nulls safely
      images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []), 
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

    if (error) {
      console.error("Error adding product:", error);
      throw error;
    }
    return data.id;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error("Error deleting product:", error);
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
    const { error } = await supabase.from('reviews').insert([{
      name: review.name,
      rating: review.rating,
      message: review.message
    }]);
    if (error) console.error("Error adding review:", error);
  },

  async deleteReview(id: string): Promise<void> {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) console.error("Error deleting review:", error);
  },

  // --- STATS ---
  async getStats() {
    try {
      const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: reviewCount } = await supabase.from('reviews').select('*', { count: 'exact', head: true });
      const { count: pendingCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', OrderStatus.PENDING);
      const { count: deliveredCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', OrderStatus.DELIVERED);

      return {
        totalOrders: orderCount || 0,
        totalProducts: productCount || 0,
        totalReviews: reviewCount || 0,
        pendingOrders: pendingCount || 0,
        deliveredOrders: deliveredCount || 0
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      return { totalOrders: 0, totalProducts: 0, totalReviews: 0, pendingOrders: 0, deliveredOrders: 0 };
    }
  }
};
