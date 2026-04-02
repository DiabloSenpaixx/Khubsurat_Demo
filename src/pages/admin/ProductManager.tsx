import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, X, Upload, ArrowLeft } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  details: string;
  tag: string;
  buyPrice: string;
  rentPrice: string;
  images: string[];
}

export function ProductManager({ onNavigate }: { onNavigate: (page: any) => void }) {
  const { token, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', description: '', details: '', tag: '', buyPrice: '', rentPrice: ''
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsAdding(false);
    setFormData({
      name: product.name,
      description: product.description,
      details: product.details,
      tag: product.tag,
      buyPrice: product.buyPrice,
      rentPrice: product.rentPrice
    });
    setExistingImages(product.images || []);
    setNewImageFiles([]);
    setNewImagePreviews([]);
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingProduct(null);
    setFormData({
      name: '', description: '', details: '', tag: '', buyPrice: '', rentPrice: ''
    });
    setExistingImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImageFiles(prev => [...prev, ...filesArray]);
      
      const previews = filesArray.map(file => URL.createObjectURL(file));
      setNewImagePreviews(prev => [...prev, ...previews]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => submitData.append(key, value));
    
    if (editingProduct) {
      submitData.append('existingImages', JSON.stringify(existingImages));
      newImageFiles.forEach(file => submitData.append('newImages', file));
      
      try {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: submitData
        });
        await fetchProducts();
        setEditingProduct(null);
      } catch (err) {
        console.error(err);
      }
    } else {
      newImageFiles.forEach(file => submitData.append('images', file));
      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: submitData
        });
        await fetchProducts();
        setIsAdding(false);
      } catch (err) {
        console.error(err);
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // The Dashboard View
  if (!isAdding && !editingProduct) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        <div className="flex justify-between items-center mb-12 border-b border-outline pb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('admin-dashboard')} title="Back to Dashboard" className="p-2 hover:bg-surface-container rounded-full transition-colors">
              <ArrowLeft size={20} className="text-on-surface-variant" />
            </button>
            <h1 className="font-serif text-3xl text-primary">Product Catalog</h1>
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 text-xs font-bold tracking-[0.1em] uppercase hover:bg-secondary transition-colors"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <motion.div key={product.id} className="bg-surface-container-low border border-outline-variant p-4">
              <div className="aspect-[4/3] bg-surface-container-highest mb-4 relative overflow-hidden">
                {product.images && product.images.length > 0 && (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 uppercase tracking-widest backdrop-blur-sm">
                  {product.tag}
                </div>
              </div>
              <h3 className="font-serif text-lg text-primary truncate">{product.name}</h3>
              <p className="text-xs text-on-surface-variant truncate mb-4">{product.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-outline">
                <button onClick={() => handleEdit(product)} className="text-xs uppercase tracking-wider font-bold text-secondary hover:text-primary">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="text-xs uppercase tracking-wider font-bold text-red-700 hover:text-red-900">Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // The Form View (Add/Edit)
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => { setIsAdding(false); setEditingProduct(null); }} title="Back" className="p-2 hover:bg-surface-container rounded-full transition-colors">
          <ArrowLeft size={20} className="text-on-surface-variant" />
        </button>
        <h1 className="font-serif text-3xl text-primary">{isAdding ? 'Add New Product' : `Editing: ${formData.name}`}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="prodName" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Product Name</label>
              <input id="prodName" type="text" className="w-full p-3 border border-outline bg-surface focus:border-primary outline-none" required
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label htmlFor="prodDesc" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Short Description</label>
              <input id="prodDesc" type="text" className="w-full p-3 border border-outline bg-surface focus:border-primary outline-none" required
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div>
              <label htmlFor="buyPrice" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Price Tag (Buy)</label>
              <input id="buyPrice" type="text" className="w-full p-3 border border-outline bg-surface focus:border-primary outline-none" placeholder="$4,500" required
                value={formData.buyPrice} onChange={e => setFormData({...formData, buyPrice: e.target.value})} />
            </div>
            <div>
              <label htmlFor="rentPrice" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Price Tag (Rent)</label>
              <input id="rentPrice" type="text" className="w-full p-3 border border-outline bg-surface focus:border-primary outline-none" placeholder="$650" required
                value={formData.rentPrice} onChange={e => setFormData({...formData, rentPrice: e.target.value})} />
            </div>
            <div>
              <label htmlFor="colTag" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Collection Tag</label>
              <input id="colTag" type="text" className="w-full p-3 border border-outline bg-surface focus:border-primary outline-none" placeholder="e.g. Best Seller" required
                value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} />
            </div>
          </div>
          
          <div className="space-y-4 flex flex-col">
            <div className="flex-grow">
              <label htmlFor="details" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Full Details (Markdown/HTML supported if applicable)</label>
              <textarea id="details" className="w-full h-[calc(100%-24px)] min-h-[200px] p-3 border border-outline bg-surface focus:border-primary outline-none resize-none" required
                value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Media Manager */}
        <div className="mt-8 border-t border-outline pt-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Media Gallery</label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            
            {/* Existing Images */}
            {existingImages.map((src, idx) => (
              <div key={`exist-${idx}`} className="relative aspect-[3/4] bg-surface-container-highest group">
                <img src={src} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                <button type="button" title="Remove image" onClick={() => removeExistingImage(idx)} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {/* New Image Previews */}
            {newImagePreviews.map((src, idx) => (
              <div key={`new-${idx}`} className="relative aspect-[3/4] bg-surface-container-highest group opacity-80 border-2 border-dashed border-secondary">
                <img src={src} alt={`New Product ${idx}`} className="w-full h-full object-cover" />
                <button type="button" title="Remove image" onClick={() => removeNewImage(idx)} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={14} />
                </button>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-black/50 text-white text-[10px] px-2 py-1 uppercase">Pending</span>
                </div>
              </div>
            ))}

            <label className="cursor-pointer aspect-[3/4] border-2 border-dashed border-outline-variant hover:border-primary transition-colors flex flex-col items-center justify-center text-on-surface-variant hover:text-primary">
              <Upload size={24} className="mb-2" />
              <span className="text-xs uppercase font-bold tracking-wider">Add Images</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <button type="submit" disabled={loading} className="bg-primary text-on-primary px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-secondary transition-colors disabled:opacity-50">
            {loading ? 'Committing...' : isAdding ? 'Publish Product' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
