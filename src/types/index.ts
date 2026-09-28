export type EventCategory = 
  | 'Venues'
  | 'Decoration'
  | 'Catering'
  | 'Photography'
  | 'Entertainment';

export interface VendorPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  inclusions: string[];
  popular?: boolean;
}

export interface VendorReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  eventType: string;
  comment: string;
  verifiedBooking: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: EventCategory;
  subcategory: string;
  city: string;
  locality: string;
  fullAddress: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  priceUnit: string;
  verified: boolean;
  isAvailable: boolean;
  shortDescription: string;
  about: string;
  images: string[];
  services: string[];
  packages: VendorPackage[];
  coordinates: {
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
    hours: string;
  };
  social?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  guestCapacity?: {
    min: number;
    max: number;
  };
  experienceYears: number;
  responseTime: string;
  reviews: VendorReview[];
}

export interface BudgetItem {
  id: string;
  category: string;
  serviceName: string;
  allocatedAmount: number;
  spentAmount: number;
  notes?: string;
  status: 'Estimated' | 'Booked' | 'Paid';
}

export interface ChecklistItem {
  id: string;
  title: string;
  phase: 'before' | 'event_day';
  completed: boolean;
  dueDate?: string;
}

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  status: 'upcoming' | 'in_progress' | 'completed';
}

export interface BookingRecord {
  id: string;
  vendorId: string;
  vendorName: string;
  category: EventCategory;
  packageName: string;
  price: number;
  eventDate: string;
  location: string;
  guestCount: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
}

export interface EventPlan {
  id: string;
  title: string;
  eventType: string;
  location: string;
  date: string;
  guestCount: number;
  budget: number;
  preferredStyle: 'Elegant' | 'Colourful' | 'Traditional' | 'Modern';
  requiredServices: string[];
  additionalRequirements: string;
  status: 'planning' | 'confirmed' | 'completed';
  budgetItems: BudgetItem[];
  checklist: ChecklistItem[];
  timeline: TimelineItem[];
  savedVendorIds: string[];
  bookedServices: BookingRecord[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'event' | 'task' | 'general';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'vendor';
  avatar?: string;
  vendorBusinessName?: string;
}
