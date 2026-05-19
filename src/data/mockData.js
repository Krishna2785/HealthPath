export const hospitals = [
  {
    id: 'h1',
    name: 'Dr. D. Y. Patil Hospital & Research Centre',
    rating: 4.6,
    type: 'Hospital',
    status: 'Open',
    distance: 0.5,
    distanceStr: '~0.5 km (inside/adjacent campus)',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    specialities: ['General Medicine', 'Surgery', 'Pediatrics', 'Orthopedics', 'ENT', 'Ophthalmology', 'Obstetrics & Gynecology', 'Cardiology', 'Neurology', 'Nephrology', 'Oncology', 'Gastroenterology', 'ICU', 'Emergency', 'Radiology', 'IVF', 'Transplants'],
    timings: 'Monday–Saturday: 9:00 AM – 4:00 PM | Sunday: Limited OPD | Emergency: 24×7'
  },
  {
    id: 'h2',
    name: 'Yashwantrao Chavan Memorial Hospital (YCMH)',
    rating: 3.7,
    type: 'Government hospital',
    status: 'Open',
    distance: 0.8,
    distanceStr: '~0.8 km',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    specialities: ['General Medicine & Surgery', 'Trauma & Emergency', 'Pediatrics', 'Gynecology', 'Orthopedics', 'Dermatology', 'TB & Chest', 'Psychiatry'],
    timings: 'Monday–Saturday: 8:30 AM – 2:00 PM | Government hospital → heavy rush | Emergency: 24×7'
  },
  {
    id: 'h3',
    name: 'Omkar Multispeciality Hospital',
    rating: 3.9,
    type: 'Hospital',
    status: 'Open',
    distance: 1.0,
    distanceStr: '~1 km',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    specialities: ['General Medicine', 'Minor Surgery', 'Orthopedics', 'Gynecology', 'Basic ICU & emergency care'],
    timings: 'Monday–Saturday: 10:00 AM – 2:00 PM, 6:00 PM – 9:00 PM | Sunday: Limited hours | Emergency: 24×7'
  },
  {
    id: 'h4',
    name: 'Suyog Hospital',
    rating: 4.6,
    type: 'General hospital',
    status: 'Open',
    distance: 1.5,
    distanceStr: '~1.5 km',
    image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    specialities: ['General Medicine', 'Diabetology', 'Cardiology (basic)', 'Pediatrics', 'Diagnostic services'],
    timings: 'Monday–Saturday: 10:00 AM – 1:30 PM, 5:30 PM – 8:30 PM | Emergency: 24×7'
  },
  {
    id: 'h5',
    name: 'Aditya Birla Memorial Hospital',
    rating: 4.3,
    type: 'Hospital',
    status: 'Open',
    distance: 4.5,
    distanceStr: '~4–5 km',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    specialities: ['Cardiology & Cardiac Surgery', 'Oncology', 'Neurology & Neurosurgery', 'Orthopedics', 'Gastroenterology', 'Urology', 'Nephrology', 'Critical Care', 'Transplants'],
    timings: 'Monday–Saturday: 9:00 AM – 5:00 PM (varies by doctor) | Sunday: Limited | Emergency: 24×7'
  }
];

export const specialitiesIcons = {
  'Cardiology': 'Heart',
  'Cardiology (basic)': 'Heart',
  'Cardiology & Cardiac Surgery': 'Heart',
  'General Medicine': 'Stethoscope',
  'General Medicine & Surgery': 'Stethoscope',
  'Orthopedics': 'Bone',
  'Pediatrics': 'Baby',
  'Gynecology': 'User',
  'Obstetrics & Gynecology': 'User',
  'Oncology': 'Activity',
  'Neurology': 'Brain',
  'Neurology & Neurosurgery': 'Brain',
  'Gastroenterology': 'Activity',
  'Emergency': 'Siren',
  'ICU': 'Activity',
  'Basic ICU & emergency care': 'Siren',
  'Trauma & Emergency': 'Siren',
  'Critical Care': 'Activity',
  'Surgery': 'Activity',
  'Minor Surgery': 'Activity'
};

