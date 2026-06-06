import React from 'react';
import { ClinicSettings, ServiceItem, DoctorItem, GalleryItemType, DepartmentItem, FAQItem } from '../types';
import LucideIcon from './LucideIcon';
import { doc, setDoc, deleteDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface AdminPanelProps {
  onClose: () => void;
  settings: ClinicSettings;
  services: ServiceItem[];
  doctors: DoctorItem[];
  gallery: GalleryItemType[];
  departments: DepartmentItem[];
  faqs: FAQItem[];
}

export default function AdminPanel({
  onClose,
  settings,
  services,
  doctors,
  gallery,
  departments,
  faqs,
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [loginError, setLoginError] = React.useState('');

  // Active Tab State
  const [activeTab, setActiveTab] = React.useState<'settings' | 'services' | 'doctors' | 'gallery' | 'departments' | 'appointments' | 'faqs'>('settings');

  // Load appointments state
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [loadingAppts, setLoadingAppts] = React.useState(false);

  // General Settings editing form state
  const [settingsForm, setSettingsForm] = React.useState<ClinicSettings>(settings);

  // Services Edit/New State
  const [editingServiceId, setEditingServiceId] = React.useState<string | null>(null);
  const [serviceForm, setServiceForm] = React.useState<Omit<ServiceItem, 'id'>>({
    title: '',
    description: '',
    icon: 'Activity',
  });

  // Doctors Edit/New State
  const [editingDoctorId, setEditingDoctorId] = React.useState<string | null>(null);
  const [doctorForm, setDoctorForm] = React.useState<Omit<DoctorItem, 'id'>>({
    name: '',
    specialty: '',
    experience: '5 years experience',
    rating: 5.0,
    reviews: 10,
    status: 'available',
    image: '',
  });

  // Gallery Edit/New State
  const [editingGalleryId, setEditingGalleryId] = React.useState<string | null>(null);
  const [galleryForm, setGalleryForm] = React.useState<Omit<GalleryItemType, 'id'>>({
    title: '',
    image: '',
  });

  // Departments Edit/New State
  const [editingDeptId, setEditingDeptId] = React.useState<string | null>(null);
  const [deptForm, setDeptForm] = React.useState<Omit<DepartmentItem, 'id'>>({
    title: '',
    description: '',
    icon: 'Stethoscope',
    features: ['Service feature 1', 'Service feature 2'],
    image: '',
  });
  const [deptFeatureText, setDeptFeatureText] = React.useState('');

  // FAQs Edit/New State
  const [editingFAQId, setEditingFAQId] = React.useState<string | null>(null);
  const [faqForm, setFaqForm] = React.useState<Omit<FAQItem, 'id'>>({
    question: '',
    answer: '',
  });

  // Auto-sync settings state when loaded settings change
  React.useEffect(() => {
    if (settings) {
      setSettingsForm(settings);
    }
  }, [settings]);

  // Load appointments from Firebase on mount or tab focus
  const fetchAppointments = async () => {
    setLoadingAppts(true);
    try {
      const q = await getDocs(collection(db, 'appointments'));
      const list: any[] = [];
      q.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setAppointments(list);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'appointments');
    } finally {
      setLoadingAppts(false);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated && activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [isAuthenticated, activeTab]);

  // Password submission handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '12345') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Password! Try again.');
    }
  };

  // 1. SAVE CLINIC SETTINGS
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'clinic_info', 'main'), settingsForm);
      alert('Clinic general settings saved successfully!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'clinic_info/main');
    }
  };

  // 1.5. FAQ MANAGEMENT ACTIONS
  const handleSaveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) {
      alert('Please fill out both the question and answer fields!');
      return;
    }
    try {
      const id = editingFAQId || 'faq_' + Date.now();
      const payload: FAQItem = { id, ...faqForm };
      await setDoc(doc(db, 'faqs', id), payload);
      alert('FAQ item saved successfully!');
      setEditingFAQId(null);
      setFaqForm({ question: '', answer: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'faqs');
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this FAQ item?')) return;
    try {
      await deleteDoc(doc(db, 'faqs', id));
      alert('FAQ item deleted successfully.');
      if (editingFAQId === id) {
        setEditingFAQId(null);
        setFaqForm({ question: '', answer: '' });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `faqs/${id}`);
    }
  };

  // 2. SERVICES ACTIONS
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingServiceId || 's_' + Date.now();
      const payload: ServiceItem = { id, ...serviceForm };
      await setDoc(doc(db, 'services', id), payload);
      alert('Service saved successfully!');
      // Reset Form
      setEditingServiceId(null);
      setServiceForm({ title: '', description: '', icon: 'Activity' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'services');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this service?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      alert('Service deleted successfully.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
    }
  };

  // 3. DOCTORS ACTIONS
  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingDoctorId || 'doc_' + Date.now();
      const payload: DoctorItem = { id, ...doctorForm };
      await setDoc(doc(db, 'doctors', id), payload);
      alert('Doctor profile saved successfully!');
      // Reset Form
      setEditingDoctorId(null);
      setDoctorForm({
        name: '',
        specialty: '',
        experience: '5 years experience',
        rating: 5.0,
        reviews: 10,
        status: 'available',
        image: '',
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'doctors');
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm('Delete this doctor profile?')) return;
    try {
      await deleteDoc(doc(db, 'doctors', id));
      alert('Doctor deleted.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `doctors/${id}`);
    }
  };

  // 4. GALLERY ACTIONS
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingGalleryId || 'gal_' + Date.now();
      const payload: GalleryItemType = { id, ...galleryForm };
      await setDoc(doc(db, 'gallery', id), payload);
      alert('Gallery item saved successfully!');
      // Reset Form
      setEditingGalleryId(null);
      setGalleryForm({ title: '', image: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Delete this gallery image?')) return;
    try {
      await deleteDoc(doc(db, 'gallery', id));
      alert('Gallery item deleted.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
    }
  };

  // 5. DEPARTMENTS ACTIONS
  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingDeptId || 'dept_' + Date.now();
      const payload: DepartmentItem = { id, ...deptForm };
      await setDoc(doc(db, 'departments', id), payload);
      alert('Department updated successfully!');
      // Reset Form
      setEditingDeptId(null);
      setDeptForm({
        title: '',
        description: '',
        icon: 'Stethoscope',
        features: ['Feature 1', 'Feature 2'],
        image: '',
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'departments');
    }
  };

  const handleDeleteDept = async (id: string) => {
    if (!confirm('Delete this department?')) return;
    try {
      await deleteDoc(doc(db, 'departments', id));
      alert('Department deleted.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `departments/${id}`);
    }
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 sm:p-10 max-w-md w-full relative space-y-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full"
          >
            <LucideIcon name="X" size={24} />
          </button>

          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-brand-50 text-brand-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <LucideIcon name="Lock" size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Authentication</h2>
            <p className="text-xs text-slate-500">Provide the administrator system passcode to unlock editing parameters, lists and databases in real-time.</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-xs font-semibold text-center leading-relaxed">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Enter Passcode</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                placeholder="•••••" 
                className="w-full text-center tracking-widest text-lg font-black bg-slate-50 text-slate-900 py-3.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-700 hover:bg-brand-600 text-white font-extrabold text-sm py-4 rounded-xl transition-all shadow-md active:scale-[0.99]"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-medium">Nepal Clinic Pvt. Ltd. • Realtime Management</span>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED REALTIME DASHBOARD
  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 overflow-hidden animate-fadeIn">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar Nav section */}
        <div className="md:w-64 bg-slate-900 text-slate-300 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-8">
            {/* Logo brand */}
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <div className="p-1.5 bg-brand-500 text-white rounded-lg">
                <LucideIcon name="Settings" size={18} />
              </div>
              <div>
                <span className="block font-black text-sm tracking-tight text-white uppercase">Admin Console</span>
                <span className="block text-[9px] text-brand-400 font-bold tracking-widest">REALTIME MODE</span>
              </div>
            </div>

            {/* Menu Links */}
            <nav className="flex flex-col gap-2.5">
              <button 
                onClick={() => { setActiveTab('settings'); }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'settings' ? 'bg-brand-700 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                <LucideIcon name="Sliders" size={14} />
                <span>General Settings</span>
              </button>

              <button 
                onClick={() => { setActiveTab('services'); }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'services' ? 'bg-brand-700 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                <LucideIcon name="Activity" size={14} />
                <span>Services</span>
              </button>

              <button 
                onClick={() => { setActiveTab('doctors'); }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'doctors' ? 'bg-brand-700 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                <LucideIcon name="Award" size={14} />
                <span>Doctors Profiles</span>
              </button>

              <button 
                onClick={() => { setActiveTab('gallery'); }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'gallery' ? 'bg-brand-700 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                <LucideIcon name="Image" size={14} />
                <span>Hospital Gallery</span>
              </button>

              <button 
                onClick={() => { setActiveTab('departments'); }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'departments' ? 'bg-brand-700 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                <LucideIcon name="HeartPulse" size={14} />
                <span>Clinical Departments</span>
              </button>

              <button 
                onClick={() => { setActiveTab('faqs'); }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'faqs' ? 'bg-brand-700 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                <LucideIcon name="HelpCircle" size={14} />
                <span>FAQs Support</span>
              </button>

              <button 
                onClick={() => { setActiveTab('appointments'); }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'appointments' ? 'bg-brand-700 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                <LucideIcon name="Clock" size={14} />
                <span>Appointments List</span>
              </button>
            </nav>
          </div>

          <button 
            onClick={onClose}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-xl transition-all"
          >
            <LucideIcon name="X" size={14} />
            <span>Close Dashboard</span>
          </button>
        </div>

        {/* Dynamic Editor Workspace content area */}
        <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
          
          {/* Header area */}
          <div className="h-16 bg-white border-b border-slate-100 px-6 flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-extrabold text-slate-900 uppercase tracking-tight text-sm">
                Managing: {activeTab === 'settings' ? 'Clinic Metadata' : activeTab}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span>Online Synchronization</span>
            </div>
          </div>

          {/* Scrolling Content area */}
          <div className="flex-1 p-6 overflow-y-auto">
            
            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Branding & Contact Info</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Clinic Name</label>
                      <input 
                        type="text" 
                        required
                        value={settingsForm.name}
                        onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Contact Phone</label>
                      <input 
                        type="text" 
                        required
                        value={settingsForm.phone}
                        onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Email</label>
                      <input 
                        type="email" 
                        required
                        value={settingsForm.email}
                        onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Clinic Physical Address</label>
                      <input 
                        type="text" 
                        required
                        value={settingsForm.address}
                        onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Hero Header Settings</h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Hero Headline Title</label>
                      <input 
                        type="text" 
                        required
                        value={settingsForm.heroTitle}
                        onChange={e => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Hero Paragraph description</label>
                      <textarea 
                        required
                        value={settingsForm.heroDescription}
                        onChange={e => setSettingsForm({ ...settingsForm, heroDescription: e.target.value })}
                        rows={2}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">About Section narrative</h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">About Section Headline Title</label>
                      <input 
                        type="text" 
                        required
                        value={settingsForm.aboutTitle}
                        onChange={e => setSettingsForm({ ...settingsForm, aboutTitle: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">About Section Lead Text</label>
                      <input 
                        type="text" 
                        required
                        value={settingsForm.aboutLeadText}
                        onChange={e => setSettingsForm({ ...settingsForm, aboutLeadText: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">About Section Detail Text</label>
                      <textarea 
                        required
                        value={settingsForm.aboutText}
                        onChange={e => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                        rows={4}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500 text-slate-700 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">App Banner, Live Map & Social Media links</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <LucideIcon name="ShieldCheck" size={12} className="text-brand-500" />
                        <span>Clinic Logo Image URL (Rectangle / Horizontal format)</span>
                      </label>
                      <input 
                        type="url" 
                        placeholder="e.g. Drop any online transparent PNG logo link here"
                        value={settingsForm.logoUrl || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                      <span className="block text-[10px] text-slate-400">Customizes the elongated rectangular brand logo container displayed directly to the left of your Nepal Clinic title.</span>
                      {settingsForm.logoUrl && (
                        <div className="mt-1.5 p-2 bg-slate-50 rounded-xl inline-flex items-center gap-3 border border-slate-200/60 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preview Logo:</span>
                          <div className="h-10 w-24 sm:w-28 rounded-lg border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
                            <img src={settingsForm.logoUrl} className="w-full h-full object-contain p-1" alt="Logo preview" referrerPolicy="no-referrer" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <LucideIcon name="Image" size={12} className="text-brand-500" />
                        <span>Dynamic Hero Banner Photo URL</span>
                      </label>
                      <input 
                        type="url" 
                        placeholder="e.g. https://images.unsplash.com/... or any online image URL"
                        value={settingsForm.bannerImageUrl || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, bannerImageUrl: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                      <span className="block text-[10px] text-slate-400">Customizes the display picture loaded dynamically at the right column of the landing hero.</span>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <LucideIcon name="Image" size={12} className="text-emerald-500" />
                        <span>Dynamic About Section Photo URL (Compassionate Care, Advanced Medicine)</span>
                      </label>
                      <input 
                        type="url" 
                        placeholder="e.g. https://images.unsplash.com/... or any online image URL for Compassionate Care section"
                        value={settingsForm.aboutImageUrl || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, aboutImageUrl: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                      <span className="block text-[10px] text-slate-400">Customizes the display picture loaded dynamically inside the "Compassionate Care, Advanced Medicine" About clinic section.</span>
                      {settingsForm.aboutImageUrl && (
                        <div className="mt-1.5 p-2 bg-slate-50 rounded-xl inline-flex items-center gap-3 border border-slate-200/60 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preview About Section Image:</span>
                          <div className="h-12 w-20 rounded-lg border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
                            <img src={settingsForm.aboutImageUrl} className="w-full h-full object-cover" alt="About preview" referrerPolicy="no-referrer" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <LucideIcon name="Map" size={12} className="text-brand-500" />
                        <span>Google Maps Live Location Embed URL / iframe</span>
                      </label>
                      <textarea 
                        rows={2}
                        placeholder="e.g. https://www.google.com/maps/embed?... or Google Maps <iframe> tag"
                        value={settingsForm.googleMapUrl || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, googleMapUrl: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                      />
                      <span className="block text-[10px] text-slate-400">Insert standard URL source or directly drop standard embed code (e.g. &lt;iframe&gt;) obtained from the Google Maps share tool.</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <LucideIcon name="MessageSquare" size={12} className="text-brand-500" />
                        <span>WhatsApp Number (with country code)</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. 9851051956 or international 9779851051956"
                        value={settingsForm.whatsappNumber || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <LucideIcon name="Facebook" size={12} className="text-brand-500" />
                        <span>Facebook Profile Link URL</span>
                      </label>
                      <input 
                        type="url" 
                        placeholder="e.g. https://facebook.com/nepalclinic"
                        value={settingsForm.facebookUrl || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <LucideIcon name="Instagram" size={12} className="text-brand-500" />
                        <span>Instagram Profile Link URL</span>
                      </label>
                      <input 
                        type="url" 
                        placeholder="e.g. https://instagram.com/nepalclinic"
                        value={settingsForm.instagramUrl || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <LucideIcon name="Twitter" size={12} className="text-brand-500" />
                        <span>Twitter Profile Link URL</span>
                      </label>
                      <input 
                        type="url" 
                        placeholder="e.g. https://twitter.com/nepalclinic"
                        value={settingsForm.twitterUrl || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, twitterUrl: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="bg-brand-700 hover:bg-brand-600 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  Save settings modifications
                </button>
              </form>
            )}

            {/* TAB: SERVICES */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                
                {/* Save/Edit form */}
                <form onSubmit={handleSaveService} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs max-w-3xl space-y-4">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                    {editingServiceId ? 'Edit Selected Service' : 'Configure New Service Item'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Service Title</label>
                      <input 
                        type="text" 
                        required
                        value={serviceForm.title}
                        onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })}
                        placeholder="e.g. Skin Cancer Check"
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Service Lucide Icon Name</label>
                      <select 
                        value={serviceForm.icon}
                        onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
                      >
                        <option value="Activity">Activity (Pulse)</option>
                        <option value="Sparkles">Sparkles (Derm)</option>
                        <option value="FlaskConical">FlaskConical (Lab)</option>
                        <option value="HeartPulse">HeartHeart (Cardio)</option>
                        <option value="Stethoscope">Stethoscope (General)</option>
                        <option value="Baby">Baby (Peds)</option>
                        <option value="Brain">Brain (Neurology)</option>
                        <option value="Eye">Eye (Ophth)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Service Description</label>
                    <textarea 
                      required
                      value={serviceForm.description}
                      onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                      placeholder="Explain features and specifications of this specialty..."
                      rows={2}
                      className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="flex gap-2.5">
                    <button 
                      type="submit"
                      className="bg-brand-700 hover:bg-brand-600 text-white font-extrabold text-xs px-5 py-3 rounded-lg shadow-sm"
                    >
                      {editingServiceId ? 'Update Service' : 'Create Service Entry'}
                    </button>
                    {editingServiceId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingServiceId(null);
                          setServiceForm({ title: '', description: '', icon: 'Activity' });
                        }}
                        className="bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-lg"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* List block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                  {services.map(item => (
                    <div key={item.id} className="p-5 bg-white border border-slate-100 rounded-2xl flex justify-between items-start">
                      <div className="flex gap-3 items-start">
                        <div className="p-2.5 bg-brand-50 text-brand-700 rounded-lg">
                          <LucideIcon name={item.icon} size={18} />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-slate-900 text-xs">{item.title}</h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-1 max-w-[280px]">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => {
                            setEditingServiceId(item.id);
                            setServiceForm({ title: item.title, description: item.description, icon: item.icon });
                          }}
                          className="p-2 text-slate-500 hover:text-brand-700 rounded-lg"
                        >
                          <LucideIcon name="Edit2" size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteService(item.id)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                        >
                          <LucideIcon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB: DOCTORS */}
            {activeTab === 'doctors' && (
              <div className="space-y-6">
                
                {/* New / Edit Form */}
                <form onSubmit={handleSaveDoctor} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs max-w-4xl space-y-4">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                    {editingDoctorId ? 'Edit Selected Doctor profile' : 'Add New Medical Expert'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Doctor Full Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Dr. Ram Bahadur"
                        value={doctorForm.name}
                        onChange={e => setDoctorForm({ ...doctorForm, name: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Specialty / Role label</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Cardiology Specialist"
                        value={doctorForm.specialty}
                        onChange={e => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Years of experience</label>
                      <input 
                        type="text" 
                        required
                        placeholder="12 years experience"
                        value={doctorForm.experience}
                        onChange={e => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Average Rating (out of 5)</label>
                      <input 
                        type="number" 
                        required
                        step="0.1"
                        min="1"
                        max="5"
                        value={doctorForm.rating}
                        onChange={e => setDoctorForm({ ...doctorForm, rating: parseFloat(e.target.value) || 5.0 })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500 font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Reviews Submitted count</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        value={doctorForm.reviews}
                        onChange={e => setDoctorForm({ ...doctorForm, reviews: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Availability Status</label>
                      <select 
                        value={doctorForm.status}
                        onChange={e => setDoctorForm({ ...doctorForm, status: e.target.value as any })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
                      >
                        <option value="available">Available (Green dot)</option>
                        <option value="busy">Busy (Orange dot)</option>
                        <option value="offline">Offline (Gray dot)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Doctor Photo URL</label>
                      <input 
                        type="url" 
                        placeholder="https://images.unsplash.com/..." 
                        value={doctorForm.image}
                        onChange={e => setDoctorForm({ ...doctorForm, image: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <button 
                      type="submit"
                      className="bg-brand-700 hover:bg-brand-600 text-white font-extrabold text-xs px-5 py-3 rounded-lg shadow-sm"
                    >
                      {editingDoctorId ? 'Update Doctor Profile' : 'Save New Doctor Profile'}
                    </button>
                    {editingDoctorId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingDoctorId(null);
                          setDoctorForm({ name: '', specialty: '', experience: '5 years experience', rating: 5.0, reviews: 10, status: 'available', image: '' });
                        }}
                        className="bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-lg"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Grid List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
                  {doctors.map(doc => (
                    <div key={doc.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col justify-between shadow-xs">
                      <div className="flex items-center gap-3">
                        <img src={doc.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2'} alt={doc.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div>
                          <strong className="block text-xs font-extrabold text-slate-950">{doc.name}</strong>
                          <span className="block text-[10px] text-brand-700 font-semibold">{doc.specialty}</span>
                          <span className="block text-[9px] text-slate-400">{doc.experience}</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-100 mt-3 flex justify-between items-center">
                        <span className={`text-[10px] font-bold uppercase ${
                          doc.status === 'available' ? 'text-emerald-600' : doc.status === 'busy' ? 'text-amber-500' : 'text-slate-400'
                        }`}>Status: {doc.status}</span>
                        
                        <div className="flex">
                          <button 
                            onClick={() => {
                              setEditingDoctorId(doc.id);
                              setDoctorForm({
                                name: doc.name,
                                specialty: doc.specialty,
                                experience: doc.experience,
                                rating: doc.rating,
                                reviews: doc.reviews,
                                status: doc.status,
                                image: doc.image || '',
                              });
                            }}
                            className="p-1 px-2.5 text-xs text-brand-700 font-bold hover:bg-brand-50 rounded"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteDoctor(doc.id)}
                            className="p-1 px-2 text-xs text-red-600 font-bold hover:bg-red-50 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB: GALLERY */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                
                {/* Save form */}
                <form onSubmit={handleSaveGallery} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs max-w-3xl space-y-4">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                    {editingGalleryId ? 'Edit Gallery Photo' : 'Upload New Gallery Capture'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Image Description / Title</label>
                      <input 
                        type="text" 
                        required
                        value={galleryForm.title}
                        onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                        placeholder="e.g. Vaccination Ward"
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Photo CDN Image URL</label>
                      <input 
                        type="url" 
                        required
                        value={galleryForm.image}
                        onChange={e => setGalleryForm({ ...galleryForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <button 
                      type="submit"
                      className="bg-brand-700 hover:bg-brand-600 text-white font-extrabold text-xs px-5 py-3 rounded-lg shadow-sm"
                    >
                      {editingGalleryId ? 'Update Photo' : 'Add Photo to Gallery'}
                    </button>
                    {editingGalleryId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingGalleryId(null);
                          setGalleryForm({ title: '', image: '' });
                        }}
                        className="bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-lg"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* List thumbnails */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-5xl">
                  {gallery.map(item => (
                    <div key={item.id} className="relative group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
                      <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <strong className="block text-[11px] text-slate-700 truncate">{item.title}</strong>
                        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end gap-1">
                          <button 
                            onClick={() => {
                              setEditingGalleryId(item.id);
                              setGalleryForm({ title: item.title, image: item.image });
                            }}
                            className="text-[10px] font-bold text-brand-700 hover:underline px-2"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteGallery(item.id)}
                            className="text-[10px] font-bold text-red-600 hover:underline px-2"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB: DEPARTMENTS */}
            {activeTab === 'departments' && (
              <div className="space-y-6">
                
                {/* Save Form */}
                <form onSubmit={handleSaveDept} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs max-w-3xl space-y-4">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                    {editingDeptId ? 'Edit Department Details' : 'Add New Department'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Department Title</label>
                      <input 
                        type="text" 
                        required
                        value={deptForm.title}
                        onChange={e => setDeptForm({ ...deptForm, title: e.target.value })}
                        placeholder="e.g. Cardiovascular Medicine"
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Icon Name (Lucide format)</label>
                      <input 
                        type="text" 
                        required
                        value={deptForm.icon}
                        onChange={e => setDeptForm({ ...deptForm, icon: e.target.value })}
                        placeholder="e.g. Brain, HeartPulse, Bone"
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Department Cover Image URL</label>
                      <input 
                        type="url" 
                        required
                        value={deptForm.image}
                        onChange={e => setDeptForm({ ...deptForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Department Description</label>
                      <textarea 
                        required
                        value={deptForm.description}
                        onChange={e => setDeptForm({ ...deptForm, description: e.target.value })}
                        rows={2}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500 text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Features mini tags manager */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Department Highlight Features</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {deptForm.features.map((feat, fIdx) => (
                        <span key={fIdx} className="bg-brand-50 text-brand-800 text-[10px] font-extrabold px-2.5 py-1 rounded flex items-center gap-1.5 border border-brand-100">
                          <span>{feat}</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              const updated = [...deptForm.features];
                              updated.splice(fIdx, 1);
                              setDeptForm({ ...deptForm, features: updated });
                            }}
                            className="text-red-500 hover:text-red-700 text-xs font-black inline-block"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={deptFeatureText}
                        onChange={e => setDeptFeatureText(e.target.value)}
                        placeholder="Add bullet details e.g. 'Minimally Invasive Joint Surgery'"
                        className="flex-1 bg-slate-100 px-3.5 py-2 rounded text-xs border border-slate-200 focus:outline-none focus:bg-white"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (!deptFeatureText.trim()) return;
                          setDeptForm({ ...deptForm, features: [...deptForm.features, deptFeatureText.trim()] });
                          setDeptFeatureText('');
                        }}
                        className="bg-slate-800 text-white text-xs px-3.5 py-2 rounded-lg font-bold hover:bg-slate-700"
                      >
                        Add bullet
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button 
                      type="submit"
                      className="bg-brand-700 hover:bg-brand-600 text-white font-extrabold text-xs px-5 py-3 rounded-lg shadow-sm"
                    >
                      {editingDeptId ? 'Update Department' : 'Create Department'}
                    </button>
                    {editingDeptId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingDeptId(null);
                          setDeptForm({ title: '', description: '', icon: 'Stethoscope', features: [], image: '' });
                        }}
                        className="bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-lg"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* List block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                  {departments.map(item => (
                    <div key={item.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover" />
                        <div>
                          <strong className="block text-xs font-bold text-slate-900">{item.title}</strong>
                          <span className="block text-[10px] text-slate-400 capitalize">Icon: {item.icon}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingDeptId(item.id);
                            setDeptForm({
                              title: item.title,
                              description: item.description,
                              icon: item.icon,
                              features: item.features || [],
                              image: item.image,
                            });
                          }}
                          className="text-xs font-bold text-brand-700 hover:underline"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteDept(item.id)}
                          className="text-xs font-bold text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB: APPOINTMENTS */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
                  <span className="text-xs text-slate-500 font-bold">Patient appointments submitted via the Guest booking UI.</span>
                  <button 
                    onClick={fetchAppointments}
                    className="bg-brand-50 hover:bg-brand-100 text-brand-800 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-brand-100"
                  >
                    Refresh List
                  </button>
                </div>

                <div className="space-y-4 max-w-5xl">
                  {loadingAppts ? (
                    <div className="text-center py-12 text-slate-400 text-xs animate-pulse">
                      Retrieving live submissions...
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 text-xs text-slate-400 font-medium p-8">
                      No appointments received yet. Try filling out the appointment form in the website.
                    </div>
                  ) : (
                    appointments.map((appt) => (
                      <div key={appt.id} className="p-6 bg-white border border-slate-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2 items-center">
                            <strong className="text-sm font-extrabold text-slate-900">{appt.name}</strong>
                            <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-100">
                              {appt.status || 'pending'}
                            </span>
                            <span className="text-[9px] text-slate-400">{new Date(appt.createdAt).toLocaleString()}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-xs text-slate-600">
                            <span>Phone: <strong className="font-bold text-slate-800">{appt.phone}</strong></span>
                            <span>Email: <strong className="font-semibold text-slate-800">{appt.email}</strong></span>
                            <span>Target Date: <strong className="font-semibold text-brand-700">{appt.date}</strong></span>
                            <span>Doctor Assigned: <strong className="font-semibold text-slate-800">{appt.doctorName}</strong></span>
                          </div>

                          {appt.notes && (
                            <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                              "{appt.notes}"
                            </p>
                          )}
                        </div>

                        {/* Complete action */}
                        <div className="flex gap-2">
                          <button 
                            onClick={async () => {
                              try {
                                await deleteDoc(doc(db, 'appointments', appt.id));
                                alert('Appointment record archived.');
                                fetchAppointments();
                              } catch (err) {
                                handleFirestoreError(err, OperationType.DELETE, `appointments/${appt.id}`);
                              }
                            }}
                            className="bg-red-50 hover:bg-red-100 text-red-700 text-xs px-3.5 py-2 rounded-xl font-bold border border-red-100"
                          >
                            Archive File
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* TAB: FAQs */}
            {activeTab === 'faqs' && (
              <div className="space-y-6">
                
                {/* Save/Edit FAQ Form */}
                <form onSubmit={handleSaveFAQ} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs max-w-3xl space-y-4">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <LucideIcon name="HelpCircle" size={16} className="text-brand-600" />
                    <span>{editingFAQId ? 'Edit Selected FAQ Item' : 'Add New FAQ Item'}</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Question (Prasna)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Booking garna k kura chahinchha?"
                        value={faqForm.question}
                        onChange={e => setFaqForm({ ...faqForm, question: e.target.value })}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Answer (Uttar)</label>
                      <textarea 
                        required
                        placeholder="Explain instructions clearly..."
                        value={faqForm.answer}
                        onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })}
                        rows={4}
                        className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-brand-500 text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button 
                      type="submit"
                      className="bg-brand-700 hover:bg-brand-600 text-white font-extrabold text-xs px-5 py-3 rounded-lg shadow-sm"
                    >
                      {editingFAQId ? 'Update FAQ Item' : 'Create FAQ Item'}
                    </button>
                    {editingFAQId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingFAQId(null);
                          setFaqForm({ question: '', answer: '' });
                        }}
                        className="bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-lg"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>

                {/* FAQ List Block */}
                <div className="space-y-4 max-w-4xl">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Current Dynamic Questions ({faqs.length})</h4>
                  
                  {faqs.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 font-medium bg-white rounded-2xl border border-slate-150">
                      No FAQs found in database. Use form above to seed questions.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {faqs.map((faq) => (
                        <div 
                          key={faq.id} 
                          className="p-5 bg-white border border-slate-150 rounded-2xl flex justify-between items-start gap-4 hover:shadow-md transition-shadow"
                        >
                          <div className="space-y-2">
                            <strong className="block text-sm font-bold text-slate-900">{faq.question}</strong>
                            <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{faq.answer}</p>
                          </div>
                          
                          <div className="flex gap-3 shrink-0">
                            <button 
                              onClick={() => {
                                setEditingFAQId(faq.id);
                                setFaqForm({
                                  question: faq.question,
                                  answer: faq.answer,
                                });
                              }}
                              className="text-xs font-black text-brand-700 hover:underline flex items-center gap-1"
                            >
                              <LucideIcon name="Settings" size={11} />
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteFAQ(faq.id)}
                              className="text-xs font-black text-red-600 hover:underline flex items-center gap-1"
                            >
                              <LucideIcon name="Trash2" size={11} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Footer stats */}
          <div className="h-10 bg-slate-900 border-t border-slate-800 px-6 py-2 shrink-0 flex justify-between items-center text-[10px] text-slate-400 font-medium">
            <span>Logged in as Root Admin • Nepal Clinic Pvt. Ltd.</span>
            <span>Realtime Engine Live</span>
          </div>

        </div>

      </div>
    </div>
  );
}
