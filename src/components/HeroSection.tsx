import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HERO_IMAGE, VIZAG_LOCALITIES, OTHER_CITIES } from '../data/mockData';
import { Search, MapPin, Calendar, Users, IndianRupee, Sparkles, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveTab, searchFilter, setSearchFilter, createNewEvent } = useApp();

  const [eventType, setEventType] = useState('Birthday');
  const [location, setLocation] = useState('Visakhapatnam (MVP Colony)');
  const [eventDate, setEventDate] = useState('2026-10-18');
  const [guests, setGuests] = useState('100');
  const [budget, setBudget] = useState('50000');

  const quickCategories = [
    { label: 'Birthday', icon: '🎂', type: 'Birthday' },
    { label: 'Wedding', icon: '💍', type: 'Wedding' },
    { label: 'Engagement', icon: '💐', type: 'Engagement' },
    { label: 'College Event', icon: '🎓', type: 'College Event' },
    { label: 'Party', icon: '🎉', type: 'House Party' },
    { label: 'Corporate Event', icon: '🏢', type: 'Corporate Event' },
    { label: 'Haldi', icon: '🌼', type: 'Haldi' },
    { label: 'Baby Shower', icon: '👶', type: 'Baby Shower' },
  ];

  const handleStartPlanning = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilter(prev => ({
      ...prev,
      city: location.includes('(') ? 'Visakhapatnam' : location,
      locality: location.includes('(') ? location.split('(')[1].replace(')', '') : 'All Localities',
      eventDate,
      guests: Number(guests) || 100,
      budget: Number(budget) || 50000,
    }));

    // Initialize or redirect to Plan Event
    setActiveTab('plan');
  };

  const handleQuickCategoryClick = (catType: string) => {
    setEventType(catType);
    setSearchFilter(prev => ({ ...prev, query: catType }));
    setActiveTab('explore');
  };

  return (
    <div className="relative w-full overflow-hidden bg-stone-900 text-white">
      {/* Background Image with Warm Celebratory Gradient Scrim */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Opulent Indian Wedding Celebration Hall in Visakhapatnam"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.78]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-900/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-950/40 via-transparent to-amber-950/30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
        
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-200 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Plan it. Personalize it. Celebrate it.</span>
        </div>

        {/* Heading & Subheading */}
        <div className="max-w-3xl mb-10">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance leading-[1.12]">
            Your perfect event starts here.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-200/90 leading-relaxed font-normal max-w-2xl">
            Discover trusted local vendors, compare services and organize every part of your celebration in one place.
          </p>
          <p className="mt-1 text-xs text-amber-300 font-medium">
            Everything you need for your perfect event, all in one place.
          </p>
        </div>

        {/* Search & Planning Form Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-800 border border-stone-200/70 max-w-5xl backdrop-blur-lg">
          <form onSubmit={handleStartPlanning}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
              
              {/* Event Type */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Event Type
                </label>
                <div className="relative">
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="Birthday">🎂 Birthday</option>
                    <option value="Wedding">💍 Wedding</option>
                    <option value="Engagement">💐 Engagement</option>
                    <option value="Reception">🥂 Reception</option>
                    <option value="Haldi">🌼 Haldi</option>
                    <option value="Baby Shower">👶 Baby Shower</option>
                    <option value="Anniversary">💖 Anniversary</option>
                    <option value="College Event">🎓 College Event</option>
                    <option value="Corporate Event">🏢 Corporate Event</option>
                    <option value="House Party">🏡 House Party</option>
                    <option value="Festival Event">🪔 Festival Event</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-rose-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all cursor-pointer"
                  >
                    <optgroup label="Visakhapatnam Localities">
                      {VIZAG_LOCALITIES.map((loc) => (
                        <option key={loc} value={`Visakhapatnam (${loc})`}>
                          Vizag — {loc}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Other Hubs">
                      {OTHER_CITIES.filter((c) => c !== 'Visakhapatnam').map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Event Date */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Event Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Number of Guests */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Guests
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    placeholder="100"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Budget (₹) */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Budget (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="5000"
                    step="5000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="50000"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

            </div>

            {/* Submit Action */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-100">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Over 120+ verified event decorators, caterers & venues in Visakhapatnam</span>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Planning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Event Categories */}
        <div className="mt-8 pt-4">
          <p className="text-xs uppercase font-bold tracking-wider text-stone-300 mb-3">
            Quick Categories
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {quickCategories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => handleQuickCategoryClick(cat.type)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs font-medium text-stone-100 transition-all hover:scale-102 cursor-pointer"
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
