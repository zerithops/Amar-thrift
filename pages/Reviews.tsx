// @ts-nocheck
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
    <div className="bg-brand-bg min-h-screen pb-20 pt-10">
      {/* Header */}
      <div className="mb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
             <div className="p-4 bg-brand-card rounded-full text-brand-gold shadow-sm border border-brand-border">
                <Star size={32} fill="currentColor" />
             </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-heading font-bold text-brand-primary mb-4"
          >
            Client Love
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-brand-secondary max-w-xl mx-auto mb-8 text-lg font-light"
          >
            See what our community is saying about their premium thrift finds.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setFormVisible(!formVisible)}
            className="inline-flex items-center space-x-2 bg-brand-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-brand-accent transition-all shadow-lg"
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
                className="bg-brand-card p-10 rounded-3xl shadow-soft border border-brand-border overflow-hidden"
            >
                <h3 className="text-xl font-heading font-bold text-brand-primary mb-6">Share your experience</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-muted uppercase tracking-widest">Name</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent" placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-muted uppercase tracking-widest">Rating</label>
                            <select value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent">
                                <option value="5">★★★★★ (5 Stars)</option>
                                <option value="4">★★★★☆ (4 Stars)</option>
                                <option value="3">★★★☆☆ (3 Stars)</option>
                                <option value="2">★★☆☆☆ (2 Stars)</option>
                                <option value="1">★☆☆☆☆ (1 Star)</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-muted uppercase tracking-widest">Message</label>
                        <textarea required rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-brand-bg border border-brand-border rounded-xl px-5 py-4 text-brand-primary focus:outline-none focus:border-brand-accent resize-none" placeholder="How was the product?" />
                    </div>
                    <button disabled={submitLoading} type="submit" className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-brand-accent transition-colors flex items-center justify-center space-x-2">
                        {submitLoading ? <Loader2 className="animate-spin" /> : <><Send size={18} /><span>Submit Review</span></>}
                    </button>
                </form>
            </motion.div>
        )}

        {/* Reviews List */}
        {loading ? (
             <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-accent" size={32} /></div>
        ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-brand-muted">No reviews yet. Be the first to review!</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review, idx) => (
                    <motion.div 
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-brand-card p-8 rounded-3xl shadow-soft border border-brand-border hover:shadow-hover transition-all"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-brand-primary text-lg">{review.name}</p>
                                    <p className="text-xs text-brand-muted">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex text-brand-gold">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" className={i < review.rating ? "text-brand-gold" : "text-gray-300"} />
                                ))}
                            </div>
                        </div>
                        <p className="text-brand-secondary leading-relaxed">"{review.message}"</p>
                    </motion.div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;