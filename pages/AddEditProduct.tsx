
// @ts-nocheck
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Upload, X, Trash2, Percent, Truck } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Category } from '../types';

const CATEGORIES: Category[] = ['T-Shirt', 'Shirt', 'Hoodie', 'Jacket', 'Pants', 'Sweater', 'Accessories'];
const DISCOUNTS = [0, 10, 15, 20, 30, 40, 50];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const AddEditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(isEditMode);
  
  // Data State
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    price: '',
    category: 'T-Shirt' as Category,
    stock: '1',
    discountPercentage: 0,
    isFreeDelivery: false
  });

  // Existing images (URLs)
  const [existingImages, setExistingImages] = React.useState<string[]>([]);
  
  // New files to upload
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);

  // Fetch product if Edit Mode
  React.useEffect(() => {
    if (isEditMode && id) {
      firebaseService.getProduct(id)
        .then(product => {
          if (product) {
            setFormData({
              name: product.name,
              description: product.description,
              price: product.price.toString(),
              category: product.category,
              stock: product.stock.toString(),
              discountPercentage: product.discountPercentage || 0,
              isFreeDelivery: product.isFreeDelivery || false
            });
            setExistingImages(product.images || []);
          }
        })
        .finally(() => setInitialLoading(false));
    }
  }, [id, isEditMode]);

  // Cleanup object URLs
  React.useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files) as File[];
    const totalCurrentImages = existingImages.length + selectedFiles.length;
    
    if (totalCurrentImages + fileArray.length > 6) {
      alert('Maximum 6 images allowed per product.');
      if (e.target) e.target.value = ''; 
      return;
    }

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of fileArray) {
       if (file.size > MAX_FILE_SIZE) {
         alert(`File "${file.name}" is too large. Max allowed size is 5MB.`);
         continue;
       }
       newFiles.push(file);
       newPreviews.push(URL.createObjectURL(file));
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
    if (e.target) e.target.value = '';
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageUrl: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to permanently delete this image?")) return;
    
    try {
      setLoading(true);
      await firebaseService.deleteProductImage(id, imageUrl);
      setExistingImages(prev => prev.filter(img => img !== imageUrl));
    } catch (error: any) {
      console.error(error);
      alert(`Failed to delete image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (existingImages.length === 0 && selectedFiles.length === 0) {
      alert('Please have at least one image for the product.');
      return;
    }

    setLoading(true);

    const newImageUrls: string[] = [];
    const errors: string[] = [];

    for (const file of selectedFiles) {
      try {
          const url = await firebaseService.uploadFile(file);
          newImageUrls.push(url);
      } catch (uploadError: any) {
          errors.push(`"${file.name}": ${uploadError.message || 'Unknown error'}`);
      }
    }

    if (errors.length > 0) {
      setLoading(false);
      const errorMsg = `Some images failed to upload:\n\n${errors.join('\n')}\n\nPlease try again.`;
      alert(errorMsg);
      return; 
    }

    const finalImages = [...existingImages, ...newImageUrls];

    try {
      const productPayload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: finalImages,
        discountPercentage: parseInt(formData.discountPercentage)
      };

      if (isEditMode && id) {
        await firebaseService.updateProduct(id, productPayload);
      } else {
        await firebaseService.addProduct(productPayload);
      }
      navigate('/products');
    } catch (err: any) {
      alert(`Database Error: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg">
            <Loader2 className="animate-spin text-brand-primary" size={40} />
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24 space-y-8 bg-brand-bg min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-brand-secondary hover:text-brand-primary transition-colors">
        <ArrowLeft size={20} />
        <span>Go Back</span>
      </button>

      <div className="bg-white border border-brand-border p-8 md:p-12 rounded-3xl shadow-soft overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-brand-primary"><Save size={120}/></div>
        
        <div className="mb-10">
          <h1 className="text-3xl font-heading font-bold text-brand-primary">{isEditMode ? 'Edit Product' : 'Add New Item'}</h1>
          <p className="text-brand-secondary">{isEditMode ? 'Update product details and manage images.' : 'Curate a new piece for your collection.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary px-1">Product Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Classic Trench Coat" className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:border-brand-accent outline-none transition-all placeholder:text-gray-400"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary px-1">Price (BDT ৳)</label>
                <input required type="number" name="price" value={formData.price} onChange={handleChange} placeholder="1299" className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:border-brand-accent outline-none transition-all placeholder:text-gray-400"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary px-1">Stock</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:border-brand-accent outline-none transition-all placeholder:text-gray-400"/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary px-1 flex items-center gap-1"><Percent size={12}/> Discount</label>
                <select name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:border-brand-accent outline-none transition-all appearance-none">
                  {DISCOUNTS.map(d => <option key={d} value={d}>{d === 0 ? 'No Discount' : `${d}% Off`}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary px-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:border-brand-accent outline-none transition-all appearance-none">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-brand-bg border border-brand-border rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-brand-accent shadow-sm">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-primary">Free Delivery</p>
                  <p className="text-[10px] text-brand-secondary uppercase tracking-wider">Set for this product</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isFreeDelivery" checked={formData.isFreeDelivery} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary px-1">
                Product Images ({existingImages.length + selectedFiles.length}/6)
              </label>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {existingImages.map((url, idx) => (
                  <div key={`exist-${idx}`} className="relative aspect-square rounded-xl overflow-hidden group border border-brand-border bg-gray-50">
                    <img src={url} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => handleDeleteExistingImage(url)}
                      disabled={loading}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Saved
                    </div>
                  </div>
                ))}

                {previews.map((previewUrl, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden group border border-brand-border bg-gray-50">
                    <img src={previewUrl} alt={`New ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      disabled={loading}
                      className="absolute top-2 right-2 bg-white text-gray-600 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500/80 text-white text-[10px] text-center py-1">
                        New
                    </div>
                  </div>
                ))}

                {(existingImages.length + selectedFiles.length) < 6 && (
                  <div className={`relative aspect-square bg-brand-bg border-2 border-dashed border-brand-border rounded-xl transition-colors flex flex-col items-center justify-center cursor-pointer group ${loading ? 'opacity-50 pointer-events-none' : 'hover:border-brand-accent'}`}>
                    <input 
                      type="file" 
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={loading}
                    />
                    <div className="p-3 bg-white rounded-full mb-2 group-hover:scale-110 transition-transform shadow-sm border border-brand-border">
                       <Upload size={20} className="text-brand-secondary group-hover:text-brand-accent" />
                    </div>
                    <p className="text-xs text-brand-secondary font-medium font-sans">Add Images</p>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-brand-muted pt-1">* Max size 5MB per image.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-secondary px-1">Description</label>
              <textarea required rows={4} name="description" value={formData.description} onChange={handleChange} placeholder="Premium silk blend..." className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:border-brand-accent outline-none transition-all resize-none placeholder:text-gray-400"/>
            </div>

            <div className="pt-4">
              <button disabled={loading} type="submit" className="w-full bg-brand-primary hover:opacity-90 text-white font-bold py-5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" /> 
                        <span>{isEditMode ? 'Saving...' : 'Uploading...'}</span>
                    </>
                ) : (
                    <>
                        <Save size={20}/> 
                        <span>{isEditMode ? 'Update Product' : 'List Product'}</span>
                    </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProduct;
