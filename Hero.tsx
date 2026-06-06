import React from 'react';
import { ClinicSettings } from './types';
import LucideIcon from './LucideIcon';

interface HeroProps {
  settings: ClinicSettings;
}

export default function Hero({ settings }: HeroProps) {
  return (
    <section id="hero" className="relative pt-36 pb-20 bg-slate-50 overflow-hidden">
      {/* Decorative bg shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50 rounded-full filter blur-3xl -z-10 translate-x-24 -translate-y-24 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-50 rounded-full filter blur-3xl -z-10 -translate-x-24 translate-y-24 opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-12 lg:gap-16 items-center">
          
          {/* Left Column Text Content */}
          <div className="space-y-4 sm:space-y-8">
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
              <div className="flex items-center gap-1 px-1.5 py-0.5 sm:px-3 sm:py-1.5 bg-brand-100/80 text-brand-800 rounded-full text-[9px] sm:text-xs font-bold shadow-2xs">
                <LucideIcon name="ShieldCheck" size={10} className="text-brand-700 shrink-0" />
                <span className="truncate">Accredited</span>
              </div>
              <div className="flex items-center gap-1 px-1.5 py-0.5 sm:px-3 sm:py-1.5 bg-emerald-100/80 text-emerald-800 rounded-full text-[9px] sm:text-xs font-bold shadow-2xs">
                <LucideIcon name="Clock" size={10} className="text-emerald-700 shrink-0" />
                <span className="truncate">24/7 Care</span>
              </div>
              <div className="flex items-center gap-1 px-1.5 py-0.5 sm:px-3 sm:py-1.5 bg-amber-100/80 text-amber-850 rounded-full text-[9px] sm:text-xs font-bold shadow-2xs">
                <LucideIcon name="Star" size={10} className="text-amber-500 fill-amber-500 shrink-0" />
                <span className="truncate">4.9/5</span>
              </div>
            </div>

            {/* Dynamic Headers from Firebase */}
            <div className="space-y-1.5 sm:space-y-4">
              <h1 className="text-lg sm:text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight sm:leading-snug">
                {settings.heroTitle.split(' ').map((word, idx) => {
                  // Make Healthcare or specific words visually highlighted
                  if (word.toLowerCase() === 'healthcare' || word.toLowerCase() === 'excellence') {
                    return <span key={idx} className="text-brand-700 inline-block mr-1.5 sm:mr-2">{word}</span>;
                  }
                  return <span key={idx} className="inline-block mr-1.5 sm:mr-2">{word}</span>;
                })}
              </h1>
              <p className="text-[10px] sm:text-base md:text-lg text-slate-600 max-w-lg leading-relaxed line-clamp-3 sm:line-clamp-none">
                {settings.heroDescription}
              </p>
            </div>

            {/* Stats Counter Row */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-4 border-y border-slate-200/80 py-2 sm:py-6">
              <div>
                <span className="block text-sm sm:text-3xl md:text-4xl font-black text-slate-900 font-display">15+</span>
                <span className="block text-[8px] sm:text-xs font-bold text-slate-500 tracking-wide uppercase mt-0.5">Years Exp.</span>
              </div>
              <div>
                <span className="block text-sm sm:text-3xl md:text-4xl font-black text-slate-900 font-display">5,000+</span>
                <span className="block text-[8px] sm:text-xs font-bold text-slate-500 tracking-wide uppercase mt-0.5">Patients</span>
              </div>
              <div>
                <span className="block text-sm sm:text-3xl md:text-4xl font-black text-slate-900 font-display">50+</span>
                <span className="block text-[8px] sm:text-xs font-bold text-slate-500 tracking-wide uppercase mt-0.5">Experts</span>
              </div>
            </div>

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-4">
              <a href="#appointment" className="bg-brand-700 hover:bg-brand-600 text-white font-bold text-center px-3 py-1.5 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl shadow-md text-[10px] sm:text-base transition-all duration-150 active:scale-[0.98]">
                Book Appointment
              </a>
              <a href="#about" className="flex items-center justify-center gap-1 sm:gap-2 border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold px-3 py-1.5 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-base transition-colors">
                <LucideIcon name="Activity" size={12} className="text-brand-700 shrink-0 sm:scale-125" />
                <span>Our Specialties</span>
              </a>
            </div>

            {/* Emergency Info Row */}
            <div className="flex items-center gap-1.5 sm:gap-4 p-1.5 sm:p-4 bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl max-w-sm shadow-xs">
              <div className="w-6 h-6 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                <LucideIcon name="Phone" size={12} className="fill-red-600/10 sm:scale-125" />
              </div>
              <div>
                <span className="block text-[7px] sm:text-xs font-bold text-red-500 uppercase tracking-widest leading-none mb-0.5 sm:mb-1">Emergency Hotline</span>
                <a href={`tel:${settings.phone}`} className="text-slate-900 font-black text-[9px] sm:text-lg hover:text-brand-700 transition-colors leading-none block">
                  {settings.phone}
                </a>
              </div>
            </div>

          </div>

          {/* Right Column Visual Media */}
          <div className="relative justify-self-center lg:justify-self-end w-full max-w-lg lg:max-w-none">
            {/* Base Backdrop elements */}
            <div className="absolute top-2 left-2 right-2 bottom-2 sm:top-8 sm:left-8 sm:right-8 sm:bottom-8 rounded-2xl sm:rounded-3xl bg-teal-100/60 -rotate-3 -z-10"></div>
            
            {/* Primary medical visualization */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-white bg-slate-200 aspect-[4/3] lg:aspect-auto lg:h-[480px]">
              <img 
                src={settings.bannerImageUrl || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"} 
                alt={`${settings.name} Facility`} 
                className="w-full h-full object-cover"
              />
              
              {/* Floating Dynamic Available Doc card */}
              <div className="absolute left-1.5 bottom-1.5 sm:left-6 sm:bottom-6 bg-white/95 backdrop-blur-md p-1 sm:p-4 rounded-lg sm:rounded-2xl shadow-xl flex items-center gap-1 sm:gap-3 border border-white/60 max-w-[90px] sm:max-w-[240px] animate-bounce-slow">
                <div className="w-5 h-5 sm:w-10 sm:h-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                  <LucideIcon name="Clock" size={10} className="sm:scale-125" />
                </div>
                <div>
                  <h6 className="font-extrabold text-slate-900 text-[6px] sm:text-sm leading-none">Available</h6>
                  <p className="text-[5px] sm:text-xs text-brand-700 font-bold mt-0.5 sm:mt-1 leading-none">Today 2:30 PM</p>
                  <span className="block text-[4px] sm:text-[10px] text-slate-500 font-semibold mt-0.5 leading-none">Dr. Amanda Foster</span>
                </div>
              </div>

              {/* Floating review count badge */}
              <div className="absolute right-1.5 top-1.5 sm:right-6 sm:top-6 bg-slate-900/90 backdrop-blur-md p-1 sm:p-4 rounded-lg sm:rounded-xl border border-slate-800 text-white min-w-[60px] sm:min-w-[130px] shadow-lg text-center">
                <div className="flex justify-center gap-0.5 text-amber-400 mb-0.5 sm:mb-1">
                  <LucideIcon name="Star" size={6} className="fill-amber-400 sm:scale-125" />
                  <LucideIcon name="Star" size={6} className="fill-amber-400 sm:scale-125" />
                  <LucideIcon name="Star" size={6} className="fill-amber-400 sm:scale-125" />
                  <LucideIcon name="Star" size={6} className="fill-amber-400 sm:scale-125" />
                  <LucideIcon name="Star" size={6} className="fill-amber-400 sm:scale-125" />
                </div>
                <span className="font-black text-[9px] sm:text-xl leading-none block">4.9/5</span>
                <span className="block text-[5px] sm:text-[10px] text-slate-400 font-semibold mt-0.5 leading-none">1,234 reviews</span>
              </div>
            </div>

            {/* Circle deco styles */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-8 sm:-right-8 w-12 h-12 sm:w-24 sm:h-24 bg-brand-500/10 rounded-full -z-10 blur-xl"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
