import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EventCategory } from '../types';
import { VIZAG_LOCALITIES, OTHER_CITIES } from '../data/mockData';
import { VendorCard } from './VendorCard';
import { MapDiscoveryView } from './MapDiscoveryView';
import {
  Search,
  Filter,
  MapPin,
  Star,
  SlidersHorizontal,
  LayoutGrid,
  Map as MapIcon,
  CheckCircle,
  X,
  IndianRupee,
  Sparkles,
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const { vendors, searchFilter, setSearchFilter, setActiveTab } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchFilter.category || 'All');
  const [selectedLocality, setSelectedLocality] = useState<string>(searchFilter.locality || 'All Localities');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(searchFilter.query || '');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const categories: { label: string; value: string; count: number }[] = [
    { label: 'All Services', value: 'All', count: vendors.length },
    { label: 'Venues', value: 'Venues', count: vendors.filter(v => v.category === 'Venues').length },
    { label: 'Decoration', value: 'Decoration', count: vendors.filter(v => v.category === 'Decoration').length },
    { label: 'Catering', value: 'Catering', count: vendors.filter(v => v.category === 'Catering').length },
    { label: 'Photography', value: 'Photography', count: vendors.filter(v => v.category === 'Photography').length },
    { label: 'Entertainment', value: 'Entertainment', count: vendors.filter(v => v.category === 'Entertainment').length },
  ];

  const subcategoryMap: Record<string, string[]> = {
    Venues: ['All', 'Banquet halls', 'Function halls', 'Resorts', 'Outdoor venues', 'Beachside venues'],
    Decoration: ['All', 'Birthday decorators', 'Wedding decorators', 'Balloon decorators', 'Floral decorators', 'Stage decorators'],
    Catering: ['All', 'Vegetarian catering', 'Non-vegetarian catering', 'Buffet', 'Snacks', 'Andhra catering'],
    Photography: ['All', 'Wedding photography', 'Birthday photography', 'Candid photography', 'Videography', 'Pre-wedding photography'],
    Entertainment: ['All', 'DJs', 'Live bands', 'Anchors', 'Dance performers', 'Event hosts'],
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      // Category filter
      if (selectedCategory !== 'All' && vendor.category !== selectedCategory) {
        return false;
      }

      // Locality filter
      if (selectedLocality !== 'All Localities' && !vendor.locality.toLowerCase().includes(selectedLocality.toLowerCase())) {
        return false;
      }

      // Search query (matches name, subcategory, services, city, description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = vendor.name.toLowerCase().includes(q);
        const matchesSub = vendor.subcategory.toLowerCase().includes(q);
        const matchesLoc = vendor.locality.toLowerCase().includes(q);
        const matchesServices = vendor.services.some(s => s.toLowerCase().includes(q));
        const matchesDesc = vendor.shortDescription.toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesLoc && !matchesServices && !matchesDesc) {
          return false;
        }
      }

      // Rating filter
      if (minRating > 0 && vendor.rating < minRating) {
        return false;
      }

      // Max price
      if (vendor.startingPrice > maxPrice) {
        return false;
      }

      // Verified toggle
      if (onlyVerified && !vendor.verified) {
        return false;
      }

      // Available toggle
      if (onlyAvailable && !vendor.isAvailable) {
        return false;
      }

      return true;
    });
  }, [
    vendors,
    selectedCategory,
    selectedLocality,
    searchQuery,
    minRating,
    maxPrice,
    onlyVerified,
    onlyAvailable,
  ]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedLocality('All Localities');
    setSelectedSubcategory('All');
    setSearchQuery('');
    setMinRating(0);
    setMaxPrice(100000);
    setOnlyVerified(false);
    setOnlyAvailable(false);
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & View Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visakhapatnam & Coastal AP Marketplace</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Explore Event Services
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Browse top-rated venues, decorators, caterers, photographers & entertainers.
            </p>
          </div>

          {/* Toggle between Grid View & Map Discovery View */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="p-1 bg-stone-200/80 rounded-xl flex items-center gap-1 text-xs font-semibold">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map Discovery</span>
              </button>
            </div>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden p-2 bg-white border border-stone-300 rounded-xl text-slate-700 flex items-center justify-center cursor-pointer"
              title="Filter Services"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs (Zero-pill functional segmented buttons) */}
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setSelectedSubcategory('All');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded-md ${
                    selectedCategory === cat.value
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-100 text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Subcategories (if a category is active) */}
        {selectedCategory !== 'All' && subcategoryMap[selectedCategory] && (
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0">Subcategory:</span>
            {subcategoryMap[selectedCategory].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedSubcategory === sub
                    ? 'bg-rose-100 text-rose-800 font-bold border border-rose-200'
                    : 'bg-white text-slate-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Search Bar & Inline Filters */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200 shadow-xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search vendor, catering, decor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Locality Selector */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none cursor-pointer"
              >
                <option value="All Localities">All Vizag Areas</option>
                {VIZAG_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div className="flex flex-col justify-center px-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                <span>Max Starting Price</span>
                <span className="text-rose-600 font-bold tabular-nums">
                  ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rating & Toggles */}
            <div className="flex items-center gap-2 justify-between">
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="0">Any Rating</option>
                <option value="4.5">★ 4.5 & above</option>
                <option value="4.7">★ 4.7 & above</option>
              </select>

              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span>Verified</span>
              </label>

              {(searchQuery || selectedCategory !== 'All' || selectedLocality !== 'All Localities' || minRating > 0 || maxPrice < 100000 || onlyVerified) && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Main Content Area */}
        {viewMode === 'map' ? (
          <div className="mb-12">
            <MapDiscoveryView vendors={filteredVendors} />
          </div>
        ) : (
          <div>
            {/* Results count & status */}
            <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
              <div>
                Showing <span className="font-bold text-slate-900 tabular-nums">{filteredVendors.length}</span> verified event providers in{' '}
                <span className="font-semibold text-slate-900">{selectedLocality}</span>
              </div>
              <div className="hidden sm:block">
                All prices are in Indian Rupees (₹)
              </div>
            </div>

            {/* Vendor Cards Grid */}
            {filteredVendors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-1">
                  No matching providers found
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Try adjusting your filters or searching across other localities in Visakhapatnam.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
