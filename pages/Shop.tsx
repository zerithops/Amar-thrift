
// @ts-nocheck
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ShoppingBag, Filter, X, Loader2, ArrowRight, Truck } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Product } from '../types';

const ProductSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-white shadow-card border border-transparent">
    <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
    </div>
    <div className="p-4 space-y-3">
      <div className="h-3 bg-gray-100 rounded w-2/3" />
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="h-8 w-8 bg-gray-100 rounded-full" />
      </div>
    </div>
  </div>
);

const Shop: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const PRODUCTS_PER_PAGE = 26;
  const CATEGORIES = ['T-Shirt', 'Shirt', 'Hoodie', 'Jacket', 'Pants', 'Sweater', 'Accessories'];

  const getCategoryFromSlug = (slug?: string) => {
    if (!slug) return null;
    const map: Record<string, string> = {
      't-shirt': 'T-Shirt',
      'shirt': 'Shirt',
      'hoodie': 'Hoodie',
      'jacket': 'Jacket',
      'pants': 'Pants',
      'sweater': 'Sweater',
      'accessories': 'Accessories'
    };
    return map[slug.toLowerCase()] || slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  const fetchProducts = async (pageNum: number) => {
    try {
      let data: Product[] = [];
      const categoryFilter = getCategoryFromSlug(categoryId) || selectedCategory;

      if (categoryFilter) {
        if (pageNum === 1) {
            data = await firebaseService.getProductsByCategory(categoryFilter);
            setHasMore(false);
        }
      } else {
        data = await firebaseService.getProductsPaginated(pageNum, PRODUCTS_PER_PAGE);
        if (data.length < PRODUCTS_PER_PAGE) {
            setHasMore(false);
        }
      }

      if (pageNum === 1) {
        setProducts(data);
        setLoading(false);
      } else {
        setProducts(prev => [...prev, ...data]);
        setLoadingMore(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  React.useEffect(() => {
    setProducts([]);
    setLoading(true);
    setHasMore(true);
    setPage(1);
    
    const urlCat = getCategoryFromSlug(categoryId);
    if(urlCat) setSelectedCategory(urlCat);

    fetchProducts(1);
  }, [categoryId, selectedCategory]);

  const handleLoadMore = () => {
    if (selectedCategory || categoryId) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  const applyCategoryFilter = (cat: string | null) => {
    setSelectedCategory(cat);
    setIsFilterOpen(false);
    if (categoryId) navigate('/shop'); 
  };

  const formatPrice = (price: number) => `৳ ${Math.round(price).toLocaleString()}`;
  
  const getDiscountedPrice = (product: Product) => {
    if (!product.discountPercentage) return product.price;
    return product.price - (product.price * product.discountPercentage / 100);
  };

  return (
    <div className="bg-brand-bg min-h-screen pb-32">
      <div className="sticky top-16 md:top-20 z-30 bg-brand-bg/95 backdrop-blur-md py-4 border-b border-brand-border/60 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
                <h1 className="text-xl font-heading font-bold text-brand-primary tracking-tight">
                    {selectedCategory || (categoryId ? getCategoryFromSlug(categoryId) : "Collection")}
                </h1>
                <p className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider mt-0.5">
                    {loading ? '...' : `${products.length} Items`}
                </p>
            </div>
            
            <button 
                onClick={() => setIsFilterOpen(true)}
                className="group flex items-center space-x-2 px-5 py-2.5 bg-white border border-brand-border rounded-xl shadow-sm hover:border-brand-accent transition-all duration-300"
            >
                <Filter size={14} className="text-brand-primary group-hover:text-brand-accent transition-colors" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Filter</span>
                {(selectedCategory || categoryId) && <div className="w-1.5 h-1.5 bg-brand-accent rounded-full ml-1 animate-pulse"></div>}
            </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8 lg:gap-10">
            
            {loading && Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}

            {!loading && products.map((product, index) => (
                <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="group cursor-pointer flex flex-col"
                >
                    <div className="relative aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-soft group-hover:shadow-hover transition-all duration-500 mb-4 transform group-hover:-translate-y-1">
                        {product.images?.[0] ? (
                            <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">No Image</div>
                        )}
                        
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {product.discountPercentage > 0 && (
                            <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-lg">
                              -{product.discountPercentage}%
                            </div>
                          )}
                          {product.isFreeDelivery && (
                            <div className="bg-brand-primary/90 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-lg flex items-center gap-1">
                              <Truck size={10}/> Free Delivery
                            </div>
                          )}
                        </div>

                        {index < 2 && !selectedCategory && !categoryId && product.discountPercentage === 0 && (
                            <div className="absolute top-3 left-3 bg-brand-tag-bg/90 backdrop-blur text-brand-tag-text text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                                New
                            </div>
                        )}

                        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                             <div className="w-10 h-10 bg-white text-brand-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                <ShoppingBag size={18} strokeWidth={2} />
                             </div>
                        </div>
                    </div>

                    <div className="flex flex-col px-1">
                        <div className="flex justify-between items-start">
                             <div className="flex-1 pr-2">
                                <h3 className="text-sm md:text-base font-medium text-brand-primary leading-tight group-hover:text-brand-accent transition-colors line-clamp-2">
                                    {product.name}
                                </h3>
                                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1.5">{product.category}</p>
                             </div>
                             <div className="flex flex-col items-end">
                               {product.discountPercentage > 0 ? (
                                 <>
                                   <span className="text-sm md:text-base font-bold text-brand-primary whitespace-nowrap">
                                      {formatPrice(getDiscountedPrice(product))}
                                   </span>
                                   <span className="text-[10px] text-brand-muted line-through">
                                      {formatPrice(product.price)}
                                   </span>
                                 </>
                               ) : (
                                 <span className="text-sm md:text-base font-bold text-brand-primary whitespace-nowrap">
                                    {formatPrice(product.price)}
                                 </span>
                               )}
                             </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
        
        {!loading && products.length === 0 && (
            <div className="py-32 text-center">
                <ShoppingBag size={56} className="mx-auto text-gray-200 mb-6" strokeWidth={1}/>
                <h3 className="text-2xl font-heading font-bold text-brand-primary mb-2">No products found</h3>
                <p className="text-brand-secondary mb-8">Try adjusting your filters to find what you're looking for.</p>
                <button 
                    onClick={() => {setSelectedCategory(null); navigate('/shop');}} 
                    className="inline-flex items-center space-x-2 text-brand-accent font-bold uppercase tracking-widest border-b-2 border-transparent hover:border-brand-accent transition-all pb-1"
                >
                    <span>Clear All Filters</span>
                    <ArrowRight size={16} />
                </button>
            </div>
        )}

        {hasMore && !loading && !selectedCategory && !categoryId && (
            <div className="mt-20 text-center">
                <button 
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="group relative px-8 py-4 bg-white border border-brand-border text-brand-primary font-bold text-xs uppercase tracking-widest rounded-full shadow-sm hover:shadow-md transition-all disabled:opacity-50 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center space-x-3">
                        {loadingMore && <Loader2 className="animate-spin" size={14} />}
                        <span>Load More Products</span>
                    </span>
                    <div className="absolute inset-0 bg-brand-bg transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out -z-0"></div>
                </button>
            </div>
        )}
      </div>

      <AnimatePresence>
        {isFilterOpen && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" 
                    onClick={() => setIsFilterOpen(false)} 
                />
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-[2rem] shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
                >
                    <div className="w-full flex justify-center pt-4 pb-2 bg-white" onClick={() => setIsFilterOpen(false)}>
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 pt-2 pb-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-heading font-bold text-brand-primary">Filter</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-brand-bg rounded-full text-brand-secondary hover:bg-gray-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-secondary">Category</h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => applyCategoryFilter(null)}
                                    className={`px-5 py-3 rounded-xl text-sm font-medium border transition-all duration-300 ${
                                        !selectedCategory && !categoryId
                                        ? 'bg-brand-primary text-white border-brand-primary shadow-lg'
                                        : 'bg-brand-bg text-brand-secondary border-transparent hover:bg-gray-200'
                                    }`}
                                >
                                    View All
                                </button>
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => applyCategoryFilter(cat)}
                                        className={`px-5 py-3 rounded-xl text-sm font-medium border transition-all duration-300 ${
                                            (selectedCategory === cat || (categoryId && getCategoryFromSlug(categoryId) === cat))
                                            ? 'bg-gradient-to-r from-brand-accent-start to-brand-accent-end text-white border-transparent shadow-lg shadow-brand-accent/20'
                                            : 'bg-brand-bg text-brand-secondary border-transparent hover:bg-gray-200'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-brand-border bg-white safe-area-pb">
                        <button 
                            onClick={() => setIsFilterOpen(false)}
                            className="w-full py-5 bg-gradient-to-r from-brand-accent-start to-brand-accent-end text-white font-bold uppercase tracking-widest text-sm rounded-xl shadow-lg shadow-brand-accent/30 active:scale-95 transition-transform"
                        >
                            Apply Filters
                        </button>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
