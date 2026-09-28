import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { VIZAG_LOCALITIES } from '../data/mockData';

export const Footer: React.FC = () => {
  const { setActiveTab, setSearchFilter } = useApp();

  const handleLocalityClick = (loc: string) => {
    setSearchFilter(prev => ({
      ...prev,
      locality: loc,
      city: 'Visakhapatnam',
    }));
    setActiveTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand & Mission (takes 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-purple-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl font-bold text-white tracking-tight">
                LocalEvent
              </span>
            </div>

            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Plan it. Personalize it. Celebrate it. Coastal Andhra's dedicated event-services marketplace connecting families and hosts with trusted local event specialists.
            </p>

            <div className="pt-2 text-xs text-amber-300 font-medium">
              “Everything you need for your perfect event, all in one place.”
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Verified Local Professionals across Visakhapatnam</span>
            </div>
          </div>

          {/* Column 2: Event Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Services
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setSearchFilter(prev => ({ ...prev, category: 'Venues' }));
                    setActiveTab('explore');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Resorts & Banquet Halls
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSearchFilter(prev => ({ ...prev, category: 'Decoration' }));
                    setActiveTab('explore');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Theme & Mandap Decor
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSearchFilter(prev => ({ ...prev, category: 'Catering' }));
                    setActiveTab('explore');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Traditional Andhra Catering
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSearchFilter(prev => ({ ...prev, category: 'Photography' }));
                    setActiveTab('explore');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Candid Wedding Photography
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSearchFilter(prev => ({ ...prev, category: 'Entertainment' }));
                    setActiveTab('explore');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  DJs, Dhol & Emcees
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Event Formats */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Celebrations
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setSearchFilter(prev => ({ ...prev, query: 'Wedding' }));
                    setActiveTab('explore');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Telugu Weddings & Mandaps
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSearchFilter(prev => ({ ...prev, query: 'Birthday' }));
                    setActiveTab('explore');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Birthday Celebrations
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSearchFilter(prev => ({ ...prev, query: 'Haldi' }));
                    setActiveTab('explore');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Haldi & Sangeet Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSearchFilter(prev => ({ ...prev, query: 'Baby Shower' }));
                    setActiveTab('explore');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sreemantham & Baby Showers
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSearchFilter(prev => ({ ...prev, query: 'Corporate Event' }));
                    setActiveTab('explore');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Corporate Galas & Summits
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Localities in Vizag */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Vizag Neighborhoods
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {VIZAG_LOCALITIES.slice(0, 8).map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocalityClick(loc)}
                  className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors text-[11px] cursor-pointer"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} LocalEvent Technologies India. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>MVP Colony, Visakhapatnam, AP</span>
            <span>·</span>
            <span>All pricing in Indian Rupee (₹)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
