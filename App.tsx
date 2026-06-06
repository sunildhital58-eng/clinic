import React from 'react';
import { doc, onSnapshot, setDoc, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { ClinicSettings, ServiceItem, DoctorItem, GalleryItemType, DepartmentItem, FAQItem } from './types';
import {
  initialSettings,
  initialServices,
  initialDoctors,
  initialGallery,
  initialDepartments,
  initialFAQs,
} from './initialData';

// Component Imports
import Header from './Header';
import Hero from './Hero';
import About from './About';
import Departments from './Departments';
import Services from './Services';
import Doctors from './Doctors';
import Gallery from './Gallery';
import ContactSection from './ContactSection';
import FAQSection from './FAQSection';
import AdminPanel from './AdminPanel';
import LucideIcon from './LucideIcon';

export default function App() {
  const [settings, setSettings] = React.useState<ClinicSettings | null>(null);
  const [services, setServices] = React.useState<ServiceItem[]>([]);
  const [doctors, setDoctors] = React.useState<DoctorItem[]>([]);
  const [gallery, setGallery] = React.useState<GalleryItemType[]>([]);
  const [departments, setDepartments] = React.useState<DepartmentItem[]>([]);
  const [faqs, setFaqs] = React.useState<FAQItem[]>([]);

  // UI state controllers
  const [adminOpen, setAdminOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Real-time subscribers list
  React.useEffect(() => {
    setIsLoading(true);

    // 1. Subscribe to General settings doc
    const unsubSettings = onSnapshot(
      doc(db, 'clinic_info', 'main'),
      (snap) => {
        if (!snap.exists()) {
          // If settings doc is not initialized, set default/initial template
          setDoc(doc(db, 'clinic_info', 'main'), initialSettings).catch((err) => {
            console.error('Non-fatal settings seeding error:', err);
          });
        } else {
          setSettings(snap.data() as ClinicSettings);
        }
      },
      (error) => {
        console.error('Live settings subscription error:', error);
        // Fallback to initial data so the screen can still render if connection is spotty
        setSettings(initialSettings);
      }
    );

    // 2. Subscribe to Services
    const unsubServices = onSnapshot(
      collection(db, 'services'),
      (snap) => {
        if (snap.empty) {
          // Seed default services
          initialServices.forEach((serv) => {
            setDoc(doc(db, 'services', serv.id), serv).catch((err) => {
              console.error('Non-fatal services seeding error:', err);
            });
          });
          setServices(initialServices);
        } else {
          const list: ServiceItem[] = [];
          snap.forEach((docSnap) => {
            list.push(docSnap.data() as ServiceItem);
          });
          setServices(list);
        }
      },
      (error) => {
        console.error('Services subscription error:', error);
        setServices(initialServices);
      }
    );

    // 3. Subscribe to Doctors List
    const unsubDoctors = onSnapshot(
      collection(db, 'doctors'),
      (snap) => {
        if (snap.empty) {
          initialDoctors.forEach((docItem) => {
            setDoc(doc(db, 'doctors', docItem.id), docItem).catch((err) => {
              console.error('Non-fatal doctors seeding error:', err);
            });
          });
          setDoctors(initialDoctors);
        } else {
          const list: DoctorItem[] = [];
          snap.forEach((docSnap) => {
            list.push(docSnap.data() as DoctorItem);
          });
          setDoctors(list);
        }
      },
      (error) => {
        console.error('Doctors subscription error:', error);
        setDoctors(initialDoctors);
      }
    );

    // 4. Subscribe to Gallery Items
    const unsubGallery = onSnapshot(
      collection(db, 'gallery'),
      (snap) => {
        if (snap.empty) {
          initialGallery.forEach((gal) => {
            setDoc(doc(db, 'gallery', gal.id), gal).catch((err) => {
              console.error('Non-fatal gallery seeding error:', err);
            });
          });
          setGallery(initialGallery);
        } else {
          const list: GalleryItemType[] = [];
          snap.forEach((docSnap) => {
            list.push(docSnap.data() as GalleryItemType);
          });
          setGallery(list);
        }
      },
      (error) => {
        console.error('Gallery subscription error:', error);
        setGallery(initialGallery);
      }
    );

    // 5. Subscribe to Departments List
    const unsubDepts = onSnapshot(
      collection(db, 'departments'),
      (snap) => {
        if (snap.empty) {
          initialDepartments.forEach((dept) => {
            setDoc(doc(db, 'departments', dept.id), dept).catch((err) => {
              console.error('Non-fatal department seeding error:', err);
            });
          });
          setDepartments(initialDepartments);
        } else {
          const list: DepartmentItem[] = [];
          snap.forEach((docSnap) => {
            list.push(docSnap.data() as DepartmentItem);
          });
          setDepartments(list);
        }
      },
      (error) => {
        console.error('Departments subscription error:', error);
        setDepartments(initialDepartments);
      }
    );

    // 6. Subscribe to FAQ List
    const unsubFaqs = onSnapshot(
      collection(db, 'faqs'),
      (snap) => {
        if (snap.empty) {
          initialFAQs.forEach((faq) => {
            setDoc(doc(db, 'faqs', faq.id), faq).catch((err) => {
              console.error('Non-fatal FAQ seeding error:', err);
            });
          });
          setFaqs(initialFAQs);
        } else {
          const list: FAQItem[] = [];
          snap.forEach((docSnap) => {
            list.push(docSnap.data() as FAQItem);
          });
          setFaqs(list);
        }
      },
      (error) => {
        console.error('FAQs subscription error:', error);
        setFaqs(initialFAQs);
      }
    );

    // Stop initial loading mask once primary settings loaded
    const checkTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => {
      unsubSettings();
      unsubServices();
      unsubDoctors();
      unsubGallery();
      unsubDepts();
      unsubFaqs();
      clearTimeout(checkTimer);
    };
  }, []);

  // Screen preloader
  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h3 className="text-white font-extrabold font-display text-lg tracking-wide animate-pulse">
            Connecting Realtime Healthcare Engine...
          </h3>
          <p className="text-xs text-slate-400">Synchronizing database configurations with Nepal Clinic Pvt. Ltd.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-brand-100 selection:text-brand-800">
      
      {/* 1. Global Navigation header (using custom Firestore phone / email state!) */}
      <Header settings={settings} onAdminClick={() => setAdminOpen(true)} />

      {/* Main landing segments */}
      <main className="flex-1">
        
        {/* About / sections */}
        <Hero settings={settings} />

        <About settings={settings} />

        <Departments departments={departments} settings={settings} />

        <Services services={services} />

        <Doctors doctors={doctors} />

        <Gallery gallery={gallery} />

        <FAQSection faqs={faqs} />

        <ContactSection settings={settings} doctors={doctors} />

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800">
          <div className="space-y-4">
            <h4 className="font-extrabold font-display text-white text-base">{settings.name}</h4>
            <p className="leading-relaxed text-slate-400 max-w-sm">
              Providing compassionate real-time medical care services, diagnostics, and patient support parameters tailored for you.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-extrabold font-display text-white text-sm">Quick Contacts</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Phone: <strong>{settings.phone}</strong></li>
              <li>Emergency Support: <strong>{settings.phone}</strong></li>
              <li>Email: <strong>{settings.email}</strong></li>
              <li>Address: <strong>{settings.address}</strong></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-extrabold font-display text-white text-sm">System Administration</h4>
            <p className="text-xs text-slate-400">
              This system database synchronizes all services, doctors, gallery photos and settings to Cloud Firestore dynamically in real time.
            </p>
            <button 
              onClick={() => setAdminOpen(true)}
              className="inline-flex items-center gap-1.5 bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-transform active:scale-[0.98]"
            >
              <LucideIcon name="Lock" size={13} />
              <span>Access Admin Dashboard</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500">
          <span>© {new Date().getFullYear()} {settings.name}. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#!" className="hover:text-slate-300">Privacy Policy</a>
            <span>•</span>
            <a href="#!" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Realtime Admin Interactive Management Overlay component */}
      {adminOpen && (
        <AdminPanel 
          onClose={() => setAdminOpen(false)}
          settings={settings}
          services={services}
          doctors={doctors}
          gallery={gallery}
          departments={departments}
          faqs={faqs}
        />
      )}

    </div>
  );
}
