import React from 'react';
import { DoctorItem } from './types';
import LucideIcon from './LucideIcon';

interface DoctorsProps {
  doctors: DoctorItem[];
}

export default function Doctors({ doctors }: DoctorsProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [specialtyFilter, setSpecialtyFilter] = React.useState('');

  // Extract unique specialties for filtering
  const specialties = React.useMemo(() => {
    const list = doctors.map(d => {
      // Clean specialist string or tag e.g. "Cardiology Specialist" -> "Cardiology"
      const word = d.specialty.split(' ')[0];
      return word;
    });
    return Array.from(new Set(list));
  }, [doctors]);

  const filteredDoctors = React.useMemo(() => {
    return doctors.filter(doc => {
      const matchName = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSpecialty = specialtyFilter === '' || doc.specialty.toLowerCase().includes(specialtyFilter.toLowerCase());
      return matchName && matchSpecialty;
    });
  }, [doctors, searchTerm, specialtyFilter]);

  return (
    <section id="doctors" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1 bg-brand-50 text-brand-800 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-md">
            <LucideIcon name="Award" size={12} className="text-brand-600" />
            <span>Medical Experts</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Certified Medical Team
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Expert physicians committed to helping you live a happy, healthy life. Review availability and book consults instantly.
          </p>
        </div>

        {/* Live Search and Filter form */}
        <div className="max-w-4xl mx-auto bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-sm mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            
            {/* Input name wrapper */}
            <div className="sm:col-span-5 relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <LucideIcon name="Search" size={16} />
              </div>
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search healthcare provider by name..."
                className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 transition-all font-medium"
              />
            </div>

            {/* Select specialty */}
            <div className="sm:col-span-4 relative">
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="w-full bg-slate-50 text-slate-700 text-sm pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 transition-all font-semibold appearance-none"
              >
                <option value="">All Specialties</option>
                {specialties.map((spec, idx) => (
                  <option key={idx} value={spec}>{spec}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                <LucideIcon name="ChevronDown" size={16} />
              </div>
            </div>

            {/* Status indicators quick overview */}
            <div className="sm:col-span-3 flex justify-center sm:justify-end gap-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              {searchTerm || specialtyFilter ? (
                <button 
                  onClick={() => { setSearchTerm(''); setSpecialtyFilter(''); }}
                  className="bg-brand-50 text-brand-700 border border-brand-100 hover:bg-brand-100 px-3 py-1.5 rounded-lg font-bold"
                >
                  Clear filter
                </button>
              ) : (
                <span className="text-slate-400">Filtering {filteredDoctors.length} docs</span>
              )}
            </div>

          </div>
        </div>

        {/* Doctors Profiles dynamic grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {filteredDoctors.map((doc) => (
            <div 
              key={doc.id}
              className="group flex flex-col bg-white border border-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-xl hover:border-brand-100 transition-all duration-300"
            >
              <div className="p-3 sm:p-6 space-y-2.5 sm:space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Doctor Portrait & meta */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <div className="relative shrink-0">
                    <img 
                      src={doc.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2'} 
                      alt={doc.name} 
                      className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover border-2 border-brand-100 shadow-sm"
                    />
                    {/* Status Dot */}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4.5 sm:h-4.5 border-1.5 sm:border-2 border-white rounded-full ${
                      doc.status === 'available' ? 'bg-emerald-500' :
                      doc.status === 'busy' ? 'bg-amber-500' : 'bg-slate-400'
                    }`}></span>
                  </div>
                  
                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <h3 className="font-extrabold text-slate-900 group-hover:text-brand-800 transition-colors tracking-tight text-xs sm:text-lg leading-tight truncate">
                      {doc.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] sm:text-xs bg-brand-50 text-brand-800 font-semibold px-1 py-0.2 sm:px-2 sm:py-0.5 rounded truncate">
                        {doc.specialty}
                      </span>
                    </div>
                    <span className="block text-[9px] sm:text-[11px] font-bold text-slate-500 flex items-center gap-1 leading-none">
                      <LucideIcon name="Award" size={10} className="text-brand-500 shrink-0" />
                      <span className="truncate">{doc.experience}</span>
                    </span>
                  </div>
                </div>

                {/* Rating section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-1.5 sm:p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] sm:text-xs gap-1">
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-500 shrink-0">
                      {[...Array(5)].map((_, starIdx) => {
                        const scoreDiff = doc.rating - starIdx;
                        return (
                          <span key={starIdx}>
                            <LucideIcon 
                              name="Star" 
                              size={10} 
                              className={`${scoreDiff >= 1 ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} 
                            />
                          </span>
                        );
                      })}
                    </div>
                    <span className="font-bold text-slate-700">{doc.rating}</span>
                  </div>
                  <span className="text-slate-500 font-semibold truncate leading-none">{doc.reviews} reviews</span>
                </div>

                {/* Action details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3 pt-1">
                  <a href="#appointment" className="text-[10px] sm:text-xs font-bold text-center text-slate-700 bg-slate-100 hover:bg-slate-200 py-1.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors">
                    Availability
                  </a>
                  <a href="#appointment" className="text-[10px] sm:text-xs font-bold text-center text-white bg-brand-700 hover:bg-brand-600 py-1.5 sm:py-3 rounded-lg sm:rounded-xl shadow-xs transition-colors">
                    Book
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center bg-white border border-slate-100 rounded-2xl p-12 max-w-lg mx-auto">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
              <LucideIcon name="Search" size={24} />
            </div>
            <h4 className="text-slate-800 font-bold mb-2">No Healthcare Providers Found</h4>
            <p className="text-slate-500 text-xs">No doctors matched "{searchTerm}" or "{specialtyFilter}". Try adjusting your filters.</p>
          </div>
        )}

      </div>
    </section>
  );
}
