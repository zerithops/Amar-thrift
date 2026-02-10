
import React from 'react';
import { Plus, Trash2, Edit2, Upload, X, Save, Loader2 } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Product, Category } from '../types';

const CATEGORIES: Category[] = ['T-Shirt', 'Hoodie', 'Jacket', 'Pants', 'Sweater', 'Accessories'];

const AdminProducts: React.FC = () => {
  const [view, setView] = React.useState<'list' | 'add'>('list');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);
  
  // Form State
  const [formData, setFormData] = React.useState({
    name: '',
    imagePreview: '', // For display only
    description: '',
    price: '',
    category: 'T-Shirt' as Category,
    stock: '1'
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const fetchProducts = async () => {
    const data = await firebaseService.getProducts();
    setProducts(data);
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await firebaseService.deleteProduct(id);
      fetchProducts();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      // Use URL.createObjectURL for preview instead of Base64
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imagePreview: previewUrl }));
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        // Upload to Supabase using robust service
        imageUrl = await firebaseService.uploadFile(imageFile);
      }

      await firebaseService.addProduct({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: imageUrl ? [imageUrl] : []
      });

      setLoading(false);
      setView('list');
      fetchProducts();
      
      // Reset form
      setFormData({ name: '', imagePreview: '', description: '', price: '', category: 'T-Shirt', stock: '1' });
      setImageFile(null);

    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading font-bold text-white">Inventory</h2>
          <p className="text-white/40 text-sm">Manage your product catalog.</p>
        </div>
        {view === 'list' ? (
          <button 
            onClick={() => setView('add')}
            className="flex items-center space-x-2 px-6 py-3 bg-[#e63946] hover:bg-[#d62839] text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20"
          >
            <Plus size={18} />
            <span>Add Item</span>
          </button>
        ) : (
          <button 
            onClick={() => setView('list')}
            className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all"
          >
            <X size={18} />
            <span>Cancel</span>
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {products.map(product => (
             <div key={product.id} className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden group">
               <div className="relative aspect-[4/5] overflow-hidden">
                 <img src={product.images && product.images.length > 0 ? product.images[0] : ''} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(product.id!)} className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                 </div>
               </div>
               <div className="p-4">
                 <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#e63946]">{product.category}</p>
                        <h3 className="text-white font-bold truncate pr-2">{product.name}</h3>
                    </div>
                    <p className="text-white font-mono text-sm">৳{product.price}</p>
                 </div>
                 <p className="text-white/40 text-xs line-clamp-2">{product.description}</p>
               </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-[#141414] border border-white/5 p-8 rounded-2xl">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Product Image</label>
                 <div className="w-full aspect-video bg-black/40 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#e63946]/50 transition-colors">
                    {formData.imagePreview ? (
                        <img src={formData.imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                        <div className="text-center">
                            <Upload className="mx-auto text-white/30 mb-2" />
                            <p className="text-xs text-white/30">Click to upload</p>
                        </div>
                    )}
                    <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#e63946] outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#e63946] outline-none">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Price (৳)</label>
                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#e63946] outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Stock</label>
                    <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#e63946] outline-none" />
                 </div>
              </div>

              <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Description</label>
                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#e63946] outline-none resize-none" />
              </div>

              <button disabled={loading} type="submit" className="w-full bg-[#e63946] hover:bg-[#d62839] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center space-x-2">
                 {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> <span>Save Product</span></>}
              </button>
           </form>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
