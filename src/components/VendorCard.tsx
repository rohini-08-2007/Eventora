import React from 'react';
import { Vendor } from '../types';
import { useApp } from '../context/AppContext';
import {
  Star,
  MapPin,
  Heart,
  CheckCircle,
  PlusCircle,
  Eye,
  Check,
  CalendarCheck,
} from 'lucide-react';

interface VendorCardProps {
  vendor: Vendor;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const {
    setSelectedVendorForDetail,
    setSelectedVendorForBooking,
    toggleSaveVendor,
    isVendorSaved,
    toggleCompareVendor,
    isVendorInCompare,
  } = useApp();

  const saved = isVendorSaved(vendor.id);
  const inCompare = isVendorInCompare(vendor.id);

  return (
    <div className="group relative rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Image Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={vendor.images[0]}
          alt={vendor.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Subtle Dark Gradient Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Top Floating Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {/* Availability Quiet Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md text-white text-[11px] font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                vendor.isAvailable ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
            <span>{vendor.isAvailable ? 'Available' : 'Booked Out'}</span>
          </div>

          {/* Save / Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveVendor(vendor.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              saved
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
            title={saved ? 'Remove from saved' : 'Save vendor'}
            aria-label="Save Vendor"
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Image Overlay: Category & Price */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white pointer-events-none">
          <div className="text-xs font-medium text-amber-200 drop-shadow-sm">
            {vendor.subcategory}
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-semibold text-stone-300">
              Starting from
            </div>
            <div className="text-base font-bold text-white tabular-nums drop-shadow-sm">
              ₹{vendor.startingPrice.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        
        <div>
          {/* Unboxed Metadata: Category · Locality */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-rose-600">{vendor.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5 text-slate-600">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{vendor.locality}, {vendor.city}</span>
            </span>
          </div>

          {/* Vendor Name & Verified Badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              onClick={() => setSelectedVendorForDetail(vendor)}
              className="font-display text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors cursor-pointer line-clamp-1"
            >
              {vendor.name}
            </h3>
            {vendor.verified && (
              <span
                className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md"
                title="Verified Vendor by LocalEvent"
              >
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* Rating & Review Count (Clean inline text) */}
          <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 font-bold text-slate-900 tabular-nums">
                {vendor.rating.toFixed(1)}
              </span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 tabular-nums">
              {vendor.reviewCount} reviews
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500">
              {vendor.experienceYears}y exp
            </span>
          </div>

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {vendor.shortDescription}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-stone-100 flex flex-col gap-2.5">
          
          {/* Quick Buttons: View Details, Add to Event */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedVendorForDetail(vendor)}
              className="w-full py-2 px-3 rounded-lg border border-stone-300 hover:border-slate-800 text-xs font-semibold text-slate-800 hover:bg-stone-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </button>

            <button
              onClick={() => setSelectedVendorForBooking({ vendor })}
              className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Add to Event</span>
            </button>
          </div>

          {/* Compare Checkbox */}
          <label className="flex items-center justify-between text-[11px] font-medium text-slate-500 hover:text-slate-900 cursor-pointer pt-1 px-1">
            <span className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={inCompare}
                onChange={() => toggleCompareVendor(vendor)}
                className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <span>Add to Compare list</span>
            </span>
            {inCompare && (
              <span className="text-[10px] font-bold text-purple-600">Selected</span>
            )}
          </label>

        </div>

      </div>

    </div>
  );
};
