import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaTimes, FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAxiosSecure from '../hook/useAxiosSecure';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
  problemTitle: string;
  submissionId: string;
  userEmail: string;
  userName: string;
  userPhoto: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  problemId,
  problemTitle,
  submissionId,
  userEmail,
  userName,
  userPhoto
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [experience, setExperience] = useState<'positive' | 'neutral' | 'challenging'>('positive');
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      const response = await axiosSecure.post('/api/reviews/submit-review', reviewData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Thank you for your review! 🎉');
      queryClient.invalidateQueries({ queryKey: ['reviews', problemId] });
      queryClient.invalidateQueries({ queryKey: ['user-reviews', userEmail] });
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  });

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    submitReviewMutation.mutate({
      userEmail,
      problemId,
      submissionId,
      rating,
      comment,
      experience,
      userName,
      userPhoto
    });
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    setExperience('positive');
    onClose();
  };

  const experienceOptions = [
    { value: 'positive', label: 'Positive', icon: FaSmile, color: 'text-green-400', bgColor: 'bg-green-500/20' },
    { value: 'neutral', label: 'Neutral', icon: FaMeh, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
    { value: 'challenging', label: 'Challenging', icon: FaFrown, color: 'text-red-400', bgColor: 'bg-red-500/20' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Share Your Experience</h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Problem Info */}
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-white font-semibold mb-1">{problemTitle}</h3>
              <p className="text-gray-400 text-sm">How was your experience solving this problem?</p>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-white mb-3 font-medium">Your Rating</label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-2 transition-all duration-200 transform hover:scale-110"
                  >
                    <FaStar
                      className={`text-2xl ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-400 fill-gray-400/20'
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Type */}
            <div className="mb-6">
              <label className="block text-white mb-3 font-medium">Overall Experience</label>
              <div className="grid grid-cols-3 gap-2">
                {experienceOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setExperience(option.value as any)}
                    className={`p-3 rounded-xl border transition-all duration-200 ${
                      experience === option.value
                        ? `${option.bgColor} border-cyan-500/50`
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <option.icon className={`text-xl mb-1 mx-auto ${option.color}`} />
                    <span className="text-white text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-white mb-3 font-medium">
                Additional Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this problem..."
                className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 resize-none"
                maxLength={500}
              />
              <div className="text-right text-gray-400 text-sm mt-1">
                {comment.length}/500
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 text-gray-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitReviewMutation.isPending || rating === 0}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-200"
              >
                {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;