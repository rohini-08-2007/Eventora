import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Vendor,
  EventPlan,
  AppNotification,
  UserProfile,
  BudgetItem,
  ChecklistItem,
  TimelineItem,
  BookingRecord,
  VendorPackage,
} from '../types';
import {
  MOCK_VENDORS,
  INITIAL_EVENT_PLAN,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER,
} from '../data/mockData';

export type NavigationTab = 
  | 'home' 
  | 'explore' 
  | 'plan' 
  | 'dashboard' 
  | 'compare' 
  | 'vendor-portal';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  vendors: Vendor[];
  currentEvent: EventPlan;
  savedVendors: Vendor[];
  compareList: Vendor[];
  notifications: AppNotification[];
  currentUser: UserProfile;
  selectedVendorForDetail: Vendor | null;
  selectedVendorForBooking: { vendor: Vendor; pkg?: VendorPackage } | null;
  isAuthModalOpen: boolean;
  isNotificationOpen: boolean;
  searchFilter: {
    query: string;
    category: string;
    locality: string;
    city: string;
    eventDate: string;
    guests: number;
    budget: number;
  };
  setSearchFilter: React.Dispatch<React.SetStateAction<{
    query: string;
    category: string;
    locality: string;
    city: string;
    eventDate: string;
    guests: number;
    budget: number;
  }>>;
  // Actions
  setSelectedVendorForDetail: (vendor: Vendor | null) => void;
  setSelectedVendorForBooking: (data: { vendor: Vendor; pkg?: VendorPackage } | null) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsNotificationOpen: (open: boolean) => void;
  toggleSaveVendor: (vendorId: string) => void;
  isVendorSaved: (vendorId: string) => boolean;
  toggleCompareVendor: (vendor: Vendor) => void;
  isVendorInCompare: (vendorId: string) => boolean;
  removeFromCompare: (vendorId: string) => void;
  clearCompare: () => void;
  // Event Plan Actions
  createNewEvent: (params: {
    eventType: string;
    location: string;
    date: string;
    guestCount: number;
    budget: number;
    preferredStyle: 'Elegant' | 'Colourful' | 'Traditional' | 'Modern';
    requiredServices: string[];
    additionalRequirements: string;
  }) => void;
  updateEventDetails: (details: Partial<EventPlan>) => void;
  addBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;
  toggleChecklistTask: (id: string) => void;
  addChecklistTask: (task: Omit<ChecklistItem, 'id'>) => void;
  updateChecklistTask: (id: string, updates: Partial<ChecklistItem>) => void;
  deleteChecklistTask: (id: string) => void;
  addTimelineItem: (item: Omit<TimelineItem, 'id'>) => void;
  updateTimelineItem: (id: string, updates: Partial<TimelineItem>) => void;
  deleteTimelineItem: (id: string) => void;
  // Booking & Provider Actions
  createBooking: (booking: Omit<BookingRecord, 'id' | 'createdAt'>) => void;
  updateBookingStatus: (bookingId: string, status: BookingRecord['status']) => void;
  registerVendor: (newVendor: Omit<Vendor, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => void;
  updateVendorProfile: (vendorId: string, updates: Partial<Vendor>) => void;
  addVendorReview: (vendorId: string, review: { rating: number; comment: string; eventType: string }) => void;
  // Notifications & User
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  switchRole: (role: 'customer' | 'vendor') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('localevent_vendors');
    return saved ? JSON.parse(saved) : MOCK_VENDORS;
  });

  const [currentEvent, setCurrentEvent] = useState<EventPlan>(() => {
    const saved = localStorage.getItem('localevent_event');
    return saved ? JSON.parse(saved) : INITIAL_EVENT_PLAN;
  });

  const [compareList, setCompareList] = useState<Vendor[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('localevent_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('localevent_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [selectedVendorForDetail, setSelectedVendorForDetail] = useState<Vendor | null>(null);
  const [selectedVendorForBooking, setSelectedVendorForBooking] = useState<{ vendor: Vendor; pkg?: VendorPackage } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [searchFilter, setSearchFilter] = useState({
    query: '',
    category: 'All',
    locality: 'All Localities',
    city: 'Visakhapatnam',
    eventDate: '2026-10-18',
    guests: 100,
    budget: 50000,
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('localevent_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('localevent_event', JSON.stringify(currentEvent));
  }, [currentEvent]);

  useEffect(() => {
    localStorage.setItem('localevent_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('localevent_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Saved vendors
  const savedVendors = vendors.filter(v => currentEvent.savedVendorIds.includes(v.id));

  const toggleSaveVendor = (vendorId: string) => {
    setCurrentEvent(prev => {
      const exists = prev.savedVendorIds.includes(vendorId);
      const updatedSaved = exists 
        ? prev.savedVendorIds.filter(id => id !== vendorId)
        : [...prev.savedVendorIds, vendorId];
      return { ...prev, savedVendorIds: updatedSaved };
    });
  };

  const isVendorSaved = (vendorId: string) => {
    return currentEvent.savedVendorIds.includes(vendorId);
  };

  // Compare actions
  const toggleCompareVendor = (vendor: Vendor) => {
    setCompareList(prev => {
      const exists = prev.some(v => v.id === vendor.id);
      if (exists) {
        return prev.filter(v => v.id !== vendor.id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), vendor];
      }
      return [...prev, vendor];
    });
  };

  const isVendorInCompare = (vendorId: string) => {
    return compareList.some(v => v.id === vendorId);
  };

  const removeFromCompare = (vendorId: string) => {
    setCompareList(prev => prev.filter(v => v.id !== vendorId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  // Event Plan Actions
  const createNewEvent = (params: {
    eventType: string;
    location: string;
    date: string;
    guestCount: number;
    budget: number;
    preferredStyle: 'Elegant' | 'Colourful' | 'Traditional' | 'Modern';
    requiredServices: string[];
    additionalRequirements: string;
  }) => {
    // Generate initial realistic budget breakdown proportional to budget
    const total = params.budget || 50000;
    const initialBudgetItems: BudgetItem[] = [
      {
        id: 'b-' + Date.now() + '-1',
        category: 'Venue',
        serviceName: 'Venue Reservation',
        allocatedAmount: Math.round(total * 0.15),
        spentAmount: 0,
        notes: `Target venue in ${params.location}`,
        status: 'Estimated',
      },
      {
        id: 'b-' + Date.now() + '-2',
        category: 'Decoration',
        serviceName: 'Event Decor & Styling',
        allocatedAmount: Math.round(total * 0.25),
        spentAmount: 0,
        notes: `${params.preferredStyle} style setup`,
        status: 'Estimated',
      },
      {
        id: 'b-' + Date.now() + '-3',
        category: 'Catering',
        serviceName: 'Catering & Beverages',
        allocatedAmount: Math.round(total * 0.40),
        spentAmount: 0,
        notes: `Estimated for ${params.guestCount} guests`,
        status: 'Estimated',
      },
      {
        id: 'b-' + Date.now() + '-4',
        category: 'Photography',
        serviceName: 'Photography & Reels',
        allocatedAmount: Math.round(total * 0.12),
        spentAmount: 0,
        notes: 'Photo and video coverage',
        status: 'Estimated',
      },
      {
        id: 'b-' + Date.now() + '-5',
        category: 'Entertainment',
        serviceName: 'Entertainment / Sound',
        allocatedAmount: Math.round(total * 0.08),
        spentAmount: 0,
        notes: 'Sound, DJ or Host',
        status: 'Estimated',
      },
    ];

    const initialChecklist: ChecklistItem[] = [
      { id: 't-' + Date.now() + '-1', title: 'Confirm venue and verify parking capacity', phase: 'before', completed: false, dueDate: params.date },
      { id: 't-' + Date.now() + '-2', title: 'Confirm catering menu and tasting', phase: 'before', completed: false, dueDate: params.date },
      { id: 't-' + Date.now() + '-3', title: 'Finalize decorator stage design & color theme', phase: 'before', completed: false, dueDate: params.date },
      { id: 't-' + Date.now() + '-4', title: 'Book professional photographer', phase: 'before', completed: false, dueDate: params.date },
      { id: 't-' + Date.now() + '-5', title: 'Distribute digital and printed invitations', phase: 'before', completed: false, dueDate: params.date },
      { id: 't-' + Date.now() + '-6', title: 'Order celebration cake or special sweets', phase: 'before', completed: false, dueDate: params.date },
      { id: 't-' + Date.now() + '-7', title: 'Stage and decor installation check', phase: 'event_day', completed: false, dueDate: `${params.date} 11:00 AM` },
      { id: 't-' + Date.now() + '-8', title: 'Photographer arrival and pre-event briefing', phase: 'event_day', completed: false, dueDate: `${params.date} 04:00 PM` },
      { id: 't-' + Date.now() + '-9', title: 'Catering live food counters ready', phase: 'event_day', completed: false, dueDate: `${params.date} 05:30 PM` },
      { id: 't-' + Date.now() + '-10', title: 'Sound check & guest welcome reception', phase: 'event_day', completed: false, dueDate: `${params.date} 06:00 PM` },
    ];

    const initialTimeline: TimelineItem[] = [
      { id: 'tl-' + Date.now() + '-1', time: '10:00 AM', title: 'Venue handover & inspection', description: 'Doors open, generator check and cleaning', status: 'upcoming' },
      { id: 'tl-' + Date.now() + '-2', time: '01:00 PM', title: 'Decor & floral backdrop ready', description: 'Stage setup, lights & entrance welcome board completed', status: 'upcoming' },
      { id: 'tl-' + Date.now() + '-3', time: '04:30 PM', title: 'Photographer setup & family portraits', description: 'Early portraits before guests arrive', status: 'upcoming' },
      { id: 'tl-' + Date.now() + '-4', time: '05:30 PM', title: 'Guest arrival & welcome drinks', description: 'Traditional welcome drinks and snack counters', status: 'upcoming' },
      { id: 'tl-' + Date.now() + '-5', time: '06:30 PM', title: 'Main celebration ceremony', description: 'Stage ceremony, rituals / cake cutting and speeches', status: 'upcoming' },
      { id: 'tl-' + Date.now() + '-6', time: '07:30 PM', title: 'Grand dinner feast opens', description: 'Buffet and live food stalls active', status: 'upcoming' },
      { id: 'tl-' + Date.now() + '-7', time: '09:00 PM', title: 'Musical celebration & send-off', description: 'Celebratory music, return gifts and thank you remarks', status: 'upcoming' },
    ];

    const newPlan: EventPlan = {
      id: 'ev-' + Date.now(),
      title: `${params.eventType} Celebration`,
      ...params,
      status: 'planning',
      budgetItems: initialBudgetItems,
      checklist: initialChecklist,
      timeline: initialTimeline,
      savedVendorIds: [],
      bookedServices: [],
    };

    setCurrentEvent(newPlan);
    setActiveTab('dashboard');

    // Add notification
    const notification: AppNotification = {
      id: 'n-' + Date.now(),
      title: 'Event Plan Created',
      message: `Your ${params.eventType} plan in ${params.location} with budget ₹${params.budget.toLocaleString('en-IN')} has been organized.`,
      timestamp: 'Just now',
      read: false,
      type: 'event',
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const updateEventDetails = (details: Partial<EventPlan>) => {
    setCurrentEvent(prev => ({ ...prev, ...details }));
  };

  const addBudgetItem = (item: Omit<BudgetItem, 'id'>) => {
    const newItem: BudgetItem = {
      id: 'b-' + Date.now(),
      ...item,
    };
    setCurrentEvent(prev => ({
      ...prev,
      budgetItems: [...prev.budgetItems, newItem],
    }));
  };

  const updateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    setCurrentEvent(prev => ({
      ...prev,
      budgetItems: prev.budgetItems.map(b => (b.id === id ? { ...b, ...updates } : b)),
    }));
  };

  const deleteBudgetItem = (id: string) => {
    setCurrentEvent(prev => ({
      ...prev,
      budgetItems: prev.budgetItems.filter(b => b.id !== id),
    }));
  };

  const toggleChecklistTask = (id: string) => {
    setCurrentEvent(prev => ({
      ...prev,
      checklist: prev.checklist.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const addChecklistTask = (task: Omit<ChecklistItem, 'id'>) => {
    const newTask: ChecklistItem = {
      id: 't-' + Date.now(),
      ...task,
    };
    setCurrentEvent(prev => ({
      ...prev,
      checklist: [...prev.checklist, newTask],
    }));
  };

  const updateChecklistTask = (id: string, updates: Partial<ChecklistItem>) => {
    setCurrentEvent(prev => ({
      ...prev,
      checklist: prev.checklist.map(t => (t.id === id ? { ...t, ...updates } : t)),
    }));
  };

  const deleteChecklistTask = (id: string) => {
    setCurrentEvent(prev => ({
      ...prev,
      checklist: prev.checklist.filter(t => t.id !== id),
    }));
  };

  const addTimelineItem = (item: Omit<TimelineItem, 'id'>) => {
    const newItem: TimelineItem = {
      id: 'tl-' + Date.now(),
      ...item,
    };
    setCurrentEvent(prev => ({
      ...prev,
      timeline: [...prev.timeline, newItem],
    }));
  };

  const updateTimelineItem = (id: string, updates: Partial<TimelineItem>) => {
    setCurrentEvent(prev => ({
      ...prev,
      timeline: prev.timeline.map(tl => (tl.id === id ? { ...tl, ...updates } : tl)),
    }));
  };

  const deleteTimelineItem = (id: string) => {
    setCurrentEvent(prev => ({
      ...prev,
      timeline: prev.timeline.filter(tl => tl.id !== id),
    }));
  };

  // Booking Actions
  const createBooking = (bookingData: Omit<BookingRecord, 'id' | 'createdAt'>) => {
    const newBooking: BookingRecord = {
      id: 'bk-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      ...bookingData,
    };

    setCurrentEvent(prev => ({
      ...prev,
      bookedServices: [newBooking, ...prev.bookedServices],
    }));

    // Add to vendor's bookings in storage or notification
    const notification: AppNotification = {
      id: 'n-' + Date.now(),
      title: 'Booking Request Sent',
      message: `Your booking request has been sent to ${bookingData.vendorName} for ₹${bookingData.price.toLocaleString('en-IN')}.`,
      timestamp: 'Just now',
      read: false,
      type: 'booking',
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const updateBookingStatus = (bookingId: string, status: BookingRecord['status']) => {
    setCurrentEvent(prev => ({
      ...prev,
      bookedServices: prev.bookedServices.map(b => (b.id === bookingId ? { ...b, status } : b)),
    }));

    const found = currentEvent.bookedServices.find(b => b.id === bookingId);
    if (found) {
      const notification: AppNotification = {
        id: 'n-' + Date.now(),
        title: `Booking ${status}`,
        message: `Your booking with ${found.vendorName} is now marked as ${status}.`,
        timestamp: 'Just now',
        read: false,
        type: 'booking',
      };
      setNotifications(prev => [notification, ...prev]);
    }
  };

  // Vendor actions
  const registerVendor = (newVendorData: Omit<Vendor, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => {
    const newVendor: Vendor = {
      id: 'v-' + Date.now(),
      rating: 5.0,
      reviewCount: 1,
      reviews: [
        {
          id: 'r-init',
          userName: 'Verified Host',
          rating: 5,
          date: 'Sep 2026',
          eventType: 'Inaugural Booking',
          comment: 'Outstanding onboarding presentation and reliable professional conduct.',
          verifiedBooking: true,
        },
      ],
      ...newVendorData,
    };

    setVendors(prev => [newVendor, ...prev]);
    setCurrentUser(prev => ({
      ...prev,
      role: 'vendor',
      vendorBusinessName: newVendor.name,
    }));

    const notification: AppNotification = {
      id: 'n-' + Date.now(),
      title: 'Provider Account Verified',
      message: `Welcome aboard, ${newVendor.name}! Your business profile is now live for Vizag event hosts.`,
      timestamp: 'Just now',
      read: false,
      type: 'general',
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const updateVendorProfile = (vendorId: string, updates: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => (v.id === vendorId ? { ...v, ...updates } : v)));
  };

  const addVendorReview = (vendorId: string, review: { rating: number; comment: string; eventType: string }) => {
    const newReview = {
      id: 'r-' + Date.now(),
      userName: currentUser.name,
      rating: review.rating,
      date: 'Just now',
      eventType: review.eventType,
      comment: review.comment,
      verifiedBooking: true,
    };

    setVendors(prev =>
      prev.map(v => {
        if (v.id === vendorId) {
          const updatedReviews = [newReview, ...v.reviews];
          const newAvg = Number(
            (
              updatedReviews.reduce((acc, r) => acc + r.rating, 0) /
              updatedReviews.length
            ).toFixed(1)
          );
          return {
            ...v,
            rating: newAvg,
            reviewCount: updatedReviews.length,
            reviews: updatedReviews,
          };
        }
        return v;
      })
    );
  };

  // Notification actions
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const switchRole = (role: 'customer' | 'vendor') => {
    setCurrentUser(prev => ({ ...prev, role }));
    if (role === 'vendor') {
      setActiveTab('vendor-portal');
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        vendors,
        currentEvent,
        savedVendors,
        compareList,
        notifications,
        currentUser,
        selectedVendorForDetail,
        selectedVendorForBooking,
        isAuthModalOpen,
        isNotificationOpen,
        searchFilter,
        setSearchFilter,
        setSelectedVendorForDetail,
        setSelectedVendorForBooking,
        setIsAuthModalOpen,
        setIsNotificationOpen,
        toggleSaveVendor,
        isVendorSaved,
        toggleCompareVendor,
        isVendorInCompare,
        removeFromCompare,
        clearCompare,
        createNewEvent,
        updateEventDetails,
        addBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,
        toggleChecklistTask,
        addChecklistTask,
        updateChecklistTask,
        deleteChecklistTask,
        addTimelineItem,
        updateTimelineItem,
        deleteTimelineItem,
        createBooking,
        updateBookingStatus,
        registerVendor,
        updateVendorProfile,
        addVendorReview,
        markNotificationRead,
        markAllNotificationsRead,
        setCurrentUser,
        switchRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
