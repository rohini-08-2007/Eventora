import React, { useState } from 'react';
import { Vendor } from '../types';
import { useApp } from '../context/AppContext';
import { MapPin, Star, CheckCircle, Navigation, Eye, IndianRupee, Layers } from 'lucide-react';

interface MapDiscoveryViewProps {
  vendors: Vendor[];
}

export const MapDiscoveryView: React.FC<MapDiscoveryViewProps> = ({ vendors }) => {
  const { setSelectedVendorForDetail, setSelectedVendorForBooking } = useApp();
  const [selectedVendorId, setSelectedVendorId] = useState<string>(vendors[0]?.id || '');
  const [selectedLocality, setSelectedLocality] = useState<string>('All');

  const selectedVendor = vendors.find(v => v.id === selectedVendorId) || vendors[0];

  const mapLocalities = [
    { name: 'All', count: vendors.length },
    { name: 'MVP Colony', count: vendors.filter(v => v.locality === 'MVP Colony').length },
    { name: 'Madhurawada', count: vendors.filter(v => v.locality === 'Madhurawada').length },
    { name: 'Rushikonda', count: vendors.filter(v => v.locality === 'Rushikonda').length },
    { name: 'Siripuram', count: vendors.filter(v => v.locality === 'Siripuram').length },
    { name: 'Dwaraka Nagar', count: vendors.filter(v => v.locality === 'Dwaraka Nagar').length },
    { name: 'Beach Road', count: vendors.filter(v => v.locality === 'Beach Road').length },
    { name: 'Gajuwaka', count: vendors.filter(v => v.locality === 'Gajuwaka').length },
  ];

  const filtered = selectedLocality === 'All'
    ? vendors
    : vendors.filter(v => v.locality === selectedLocality);

  // Approximate relative positioning on our simulated Vizag coastline map canvas
  // Vizag geography: Rushikonda (North-East, top-right), Madhurawada (North, top-center), MVP Colony (Mid-East coast), Siripuram/Dwaraka Nagar (Central), Gajuwaka (South-West)
  const getCoordinatesPosition = (locality: string, index: number) => {
    switch (locality) {
      case 'Rushikonda':
        return { top: '22%', left: '76%' };
      case 'Madhurawada':
        return { top: '18%', left: '48%' };
      case 'MVP Colony':
        return { top: '44%', left: '68%' };
      case 'Beach Road':
        return { top: '56%', left: '64%' };
      case 'Siripuram':
        return { top: '50%', left: '50%' };
      case 'Dwaraka Nagar':
        return { top: '54%', left: '42%' };
      case 'Seethammadhara':
        return { top: '42%', left: '45%' };
      case 'Akkayyapalem':
        return { top: '52%', left: '36%' };
      case 'Gajuwaka':
        return { top: '78%', left: '24%' };
      default:
        return { top: `${35 + (index * 8) % 45}%`, left: `${30 + (index * 11) % 45}%` };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col lg:flex-row h-[680px]">
      
      {/* Left / Top Map Canvas */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden flex flex-col">
        
        {/* Coastal Stylized Map Background */}
        <div className="absolute inset-0 bg-[#0f172a] select-none pointer-events-none">
          {/* Subtle grid lines */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Bay of Bengal Sea Graphic on East / Right */}
          <div
            className="absolute top-0 right-0 bottom-0 w-[38%] bg-gradient-to-l from-cyan-950/70 via-sky-950/50 to-transparent border-l border-cyan-800/30 flex items-center justify-center"
          >
            <div className="rotate-90 text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400/40 select-none">
              Bay of Bengal (Vizag Coast)
            </div>
          </div>

          {/* Coastal Road & Kailasagiri curve lines */}
          <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
            <path
              d="M 200,50 Q 420,180 500,320 T 480,680"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeDasharray="6,6"
            />
            <path
              d="M 120,120 Q 320,300 380,480 T 260,680"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
            />
          </svg>

          {/* Key Geographic Landmarks */}
          <div className="absolute top-6 right-[42%] text-[10px] font-bold text-slate-400 tracking-wider">
            ↑ Madhurawada IT Hub
          </div>
          <div className="absolute top-[26%] right-[22%] text-[10px] font-bold text-cyan-300 tracking-wider">
            🌊 Rushikonda Beach
          </div>
          <div className="absolute top-[38%] right-[32%] text-[10px] font-bold text-amber-300/80 tracking-wider">
            ⛰️ Kailasagiri Hill
          </div>
          <div className="absolute top-[52%] right-[36%] text-[10px] font-bold text-slate-400 tracking-wider">
            RK Beach Road Promenade
          </div>
          <div className="absolute bottom-6 left-6 text-[10px] font-bold text-slate-400 tracking-wider">
            ↙ Gajuwaka & Steel Plant
          </div>
        </div>

        {/* Top Control Bar on Map */}
        <div className="relative z-10 p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Navigation className="w-4 h-4 text-rose-500" />
            <span>Visakhapatnam Vendor Map</span>
            <span className="text-slate-400 font-normal">({filtered.length} locations)</span>
          </div>

          {/* Quick Locality Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
            {mapLocalities.map(loc => (
              <button
                key={loc.name}
                onClick={() => setSelectedLocality(loc.name)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedLocality === loc.name
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Map Pins */}
        <div className="relative flex-1">
          {filtered.map((v, i) => {
            const pos = getCoordinatesPosition(v.locality, i);
            const isSelected = v.id === selectedVendorId;

            return (
              <div
                key={v.id}
                style={{ top: pos.top, left: pos.left }}
                onClick={() => setSelectedVendorId(v.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              >
                {/* Pin Container */}
                <div
                  className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg transition-transform duration-200 ${
                    isSelected
                      ? 'bg-rose-500 text-white scale-110 ring-4 ring-rose-500/30'
                      : 'bg-white text-slate-900 hover:scale-105 hover:bg-rose-50'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-rose-600'}`} />
                  <span className="tabular-nums">₹{(v.startingPrice / 1000).toFixed(0)}k</span>
                </div>

                {/* Tooltip on Hover or Select */}
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-xl bg-slate-900 text-white text-left shadow-xl pointer-events-none transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <div className="font-semibold text-xs truncate">{v.name}</div>
                  <div className="text-[10px] text-amber-300 flex items-center gap-1">
                    <span>★ {v.rating}</span>
                    <span>·</span>
                    <span className="text-slate-300">{v.locality}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Legend */}
        <div className="relative z-10 p-2.5 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Selected Venue/Service</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <span>Available Provider</span>
            </span>
          </div>
          <span className="hidden sm:inline">Click pin to view full details</span>
        </div>

      </div>

      {/* Right Details Panel for Selected Vendor */}
      <div className="w-full lg:w-96 p-5 bg-stone-50 border-t lg:border-t-0 lg:border-l border-stone-200 flex flex-col justify-between overflow-y-auto">
        {selectedVendor ? (
          <div className="space-y-4">
            
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-200">
              <img
                src={selectedVendor.images[0]}
                alt={selectedVendor.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-xs font-bold">
                {selectedVendor.category}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1 text-xs text-rose-600 font-semibold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{selectedVendor.locality}, Visakhapatnam</span>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">
                {selectedVendor.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {selectedVendor.shortDescription}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 py-3 border-y border-stone-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Starting Rate</span>
                <span className="text-base font-bold text-slate-900 tabular-nums">
                  ₹{selectedVendor.startingPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Customer Rating</span>
                <div className="flex items-center gap-1 text-slate-900 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{selectedVendor.rating} ({selectedVendor.reviewCount})</span>
                </div>
              </div>
            </div>

            {/* Included highlights */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Key Services
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedVendor.services.slice(0, 3).map((srv, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{srv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setSelectedVendorForDetail(selectedVendor)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>View Full Profile & Packages</span>
              </button>
              <button
                onClick={() => setSelectedVendorForBooking({ vendor: selectedVendor })}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Book This Vendor</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 text-sm">
            Select a location pin on the map to inspect provider details.
          </div>
        )}
      </div>

    </div>
  );
};