export const doctors = [
  {
    id: 'd1',
    name: 'Dr. Sarah Smith',
    hospitalId: 'h1',
    speciality: 'Cardiology',
    rating: 4.8,
    reviewsCount: 124,
    experience: '12 Years',
    fee: 800,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    about: 'Dr. Sarah Smith is a highly respected Cardiologist with over 12 years of experience. She specializes in interventional cardiology and preventive care.',
    availability: ['Mon', 'Wed', 'Fri'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    reviews: [
      { id: 'r1', user: 'Amit S.', rating: 5, comment: 'Very attentive and professional. Saved my life!' },
      { id: 'r2', user: 'Priya K.', rating: 4, comment: 'Great doctor but waiting time was a bit long.' }
    ]
  },
  {
    id: 'd2',
    name: 'Dr. Rajesh Kumar',
    hospitalId: 'h1',
    speciality: 'Orthopedics',
    rating: 4.5,
    reviewsCount: 89,
    experience: '15 Years',
    fee: 1000,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    about: 'Expert in joint replacement and sports injuries. Has successfully performed over 500 knee replacements.',
    availability: ['Tue', 'Thu', 'Sat'],
    timeSlots: ['10:00 AM', '11:30 AM', '01:00 PM', '04:00 PM'],
    reviews: [
      { id: 'r3', user: 'Vikram M.', rating: 5, comment: 'Excellent surgery, recovered in no time.' }
    ]
  },
  {
    id: 'd3',
    name: 'Dr. Meena Iyer',
    hospitalId: 'h5',
    speciality: 'Cardiology & Cardiac Surgery',
    rating: 4.9,
    reviewsCount: 210,
    experience: '20 Years',
    fee: 1500,
    image: 'https://images.unsplash.com/photo-1594824467971-078bcce041ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    about: 'Leading Cardiac Surgeon in the city. Specializes in bypass surgeries and heart transplants.',
    availability: ['Mon', 'Tue', 'Thu', 'Fri'],
    timeSlots: ['09:00 AM', '10:30 AM', '12:00 PM', '03:00 PM'],
    reviews: [
      { id: 'r4', user: 'Sneha D.', rating: 5, comment: 'Dr. Meena is a gem. Her calm demeanor really helped during a stressful time.' }
    ]
  },
  {
    id: 'd4',
    name: 'Dr. Ankit Sharma',
    hospitalId: 'h2',
    speciality: 'General Medicine & Surgery',
    rating: 4.2,
    reviewsCount: 45,
    experience: '8 Years',
    fee: 300,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    about: 'Compassionate general physician dedicated to accessible healthcare.',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: ['08:30 AM', '10:00 AM', '11:00 AM', '01:00 PM'],
    reviews: [
      { id: 'r5', user: 'Rahul B.', rating: 4, comment: 'Good doctor, very affordable.' }
    ]
  }
];

export const pathLabs = [
  {
    id: 'l1',
    name: 'Dr. Lal PathLabs',
    rating: 4.7,
    status: 'Open',
    distance: 1.2,
    distanceStr: '~1.2 km',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    address: '12, Main Street, Near City Center',
    timings: 'Monday–Sunday: 7:00 AM – 8:00 PM',
    homeCollection: true
  },
  {
    id: 'l2',
    name: 'SRL Diagnostics',
    rating: 4.5,
    status: 'Open',
    distance: 2.5,
    distanceStr: '~2.5 km',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    address: 'Phase 2, IT Park Road',
    timings: 'Monday–Saturday: 8:00 AM – 9:00 PM',
    homeCollection: true
  },
  {
    id: 'l3',
    name: 'City Care Pathology',
    rating: 4.1,
    status: 'Open',
    distance: 0.8,
    distanceStr: '~0.8 km',
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    address: 'Shop 4, Greenfield Plaza',
    timings: 'Monday–Saturday: 8:00 AM – 6:00 PM',
    homeCollection: false
  }
];

export const labTests = [
  {
    id: 't1',
    name: 'Complete Blood Count (CBC)',
    category: 'Blood Test',
    price: 350,
    turnaround: '24 Hours',
    description: 'Measures different features of your blood, including RBCs, WBCs, and platelets.'
  },
  {
    id: 't2',
    name: 'Lipid Profile',
    category: 'Heart Health',
    price: 600,
    turnaround: '24 Hours',
    description: 'Measures cholesterol and triglycerides to assess heart disease risk.'
  },
  {
    id: 't3',
    name: 'Thyroid Panel (T3, T4, TSH)',
    category: 'Hormonal',
    price: 750,
    turnaround: '24 Hours',
    description: 'Evaluates thyroid gland function.'
  },
  {
    id: 't4',
    name: 'HbA1c (Glycosylated Hemoglobin)',
    category: 'Diabetes',
    price: 500,
    turnaround: '24 Hours',
    description: 'Measures average blood sugar levels over the past 3 months.'
  },
  {
    id: 't5',
    name: 'Urine Routine & Microscopy',
    category: 'Urine Test',
    price: 200,
    turnaround: '12 Hours',
    description: 'Basic urine analysis to detect infections, kidney disease, etc.'
  }
];

export const pharmacies = [
  {
    id: 'p1',
    name: 'Apollo Pharmacy',
    rating: 4.8,
    status: 'Open 24x7',
    distance: 0.4,
    distanceStr: '~0.4 km',
    image: 'https://images.unsplash.com/photo-1586282391129-76a6df230234?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    address: 'Shop 12, High Street Mall',
    deliveryTime: '30-45 mins',
    freeDeliveryAbove: 500
  },
  {
    id: 'p2',
    name: 'Wellness Forever',
    rating: 4.6,
    status: 'Open 24x7',
    distance: 1.1,
    distanceStr: '~1.1 km',
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    address: 'Ground Floor, Signature Towers',
    deliveryTime: '45-60 mins',
    freeDeliveryAbove: 300
  },
  {
    id: 'p3',
    name: 'MedPlus',
    rating: 4.2,
    status: 'Closes at 10 PM',
    distance: 1.8,
    distanceStr: '~1.8 km',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    address: 'Sector 4 Market',
    deliveryTime: '1-2 hrs',
    freeDeliveryAbove: 0
  }
];

export const donationOrgs = [
  {
    id: 'org1',
    name: 'National Organ and Tissue Transplant Organization (NOTTO)',
    type: 'Government Agency',
    focus: 'All Organs & Tissues',
    verified: true,
    logo: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'org2',
    name: 'MOHAN Foundation',
    type: 'NGO',
    focus: 'Education & Registration',
    verified: true,
    logo: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'org3',
    name: 'Organ India',
    type: 'NGO',
    focus: 'Awareness & Counseling',
    verified: true,
    logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }
];
