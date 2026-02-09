
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white">Inventory</h1>
          <p className="text-white/40 mt-1">Manage your storefront items.</p>
        </div>
        <Link to="/_secure-admin-9xA7/add-product" className="flex items-center space-x-2 px-8 py-4 bg-brand text-white rounded-xl font-bold transition-all glow-hover">
          <Plus size={20} />
          <span>ADD PRODUCT</span>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
        <input
          type="text"
          placeholder="Search products or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dark-card border border-white/5 rounded-2xl px-12 py-5 text-white focus:outline-none focus:border-brand transition-all"
        />
      </div>

      {loading ? (
        <div className="text-center py-24 text-white/30">Loading inventory...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-dark-card rounded-3xl border border-dashed border-white/10">
          <Package size={48} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/40">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p, idx) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-dark-card border border-white/5 rounded-2xl p-4 flex items-center space-x-6 hover:border-white/10 transition-all group">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-dark">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-grow overflow-hidden">
                <p className="text-brand text-[10px] font-bold uppercase tracking-widest">{p.category}</p>
                <h3 className="text-lg font-bold text-white truncate">{p.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-white font-heading font-bold">৳ {p.price.toLocaleString()}</p>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleDelete(p.id!)} className="p-2 text-white/20 hover:text-brand transition-colors"><Trash2 size={16}/></button>
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
