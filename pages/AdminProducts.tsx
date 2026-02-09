
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Package, Search } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Product } from '../types';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    const data = await firebaseService.getProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      await firebaseService.deleteProduct(id);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-brand-gray min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold text-brand-black">Inventory</h1>
          <p className="text-gray-500 mt-1">Manage your storefront items.</p>
        </div>
        <Link to="/add-product" className="flex items-center space-x-2 px-8 py-4 bg-brand-black text-white rounded-xl font-bold transition-all shadow-lg hover:bg-brand-blue hover:shadow-xl">
          <Plus size={20} />
          <span>ADD PRODUCT</span>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search products or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-2xl px-12 py-5 text-brand-black focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all shadow-soft"
        />
      </div>

      {loading ? (
        <div className="text-center py-24 text-gray-400">Loading inventory...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-soft">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p, idx) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center space-x-6 shadow-soft hover:shadow-hover transition-all group">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-grow overflow-hidden">
                <p className="text-brand-blue text-[10px] font-bold uppercase tracking-widest">{p.category}</p>
                <h3 className="text-lg font-bold text-brand-black truncate">{p.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-brand-black font-heading font-bold">৳ {p.price.toLocaleString()}</p>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleDelete(p.id!)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
