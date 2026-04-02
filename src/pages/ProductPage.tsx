import React, { useState, useRef } from 'react';
import { Heart, Share2, Box, Sparkles, ShieldCheck, Globe, Calendar, ArrowRight, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '../data/products';

export function ProductPage({ productId = 'zoya-lehenga' }: { productId?: string }) {
  const product = PRODUCTS[productId] || PRODUCTS['zoya-lehenga'];
  
  const [activeImage, setActiveImage] = useState(0);
  const [purchaseMode, setPurchaseMode] = useState<'buy' | 'rent'>('rent');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // AI Feature State
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiData, setAiData] = useState({ name: '', contactInfo: '', file: null as File | null });
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1048576) {
        setUploadError('File size exceeds 1 MB. Please choose a smaller image.');
        setAiData({ ...aiData, file: null });
      } else {
        setUploadError('');
        setAiData({ ...aiData, file });
      }
    }
  };

  const handleAIUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiData.file) return setUploadError('Please select a valid image within 1 MB.');
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('name', aiData.name);
    formData.append('contactInfo', aiData.contactInfo);
    formData.append('desiredDressDescription', `Edit this user image wearing: ${product.name}`);
    formData.append('image', aiData.file);

    try {
      const response = await fetch('/api/customers/request', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setUploadSuccess(true);
      } else {
        setUploadError(result.message || 'Error submitting request. Ensure backend is running.');
      }
    } catch (err) {
      setUploadError('Failed to connect to the server.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen pt-24 selection:bg-secondary-container selection:text-primary">
      
      {/* Breadcrumbs */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1440px] mx-auto px-6 md:px-12 py-6 border-b border-outline-variant/30"
      >
        <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.1em] uppercase text-on-surface-variant">
          <a href="#" className="hover:text-primary transition-colors hover:underline underline-offset-4">Home</a>
          <span>/</span>
          <a href="#" className="hover:text-primary transition-colors hover:underline underline-offset-4">Bridal Collection</a>
          <span>/</span>
          <span className="text-primary font-bold">{product.name}</span>
        </div>
      </motion.div>

      {/* Main Product Section */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto hide-scrollbar md:w-24 shrink-0 px-1 py-1"
            >
              {product.images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-[3/4] w-20 md:w-full shrink-0 transition-all ${activeImage === idx ? 'ring-2 ring-secondary ring-offset-2 ring-offset-surface' : 'ring-1 ring-outline-variant/50 hover:ring-primary'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </motion.div>

            {/* Main Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative flex-1 aspect-[3/4] bg-surface-container-highest group overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  src={product.images[activeImage]} 
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              {/* Floating Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 glass-panel flex items-center justify-center text-primary hover:text-secondary transition-colors rounded-full">
                  <Heart size={18} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 glass-panel flex items-center justify-center text-primary hover:text-secondary transition-colors rounded-full">
                  <Share2 size={18} />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Right: Product Info (Sticky, 5 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5"
          >
            <div className="sticky top-32">
              
              {/* Header */}
              <div className="mb-8 border-b border-outline-variant/30 pb-8">
                <h1 className="font-serif text-4xl text-primary mb-2">{product.name}</h1>
                <p className="text-on-surface-variant text-sm mb-6">{product.description}</p>
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-3xl text-primary transition-all">
                    {purchaseMode === 'buy' ? product.buyPrice : product.rentPrice}
                  </span>
                  <span className="text-xs font-bold tracking-[0.1em] uppercase text-secondary">
                    {purchaseMode === 'buy' ? 'Custom Order' : '4-Day Rent'}
                  </span>
                </div>
              </div>

              {/* Buy/Rent Toggle */}
              <div className="flex bg-surface-container-low p-1 rounded-sm relative mb-8 shadow-inner shadow-primary/5">
                {['rent', 'buy'].map((mode) => (
                  <button 
                    key={mode}
                    onClick={() => setPurchaseMode(mode as 'buy' | 'rent')}
                    className={`flex-1 py-3 text-xs font-bold tracking-[0.1em] uppercase relative z-10 transition-colors duration-300 ${
                      purchaseMode === mode ? 'text-surface' : 'text-primary hover:bg-surface-container/50'
                    }`}
                  >
                    {mode === 'rent' ? 'Rent' : 'Make to Order'}
                    {purchaseMode === mode && (
                      <motion.div 
                        layoutId="purchase-mode-pill" 
                        className="absolute inset-0 bg-primary rounded-sm -z-10 shadow-md"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Dynamic Content based on mode */}
              <div className="mb-8 min-h-[160px]">
                <AnimatePresence mode="wait">
                  {purchaseMode === 'rent' ? (
                    <motion.div 
                      key="rent-mode"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-semibold text-primary">Choose Your Size</span>
                          <button className="text-xs text-secondary underline underline-offset-4 hover:text-primary transition-colors">Size Chart</button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          {['XS', 'S', 'M', 'L'].map(size => (
                            <button 
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`py-3 text-sm transition-all duration-300 ${selectedSize === size ? 'border-primary bg-primary text-surface shadow-md scale-105' : 'border border-outline-variant text-primary hover:border-primary hover:bg-surface-container-low'}`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-primary block mb-3">Booking Dates</span>
                        <button className="w-full py-4 border border-outline-variant flex items-center justify-between px-4 text-sm text-on-surface-variant hover:border-primary hover:bg-surface-container-low transition-all">
                          <span>Select Booking Dates</span>
                          <Calendar size={18} className="text-primary" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="buy-mode"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="bg-surface-container-low p-6 border border-outline-variant/30"
                    >
                      <h3 className="text-sm font-bold text-primary mb-2">How Ordering Works</h3>
                      <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                        We will make this exactly to your fitting. Our team will contact you within 24 hours to take your measurements.
                      </p>
                      <ul className="text-xs text-on-surface-variant space-y-2">
                        <li className="flex items-center gap-2"><span className="w-1 h-1 bg-secondary rounded-full"></span> Delivery time: 8 to 12 weeks</li>
                        <li className="flex items-center gap-2"><span className="w-1 h-1 bg-secondary rounded-full"></span> 2 fitting sessions included</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="space-y-4 mb-12">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary text-surface py-4 text-sm font-bold tracking-[0.1em] uppercase hover:bg-primary-container transition-colors shadow-lg shadow-primary/20"
                >
                  {purchaseMode === 'rent' ? 'Add to Cart' : 'Place Order'}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-transparent text-primary py-4 text-sm font-bold tracking-[0.1em] uppercase border border-primary hover:bg-surface-container transition-colors"
                >
                  Ask on WhatsApp
                </motion.button>
              </div>

              {/* Description */}
              <div className="border-t border-outline-variant/30 pt-6">
                <h3 className="text-sm font-bold text-primary mb-3">The Details</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                  {product.details}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <ShieldCheck size={18} className="text-secondary" />
                    <span>100% Original Quality</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <Globe size={18} className="text-secondary" />
                    <span>Delivery available across Pakistan & Worldwide</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Virtual Try-On Section */}
      <section className="py-24 bg-surface-container-low border-y border-outline-variant/30 overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-surface px-3 py-1 border border-outline-variant mb-6 shadow-sm">
                <Sparkles size={14} className="text-secondary" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-primary">AI Feature</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6">Try "{product.name}" with AI</h2>
              <p className="text-on-surface-variant text-base leading-relaxed mb-8">
                Send us a picture of yourself, and our styling AI will edit this Jora onto your image perfectly! Just provide your contact details.
              </p>
              
              {!showAIModal ? (
                <motion.button 
                  onClick={() => setShowAIModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary text-surface px-8 py-4 text-sm font-bold tracking-[0.1em] uppercase hover:bg-surface hover:text-primary transition-all duration-300 border border-secondary hover:border-surface flex items-center gap-3 shadow-[0_0_15px_rgba(254,214,91,0.4)]"
                >
                  <Sparkles size={18} /> Try with AI
                </motion.button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-surface p-6 border border-outline-variant shadow-lg"
                >
                  <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-3">
                    <h3 className="font-serif text-xl text-primary flex items-center gap-2"><Sparkles size={18} className="text-secondary"/> AI Upload Request</h3>
                    <button onClick={() => setShowAIModal(false)} className="text-on-surface-variant hover:text-primary"><X size={20}/></button>
                  </div>
                  
                  {uploadSuccess ? (
                    <div className="text-center py-6 border border-secondary bg-secondary/5">
                      <p className="text-secondary font-bold uppercase tracking-wider text-sm mb-2">Request Received!</p>
                      <p className="text-on-surface-variant text-sm text-balance">Our AI team will edit your image and email it to you shortly.</p>
                      <button onClick={() => setShowAIModal(false)} className="mt-4 px-6 py-2 bg-primary text-surface text-xs uppercase font-bold tracking-wider">Close</button>
                    </div>
                  ) : (
                    <form onSubmit={handleAIUpload} className="space-y-4">
                      {uploadError && <div className="text-red-600 bg-red-50 p-2 text-xs border border-red-200">{uploadError}</div>}
                      
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Name</label>
                        <input type="text" value={aiData.name} onChange={e => setAiData({...aiData, name: e.target.value})} required className="w-full p-2 border border-outline focus:border-primary outline-none text-sm bg-surface" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Email / Contact Info</label>
                        <input type="text" value={aiData.contactInfo} onChange={e => setAiData({...aiData, contactInfo: e.target.value})} required className="w-full p-2 border border-outline focus:border-primary outline-none text-sm bg-surface" />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Upload Photo (Max 1MB)</label>
                        <div className="border border-dashed border-outline-variant p-4 text-center hover:bg-surface-container-low transition-colors cursor-pointer relative">
                           <input type="file" required accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                           {aiData.file ? (
                             <p className="text-sm text-primary font-semibold flex items-center justify-center gap-2"><ShieldCheck size={16} className="text-green-600"/> {aiData.file.name}</p>
                           ) : (
                             <p className="text-sm text-on-surface-variant flex items-center justify-center gap-2"><Upload size={16}/> Click or drop image</p>
                           )}
                        </div>
                      </div>

                      <button type="submit" disabled={isUploading} className={`w-full py-3 text-xs font-bold tracking-[0.1em] uppercase transition-colors text-surface ${isUploading ? 'bg-outline-variant' : 'bg-primary hover:bg-secondary'}`}>
                        {isUploading ? 'Uploading...' : 'Submit Request'}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square bg-surface-container-highest flex items-center justify-center overflow-hidden group cursor-pointer border border-outline-variant/20"
            >
              <img 
                src={product.images[0]} 
                alt="AR Preview" 
                loading="lazy"
                className="w-full h-full object-cover opacity-60 mix-blend-multiply transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute w-32 h-32 border border-dashed border-secondary/50 rounded-full"
                />
                <div className="w-20 h-20 rounded-full glass-panel flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-2xl">
                  <Box size={32} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Rental Vault Info */}
      <section className="py-24 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="font-serif text-3xl text-primary mb-4">How Our Rentals Work</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              We keep our rental outfits as good as new. Read below to see how we dry-clean and pack your dress.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface-container-low p-10 border border-outline-variant/30 hover:border-primary/30 transition-colors duration-300 group"
            >
              <h3 className="font-serif text-xl text-primary mb-4 group-hover:text-secondary transition-colors">Dry Cleaned & Ironed</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Every Jora goes through professional dry cleaning after it's returned. We make sure there are no stains and the embroidery is perfect before we send it to you.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-surface-container-low p-10 border border-outline-variant/30 hover:border-primary/30 transition-colors duration-300 group"
            >
              <h3 className="font-serif text-xl text-primary mb-4 group-hover:text-secondary transition-colors">Minor Damages are Okay</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                We know Shaadis can be crazy. Minor things like a few fallen beads or dust on the border are completely fine and covered. We check everything before dispatching.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Concierge Banner */}
      <section className="bg-mesh text-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 md:p-16 flex flex-col justify-center"
          >
            <h2 className="font-serif text-3xl text-gradient-gold mb-6 inline-block">Need Fashion Advice?</h2>
            <p className="text-surface/90 text-sm leading-relaxed mb-8 font-light">
              Not sure about your fitting or matching jewelry? Let our styling team help you out.
            </p>
            <button className="self-start border-b border-secondary-container pb-1 text-xs font-bold tracking-[0.1em] uppercase text-secondary-container hover:text-surface hover:border-surface transition-colors">
              Chat with us
            </button>
          </motion.div>
          <div className="md:col-span-2 relative h-64 md:h-auto overflow-hidden">
            <motion.img 
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              src="https://images.unsplash.com/photo-1583391733958-d25e07fac044?q=80&w=1200&auto=format&fit=crop" 
              alt="Styling session" 
              loading="lazy"
              className="w-full h-full object-cover opacity-70 mix-blend-luminosity"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent"></div>
          </div>
        </div>
      </section>

    </div>
  );
}
