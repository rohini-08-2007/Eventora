import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventCategory, VendorPackage } from '../types';
import { VIZAG_LOCALITIES } from '../data/mockData';
import {
  Store,
  CheckCircle,
  Plus,
  DollarSign,
  Users,
  Calendar,
  Star,
  Settings,
  ShieldCheck,
  IndianRupee,
  Clock,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Check,
  X,
} from 'lucide-react';

export const VendorPortal: React.FC = () => {
  const {
    currentUser,
    registerVendor,
    vendors,
    updateBookingStatus,
    currentEvent,
    switchRole,
  } = useApp();

  // If user is not yet a vendor, show registration form
  const isVendor = currentUser.role === 'vendor' || !!currentUser.vendorBusinessName;
  const myVendor = vendors.find(v => v.name === currentUser.vendorBusinessName) || vendors[0];

  // Registration Form State
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '+91 98480 12345');
  const [email, setEmail] = useState(currentUser.email || '');
  const [category, setCategory] = useState<EventCategory>('Decoration');
  const [locality, setLocality] = useState(VIZAG_LOCALITIES[0]);
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('10000');
  const [experienceYears, setExperienceYears] = useState('5');
  const [businessHours, setBusinessHours] = useState('9:00 AM – 9:00 PM');
  const [servicesInput, setServicesInput] = useState('Theme Setup, Backdrops, Lighting, Floral Decor');

  // Vendor Dashboard State
  const [activeTab, setActiveTab] = useState<'bookings' | 'packages' | 'profile' | 'reviews'>('bookings');
  
  // New Package Form
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [pkgName, setPkgName] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgDesc, setPkgDesc] = useState('');
  const [pkgInclusions, setPkgInclusions] = useState('');

  // Handle Vendor Registration Submit
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const services = servicesInput.split(',').map(s => s.trim()).filter(Boolean);

    registerVendor({
      name: businessName.trim(),
      category,
      subcategory: `${category} Specialists`,
      city: 'Visakhapatnam',
      locality,
      fullAddress: `${locality}, Visakhapatnam, Andhra Pradesh`,
      startingPrice: Number(startingPrice) || 8000,
      priceUnit: 'per event',
      verified: true,
      isAvailable: true,
      shortDescription: description.trim(),
      about: `${businessName} provides premium, reliable ${category.toLowerCase()} services in Visakhapatnam with ${experienceYears} years of celebration excellence.`,
      images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      ],
      services,
      packages: [
        {
          id: 'pkg-init-1',
          name: 'Standard Package',
          price: Number(startingPrice) || 8000,
          description: 'Essential service package for small and medium celebrations.',
          inclusions: services.slice(0, 3),
        },
      ],
      coordinates: { lat: 17.73, lng: 83.32 },
      contact: {
        phone,
        email,
        whatsapp: phone,
        hours: businessHours,
      },
      experienceYears: Number(experienceYears) || 3,
      responseTime: 'Replies within 20 mins',
    });
  };

  // Mock incoming bookings for this vendor
  const vendorBookings = currentEvent.bookedServices.filter(
    b => b.vendorId === myVendor.id || b.vendorName === myVendor.name
  );

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {!isVendor ? (
          /* ONBOARDING REGISTRATION VIEW */
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-3">
                <Store className="w-3.5 h-3.5" />
                <span>Partner with LocalEvent</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Become a Service Provider
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
                Join coastal Andhra's fastest-growing network of event decorators, caterers, venues, photographers, and entertainers.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200">
              <form onSubmit={handleRegister} className="space-y-6">
                
                {/* Basic Business Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Business / Studio Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Telugu Mandap Creators"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Owner / Lead Specialist
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohini Polamarasetti"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category & Locality */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Primary Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EventCategory)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Decoration">Decoration & Stage Styling</option>
                      <option value="Venues">Venues & Banquets</option>
                      <option value="Catering">Catering & Buffets</option>
                      <option value="Photography">Photography & Videography</option>
                      <option value="Entertainment">Entertainment, DJ & Anchors</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Base Location (Visakhapatnam)
                    </label>
                    <select
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                    >
                      {VIZAG_LOCALITIES.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Contact Phone (Indian Format)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98480 32119"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Business Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="info@business.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Starting Price & Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Starting Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="10000"
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="5"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Business Hours
                    </label>
                    <input
                      type="text"
                      placeholder="9:00 AM – 9:00 PM"
                      value={businessHours}
                      onChange={(e) => setBusinessHours(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Services list comma separated */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Specific Services Offered (Comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mandap Styling, Balloon Garlands, LED Lights, Entrance Toran"
                    value={servicesInput}
                    onChange={(e) => setServicesInput(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Business Bio / Short Overview
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your craft, previous client celebrations, quality guarantees, and team setup..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Register Business & Open Dashboard
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ACTIVE SERVICE PROVIDER DASHBOARD */
          <div className="space-y-8">
            
            {/* Top Provider Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-600 flex items-center justify-center text-white text-2xl font-bold font-display shadow-md">
                  {myVendor.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                      {myVendor.name}
                    </h1>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Provider</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>{myVendor.category}</span>
                    <span>·</span>
                    <span>{myVendor.locality}, Visakhapatnam</span>
                    <span>·</span>
                    <span className="text-amber-500 font-bold">★ {myVendor.rating} ({myVendor.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => switchRole('customer')}
                  className="px-4 py-2 border border-stone-300 hover:border-slate-800 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Switch to Host View
                </button>
              </div>
            </div>

            {/* Provider Earnings & Performance Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Active Inquiries
                </span>
                <div className="text-2xl font-bold text-slate-900 tabular-nums">
                  {vendorBookings.filter(b => b.status === 'Pending').length}
                </div>
                <span className="text-xs text-amber-600 font-medium mt-1 block">Awaiting your response</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Confirmed Bookings
                </span>
                <div className="text-2xl font-bold text-emerald-600 tabular-nums">
                  {vendorBookings.filter(b => b.status === 'Confirmed').length + 2}
                </div>
                <span className="text-xs text-slate-500 font-medium mt-1 block">October celebrations</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Total Booked Volume
                </span>
                <div className="text-2xl font-bold text-slate-900 tabular-nums">
                  ₹{(vendorBookings.reduce((sum, b) => sum + b.price, 0) + 32000).toLocaleString('en-IN')}
                </div>
                <span className="text-xs text-slate-500 font-medium mt-1 block">Current season earnings</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Client Rating
                </span>
                <div className="text-2xl font-bold text-amber-500 tabular-nums flex items-center gap-1">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{myVendor.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-slate-500 font-medium mt-1 block">100% verified hosts</span>
              </div>
            </div>

            {/* Provider Tabs */}
            <div className="flex items-center gap-2 border-b border-stone-200 text-xs font-bold pb-2">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200'
                }`}
              >
                Manage Bookings & Inquiries
              </button>
              <button
                onClick={() => setActiveTab('packages')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'packages'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200'
                }`}
              >
                Packages & Pricing
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200'
                }`}
              >
                Client Reviews ({myVendor.reviews.length})
              </button>
            </div>

            {/* TAB 1: Manage Bookings */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-display text-lg font-bold text-slate-900 mb-4">
                  Incoming Host Requests
                </h3>

                {currentEvent.bookedServices.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    No active booking requests right now.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentEvent.bookedServices.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1 text-xs">
                            <span className="font-bold text-slate-900">{booking.customerName}</span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-500">{booking.customerPhone}</span>
                            <span className="text-slate-400">·</span>
                            <span className="font-semibold text-rose-600">{booking.eventDate}</span>
                          </div>
                          <div className="text-xs font-semibold text-slate-800">
                            Package: {booking.packageName} ({booking.guestCount} guests)
                          </div>
                          {booking.notes && (
                            <p className="text-xs text-slate-500 mt-1 italic">
                              "{booking.notes}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-900 tabular-nums">
                              ₹{booking.price.toLocaleString('en-IN')}
                            </div>
                            <span className="text-[10px] text-amber-600 font-bold uppercase">
                              {booking.status}
                            </span>
                          </div>

                          {booking.status === 'Pending' ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept</span>
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                                className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Decline
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'Completed')}
                              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              Mark Completed
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Packages */}
            {activeTab === 'packages' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Active Packages & Tiers
                  </h3>
                  <button
                    onClick={() => setIsAddingPackage(true)}
                    className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Package</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {myVendor.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-display font-bold text-slate-900">{pkg.name}</h4>
                          <span className="text-sm font-bold text-slate-900 tabular-nums">
                            ₹{pkg.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mb-3">{pkg.description}</p>
                        <ul className="space-y-1 text-xs text-slate-500">
                          {pkg.inclusions.map((inc, i) => (
                            <li key={i}>✓ {inc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Client Feedback
                </h3>
                <div className="space-y-3">
                  {myVendor.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{rev.userName}</span>
                        <span className="text-slate-400">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold mb-1.5">
                        <span>★ {rev.rating}</span>
                        <span className="text-slate-400 font-normal">· {rev.eventType}</span>
                      </div>
                      <p className="text-slate-700">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
