
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Category } from '../types';

const CATEGORIES: Category[] = ['T-Shirt', 'Hoodie', 'Jacket', 'Pants', 'Sweater', 'Accessories'];

const AddEditProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    image: '',
    description: '',
    price: '',
    category: 'T-Shirt' as Category,
    stock: '1'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!formData.image) {
      alert('Please upload an image for the product.');
      setLoading(false);
      return;
    }

    try {
      await firebaseService.addProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
      navigate('/products');
    } catch (err) {
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit check
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24 space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-white/40 hover:text-white transition-colors">
        <ArrowLeft size={20} />
        <span>Go Back</span>
      </button>

      <div className="bg-dark-card border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Save size={120}/></div>
        
        <div className="mb-10">
          <h1 className="text-3xl font-heading font-bold text-white">Add New Item</h1>
          <p className="text-white/40">Curate a new piece for your collection.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Product Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Classic Trench Coat" className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand outline-none transition-all"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Price (BDT ৳)</label>
                <input required type="number" name="price" value={formData.price} onChange={handleChange} placeholder="1299" className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand outline-none transition-all"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Stock</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand outline-none transition-all"/>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand outline-none transition-all">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Product Image</label>
              
              {!formData.image ? (
                <div className="relative w-full aspect-square md:aspect-[4/3] bg-dark border-2 border-dashed border-white/10 rounded-xl hover:border-brand/50 transition-colors flex flex-col items-center justify-center cursor-pointer group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={24} className="text-white/70" />
                  </div>
                  <p className="text-sm text-white/70 font-medium">Click to upload image</p>
                  <p className="text-xs text-white/30 mt-2">JPG, PNG up to 5MB</p>
                </div>
              ) : (
                <div className="relative w-full aspect-square md:aspect-[4/3] rounded-xl overflow-hidden group">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={clearImage}
                      className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-full transition-all backdrop-blur-sm"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 px-1">Description</label>
              <textarea required rows={4} name="description" value={formData.description} onChange={handleChange} placeholder="Premium silk blend..." className="w-full bg-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand outline-none transition-all resize-none"/>
            </div>

            <div className="pt-4">
              <button disabled={loading} type="submit" className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-5 rounded-xl transition-all glow-hover flex items-center justify-center space-x-2">
                {loading ? <Loader2 className="animate-spin"/> : <><Save size={20}/> <span>LIST PRODUCT</span></>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProduct;
