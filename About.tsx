import React from 'react';
import { ClinicSettings } from '../types';
import LucideIcon from './LucideIcon';
import ReadMoreText from './ReadMoreText';

interface AboutProps {
  settings: ClinicSettings;
}

export default function About({ settings }: AboutProps) {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-12 lg:gap-20 items-center">
          
          {/* Left Column Description */}
          <div className="space-y-3 sm:space-y-6">
            <div className="inline-flex items-center gap-1 bg-brand-50 text-brand-800 font-bold text-[9px] sm:text-xs uppercase tracking-widest px-2 py-1.5 rounded-md">
              <LucideIcon name="ShieldCheck" size={10} className="text-brand-600 shrink-0" />
              <span>About Our Clinic</span>
            </div>
            
            <h2 className="text-sm sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug sm:leading-tight">
              {settings.aboutTitle}
            </h2>
            
            <p className="text-[10px] sm:text-lg font-medium text-slate-700 leading-relaxed border-l-2 sm:border-l-4 border-brand-500 pl-2 sm:pl-4">
              {settings.aboutLeadText}
            </p>
            
            <div className="text-[10px] sm:text-base text-slate-600 leading-relaxed">
              <ReadMoreText text={settings.aboutText} limit={60} />
            </div>

            {/* Quick mini-stats display list */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-1.5 sm:p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="block text-sm sm:text-2xl font-black text-brand-700 font-display">15k+</span>
                <span className="block text-[7px] sm:text-xs text-slate-400 sm:text-slate-500 font-semibold uppercase tracking-wider scale-[0.85] origin-center truncate">Patients</span>
              </div>
              <div className="p-1.5 sm:p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="block text-sm sm:text-2xl font-black text-brand-700 font-display">25+</span>
                <span className="block text-[7px] sm:text-xs text-slate-400 sm:text-slate-500 font-semibold uppercase tracking-wider scale-[0.85] origin-center truncate font-display">Years</span>
              </div>
              <div className="p-1.5 sm:p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="block text-sm sm:text-2xl font-black text-brand-700 font-display">50+</span>
                <span className="block text-[7px] sm:text-xs text-slate-400 sm:text-slate-500 font-semibold uppercase tracking-wider scale-[0.85] origin-center truncate font-display font-medium">Experts</span>
              </div>
            </div>

            <div className="pt-2">
              <a href="#contact" className="inline-flex items-center gap-1 border border-slate-200 bg-slate-950 text-white font-bold text-[9px] sm:text-base px-2.5 py-1.5 sm:px-6 sm:py-3.5 rounded-lg hover:bg-slate-800 transition-colors shadow-md">
                <span>Location</span>
                <LucideIcon name="MapPin" size={10} className="sm:scale-125" />
              </a>
            </div>
          </div>

          {/* Right Column Media Elements */}
          <div className="relative">
            <div className="absolute top-2 left-2 sm:top-10 sm:left-10 w-full h-full border border-slate-200 bg-slate-100 rounded-2xl sm:rounded-3xl -z-10 animate-pulse-slow"></div>
            
            {/* Primary clinic visual illustration */}
            <div className="relative overflow-hidden shadow-2xl rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-white aspect-[4/3] bg-slate-200">
              <img 
                src={settings.aboutImageUrl || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"}
                alt="Clinic diagnostics center"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              
              {/* Overlay heart emergency banner card */}
              <div className="absolute right-1.5 bottom-1.5 sm:right-6 sm:bottom-6 bg-brand-800/95 backdrop-blur-md p-1.5 sm:p-5 rounded-lg sm:rounded-2xl text-white max-w-[85px] sm:max-w-xs shadow-xl border border-brand-700">
                <div className="flex gap-1 sm:gap-3 items-center">
                  <div className="w-5 h-5 sm:w-10 sm:h-10 bg-white/20 rounded-md sm:rounded-xl flex items-center justify-center shrink-0">
                    <LucideIcon name="HeartPulse" size={10} className="text-white sm:scale-125" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[6px] sm:text-sm tracking-wide leading-none">24/7 Care</h4>
                    <p className="text-[5px] sm:text-xs text-teal-100 font-semibold leading-none mt-0.5 sm:mt-1">Always online</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience circular stamp badge */}
            <div className="absolute -left-2 -top-2 sm:-left-6 sm:-top-6 bg-teal-50 border border-white shadow-lg w-10 h-10 sm:w-28 sm:h-28 rounded-full flex flex-col justify-center items-center text-center p-0.5 sm:p-2">
              <span className="block text-[10px] sm:text-2xl font-black text-brand-800 font-display leading-none">25+</span>
              <span className="block text-[4px] sm:text-[8px] text-brand-750 uppercase font-bold tracking-wider mt-0.5 scale-[0.8] leading-none shrink-0 truncate">Years Care</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
