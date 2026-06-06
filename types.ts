export interface ClinicSettings {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  heroTitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutLeadText: string;
  aboutText: string;
  emergencyPhone: string;
  // Banner background image
  bannerImageUrl?: string;
  // Google Map embed URL
  googleMapUrl?: string;
  // Social media and Chat integration
  whatsappNumber?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  // Custom clinic logo image URL
  logoUrl?: string;
  // About section image URL
  aboutImageUrl?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  status: 'available' | 'busy' | 'offline';
  image: string;
}

export interface GalleryItemType {
  id: string;
  title: string;
  image: string;
}

export interface DepartmentItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  image: string;
}
