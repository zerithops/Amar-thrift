
import { supabase } from '../lib/supabaseClient';
import { Order, OrderStatus, PaymentStatus, Product, Review, ActivityLog, CartItem } from '../types';

export const firebaseService = {
  // --- HELPERS ---
  
  toTimestamp(isoString: string): number {
    return new Date(isoString).getTime();
  },

  async checkAdmin(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    return profile?.role === 'admin';
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

  // --- STORAGE ---
  async uploadFile(file: File): Promise<string> {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw new Error("You appear to be offline. Please check your internet connection.");
    }

    const RETRY_LIMIT = 3;
    let attempt = 0;
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanName = file.name.substring(0, file.name.lastIndexOf('.')).replace(/[^a-zA-Z0-9]/g, ''); 
    const fileName = `${Date.now()}_${cleanName}.${fileExt}`;

    while (attempt < RETRY_LIMIT) {
      try {
        attempt++;
        const { error } = await supabase.storage.from('product-images').upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
        return publicUrl;
      } catch (error: any) {
        if (attempt >= RETRY_LIMIT) throw new Error(error.message || "Unknown error from Supabase storage.");
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    throw new Error("Unexpected upload failure");
  },

  // Extract file path from public URL
  getFilePathFromUrl(url: string): string | null {
    try {
      // Splits at the bucket name to get the path relative to bucket root
      const parts = url.split('/product-images/');
      if (parts.length < 2) return null;
      return parts[1];
    } catch (e) {
      return null;
    }
  },

  async deleteProductImage(productId: string, imageUrl: string): Promise<void> {
    // 1. Verify Admin Role
    const isAdmin = await this.checkAdmin();
    if (!isAdmin) {
      throw new Error("Unauthorized: Only admins can delete images.");
    }

    // 2. Delete file from Storage
    const filePath = this.getFilePathFromUrl(imageUrl);
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove([filePath]);
      
      if (storageError) {
        console.error("Storage delete error:", storageError);
        throw new Error("Failed to delete image file from storage.");
      }
    } else {
        console.warn("Could not extract file path, skipping storage delete", imageUrl);
    }

    // 3. Update Database (Remove URL from array)
    // First fetch current product to ensure we have latest array
    const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('images')
        .eq('id', productId)
        .single();
    
    if (fetchError || !product) throw new Error("Product not found");

    const updatedImages = product.images.filter((img: string) => img !== imageUrl);

    const { error: dbError } = await supabase
      .from('products')
      .update({ images: updatedImages })
      .eq('id', productId);

    if (dbError) throw new Error("Failed to update product record.");

    await this.logActivity('DELETE_IMAGE', `Deleted image from product ${productId}`);
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
        items: orderData.items, 
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

    if (error) return [];

    return data.map((o: any) => ({
      id: o.id,
      orderId: o.order_id,
      fullName: o.full_name,
      email: o.email,
      phone: o.phone,
      city: o.city,
      address: o.address,
      items: o.items || [], 
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
      items: data.items || [],
      productName: data.product_name || (data.items ? `${data.items.length} items` : 'Unknown'),
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
      const details = Object.keys(updates).map(key => `${key}: ${updates[key as keyof Order]}`).join(', ');
      await this.logActivity('UPDATE_ORDER', `Updated Order ${id} - ${details}`);
    }
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
      images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []), 
      description: p.description,
      category: p.category,
      stock: p.stock,
      createdAt: this.toTimestamp(p.created_at)
    }));
  },

  async getProductsPaginated(page: number, limit: number): Promise<Product[]> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) return [];

    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []), 
      description: p.description,
      category: p.category,
      stock: p.stock,
      createdAt: this.toTimestamp(p.created_at)
    }));
  },

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      price: data.price,
      images: Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []),
      description: data.description,
      category: data.category,
      stock: data.stock,
      createdAt: this.toTimestamp(data.created_at)
    };
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
    await this.logActivity('ADD_PRODUCT', `Added new product: ${product.name}`);
    return data.id;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        stock: product.stock,
        images: product.images
      })
      .eq('id', id);

    if (error) throw error;
    await this.logActivity('UPDATE_PRODUCT', `Updated product: ${product.name}`);
  },

  async deleteProduct(id: string): Promise<void> {
    // 1. Fetch images to delete them from storage first
    const product = await this.getProduct(id);
    if (product && product.images) {
        for (const url of product.images) {
            try {
                // Determine file path
                const path = this.getFilePathFromUrl(url);
                if (path) {
                    await supabase.storage.from('product-images').remove([path]);
                }
            } catch (e) {
                console.warn(`Failed to delete image ${url} during product deletion`);
            }
        }
    }

    // 2. Delete row
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) await this.logActivity('DELETE_PRODUCT', `Deleted product ID: ${id}`);
  },

  // --- REVIEWS ---
  async getReviews(): Promise<Review[]> {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
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
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) await this.logActivity('DELETE_REVIEW', `Deleted review ID: ${id}`);
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
      return { totalOrders: 0, totalProducts: 0, totalReviews: 0, pendingOrders: 0, deliveredOrders: 0 };
    }
  }
};
