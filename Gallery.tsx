import React from 'react';
import { GalleryItemType } from './types';
import LucideIcon from './LucideIcon';

interface GalleryProps {
  gallery: GalleryItemType[];
}

export default function Gallery({ gallery }: GalleryProps) {
  const [activeImage, setActiveImage] = React.useState<string | null>(null);

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1 bg-brand-50 text-brand-800 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-md">
            <LucideIcon name="Sparkles" size={12} className="text-brand-600" />
            <span>Facility Tour</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Hospital Gallery
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Take a look inside Nepal Clinic Pvt. Ltd. showing our modern clean environment, advanced clinical tools, diagnostic wings, and medical setups.
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {gallery.map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveImage(item.image)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-100 aspect-square shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover overlay details */}
              <div className="absolute inset-0 bg-brand-800/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="text-white space-y-1.5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-2">
                    <LucideIcon name="Search" size={14} className="text-white" />
                  </div>
                  <h4 className="font-extrabold text-sm tracking-wide leading-tight">{item.title}</h4>
                  <span className="block text-[10px] text-teal-100 uppercase font-black tracking-widest">Click to Zoom</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {gallery.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">
            No gallery imagery configured yet.
          </div>
        )}

        {/* Dynamic Photo Zoom Lightbox (Interactive overlay!) */}
        {activeImage && (
          <div 
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-50 p-4 transition-all animate-fadeIn"
          >
            <button 
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 text-white bg-slate-800 hover:bg-slate-700 p-3 rounded-full"
            >
              <LucideIcon name="X" size={24} />
            </button>
            <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-white border border-slate-800 shadow-2xl flex items-center justify-center relative">
              <img 
                src={activeImage} 
                alt="Enlarged gallery capture" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
