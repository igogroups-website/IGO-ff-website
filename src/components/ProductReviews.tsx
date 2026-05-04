'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, CheckCircle, User, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
  is_verified: boolean;
  likes: number;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      user_name: 'Rahul Sharma',
      rating: 5,
      comment: 'The quality of the vegetables is exceptional. Very fresh and delivered on time!',
      date: '2 days ago',
      is_verified: true,
      likes: 12
    },
    {
      id: '2',
      user_name: 'Priya K.',
      rating: 4,
      comment: 'Great service. The mangoes were a bit small but very sweet.',
      date: '1 week ago',
      is_verified: true,
      likes: 5
    }
  ]);

  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '0.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const review: Review = {
        id: Math.random().toString(),
        user_name: 'You',
        rating: newReview.rating,
        comment: newReview.comment,
        date: 'Just now',
        is_verified: true,
        likes: 0
      };
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      setIsSubmitting(false);
      setShowForm(false);
    }, 1000);
  };

  return (
    <div className="mt-16 border-t border-border/60 pt-16">
      <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
        <div className="flex-shrink-0">
          <h3 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tight">Customer Reviews</h3>
          <div className="flex items-center gap-6">
            <div className="text-6xl font-black text-primary">{averageRating}</div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={20} className={s <= Math.round(Number(averageRating)) ? 'fill-primary text-primary' : 'text-muted/40'} />
                ))}
              </div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{reviews.length} Verified Reviews</p>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(r => r.rating === rating).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-4">
                <span className="text-xs font-black text-muted-foreground w-4">{rating}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className="h-full bg-primary" 
                  />
                </div>
                <span className="text-[10px] font-black text-muted-foreground w-8">{Math.round(percentage)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-12">
        {!showForm ? (
          <button 
            onClick={() => setShowForm(true)}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/20 text-primary font-black uppercase tracking-widest text-xs hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare size={16} />
            Write a Review
          </button>
        ) : (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-muted/30 p-8 rounded-[2rem] border border-primary/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-black uppercase tracking-tight">Your Harvest Experience</h4>
              <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Rating</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: s })}
                    className="p-1 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star size={28} className={s <= newReview.rating ? 'fill-primary text-primary' : 'text-muted/40'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Comment</p>
              <textarea 
                required
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Tell us about the freshness and quality..."
                className="w-full bg-white border border-border rounded-2xl p-5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all min-h-[120px] text-sm font-medium"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
              Submit Review
            </button>
          </motion.form>
        )}
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {reviews.map((review) => (
            <motion.div 
              key={review.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 bg-white rounded-[2rem] border border-border shadow-sm group hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-sm font-black text-foreground uppercase tracking-tight">{review.user_name}</h4>
                      {review.is_verified && (
                        <div className="flex items-center gap-1 text-[8px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                          <CheckCircle size={8} />
                          Verified
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} className={s <= review.rating ? 'fill-primary text-primary' : 'text-muted/40'} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium mb-6">
                {review.comment}
              </p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors">
                  <ThumbsUp size={14} />
                  Helpful ({review.likes})
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function X({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
