'use client';

import { useState } from 'react';
import { addReview, deleteReview, updateReview } from './actions';
import { MessageSquareQuote, Star, Trash2, PlusCircle, CheckCircle2, Pencil, X } from 'lucide-react';

export default function ReviewsManager({ reviews }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(e.target);
    
    let result;
    if (editingReview) {
      result = await updateReview(editingReview.id, formData);
    } else {
      result = await addReview(formData);
    }

    setIsSubmitting(false);
    if (result.success) {
      setStatus({ 
        type: 'success', 
        message: editingReview ? 'Review updated successfully!' : 'Review added successfully!' 
      });
      
      // Clear editing state on success
      setEditingReview(null);
      
      if (!editingReview) {
        e.target.reset();
      }
      setTimeout(() => setStatus(null), 3000);
    } else {
      setStatus({ type: 'error', message: result.error || 'Failed to submit review.' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    const result = await deleteReview(id);
    if (result.success) {
      // If we are currently editing the deleted review, cancel edit mode
      if (editingReview && editingReview.id === id) {
        setEditingReview(null);
      }
    } else {
      alert('Failed to delete review');
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquareQuote className="w-5 h-5 text-yellow-500" /> Patient Reviews
        </h3>
        <p className="text-sm text-slate-500 mt-1">Manage the testimonials shown on the homepage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Existing Reviews List */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-700">Existing Reviews ({reviews.length})</h4>
          {reviews.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500">
              No reviews found. Add one to display on the site!
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm relative group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold">
                        {review.initials}
                      </div>
                      <h5 className="font-bold text-slate-800">{review.patientName}</h5>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => {
                          setEditingReview(review);
                          setStatus(null);
                        }}
                        className="text-slate-400 hover:text-primary transition-colors p-1"
                        title="Edit Review"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400' : 'text-slate-300'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 italic line-clamp-3">"{review.content}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Review Form */}
        <div className={`border p-6 rounded-2xl transition-all duration-300 ${
          editingReview 
            ? 'bg-amber-50/20 border-amber-200 shadow-sm shadow-amber-100' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <h4 className="font-bold text-slate-700 mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              {editingReview ? (
                <>
                  <Pencil className="w-4 h-4 text-amber-500" /> 
                  <span>Edit Review</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 text-primary" /> 
                  <span>Add New Review</span>
                </>
              )}
            </span>
            {editingReview && (
              <button 
                onClick={() => setEditingReview(null)}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-0.5 border border-slate-200 px-2 py-1 rounded bg-white"
              >
                <X className="w-3 h-3" /> Cancel Edit
              </button>
            )}
          </h4>
          
          <form 
            key={editingReview ? `edit-${editingReview.id}` : 'new'} 
            onSubmit={handleSubmit} 
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Patient Name</label>
                <input 
                  type="text" 
                  name="patientName" 
                  required 
                  defaultValue={editingReview ? editingReview.patientName : ''}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Initials (For Avatar)</label>
                <input 
                  type="text" 
                  name="initials" 
                  required 
                  maxLength={2}
                  defaultValue={editingReview ? editingReview.initials : ''}
                  placeholder="e.g. RK"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm uppercase"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Rating</label>
              <select 
                name="rating" 
                defaultValue={editingReview ? editingReview.rating.toString() : '5'}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Review Text</label>
              <textarea 
                name="content" 
                required 
                rows="4"
                defaultValue={editingReview ? editingReview.content : ''}
                placeholder="The Ayurvedic treatment given by Dr. Om Dwivedi worked like magic..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-y"
              ></textarea>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                {status && (
                  <p className={`text-xs font-bold flex items-center gap-1 ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {status.type === 'success' && <CheckCircle2 className="w-3 h-3" />}
                    {status.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {editingReview && (
                  <button 
                    type="button"
                    onClick={() => setEditingReview(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg text-sm transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`px-5 py-2 font-bold rounded-lg text-sm transition-colors disabled:opacity-50 text-white ${
                    editingReview 
                      ? 'bg-amber-500 hover:bg-amber-600' 
                      : 'bg-slate-800 hover:bg-slate-900'
                  }`}
                >
                  {isSubmitting ? 'Saving...' : editingReview ? 'Save Changes' : 'Add Review'}
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
