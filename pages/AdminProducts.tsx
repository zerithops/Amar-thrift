
import React from 'react';
import { Plus, Trash2, Edit2, Upload, X, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { firebaseService } from '../services/firebase';
import { Product, Category } from '../types';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const navigate = useNavigate();

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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading font-bold text-white">Inventory</h2>
          <p className="text-white/40 text-sm">Manage your product catalog.</p>
        </div>
        <button 
          onClick={() => navigate('/add-product')}
          className="flex items-center space-x-2 px-6 py-3 bg-[#e63946] hover:bg-[#d62839] text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20"
        >
          <Plus size={18} />
          <span>Add Item</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden group">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={product.images && product.images.length > 0 ? product.images[0] : ''} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => navigate(`/edit-product/${product.id}`)}
                    className="p-2 bg-white text-black rounded-full shadow-lg hover:bg-gray-200 transition-colors"
                   >
                     <Edit2 size={16} />
                   </button>
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
    </div>
  );
};

export default AdminProducts;
