
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Category } from '../types';

const CATEGORIES: Category[] = ['T-Shirt', 'Hoodie', 'Jacket', 'Pants', 'Sweater', 'Accessories'];

const AddEditProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  
  // Data State
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    price: '',
    category: 'T-Shirt' as Category,
    stock: '1'
  });

  // File Management State
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);

  // Cleanup object URLs to avoid memory leaks
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

    // Convert FileList to array
    const fileArray = Array.from(files);
    
    // Validations
    if (selectedFiles.length + fileArray.length > 6) {
      alert('Maximum 6 images allowed per product.');
      if (e.target) e.target.value = ''; 
      return;
    }

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of fileArray) {
       // Size check (5MB)
       if (file.size > 5 * 1024 * 1024) {
         alert(`File "${file.name}" is too large (Max 5MB). Skipped.`);
         continue;
       }
       newFiles.push(file);
       newPreviews.push(URL.createObjectURL(file));
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
    
    // Reset input so same file can be selected again if needed
    if (e.target) e.target.value = '';
  };

  const removeImage = (index: number) => {
    // Revoke the URL object
    URL.revokeObjectURL(previews[index]);
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert('Please upload at least one image for the product.');
      return;
    }

    setLoading(true);

    try {
      const imageUrls: string[] = [];

      // 1. Upload Loop
      for (const file of selectedFiles) {
        try {
           const url = await firebaseService.uploadFile(file);
           imageUrls.push(url);
        } catch (uploadError: any) {
           console.error(uploadError);
           alert(`Failed to upload image "${file.name}". Please check your internet connection and try again.`);
           setLoading(false);
           return; // Stop the entire process if one image fails to ensure data integrity
        }
      }

      // 2. Database Insert
      await firebaseService.addProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: imageUrls
      });

      // 3. Success
      navigate('/products');

    } catch (err) {
      alert('Failed to save product information to database.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24 space-y-8 bg-brand-gray min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-500 hover:text-brand-black transition-colors">
        <ArrowLeft size={20} />
        <span>Go Back</span>
      </button>

      <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-3xl shadow-soft overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-brand-black"><Save size={120}/></div>
        
        <div className="mb-10">
          <h1 className="text-3xl font-heading font-bold text-brand-black">Add New Item</h1>
          <p className="text-gray-500">Curate a new piece for your collection.</p>
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
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Product Images ({selectedFiles.length}/6)</label>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {previews.map((previewUrl, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 bg-gray-50">
                    <img src={previewUrl} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                {selectedFiles.length < 6 && (
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
              <p className="text-[10px] text-gray-400 pt-1">* Images upload when you click "List Product"</p>
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
                        <span>UPLOADING & SAVING...</span>
                    </>
                ) : (
                    <>
                        <Save size={20}/> 
                        <span>LIST PRODUCT</span>
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
