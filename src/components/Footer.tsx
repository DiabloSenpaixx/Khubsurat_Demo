import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export function Footer() {
  return (
    <footer className="bg-mesh text-surface py-24 border-t border-outline-variant/20 relative overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10"
      >
        
        {/* Brand Column */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <h2 className="font-serif text-2xl tracking-widest uppercase mb-6 text-gradient-gold inline-block">Khubsurat Libas</h2>
          <p className="text-sm text-surface/80 leading-relaxed font-light mb-8">
            Bringing premium Pakistani bridal luxury to you through easy rentals and made-to-order Joras.
          </p>
        </motion.div>

        {/* Links Column 1 */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-secondary-container">Collections</h3>
          <ul className="space-y-4 mb-8">
            {['Pret & Casual', 'Custom Bridal', 'Heavy Formals'].map(link => (
              <li key={link}><a href="#" className="text-sm text-surface/70 hover:text-secondary-container hover:pl-2 transition-all inline-block">{link}</a></li>
            ))}
          </ul>
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-secondary-container">Rental Library</h3>
          <ul className="space-y-4">
            {['How it Works', 'Browse Collection'].map(link => (
              <li key={link}><a href="#" className="text-sm text-surface/70 hover:text-secondary-container hover:pl-2 transition-all inline-block">{link}</a></li>
            ))}
          </ul>
        </motion.div>

        {/* Links Column 2 */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-secondary-container">Client Services</h3>
          <ul className="space-y-4">
            {['Book Appointment', 'Rental Terms', 'Shipping & Returns', 'FAQ'].map(link => (
              <li key={link}><a href="#" className="text-sm text-surface/70 hover:text-secondary-container hover:pl-2 transition-all inline-block">{link}</a></li>
            ))}
          </ul>
        </motion.div>

        {/* Newsletter Column */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-secondary-container">The Inner Circle</h3>
          <p className="text-sm text-surface/80 mb-6 font-light">Subscribe to receive exclusive invitations and early access to new collections.</p>
          <div className="flex border-b border-surface/30 pb-2 relative group mt-8">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="bg-transparent border-none outline-none text-sm w-full text-surface placeholder:text-surface/50 transition-all peer"
            />
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-secondary-container transition-all duration-500 peer-focus:w-full group-hover:w-full"></div>
            <button className="text-xs font-bold tracking-[0.1em] uppercase text-secondary-container hover:text-surface transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>

      </motion.div>

      {/* Bottom Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
        className="max-w-[1440px] mx-auto px-6 md:px-12 mt-24 pt-8 border-t border-surface/10 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10"
      >
        <p className="text-xs text-surface/50">&copy; {new Date().getFullYear()} Khubsurat Libas. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-surface/50 hover:text-secondary-container transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs text-surface/50 hover:text-secondary-container transition-colors">Terms of Service</a>
        </div>
      </motion.div>
    </footer>
  );
}
