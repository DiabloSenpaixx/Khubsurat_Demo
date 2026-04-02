import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export function AdminDashboard({ onNavigate }: { onNavigate: (page: any) => void }) {
  const { isAdmin, logout } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      onNavigate('admin-login');
    }
  }, [isAdmin, onNavigate]);

  if (!isAdmin) return null;

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
      <div className="flex justify-between items-center mb-12 border-b border-outline pb-6">
        <h1 className="font-serif text-4xl text-primary">Atelier Command Center</h1>
        <button 
          onClick={() => { logout(); onNavigate('home'); }}
          className="text-xs font-bold tracking-[0.1em] uppercase text-secondary hover:text-primary transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-low p-8 border border-outline-variant cursor-pointer group hover:border-primary transition-colors"
          onClick={() => onNavigate('admin-products')}
        >
          <h2 className="font-serif text-2xl text-primary mb-2 group-hover:text-secondary">Product Management</h2>
          <p className="text-sm text-on-surface-variant tracking-wide">
            Add, edit, and organize the bridal catalog. Upload high-res imagery and manage stock.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-container-low p-8 border border-outline-variant cursor-pointer group hover:border-primary transition-colors"
          onClick={() => onNavigate('admin-homepage')}
        >
          <h2 className="font-serif text-2xl text-primary mb-2 group-hover:text-secondary">Homepage CMS</h2>
          <p className="text-sm text-on-surface-variant tracking-wide">
            Update the hero banner, marquee text, and featured collection layout.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
