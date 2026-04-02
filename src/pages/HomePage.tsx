import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export function HomePage({ onNavigate }: { onNavigate?: (page: 'home' | 'product' | 'bridal-edit', id?: string) => void }) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [homepageData, setHomepageData] = useState({ 
    bannerImage: '/hero-desktop.png', 
    marqueeText: 'The Wedding Edit' 
  });

  useEffect(() => {
    fetch('/api/homepage')
      .then(res => res.json())
      .then(data => {
        if (data.bannerImage || data.marqueeText) {
          setHomepageData({
            bannerImage: data.bannerImage || '/hero-desktop.png',
            marqueeText: data.marqueeText || 'The Wedding Edit'
          });
        }
      })
      .catch(console.error);
  }, []);

  const featuredProducts = Object.values(PRODUCTS).filter(p => p.id !== 'zoya-lehenga').slice(0, 3);

  return (
    <div className="bg-surface min-h-screen selection:bg-secondary-container selection:text-primary">
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-primary">
        {/* Parallax Background */}
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute -inset-[10%] z-0"
        >
          <img 
            src={homepageData.bannerImage} 
            alt="Pakistani Bridal Wear" 
            className="w-full h-full object-cover object-top opacity-80 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-primary/10 mix-blend-multiply"></div>
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          style={{ y: textY, opacity }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20"
        >
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-secondary-container text-sm font-bold tracking-[0.4em] uppercase mb-8"
          >
            {homepageData.marqueeText}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-surface leading-[1.1] mb-10 drop-shadow-2xl"
          >
            Wear the Dream.<br/>Own the Jora.
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-secondary text-surface px-10 py-4 text-sm font-bold tracking-[0.1em] uppercase hover:bg-surface hover:text-primary transition-all duration-300 border border-secondary hover:border-surface w-full sm:w-auto relative overflow-hidden group"
            >
              <span className="relative z-10">Explore Collections</span>
              <div className="absolute inset-0 bg-surface transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0"></div>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-panel text-surface hover:text-primary px-10 py-4 text-sm font-bold tracking-[0.1em] uppercase transition-all duration-300 w-full sm:w-auto relative overflow-hidden group"
            >
              <span className="relative z-10">Rent a Jora</span>
              <div className="absolute inset-0 bg-surface transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0"></div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-secondary-container text-[10px] font-bold tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-[1px] h-16 bg-surface/20 relative overflow-hidden">
            <motion.div 
              animate={{ y: [0, 64] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-secondary-container to-transparent"
            />
          </div>
        </motion.div>
      </section>

      {/* Path Selector Section */}
      <section className="py-24 bg-surface-container-low border-b border-outline-variant/30 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Buy Path */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="group cursor-pointer flex flex-col items-center text-center p-12 hover:bg-surface transition-all duration-500 border border-transparent hover:border-outline-variant/50 hover:shadow-2xl hover:shadow-primary/5 rounded-sm"
            >
              <div className="w-24 h-24 rounded-full border border-secondary flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:scale-110 transition-all duration-500">
                <span className="font-serif text-2xl text-primary group-hover:text-surface transition-colors">I</span>
              </div>
              <h3 className="font-serif text-2xl text-primary mb-4">Custom Made Joras</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8 max-w-xs">
                Designer pieces made to your exact fitting. A heavy Jora for your big day.
              </p>
              <span className="text-xs font-bold tracking-[0.1em] uppercase text-secondary flex items-center gap-2 group-hover:gap-4 transition-all">
                Order Now <ArrowRight size={14} />
              </span>
            </motion.div>

            {/* Rent Path */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group cursor-pointer flex flex-col items-center text-center p-12 hover:bg-surface transition-all duration-500 border border-transparent hover:border-outline-variant/50 hover:shadow-2xl hover:shadow-primary/5 rounded-sm"
            >
              <div className="w-24 h-24 rounded-full border border-secondary flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:scale-110 transition-all duration-500">
                <span className="font-serif text-2xl text-primary group-hover:text-surface transition-colors">II</span>
              </div>
              <h3 className="font-serif text-2xl text-primary mb-4">Bridal Rentals</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8 max-w-xs">
                Wear heavy designer bridal outfits for a fraction of the cost. Look your best on your Shaadi.
              </p>
              <span className="text-xs font-bold tracking-[0.1em] uppercase text-secondary flex items-center gap-2 group-hover:gap-4 transition-all">
                View Rentals <ArrowRight size={14} />
              </span>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-[3/4] lg:aspect-auto lg:h-[800px]"
            >
              <img 
                src="/First.jpeg" 
                alt="Craftsmanship detail" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-surface-container-highest -z-10 hidden md:block"></div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:pl-12"
            >
              <p className="text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-6">Our Philosophy</p>
              <h2 className="font-serif text-4xl md:text-5xl text-primary leading-[1.2] mb-8">
                Redefining the modern heirloom through uncompromising craftsmanship.
              </h2>
              <div className="space-y-6 text-on-surface-variant text-base leading-relaxed">
                <p>
                  At Khubsurat Libas, we believe that a bridal ensemble is more than just a garment; it is a narrative woven in silk and zardozi, a testament to centuries of artisanal heritage.
                </p>
                <p>
                  We are challenging the traditional bridal industry by offering a dual approach: the creation of bespoke, lifelong heirlooms, and a curated rental vault that champions sustainability without sacrificing luxury.
                </p>
              </div>
              <button className="mt-12 border-b border-primary pb-1 text-sm font-bold tracking-[0.1em] uppercase text-primary hover:text-secondary hover:border-secondary transition-colors group flex items-center gap-2">
                Read Our Story <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Bridal Edit (Featured) */}
      <section className="py-32 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-4">Curated Selection</p>
              <h2 className="font-serif text-4xl text-primary">The Bridal Edit</h2>
            </motion.div>
            <button 
              onClick={() => onNavigate?.('bridal-edit')}
              className="hidden md:flex border-b border-primary pb-1 text-sm font-bold tracking-[0.1em] uppercase text-primary hover:text-secondary hover:border-secondary transition-colors items-center gap-2"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`group cursor-pointer ${index === 1 ? 'md:mt-16' : ''}`}
                onClick={() => onNavigate?.('product', product.id)}
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-surface-container-highest">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 glass-panel px-4 py-2 text-[10px] font-bold tracking-wider uppercase text-on-surface">
                    {product.tag}
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-xl text-primary mb-1 group-hover:text-secondary transition-colors">{product.name}</h3>
                    <p className="text-sm text-on-surface-variant line-clamp-1">{product.description}</p>
                  </div>
                  <div className="text-right whitespace-nowrap ml-4">
                    <p className="text-sm font-semibold text-primary">Buy {product.buyPrice}</p>
                    <p className="text-xs text-secondary mt-1">Rent {product.rentPrice}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <button 
              onClick={() => onNavigate?.('bridal-edit')}
              className="border-b border-primary pb-1 text-sm font-bold tracking-[0.1em] uppercase text-primary hover:text-secondary hover:border-secondary transition-colors"
            >
              View All Collection
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-mesh text-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
        >
          <h2 className="font-serif text-4xl md:text-6xl mb-8 text-gradient-gold pb-2 inline-block">Begin Your Journey</h2>
          <p className="text-surface/90 text-lg leading-relaxed mb-12 font-light">
            Whether you seek a custom masterpiece or wish to borrow from our heritage vault, our concierge team is ready to assist you.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-secondary text-surface px-12 py-5 text-sm font-bold tracking-[0.15em] uppercase hover:bg-surface hover:text-primary transition-colors border border-secondary hover:border-surface shadow-2xl shadow-secondary/20"
          >
            Book a Consultation
          </motion.button>
        </motion.div>
      </section>

    </div>
  );
}
