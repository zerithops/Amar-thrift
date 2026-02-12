
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Upload, X, Trash2 } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Category } from '../types';

const CATEGORIES: Category[] = ['T-Shirt', 'Shirt', 'Hoodie', 'Jacket', 'Pants', 'Sweater', 'Accessories'];
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
    stock: '1'
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
              stock: product.stock.toString()
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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

  // Securely delete existing image using the service
  const handleDeleteExistingImage = async (imageUrl: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to permanently delete this image?")) return;
    
    try {
      setLoading(true);
      await firebaseService.deleteProductImage(id, imageUrl);
      // Update local state to reflect change immediately
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

    // 1. Upload Loop
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

    // 2. Database Action
    try {
      if (isEditMode && id) {
        await firebaseService.updateProduct(id, {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: finalImages
        });
      } else {
        await firebaseService.addProduct({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: finalImages
        });
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
        <div className="min-h-screen flex items-center justify-center bg-brand-gray">
            <Loader2 className="animate-spin text-brand-black" size={40} />
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24 space-y-8 bg-brand-gray min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-500 hover:text-brand-black transition-colors">
        <ArrowLeft size={20} />
        <span>Go Back</span>
      </button>

      <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-3xl shadow-soft overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-brand-black"><Save size={120}/></div>
        
        <div className="mb-10">
          <h1 className="text-3xl font-heading font-bold text-brand-black">{isEditMode ? 'Edit Product' : 'Add New Item'}</h1>
          <p className="text-gray-500">{isEditMode ? 'Update product details and manage images.' : 'Curate a new piece for your collection.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Product Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Classic Trench Coat" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-brand-black focus:border-brand-blue outline-none transition-all"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Price (BDT ৳)</label>
                <input required type="number" name="price" value={formData.price} onChange={handleChange} placeholder="1299" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-brand-black focus:border-brand-blue outline-none transition-all"/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Stock</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-brand-black focus:border-brand-blue outline-none transition-all"/>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-brand-black focus:border-brand-blue outline-none transition-all">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">
                Product Images ({existingImages.length + selectedFiles.length}/6)
              </label>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Existing Images from DB */}
                {existingImages.map((url, idx) => (
                  <div key={`exist-${idx}`} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 bg-gray-50">
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

                {/* New Previews */}
                {previews.map((previewUrl, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 bg-gray-50">
                    <img src={previewUrl} alt={`New ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      disabled={loading}
                      className="absolute top-2 right-2 bg-white text-gray-500 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500/80 text-white text-[10px] text-center py-1">
                        New
                    </div>
                  </div>
                ))}

                {/* Upload Button */}
                {(existingImages.length + selectedFiles.length) < 6 && (
                  <div className={`relative aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl transition-colors flex flex-col items-center justify-center cursor-pointer group ${loading ? 'opacity-50 pointer-events-none' : 'hover:border-brand-blue/50'}`}>
                    <input 
                      type="file" 
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={loading}
                    />
                    <div className="p-3 bg-white rounded-full mb-2 group-hover:scale-110 transition-transform shadow-sm">
                       <Upload size={20} className="text-gray-400 group-hover:text-brand-blue" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Add Images</p>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-gray-400 pt-1">* Max size 5MB per image.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Description</label>
              <textarea required rows={4} name="description" value={formData.description} onChange={handleChange} placeholder="Premium silk blend..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-brand-black focus:border-brand-blue outline-none transition-all resize-none"/>
            </div>

            <div className="pt-4">
              <button disabled={loading} type="submit" className="w-full bg-brand-black hover:bg-brand-blue text-white font-bold py-5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" /> 
                        <span>{isEditMode ? 'SAVING...' : 'UPLOADING...'}</span>
                    </>
                ) : (
                    <>
                        <Save size={20}/> 
                        <span>{isEditMode ? 'UPDATE PRODUCT' : 'LIST PRODUCT'}</span>
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
