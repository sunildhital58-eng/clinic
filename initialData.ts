import { ClinicSettings, ServiceItem, DoctorItem, GalleryItemType, DepartmentItem, FAQItem } from './types';

export const initialSettings: ClinicSettings = {
  id: 'main',
  name: 'Nepal Clinic Pvt. Ltd.',
  phone: '9851051956',
  email: 'nepalclinic@gmail.com',
  address: 'नयाँ पुल, चमती खुशीबन मार्ग, Kathmandu 44600',
  heroTitle: 'Excellence in Healthcare With Compassionate Care',
  heroDescription: 'Nepal Clinic Pvt. Ltd. provides outstanding healthcare services with qualified medical professionals. We combine advanced diagnostic tools and caring treatment tailored for your family.',
  aboutTitle: 'Compassionate Care, Advanced Medicine',
  aboutLeadText: "For over two decades, we've been dedicated to providing exceptional healthcare that combines cutting-edge medical technology with the personal touch our patients deserve.",
  aboutText: 'Our multidisciplinary team of specialists works collaboratively to ensure every patient receives comprehensive care tailored to their unique needs. From preventive services to complex procedures, we maintain the highest standards of medical excellence while fostering an environment of trust and healing.',
  emergencyPhone: '9851051956',
  bannerImageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600',
  googleMapUrl: 'https://maps.app.goo.gl/zhRRza5e6hdmnnAp8',
  whatsappNumber: '9851051956',
  facebookUrl: 'https://facebook.com/nepalclinic',
  instagramUrl: 'https://instagram.com/nepalclinic',
  twitterUrl: 'https://twitter.com/nepalclinic',
  logoUrl: 'https://images.unsplash.com/photo-1612538491456-5c8e001e74f8?auto=format&fit=crop&q=80&w=300',
  aboutImageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
};

export const initialServices: ServiceItem[] = [
  {
    id: 's1',
    title: 'Dermatology Clinic',
    description: 'Specialized diagnosis and treatment for a wide range of skin, hair, and nail health issues with advanced therapy.',
    icon: 'Sparkles',
  },
  {
    id: 's2',
    title: 'Surgery Center',
    description: 'Modern outpatient surgery services with state-of-the-art operative technology and caring post-operative support.',
    icon: 'Activity',
  },
  {
    id: 's3',
    title: 'Diagnostics Lab',
    description: 'Precision diagnostic testing, clinical laboratory procedures and high-accuracy diagnostic imaging scans.',
    icon: 'FlaskConical',
  },
];

export const initialDoctors: DoctorItem[] = [
  {
    id: 'd1',
    name: 'Dr. Amanda Foster',
    specialty: 'Cardiology Specialist',
    experience: '14 years experience',
    rating: 4.9,
    reviews: 127,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'd2',
    name: 'Dr. Marcus Johnson',
    specialty: 'Neurology Expert',
    experience: '16 years experience',
    rating: 4.8,
    reviews: 89,
    status: 'busy',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'd3',
    name: 'Dr. Rachel Williams',
    specialty: 'Pediatrics Care',
    experience: '11 years experience',
    rating: 5.0,
    reviews: 203,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'd4',
    name: 'Dr. David Chen',
    specialty: 'Orthopedic Surgery',
    experience: '22 years experience',
    rating: 4.7,
    reviews: 156,
    status: 'offline',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'd5',
    name: 'Dr. Victoria Torres',
    specialty: 'Dermatology Care',
    experience: '9 years experience',
    rating: 4.5,
    reviews: 74,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'd6',
    name: 'Dr. Benjamin Lee',
    specialty: 'Oncology Treatment',
    experience: '19 years experience',
    rating: 4.9,
    reviews: 194,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1622253694082-35594e57a4a3?auto=format&fit=crop&q=80&w=600',
  },
];

export const initialGallery: GalleryItemType[] = [
  {
    id: 'g1',
    title: 'Maternal Care Services',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'g2',
    title: 'Complete Vaccination Programs',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'g3',
    title: '24/7 Critical Emergency Care',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'g4',
    title: 'State-Of-The-Art Medical Equipment',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
  },
];

export const initialDepartments: DepartmentItem[] = [
  {
    id: 'dep1',
    title: 'Cardiovascular Medicine',
    description: 'Advanced diagnostic imaging and interventional procedures for comprehensive heart health management with personalized treatment protocols.',
    icon: 'HeartPulse',
    features: ['24/7 Emergency Cardiac Care', 'Minimally Invasive Procedures'],
    image: 'https://images.unsplash.com/photo-1530026405186-ed1eaae6bbdb?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'dep2',
    title: 'Neurological Sciences',
    description: 'Cutting-edge neuroimaging and neurosurgical expertise for complex brain and spinal cord conditions with innovative treatment approaches.',
    icon: 'Brain',
    features: ['Advanced Brain Imaging', 'Robotic Surgery'],
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'dep3',
    title: 'Orthopedic Surgery',
    description: 'Comprehensive musculoskeletal care utilizing advanced arthroscopic techniques and joint replacement procedures.',
    icon: 'Bone',
    features: ['Sports Medicine', 'Joint Replacement', 'Spine Surgery'],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'dep4',
    title: 'Pediatric Care',
    description: 'Child-centered healthcare services from newborn to adolescence with family-focused treatment approaches.',
    icon: 'Baby',
    features: ['Neonatal Intensive Care', 'Developmental Pediatrics', 'Pediatric Surgery'],
    image: 'https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'dep5',
    title: 'Cancer Treatment',
    description: 'Multidisciplinary oncology program offering personalized cancer care with latest therapeutic innovations.',
    icon: 'ShieldAlert',
    features: ['Precision Medicine', 'Immunotherapy', 'Radiation Oncology'],
    image: 'https://images.unsplash.com/photo-1579684389781-7189fd7e2965?auto=format&fit=crop&q=80&w=800',
  },
];

export const initialFAQs: FAQItem[] = [
  {
    id: 'f1',
    question: 'Nepal Clinic Pvt. Ltd. ko opening hours kasto xa?',
    answer: 'Hamro clinic Sunday dekhi Friday samma, bihakar 9:00 AM dekhi beluka 7:00 PM samma khulla rahanchha. Emergency sewa chahi 24 ghanta nai upalabdha chha.'
  },
  {
    id: 'f2',
    question: 'Doctor appointment kasari book garne?',
    answer: 'Tapaile hamro website-ma vako "Quick Booking Form" bata dherai sajilari direct appointment request garna saknuhunchha. Click garda administrative dashboard ma record save hunu ka sathai direct tapailai whatsapp draft pani millxa.'
  },
  {
    id: 'f3',
    question: 'Clinic ma laboratory rw report checkgarni thau xa ki xaina?',
    answer: 'Of course, hamro clinic vitra nai fully-equipped advanced Diagnostics Laboratory rw Clinical Report system chha, jasले garda tapai ko report xito rw highly accurate aauchha.'
  },
  {
    id: 'f4',
    question: 'Emergency contact ko lagi kun number ma phone garne?',
    answer: 'Immediate emergency support ko lagi tapaile hamro dynamic phone number +977 9851051956 ma direct dial garna saknuhunchha.'
  }
];

