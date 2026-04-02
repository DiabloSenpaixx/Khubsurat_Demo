import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Upload } from 'lucide-react';

export function HomepageManager({ onNavigate }: { onNavigate: (page: any) => void }) {
  const { token } = useAuth();
  const [marqueeText, setMarqueeText] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHomepage = async () => {
      const res = await fetch('/api/homepage');
      const data = await res.json();
      if (data.marqueeText) setMarqueeText(data.marqueeText);
      if (data.bannerImage) setExistingImage(data.bannerImage);
    };
    fetchHomepage();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('marqueeText', marqueeText);
    
    // If we upload a new local file
    if (newImageFile) {
      formData.append('bannerImage', newImageFile);
    } else {
      // Keep existing
      formData.append('bannerImage', existingImage);
    }

    try {
      await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      alert('Homepage assets updated successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to update homepage');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => onNavigate('admin-dashboard')} title="Back" className="p-2 hover:bg-surface-container rounded-full transition-colors">
          <ArrowLeft size={20} className="text-on-surface-variant" />
        </button>
        <h1 className="font-serif text-3xl text-primary">Homepage CMS</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-low border border-outline-variant p-8 space-y-8">
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Marquee Text (Header Announcement)</label>
          <input 
            type="text" 
            className="w-full p-4 border border-outline bg-surface focus:border-primary outline-none text-xl font-light"
            value={marqueeText}
            onChange={(e) => setMarqueeText(e.target.value)}
            required
            placeholder="e.g. NEW ARRIVALS &bull; THE WEDDING EDIT"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">Hero Banner Image</label>
          
          <div className="relative aspect-video bg-surface-container-highest border border-outline overflow-hidden mb-4 group">
            {(preview || existingImage) ? (
              <img src={preview || existingImage} className="w-full h-full object-cover" alt="Hero Banner" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-serif">No Image Selected</div>
            )}
            
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm transition-opacity ${(!preview && !existingImage) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <label className="cursor-pointer flex flex-col items-center justify-center text-white px-8 py-4 border border-white/50 hover:bg-white/10 transition-colors">
                <Upload size={24} className="mb-2" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase">Replace Banner</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant">Recommended size: 1920x1080 (16:9 aspect ratio or wider).</p>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="bg-primary text-on-primary px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-secondary transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Deploy Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
