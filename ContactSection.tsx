import React from 'react';
import { ClinicSettings, DoctorItem } from '../types';
import LucideIcon from './LucideIcon';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface ContactSectionProps {
  settings: ClinicSettings;
  doctors: DoctorItem[];
}

export default function ContactSection({ settings, doctors }: ContactSectionProps) {
  // Appointment form inputs
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [doctorId, setDoctorId] = React.useState('');
  const [appointmentDate, setAppointmentDate] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [whatsappHref, setWhatsappHref] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !appointmentDate) {
      alert('Please fill out Name, Phone and Appointment Date!');
      return;
    }

    setLoading(true);
    setSuccess(false);
    setWhatsappHref('');

    try {
      const docName = doctors.find(d => d.id === doctorId)?.name || 'General Doctor';
      const payload = {
        name,
        email: email || 'N/A',
        phone,
        doctorId: doctorId || 'Any available',
        doctorName: docName,
        date: appointmentDate,
        notes: notes || '',
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      // 1. Save in Firestore database appointments
      await addDoc(collection(db, 'appointments'), payload);

      // 2. Draft SMS structured WhatsApp details
      const whatsappText = `*NEPAL CLINIC -- APPOINTMENT RESERVATION*
---------------------------------------
👤 *Patient Name:* ${payload.name}
📞 *Phone Number:* ${payload.phone}
📧 *Email:* ${payload.email}
📅 *Requested Date:* ${payload.date}
👨‍⚕️ *Consultant:* ${payload.doctorName}
📝 *Symptom/Notes:* ${payload.notes || 'None'}
---------------------------------------
_Auto-generated request via Online Portal. Please confirm my appointment timings._`;

      const targetWhatsapp = settings.whatsappNumber || settings.phone || '9851051956';
      const cleanWhatsapp = targetWhatsapp.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(whatsappText)}`;
      
      setWhatsappHref(waUrl);
      setSuccess(true);

      // Try opening WhatsApp directly
      try {
        window.open(waUrl, '_blank');
      } catch (browserErr) {
        console.warn('Popup blocked, rendering fallback button', browserErr);
      }

      // Reset fields
      setName('');
      setEmail('');
      setPhone('');
      setDoctorId('');
      setAppointmentDate('');
      setNotes('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleMapUrl = (inputUrl: string) => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return '';

    // If it's a full iframe tag, we can render it safely
    if (trimmed.startsWith('<iframe')) {
      return trimmed;
    }

    // If it's a valid embed or output=embed link, return it directly
    if (trimmed.includes('output=embed') || trimmed.includes('/embed')) {
      return trimmed;
    }

    // For any short link (e.g. maps.app.goo.gl) or custom query,
    // we compile a premium query search embed pointing to the exact correct location
    // of Nepal Clinic Pvt. Ltd. at नयाँ पुल, चमती खुशीबन मार्ग to prevent incorrect listings.
    const customAddress = 'Nepal Clinic Pvt. Ltd., नयाँ पुल, चमती खुशीबन मार्ग, Kathmandu 44600';
    return `https://maps.google.com/maps?q=${encodeURIComponent(customAddress)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  };

  const mapData = handleMapUrl(settings.googleMapUrl || '');
  
  const getDirectMapLink = () => {
    const rawUrl = (settings.googleMapUrl || '').trim();
    if (!rawUrl) {
      return 'https://maps.app.goo.gl/zhRRza5e6hdmnnAp8';
    }

    // If it is an iframe, embed, or output=embed URL, redirect directly to the permanent live coordinates share link.
    const lowerUrl = rawUrl.toLowerCase();
    if (
      rawUrl.startsWith('<iframe') || 
      lowerUrl.includes('embed') || 
      lowerUrl.includes('output=') ||
      lowerUrl.includes('pb=')
    ) {
      return 'https://maps.app.goo.gl/zhRRza5e6hdmnnAp8';
    }

    return rawUrl;
  };

  const directMapLink = getDirectMapLink();

  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column contacting details info card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-black font-display text-white tracking-tight">Need Medical Assistance?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Contact our front desk directly at Nepal Clinic Pvt. Ltd. to expedite immediate tests, checkups or general wellness info.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-10 h-10 bg-brand-700/30 text-brand-500 rounded-xl flex items-center justify-center shrink-0 border border-brand-500/10">
                    <LucideIcon name="MapPin" size={18} className="text-brand-500" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Clinic Location</span>
                    <strong className="text-sm font-semibold">{settings.address}</strong>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-10 h-10 bg-brand-700/30 text-brand-500 rounded-xl flex items-center justify-center shrink-0 border border-brand-500/10">
                    <LucideIcon name="Phone" size={18} className="text-brand-500" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Phone & Hotline</span>
                    <a href={`tel:${settings.phone}`} className="text-sm font-semibold hover:text-brand-500 block transition-colors">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-10 h-10 bg-brand-700/30 text-brand-500 rounded-xl flex items-center justify-center shrink-0 border border-brand-500/10">
                    <LucideIcon name="Mail" size={18} className="text-brand-500" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">E-Mail Address</span>
                    <a href={`mailto:${settings.email}`} className="text-sm font-semibold hover:text-brand-500 block transition-colors">
                      {settings.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Embedded Live Map or query fallback block */}
            <div className="space-y-3">
              {mapData ? (
                <div className="overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 h-48 sm:h-52 relative shadow-inner animate-[fadeIn_0.5s_ease-out]">
                  {/* Visual non-blocking pointer events blocker overlay to prevent iframe redirect errors */}
                  <div className="absolute inset-0 z-10 cursor-alias" title="Click the directions button below to navigate" />
                  
                  {mapData.startsWith('<iframe') ? (
                    <div 
                      className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0 hover:opacity-95 transition-opacity pointer-events-none"
                      dangerouslySetInnerHTML={{ __html: mapData }}
                    />
                  ) : (
                    <iframe 
                      title="Nepal Clinic Location Map"
                      src={mapData} 
                      className="w-full h-full border-0 hover:opacity-95 transition-opacity pointer-events-none" 
                      allowFullScreen 
                      loading="lazy"
                    />
                  )}
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 h-44 relative flex items-center justify-center">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="text-center p-4 z-10 space-y-1.5">
                    <LucideIcon name="MapPin" size={24} className="text-brand-500 mx-auto fill-brand-500/10" />
                    <h5 className="font-bold text-xs">Interactive Route</h5>
                    <p className="text-[10px] text-slate-400">{settings.address}, Kathmandu</p>
                  </div>
                </div>
              )}

              {/* High precision navigation trigger to prevent wrong direction errors */}
              <a 
                href={directMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white rounded-xl py-3.5 px-4 font-black text-xs flex items-center gap-2 justify-center shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
              >
                <LucideIcon name="Navigation" size={14} className="animate-bounce" />
                <span>Open Exact Google Maps & Get Directions</span>
              </a>
            </div>
          </div>

          {/* Right Column Interactive Booking Form */}
          <div id="appointment" className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black font-display text-slate-900 tracking-tight">Book An Appointment</h3>
                <p className="text-slate-500 text-xs">Fill out the quick reservation details below, and our administration team will call or email to verify.</p>
              </div>

              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs flex flex-col gap-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <LucideIcon name="Check" size={16} />
                    </div>
                    <div className="flex-1">
                      <strong className="block font-bold">Appointment Requested Successfully!</strong>
                      <span className="block mt-0.5">Your record was saved in our clinic database. If WhatsApp didn't open automatically, click the button below:</span>
                    </div>
                  </div>
                  {whatsappHref && (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-[0.99] text-center"
                    >
                      <LucideIcon name="MessageSquare" size={14} />
                      <span>Send Details to Clinic WhatsApp Now</span>
                    </a>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Your Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Ram Bahadur" 
                      className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm py-3 px-3 sm:px-4 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Phone number <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. 9851051956" 
                      className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm py-3 px-3 sm:px-4 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. guest@gmail.com" 
                      className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm py-3 px-3 sm:px-4 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Appointment Date <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      required
                      value={appointmentDate}
                      onChange={e => setAppointmentDate(e.target.value)}
                      className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm py-3 px-3 sm:px-4 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Select Medical Professional</label>
                    <select
                      value={doctorId}
                      onChange={e => setDoctorId(e.target.value)}
                      className="w-full bg-slate-50 text-slate-700 text-sm py-3 px-4 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 transition-all font-semibold"
                    >
                      <option value="">Any available medical expert</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Add notes / query</label>
                    <textarea 
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Explain symptoms, key requests or custom dates request..."
                      className="w-full bg-slate-50 text-slate-800 text-sm py-3 px-4 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 transition-all font-medium resize-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-700 hover:bg-brand-600 disabled:bg-slate-300 text-white font-extrabold text-sm py-4 rounded-xl shadow-lg transition-transform duration-100 active:scale-[0.99] flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <span>Registering... Please wait</span>
                  ) : (
                    <>
                      <LucideIcon name="Plus" size={16} />
                      <span>Request Realtime Appointment</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
