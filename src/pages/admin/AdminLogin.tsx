import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export function AdminLogin({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      
      if (data.success) {
        login(data.token);
        onNavigate('admin-dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Make sure the server is running.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-surface-container-low border border-outline-variant shadow-lg"
      >
        <h2 className="text-2xl font-serif text-primary mb-6 text-center">Atelier Access</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="text-red-800 bg-red-100 p-3 text-sm">{error}</div>}
          <div>
            <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Username</label>
            <input 
              id="username"
              type="text" 
              className="w-full p-3 border border-outline bg-surface text-on-surface focus:border-primary outline-none transition-colors"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">Password</label>
            <div className="relative">
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'} 
                className="w-full p-3 border border-outline bg-surface text-on-surface focus:border-primary outline-none transition-colors"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-primary text-on-primary py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-secondary hover:text-on-secondary transition-all"
          >
            Authenticate
          </button>
        </form>
      </motion.div>
    </div>
  );
}
