import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function InlineEditModal({ product, onClose, onSave }: { product: any, onClose: () => void, onSave: () => void }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    tag: product.tag,
    buyPrice: product.buyPrice,
    rentPrice: product.rentPrice
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // We do a partial update since inline editing doesn't handle images directly here for brevity, 
    // or we can pass existing images and details back so they aren't lost.
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('tag', formData.tag);
    submitData.append('buyPrice', formData.buyPrice);
    submitData.append('rentPrice', formData.rentPrice);
    
    // Preserve other fields
    submitData.append('details', product.details);
    submitData.append('existingImages', JSON.stringify(product.images || []));

    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData
      });
      onSave();
    } catch (err) {
      console.error(err);
      alert('Failed to update product');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-surface w-full max-w-2xl border border-outline shadow-2xl z-10 p-8 max-h-[90vh] overflow-y-auto"
        >
          <button onClick={onClose} title="Close" className="absolute top-4 right-4 p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant hover:text-primary">
            <X size={20} />
          </button>
          
          <h2 className="font-serif text-2xl text-primary mb-6">Quick Edit: {product.name}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="editName" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Name</label>
                <input id="editName" type="text" className="w-full p-3 border border-outline bg-surface focus:border-primary outline-none" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label htmlFor="editTag" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Tag</label>
                <input id="editTag" type="text" className="w-full p-3 border border-outline bg-surface focus:border-primary outline-none" required
                  value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} />
              </div>
            </div>
            
            <div>
              <label htmlFor="editDesc" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Short Description</label>
              <input id="editDesc" type="text" className="w-full p-3 border border-outline bg-surface focus:border-primary outline-none" required
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="editBuy" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Buy Price</label>
                <input id="editBuy" type="text" className="w-full p-3 border border-outline bg-surface focus:border-primary outline-none" required
                  value={formData.buyPrice} onChange={e => setFormData({...formData, buyPrice: e.target.value})} />
              </div>
              <div>
                <label htmlFor="editRent" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Rent Price</label>
                <input id="editRent" type="text" className="w-full p-3 border border-outline bg-surface focus:border-primary outline-none" required
                  value={formData.rentPrice} onChange={e => setFormData({...formData, rentPrice: e.target.value})} />
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-4">
              <button type="button" onClick={onClose} className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="bg-primary text-on-primary px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-secondary transition-colors disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
