import React from 'react';
import { ServiceItem } from './types';
import LucideIcon from './LucideIcon';
import ReadMoreText from './ReadMoreText';

interface ServicesProps {
  services: ServiceItem[];
}

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1 bg-brand-50 text-brand-800 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-md">
            <LucideIcon name="ShieldCheck" size={12} className="text-brand-600" />
            <span>Healthcare Programs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Featured Services & Programs
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Providing a complete suite of professional medical services to support you and your family across every life stage.
          </p>
        </div>

        {/* Services Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Showcase Hero Service Block (Span 2) */}
          <div className="lg:col-span-2 group flex flex-col bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative h-64 sm:h-96 w-full bg-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
                alt="Comprehensive Healthcare Excellence" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              
              {/* Badge */}
              <div className="absolute top-4 left-4 bg-brand-700 text-white rounded-lg px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-md">
                <LucideIcon name="HeartPulse" size={13} />
                <span>Premier Quality</span>
              </div>
            </div>

            <div className="p-8 space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Comprehensive Healthcare Excellence</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                <ReadMoreText text="We are committed to delivering exceptional patient satisfaction and clinical wellness. Each clinic pathway follows international medical standards, ensuring compassionate primary checks and advanced surgical diagnostics." limit={140} />
              </p>
              <div>
                <a href="#appointment" className="inline-flex items-center gap-1.5 font-bold text-brand-700 hover:text-brand-800 transition-colors">
                  <span>Explore medical workflows</span>
                  <LucideIcon name="ChevronRight" size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Right sidebar services list from db (Span 1) */}
          <div className="flex flex-col gap-4 col-span-1">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pl-2">Specialist Clinics</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className="group flex gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-brand-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-brand-50 text-brand-700 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-200">
                    <LucideIcon name={service.icon} size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-800 transition-colors">{service.title}</h4>
                    <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                      <ReadMoreText text={service.description} limit={60} />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {services.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400 font-medium">
                No custom services configured yet.
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
