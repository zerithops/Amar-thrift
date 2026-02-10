
import { supabase } from '../lib/supabaseClient';
import { Order, OrderStatus, PaymentStatus, Product, Review, ActivityLog } from '../types';

export const firebaseService = {
  // --- HELPERS ---
  
  toTimestamp(isoString: string): number {
    return new Date(isoString).getTime();
  },

  // --- LOGGING ---
  async logActivity(action: string, details: string): Promise<void> {
    try {
      await supabase.from('activity_logs').insert([{
        action,
        details,
        created_at: new Date().toISOString()
      }]);
    } catch (error) {
      // Fail silently to not disrupt main flow, just warn
      console.warn("Failed to write to activity_logs:", error);
    }
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.warn("Error fetching logs:", error);
      return [];
    }

    return data.map((log: any) => ({
      id: log.id,
      action: log.action,
      details: log.details,
      createdAt: this.toTimestamp(log.created_at)
    }));
  },

  // --- STORAGE (Product Images) ---
  async uploadFile(file: File): Promise<string> {
    // 0. Explicit Network Check
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw new Error("You appear to be offline. Please check your internet connection.");
    }

    const RETRY_LIMIT = 3;
    let attempt = 0;

    // 1. Sanitize Filename (Strict: Alphanumeric only)
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
    // Remove ALL spaces and special characters, keep only letters and numbers
    const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, ''); 
    // Format: Timestamp_CleanName.ext
    const fileName = `${Date.now()}_${cleanName}.${fileExt}`;
    const filePath = fileName;

    // 2. Retry Loop
    while (attempt < RETRY_LIMIT) {
      try {
        attempt++;
        
        // Upload
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          // Log FULL Supabase error object for debugging
          console.error(`Supabase Upload Error (Attempt ${attempt}/${RETRY_LIMIT}):`, {
            message: error.message,
            name: error.name,
            details: error
          });
          throw error; // Throw to catch block for retry logic
        }

        // Get URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        return publicUrl;

      } catch (error: any) {
        // If max retries reached, throw the REAL error message
        if (attempt >= RETRY_LIMIT) {
          console.error("Final Upload Failure:", error);
          throw new Error(error.message || "Unknown error from Supabase storage.");
        }
        
        // Wait before retry (1s, 2s, 3s...)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    throw new Error("Unexpected upload failure");
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
    else {
      // Log details
      const details = Object.keys(updates)
        .map(key => `${key}: ${updates[key as keyof Order]}`)
        .join(', ');
      await this.logActivity('UPDATE_ORDER', `Updated Order ${id} - ${details}`);
    }
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

    await this.logActivity('ADD_PRODUCT', `Added new product: ${product.name}`);
    return data.id;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error("Error deleting product:", error);
    else await this.logActivity('DELETE_PRODUCT', `Deleted product ID: ${id}`);
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
    else await this.logActivity('DELETE_REVIEW', `Deleted review ID: ${id}`);
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
