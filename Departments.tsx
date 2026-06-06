import React from 'react';
import { DepartmentItem, ClinicSettings } from './types';
import LucideIcon from './LucideIcon';
import ReadMoreText from './ReadMoreText';

interface DepartmentsProps {
  departments: DepartmentItem[];
  settings: ClinicSettings;
}

export default function Departments({ departments, settings }: DepartmentsProps) {
  return (
    <section id="departments" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1 bg-brand-50 text-brand-800 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-md">
            <LucideIcon name="Activity" size={12} className="text-brand-600" />
            <span>Specialized Medicine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Featured Departments
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            We provide world-class clinical departments designed to offer advanced diagnostics, intervention, and ongoing patient rehabilitation.
          </p>
        </div>

        {/* Departments grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {departments.map((dept, idx) => {
            const isWide = idx < 2; // Keep the original wide cardiology / neurology layout, but constrain to sm-scale
            return (
              <div 
                key={dept.id} 
                className={`flex flex-col bg-white border border-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 ${
                  isWide ? 'sm:col-span-2 lg:col-span-1 border-t-4 border-t-brand-600' : ''
                }`}
              >
                {/* Media Image area */}
                <div className="relative h-28 sm:h-48 bg-slate-100">
                  <img 
                    src={dept.image} 
                    alt={dept.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 text-white">
                    <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg bg-brand-600 flex items-center justify-center border border-white/20 shrink-0">
                      <LucideIcon name={dept.icon} className="text-white" size={12} />
                    </div>
                    <span className="text-[9px] sm:text-xs font-semibold tracking-wide uppercase truncate">{dept.title.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Text descriptor content */}
                <div className="p-3 sm:p-6 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-xl font-bold text-slate-900 leading-tight truncate">{dept.title}</h3>
                    <div className="text-[10px] sm:text-sm text-slate-600 leading-relaxed">
                      <ReadMoreText text={dept.description} limit={35} />
                    </div>
                  </div>

                  {/* Features Bullet details */}
                  {dept.features && dept.features.length > 0 && (
                    <div className="space-y-1 pt-1.5 border-t border-slate-100">
                      <span className="block text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Offers:</span>
                      <ul className="grid grid-cols-1 gap-1">
                        {dept.features.slice(0, 2).map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-1 text-[9px] sm:text-xs text-slate-600 max-w-full">
                            <LucideIcon name="ShieldCheck" size={10} className="text-emerald-500 shrink-0" />
                            <span className="truncate">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-50">
                    <a href="#appointment" className="text-[10px] sm:text-xs font-bold text-brand-700 hover:text-brand-600 flex items-center gap-0.5">
                      <span>Book</span>
                      <LucideIcon name="ChevronRight" size={10} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency contact banner */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-2xl font-extrabold tracking-tight">Emergency Services Available 24/7</h3>
            <p className="text-red-100 max-w-xl text-sm leading-relaxed">
              Our emergency department is fully equipped with advanced lifesaving diagnostics and staffed by board-certified emergency physicians ready around the clock.
            </p>
          </div>
          <a 
            href={`tel:${settings.phone}`} 
            className="flex items-center gap-2 bg-white text-red-600 border border-white hover:bg-red-50 hover:text-red-700 font-extrabold px-6 py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] shrink-0"
          >
            <LucideIcon name="Phone" size={18} className="fill-red-600/10" />
            <span>Call Hotline: {settings.phone}</span>
          </a>
        </div>

      </div>
    </section>
  );
}
