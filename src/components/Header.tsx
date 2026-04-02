import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onNavigate: (page: 'home' | 'product' | 'bridal-edit' | 'admin-login', id?: string) => void;
  currentPage: 'home' | 'product' | 'bridal-edit' | 'admin-login';
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed w-full z-50 transition-all duration-500 border-b ${
        isScrolled ? 'glass-panel border-surface/20 py-4' : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className={`font-serif text-2xl tracking-widest uppercase cursor-pointer transition-colors ${
            isScrolled ? 'text-gradient-gold' : 'text-primary'
          }`}
          onClick={() => onNavigate('home')}
        >
          Khubsurat Libas
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-12">
          {['Designer Collection', 'Bridal Collection', 'Rentals', 'Talk to Designer'].map((item) => {
            const isHome = item === 'Designer Collection';
            const isProduct = item === 'Bridal Collection';
            const isActive = (isHome && currentPage === 'home') || (isProduct && currentPage === 'bridal-edit');
            
            return (
              <motion.button 
                key={item}
                whileHover={{ y: -2 }}
                onClick={() => {
                  if (item === 'Designer Collection') onNavigate('home');
                  if (item === 'Bridal Collection') onNavigate('bridal-edit');
                }}
                className={`relative text-sm font-semibold tracking-[0.1em] uppercase transition-colors hover:text-secondary-container ${
                  isActive ? 'text-secondary-container' : 'text-on-surface'
                }`}
              >
                {item}
                {isActive && (
                  <motion.div layoutId="nav-indicator" className="h-[2px] bg-secondary-container mt-1 w-full absolute -bottom-1 left-0" />
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Icons */}
        <div className="flex gap-6 items-center text-primary">
          <motion.button whileHover={{ scale: 1.1, rotate: 5 }} className="hover:text-secondary-container transition-colors"><Search size={20} strokeWidth={1.5} /></motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5 }} 
            onClick={() => onNavigate('admin-login')}
            className="hover:text-secondary-container transition-colors hidden sm:block"
          >
            <User size={20} strokeWidth={1.5} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1, rotate: -5 }} className="hover:text-secondary-container transition-colors relative">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="absolute -top-1 -right-2 bg-secondary-container text-primary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg">
              1
            </span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} className="md:hidden hover:text-secondary-container transition-colors"><Menu size={24} strokeWidth={1.5} /></motion.button>
        </div>
      </div>
    </motion.header>
  );
}
