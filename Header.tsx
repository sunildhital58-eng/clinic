import React from 'react';
import { ClinicSettings } from '../types';
import LucideIcon from './LucideIcon';

interface HeaderProps {
  settings: ClinicSettings;
  onAdminClick: () => void;
}

export default function Header({ settings, onAdminClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Contact info from Firebase dynamic state */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-center md:text-left">
            <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:text-brand-500 transition-colors">
              <LucideIcon name="Mail" size={13} className="text-brand-500" />
              <span>{settings.email}</span>
            </a>
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5 hover:text-brand-500 transition-colors">
              <LucideIcon name="Phone" size={13} className="text-brand-500" />
              <span>{settings.phone}</span>
            </a>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="flex items-center gap-1">
              <LucideIcon name="MapPin" size={13} className="text-brand-500" />
              <span>{settings.address}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                  <LucideIcon name="Facebook" size={14} />
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                  <LucideIcon name="Instagram" size={14} />
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                  <LucideIcon name="Twitter" size={14} />
                </a>
              )}
              {settings.whatsappNumber && (
                <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                  <LucideIcon name="MessageSquare" size={14} />
                </a>
              )}
            </div>
            <button 
              onClick={onAdminClick}
              className="flex items-center gap-1 bg-brand-700 hover:bg-brand-600 text-white font-medium text-xs px-2.5 py-1 rounded transition-colors duration-150"
            >
              <LucideIcon name="Lock" size={11} />
              <span>Admin Center</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center gap-3 group">
          {/* Elongated rectangle box for logo (from left to right) */}
          <div className="flex-shrink-0 h-10 w-24 sm:h-12 sm:w-36 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 bg-slate-50 relative group-hover:border-brand-400 transition-all duration-300 shadow-xs">
            {settings.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={`${settings.name} Logo`} 
                className="w-full h-full object-contain p-1" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-emerald-500 flex items-center justify-between px-3">
                <LucideIcon name="HeartPulse" className="text-white animate-pulse shrink-0" size={18} />
                <span className="font-display font-black text-white text-[10px] sm:text-xs tracking-wider leading-none">NCPL</span>
              </div>
            )}
          </div>
          <span className="text-sm sm:text-2xl font-bold font-display text-slate-900 tracking-tight leading-none">
            {settings.name}
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <a href="#hero" className="text-slate-600 hover:text-brand-700 font-medium text-sm transition-colors">Home</a>
          <a href="#about" className="text-slate-600 hover:text-brand-700 font-medium text-sm transition-colors">About</a>
          <a href="#departments" className="text-slate-600 hover:text-brand-700 font-medium text-sm transition-colors">Departments</a>
          <a href="#services" className="text-slate-600 hover:text-brand-700 font-medium text-sm transition-colors">Services</a>
          <a href="#doctors" className="text-slate-600 hover:text-brand-700 font-medium text-sm transition-colors">Doctors</a>
          <a href="#gallery" className="text-slate-600 hover:text-brand-700 font-medium text-sm transition-colors">Gallery</a>
          <a href="#contact" className="text-slate-600 hover:text-brand-700 font-medium text-sm transition-colors">Contact</a>
          <a href="#appointment" className="bg-brand-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-600 transition-all shadow-md active:scale-[0.98]">
            Book Appointment
          </a>
        </nav>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-brand-700 focus:outline-none"
        >
          <LucideIcon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
        </button>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white py-4 px-6 shadow-lg flex flex-col gap-4 animate-fadeIn">
          <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 hover:text-brand-700 font-medium py-1.5 transition-colors">Home</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 hover:text-brand-700 font-medium py-1.5 transition-colors">About</a>
          <a href="#departments" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 hover:text-brand-700 font-medium py-1.5 transition-colors">Departments</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 hover:text-brand-700 font-medium py-1.5 transition-colors">Services</a>
          <a href="#doctors" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 hover:text-brand-700 font-medium py-1.5 transition-colors">Doctors</a>
          <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 hover:text-brand-700 font-medium py-1.5 transition-colors">Gallery</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 hover:text-brand-700 font-medium py-1.5 transition-colors">Contact</a>
          <a href="#appointment" onClick={() => setMobileMenuOpen(false)} className="bg-brand-700 text-white font-semibold text-center text-sm py-2.5 rounded-lg hover:bg-brand-600 transition-all shadow-md">
            Book Appointment
          </a>
        </div>
      )}
    </header>
  );
}
