import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { InlineEditModal } from '../components/InlineEditModal';
import { Edit2 } from 'lucide-react';

const HoverImageCycle = ({ images, isHovered }: { images: string[], isHovered: boolean }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 1000);
    } else {
      setIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, images]);

  return (
    <img 
      src={images[index]} 
      alt="Product View" 
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      referrerPolicy="no-referrer"
    />
  );
};

const ProductCard: React.FC<{ item: any, index: number, onNavigate?: (page: 'home' | 'product' | 'bridal-edit', id?: string) => void, isAdmin: boolean, onEditProduct: (product: any) => void }> = ({ item, index, onNavigate, isAdmin, onEditProduct }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-surface-container-highest" onClick={() => onNavigate?.('product', item.id)}>
        <HoverImageCycle images={item.images || []} isHovered={isHovered} />
        <div className="absolute top-4 left-4 glass-panel px-4 py-2 text-[10px] font-bold tracking-wider uppercase text-on-surface">
          {item.tag}
        </div>
      </div>
      
      <div onClick={() => onNavigate?.('product', item.id)}>
        <h3 className="font-serif text-2xl text-primary mb-2 group-hover:text-secondary transition-colors">{item.name}</h3>
        <p className="text-sm text-on-surface-variant mb-3">{item.description}</p>
        <span className="text-xs font-bold tracking-[0.1em] uppercase text-primary border-b border-outline-variant pb-1 group-hover:border-primary transition-colors inline-block text-gradient-gold">
          {item.buyPrice} / {item.rentPrice}
        </span>
      </div>

      {isAdmin && (
        <button 
          title="Inline Edit"
          onClick={(e) => { e.stopPropagation(); onEditProduct(item); }}
          className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg text-primary hover:text-secondary hover:bg-white transition-colors z-20 opacity-0 group-hover:opacity-100"
        >
          <Edit2 size={16} />
        </button>
      )}
    </motion.div>
  );
};

export function BridalEditPage({ onNavigate }: { onNavigate?: (page: 'home' | 'product' | 'bridal-edit', id?: string) => void }) {
  const { isAdmin } = useAuth();
  const [catalog, setCatalog] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setCatalog(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-surface min-h-screen pt-32 pb-24 selection:bg-secondary-container selection:text-primary">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-secondary mb-4 block text-gradient-gold">
            Wedding Season 2026
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6">The Bridal Collection</h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-sm leading-relaxed">
            Check out our latest bridal Joras, made with pure fabric and heavy zardozi and naqshi kaam for the modern bride.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {catalog.map((item, index) => (
            <ProductCard 
              key={item.id} 
              item={item} 
              index={index} 
              onNavigate={onNavigate} 
              isAdmin={isAdmin} 
              onEditProduct={setEditingProduct}
            />
          ))}
        </div>

        {/* Inline Editor Portal */}
        {editingProduct && (
          <InlineEditModal 
            product={editingProduct} 
            onClose={() => setEditingProduct(null)} 
            onSave={() => {
              setEditingProduct(null);
              fetchProducts();
            }}
          />
        )}

      </div>
    </div>
  );
}
