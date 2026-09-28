import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  CheckCircle,
  Heart,
  Clock,
  ArrowRight,
  User,
  ShieldCheck,
  Edit3,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const {
    currentEvent,
    currentUser,
    savedVendors,
    setSelectedVendorForDetail,
    setActiveTab,
    setCurrentUser,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'events' | 'saved' | 'bookings' | 'profile'>('events');
  const [userName, setUserName] = useState(currentUser.name);
  const [userPhone, setUserPhone] = useState(currentUser.phone);
  const [userEmail, setUserEmail] = useState(currentUser.email);
  const [profileSaved, setProfileSaved] = useState(false);

  const completedTasks = currentEvent.checklist.filter(t => t.completed).length;
  const totalTasks = currentEvent.checklist.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalAllocated = currentEvent.budgetItems.reduce((acc, i) => acc + i.allocatedAmount, 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      name: userName,
      phone: userPhone,
      email: userEmail,
    }));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-xl font-bold shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                My Dashboard
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Welcome back, {currentUser.name} · Managing {currentEvent.title}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('plan')}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>+ Plan Another Event</span>
          </button>
        </div>

        {/* Dashboard Section Switcher */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 mb-8 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveSection('events')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeSection === 'events'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-stone-200 hover:text-slate-900'
            }`}
          >
            My Events
          </button>
          <button
            onClick={() => setActiveSection('saved')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeSection === 'saved'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-stone-200 hover:text-slate-900'
            }`}
          >
            Saved Vendors ({savedVendors.length})
          </button>
          <button
            onClick={() => setActiveSection('bookings')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeSection === 'bookings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-stone-200 hover:text-slate-900'
            }`}
          >
            Bookings ({currentEvent.bookedServices.length})
          </button>
          <button
            onClick={() => setActiveSection('profile')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeSection === 'profile'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-stone-200 hover:text-slate-900'
            }`}
          >
            Profile & Settings
          </button>
        </div>

        {/* SECTION: MY EVENTS */}
        {activeSection === 'events' && (
          <div className="space-y-6">
            
            {/* Active Primary Event Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>Active Celebration</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                    {currentEvent.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{currentEvent.location}</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>{currentEvent.date}</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-purple-500" />
                      <span className="tabular-nums">{currentEvent.guestCount} Guests</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="tabular-nums font-bold">
                        ₹{totalAllocated.toLocaleString('en-IN')} / ₹{currentEvent.budget.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Circle & CTA */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="text-center sm:text-right">
                    <div className="text-xs uppercase font-bold text-slate-400">
                      Overall Readiness
                    </div>
                    <div className="text-3xl font-bold text-rose-600 tabular-nums">
                      {progressPercent}%
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {completedTasks} of {totalTasks} checklist tasks done
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Manage Full Event</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div
                onClick={() => setActiveTab('dashboard')}
                className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                  <span>Day-of Timeline</span>
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">
                  {currentEvent.timeline.length} Milestones Scheduled
                </div>
                <p className="text-xs text-slate-500 mt-1">Starting 10:00 AM with venue inspection</p>
              </div>

              <div
                onClick={() => setActiveTab('dashboard')}
                className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                  <span>Checklist & Tasks</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">
                  {totalTasks - completedTasks} Tasks Pending
                </div>
                <p className="text-xs text-slate-500 mt-1">Next up: Confirm Catering Menu</p>
              </div>

              <div
                onClick={() => setActiveTab('dashboard')}
                className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-slate-300 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                  <span>Vendor Contracts</span>
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-xl font-bold text-slate-900">
                  {currentEvent.bookedServices.length} Active Bookings
                </div>
                <p className="text-xs text-slate-500 mt-1">Vizag Decor Studio, Moments Photo & more</p>
              </div>
            </div>

          </div>
        )}

        {/* SECTION: SAVED VENDORS */}
        {activeSection === 'saved' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <h3 className="font-display text-xl font-bold text-slate-900 mb-4">
              Saved Event Service Providers
            </h3>

            {savedVendors.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No vendors bookmarked yet. Explore services to save your favorite decorators, caterers and photographers!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={vendor.images[0]}
                        alt={vendor.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <div className="text-[10px] font-bold uppercase text-rose-600">
                          {vendor.category}
                        </div>
                        <h4 className="font-display text-sm font-bold text-slate-900 line-clamp-1">
                          {vendor.name}
                        </h4>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{vendor.locality}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        ₹{vendor.startingPrice.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => setSelectedVendorForDetail(vendor)}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION: BOOKINGS */}
        {activeSection === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
              My Service Bookings
            </h3>
            <div className="space-y-3">
              {currentEvent.bookedServices.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{booking.vendorName}</span>
                    <span className="text-slate-400"> · </span>
                    <span className="text-rose-600 font-semibold">{booking.packageName}</span>
                    <div className="text-slate-500 mt-0.5">
                      Event Date: {booking.eventDate} ({booking.guestCount} guests)
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 tabular-nums text-sm">
                      ₹{booking.price.toLocaleString('en-IN')}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        booking.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: PROFILE */}
        {activeSection === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm max-w-2xl">
            <h3 className="font-display text-xl font-bold text-slate-900 mb-4">
              Host Profile & Contact Information
            </h3>

            {profileSaved && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
                Profile updated successfully.
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Mobile Phone (WhatsApp enabled)</label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 font-semibold text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors cursor-pointer"
              >
                Save Profile
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
