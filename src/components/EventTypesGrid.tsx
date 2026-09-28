import React from 'react';
import { useApp } from '../context/AppContext';
import { EVENT_TYPES_DATA } from '../data/mockData';
import { ArrowRight, Sparkles } from 'lucide-react';

export const EventTypesGrid: React.FC = () => {
  const { setActiveTab, setSearchFilter } = useApp();

  const handleSelectEventType = (typeName: string) => {
    setSearchFilter(prev => ({
      ...prev,
      query: typeName,
      category: 'All',
    }));
    setActiveTab('explore');
  };

  return (
    <section className="py-16 sm:py-20 bg-stone-50/60 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Celebration Formats</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Celebrate every milestone in style
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              From colorful daytime Haldi ceremonies to grand beachfront wedding receptions and intimate home birthdays.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('explore')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>Explore all services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive Grid of Event Types */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {EVENT_TYPES_DATA.map((event) => (
            <div
              key={event.id}
              onClick={() => handleSelectEventType(event.name)}
              className="group relative rounded-2xl overflow-hidden bg-white border border-stone-200/80 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-[260px]"
            >
              {/* Image Container with Scrim */}
              <div className="relative w-full h-[160px] overflow-hidden bg-stone-200">
                <img
                  src={event.image}
                  alt={event.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback container gradient if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                
                {/* Event Icon & Name overlay on image for clarity */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-lg">{event.icon}</span>
                    <h3 className="font-display text-lg font-bold text-white tracking-wide">
                      {event.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Card Body - Zero pill clean typography */}
              <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-rose-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Browse local specialists</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
