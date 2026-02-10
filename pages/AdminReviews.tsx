
import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Star, User, Loader2 } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Review } from '../types';

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchReviews = async () => {
    const data = await firebaseService.getReviews();
    setReviews(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this review?')) {
        await firebaseService.deleteReview(id);
        fetchReviews();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-brand-gray min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-heading font-bold text-brand-black">Review Management</h1>
          <p className="text-gray-500 mt-1">Moderate customer feedback.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24"><Loader2 className="animate-spin inline text-brand-blue" /></div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
           <p className="text-gray-500">No reviews found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {reviews.map(review => (
               <motion.div 
                 key={review.id}
                 layout
                 className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex flex-col"
               >
                  <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                              <User size={20} />
                          </div>
                          <div>
                              <p className="font-bold text-brand-black">{review.name}</p>
                              <div className="flex text-yellow-400 text-xs mt-0.5">
                                  {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                                  ))}
                              </div>
                          </div>
                      </div>
                      <button onClick={() => handleDelete(review.id!)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                      </button>
                  </div>
                  <p className="text-gray-600 text-sm flex-grow">"{review.message}"</p>
                  <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-50 text-right">
                      {new Date(review.createdAt).toLocaleDateString()}
                  </p>
               </motion.div>
           ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
