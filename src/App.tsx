/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthProvider } from './context/AuthContext';

// Performance Optimization: Lazy load heavy route components
const HomePage = React.lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const ProductPage = React.lazy(() => import('./pages/ProductPage').then(module => ({ default: module.ProductPage })));
const BridalEditPage = React.lazy(() => import('./pages/BridalEditPage').then(module => ({ default: module.BridalEditPage })));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin').then(module => ({ default: module.AdminLogin })));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const ProductManager = React.lazy(() => import('./pages/admin/ProductManager').then(module => ({ default: module.ProductManager })));
const HomepageManager = React.lazy(() => import('./pages/admin/HomepageManager').then(module => ({ default: module.HomepageManager })));

// Loading fallback matching the luxury aesthetic
const RouteLoader = () => (
  <div className="flex h-[60vh] items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-0.5 w-16 overflow-hidden bg-rose-100 rounded">
        <div className="h-full bg-rose-900 animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: '50%', transformOrigin: 'left' }} />
      </div>
      <p className="text-xs tracking-[0.3em] uppercase text-stone-500 font-light">Curating</p>
    </div>
  </div>
);

export type PageType = 'home' | 'product' | 'bridal-edit' | 'admin-login' | 'admin-dashboard' | 'admin-products' | 'admin-homepage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('zoya-lehenga');

  const handleNavigate = (page: PageType, productId?: string) => {
    if (productId) setSelectedProductId(productId);
    setCurrentPage(page);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-rose-200 selection:text-rose-950 relative">
        <div className="bg-noise fixed inset-0 z-50 pointer-events-none mix-blend-multiply opacity-5"></div>
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        
        <main className="flex-grow pt-24 pb-12">
          <Suspense fallback={<RouteLoader />}>
            {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
            {currentPage === 'bridal-edit' && <BridalEditPage onNavigate={handleNavigate} />}
            {currentPage === 'product' && <ProductPage productId={selectedProductId} />}
            {currentPage === 'admin-login' && <AdminLogin onNavigate={handleNavigate} />}
            {currentPage === 'admin-dashboard' && <AdminDashboard onNavigate={handleNavigate} />}
            {currentPage === 'admin-products' && <ProductManager onNavigate={handleNavigate} />}
            {currentPage === 'admin-homepage' && <HomepageManager onNavigate={handleNavigate} />}
          </Suspense>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}
