
import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, User, Send, Loader2 } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import { Review } from '../types';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [formVisible, setFormVisible] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
    name: '',
    rating: 5,
    message: ''
  });

  const fetchReviews = async () => {
    const data = await firebaseService.getReviews();
    setReviews(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    await firebaseService.addReview({
      name: formData.name,
      rating: Number(formData.rating),
      message: formData.message
    });
    setFormData({ name: '', rating: 5, message: '' });
    setFormVisible(false);
    fetchReviews();
    setSubmitLoading(false);
  };

  return (
    <div className="bg-brand-gray min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-16 mb-12 shadow-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
             <div className="p-4 bg-brand-blue/10 rounded-full text-brand-blue">
                <Star size={32} fill="currentColor" />
             </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-heading font-bold text-brand-black mb-4"
          >
            Client Love
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-xl mx-auto mb-8"
          >
            See what our community is saying about their premium thrift finds.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setFormVisible(!formVisible)}
            className="inline-flex items-center space-x-2 bg-brand-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-brand-blue transition-all shadow-lg"
          >
            <MessageCircle size={18} />
            <span>{formVisible ? 'Close Form' : 'Write a Review'}</span>
          </motion.button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-12">
        {/* Review Form */}
        {formVisible && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white p-8 rounded-2xl shadow-soft border border-gray-100 overflow-hidden"
            >
                <h3 className="text-xl font-heading font-bold text-brand-black mb-6">Share your experience</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Name</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-brand-black focus:outline-none focus:border-brand-blue" placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rating</label>
                            <select value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-brand-black focus:outline-none focus:border-brand-blue">
                                <option value="5">★★★★★ (5 Stars)</option>
                                <option value="4">★★★★☆ (4 Stars)</option>
                                <option value="3">★★★☆☆ (3 Stars)</option>
                                <option value="2">★★☆☆☆ (2 Stars)</option>
                                <option value="1">★☆☆☆☆ (1 Star)</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Message</label>
                        <textarea required rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-brand-black focus:outline-none focus:border-brand-blue resize-none" placeholder="How was the product?" />
                    </div>
                    <button disabled={submitLoading} type="submit" className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-brand-black transition-colors flex items-center justify-center space-x-2">
                        {submitLoading ? <Loader2 className="animate-spin" /> : <><Send size={18} /><span>Submit Review</span></>}
                    </button>
                </form>
            </motion.div>
        )}

        {/* Reviews List */}
        {loading ? (
             <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>
        ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No reviews yet. Be the first to review!</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review, idx) => (
                    <motion.div 
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 hover:shadow-hover transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-brand-black">{review.name}</p>
                                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">"{review.message}"</p>
                    </motion.div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
