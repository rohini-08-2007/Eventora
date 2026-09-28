import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VIZAG_LOCALITIES, OTHER_CITIES } from '../data/mockData';
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

export const PlanEventPage: React.FC = () => {
  const { createNewEvent, searchFilter } = useApp();

  const [eventType, setEventType] = useState('Birthday');
  const [location, setLocation] = useState('Visakhapatnam (MVP Colony)');
  const [date, setDate] = useState('2026-10-18');
  const [guestCount, setGuestCount] = useState(100);
  const [budget, setBudget] = useState(50000);
  const [preferredStyle, setPreferredStyle] = useState<'Elegant' | 'Colourful' | 'Traditional' | 'Modern'>('Colourful');
  const [requiredServices, setRequiredServices] = useState<string[]>([
    'Venue',
    'Decoration',
    'Catering',
    'Photography',
    'Entertainment',
  ]);
  const [additionalRequirements, setAdditionalRequirements] = useState(
    'Looking for experienced vendors in Visakhapatnam who can deliver authentic Telugu celebration hospitality, pastel theme decor, and live food counters.'
  );

  const availableServices = [
    { id: 'Venue', label: 'Venue (Banquet, Lawns or Resorts)' },
    { id: 'Decoration', label: 'Decoration & Stage Styling' },
    { id: 'Catering', label: 'Catering & Beverages' },
    { id: 'Photography', label: 'Photography' },
    { id: 'Videography', label: 'Videography & Cinematic Films' },
    { id: 'DJ', label: 'DJ & Sound System' },
    { id: 'Anchor', label: 'Anchor / Emcee' },
    { id: 'Makeup', label: 'Bridal & Party Makeup' },
    { id: 'Entertainment', label: 'Entertainment & Live Dhol' },
  ];

  const toggleService = (srvId: string) => {
    if (requiredServices.includes(srvId)) {
      setRequiredServices(requiredServices.filter(s => s !== srvId));
    } else {
      setRequiredServices([...requiredServices, srvId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewEvent({
      eventType,
      location,
      date,
      guestCount: Number(guestCount) || 100,
      budget: Number(budget) || 50000,
      preferredStyle,
      requiredServices,
      additionalRequirements,
    });
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Breadcrumb / Meta */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-xs font-semibold text-rose-700 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Event Organizer</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Plan Your Event
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Tell us about your celebration. We'll set up your personalized event dashboard, budget tracker, timeline, and task checklist.
          </p>
        </div>

        {/* Planning Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Core Event Details */}
            <div>
              <h2 className="text-base font-bold text-slate-900 border-b border-stone-100 pb-3 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">1</span>
                <span>Celebration Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Event Type */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="Birthday">🎂 Birthday</option>
                    <option value="Wedding">💍 Wedding</option>
                    <option value="Engagement">💐 Engagement</option>
                    <option value="Reception">🥂 Reception</option>
                    <option value="Haldi">🌼 Haldi Ceremony</option>
                    <option value="Baby Shower">👶 Baby Shower (Sreemantham)</option>
                    <option value="Anniversary">💖 Anniversary</option>
                    <option value="College Event">🎓 College Fest / Convocation</option>
                    <option value="Corporate Event">🏢 Corporate Gala / Conference</option>
                    <option value="House Party">🏡 House Party / Housewarming</option>
                    <option value="Festival Event">🪔 Festival Event / Dandiya</option>
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Location / Area
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-500">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all cursor-pointer"
                    >
                      <optgroup label="Visakhapatnam Localities">
                        {VIZAG_LOCALITIES.map((loc) => (
                          <option key={loc} value={`Visakhapatnam (${loc})`}>
                            Visakhapatnam — {loc}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Other Major Cities">
                        {OTHER_CITIES.filter((c) => c !== 'Visakhapatnam').map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Event Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-600">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-600">
                      <Users className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      min="10"
                      step="5"
                      required
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* 2. Budget & Preferred Style */}
            <div>
              <h2 className="text-base font-bold text-slate-900 border-b border-stone-100 pb-3 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-bold">2</span>
                <span>Budget & Aesthetics</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Budget */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Total Estimated Budget (₹)
                    </label>
                    <span className="text-xs font-bold text-emerald-600">
                      ₹{budget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      min="5000"
                      step="5000"
                      required
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                    <span>Quick presets:</span>
                    <button
                      type="button"
                      onClick={() => setBudget(25000)}
                      className="text-rose-600 hover:underline cursor-pointer"
                    >
                      ₹25k
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => setBudget(50000)}
                      className="text-rose-600 hover:underline cursor-pointer"
                    >
                      ₹50k
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => setBudget(100000)}
                      className="text-rose-600 hover:underline cursor-pointer"
                    >
                      ₹1 Lakh
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => setBudget(250000)}
                      className="text-rose-600 hover:underline cursor-pointer"
                    >
                      ₹2.5 Lakh
                    </button>
                  </div>
                </div>

                {/* Preferred Style */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Preferred Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Elegant', 'Colourful', 'Traditional', 'Modern'] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setPreferredStyle(style)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                          preferredStyle === style
                            ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                            : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Required Services Checklist */}
            <div>
              <h2 className="text-base font-bold text-slate-900 border-b border-stone-100 pb-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold">3</span>
                  <span>Required Services</span>
                </div>
                <span className="text-xs text-slate-500 font-normal">
                  {requiredServices.length} selected
                </span>
              </h2>

              <p className="text-xs text-slate-500 mb-4">
                Select which services you need for this event. We will automatically organize your budget and tasks for each:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableServices.map((srv) => {
                  const isChecked = requiredServices.includes(srv.id);
                  return (
                    <label
                      key={srv.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'border-rose-300 bg-rose-50/50 shadow-xs'
                          : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleService(srv.id)}
                        className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-800">
                        {srv.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. Additional Requirements */}
            <div>
              <h2 className="text-base font-bold text-slate-900 border-b border-stone-100 pb-3 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold">4</span>
                <span>Additional Notes & Preferences</span>
              </h2>

              <textarea
                rows={3}
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="Mention any specific requests like vegetarian catering, beachside view, floral color palette, or audio equipment needs..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3.5 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Info className="w-4 h-4 text-amber-500 shrink-0" />
                <span>You can edit the plan, add tasks, and adjust expenses anytime from your dashboard.</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Create Event Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
