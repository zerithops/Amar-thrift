
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, ShoppingBag, ZoomIn } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Product } from '../types';

const Shop: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const PRODUCTS_PER_PAGE = 27;

  // Normalize slug to match DB Category Enum (Capitalized)
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
      const categoryFilter = getCategoryFromSlug(categoryId);

      if (categoryFilter) {
        // Fetch all products for this category (ignoring pagination for now for simplicity in category view)
        // or you could implement paginated category fetch in future
        if (pageNum === 1) {
            data = await firebaseService.getProductsByCategory(categoryFilter);
            setHasMore(false); // Disable load more for category view for now as we fetch all
        }
      } else {
        // Standard Shop Page (Paginated)
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
    fetchProducts(1);
  }, [categoryId]);

  const handleLoadMore = () => {
    if (categoryId) return; // Disable load more for category view
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  const formatPrice = (price: number) => `৳ ${price.toLocaleString()}`;

  const INSTAGRAM_LINK = "https://www.instagram.com/amar_thrift_/";

  const pageTitle = categoryId ? getCategoryFromSlug(categoryId) : "The Collection";

  return (
    <div className="bg-brand-bg min-h-screen pb-24 pt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-heading font-bold text-brand-primary mb-6"
        >
          {pageTitle}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-brand-secondary max-w-xl mx-auto text-lg font-light"
        >
          {categoryId 
            ? `Browse our exclusive ${getCategoryFromSlug(categoryId)?.toLowerCase()} selection.`
            : "Explore our latest drop of premium vintage essentials."
          }
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-brand-accent" size={40} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-brand-card rounded-3xl shadow-soft border border-brand-border">
             <ShoppingBag size={48} className="mx-auto text-brand-muted mb-4" strokeWidth={1} />
             <p className="text-brand-secondary font-medium">
                {categoryId 
                    ? `No ${getCategoryFromSlug(categoryId)} found.` 
                    : "No products currently available."
                }
             </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
              {products.map((product, index) => (
                <motion.div 
                  key={product.id} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-brand-bg rounded-xl mb-4 md:mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-md p-3 rounded-full text-brand-primary shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <ZoomIn size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-grow px-1">
                    <p className="text-[10px] md:text-xs font-bold text-brand-muted uppercase tracking-widest mb-1 md:mb-2">{product.category}</p>
                    <h3 className="text-sm md:text-lg font-heading font-medium text-brand-primary mb-2 group-hover:text-brand-accent transition-colors line-clamp-2 md:line-clamp-none">{product.name}</h3>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mt-auto pt-2 gap-2 md:gap-0">
                      <span className="text-base md:text-lg font-medium text-brand-primary">{formatPrice(product.price)}</span>
                      <a 
                        href={INSTAGRAM_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] md:text-xs text-center bg-[#006747] border border-[#006747] text-white px-3 py-2 md:px-4 md:py-2 rounded-full font-bold uppercase tracking-wider hover:opacity-90 transition-all"
                      >
                        Order Now
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-16 text-center">
                <button 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center space-x-2 bg-brand-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-brand-accent transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loadingMore && <Loader2 className="animate-spin" size={18} />}
                  <span>{loadingMore ? 'Loading...' : 'Load More'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
