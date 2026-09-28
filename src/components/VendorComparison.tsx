import React from 'react';
import { useApp } from '../context/AppContext';
import { Vendor } from '../types';
import {
  Scale,
  Star,
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
  CalendarCheck,
  Plus,
  Trash2,
} from 'lucide-react';

export const VendorComparison: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    vendors,
    toggleCompareVendor,
    setSelectedVendorForDetail,
    setSelectedVendorForBooking,
    setActiveTab,
  } = useApp();

  const handleAddVendorToCompare = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vId = e.target.value;
    if (!vId) return;
    const found = vendors.find(v => v.id === vId);
    if (found) {
      toggleCompareVendor(found);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>Side-by-Side Evaluation</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Compare Event Service Providers
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Evaluate rates, verified credentials, capacities and services. Compare on your own terms without automated bias.
            </p>
          </div>

          {compareList.length > 0 && (
            <div className="flex items-center gap-3">
              {/* Quick Add Dropdown */}
              {compareList.length < 4 && (
                <div className="relative">
                  <select
                    onChange={handleAddVendorToCompare}
                    defaultValue=""
                    className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 shadow-xs focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>+ Add provider to compare...</option>
                    {vendors
                      .filter(v => !compareList.some(cv => cv.id === v.id))
                      .map(v => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.category} - {v.locality})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <button
                onClick={clearCompare}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {compareList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
              No vendors selected for comparison yet
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Browse vendors in our marketplace and click "Add to Compare" on any card to evaluate them side by side.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('explore')}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Browse All Marketplace Services
              </button>

              <div className="pt-4 border-t border-stone-100">
                <span className="text-xs text-slate-400 block mb-3">Or quickly compare top Vizag decorators:</span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {vendors.slice(0, 3).map(v => (
                    <button
                      key={v.id}
                      onClick={() => toggleCompareVendor(v)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-medium text-slate-800 transition-colors cursor-pointer"
                    >
                      + Add {v.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                
                {/* Table Header: Vendors & Images */}
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/50">
                    <th className="p-4 w-48 text-xs font-bold text-slate-500 uppercase tracking-wider align-top">
                      Vendor Profile
                    </th>
                    {compareList.map(vendor => (
                      <th key={vendor.id} className="p-4 w-64 align-top border-l border-stone-200">
                        <div className="space-y-3">
                          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-200">
                            <img
                              src={vendor.images[0]}
                              alt={vendor.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeFromCompare(vendor.id)}
                              className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
                              title="Remove"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>

                          <div>
                            <div className="text-[11px] font-semibold text-rose-600 mb-0.5">
                              {vendor.category}
                            </div>
                            <h3 className="font-display text-base font-bold text-slate-900 leading-tight">
                              {vendor.name}
                            </h3>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body: Metrics & Features */}
                <tbody className="divide-y divide-stone-100 text-xs">
                  
                  {/* Rating & Reviews */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-600 bg-stone-50/30">
                      Customer Rating
                    </td>
                    {compareList.map(v => (
                      <td key={v.id} className="p-4 border-l border-stone-200">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-slate-900 tabular-nums">{v.rating.toFixed(1)}</span>
                          <span className="text-slate-400 font-normal">({v.reviewCount} reviews)</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Locality */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-600 bg-stone-50/30">
                      Location & Area
                    </td>
                    {compareList.map(v => (
                      <td key={v.id} className="p-4 border-l border-stone-200">
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{v.locality}, {v.city}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Starting Price */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-600 bg-stone-50/30">
                      Starting Rate
                    </td>
                    {compareList.map(v => (
                      <td key={v.id} className="p-4 border-l border-stone-200">
                        <div className="text-base font-bold text-slate-900 tabular-nums">
                          ₹{v.startingPrice.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-slate-500">{v.priceUnit}</span>
                      </td>
                    ))}
                  </tr>

                  {/* Verified Badge */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-600 bg-stone-50/30">
                      Verification
                    </td>
                    {compareList.map(v => (
                      <td key={v.id} className="p-4 border-l border-stone-200">
                        {v.verified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verified Provider</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Response Time */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-600 bg-stone-50/30">
                      Response Time
                    </td>
                    {compareList.map(v => (
                      <td key={v.id} className="p-4 border-l border-stone-200 font-medium text-slate-700">
                        {v.responseTime}
                      </td>
                    ))}
                  </tr>

                  {/* Experience */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-600 bg-stone-50/30">
                      Experience
                    </td>
                    {compareList.map(v => (
                      <td key={v.id} className="p-4 border-l border-stone-200 text-slate-800">
                        {v.experienceYears} Years in coastal AP
                      </td>
                    ))}
                  </tr>

                  {/* Included Packages */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-600 bg-stone-50/30">
                      Packages Offered
                    </td>
                    {compareList.map(v => (
                      <td key={v.id} className="p-4 border-l border-stone-200">
                        <div className="space-y-1.5">
                          {v.packages.map(p => (
                            <div key={p.id} className="p-1.5 rounded bg-stone-50 border border-stone-200">
                              <div className="font-semibold text-slate-800">{p.name}</div>
                              <div className="text-[11px] font-bold text-rose-600 tabular-nums">
                                ₹{p.price.toLocaleString('en-IN')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Actions Row */}
                  <tr>
                    <td className="p-4 font-semibold text-slate-600 bg-stone-50/30">
                      Actions
                    </td>
                    {compareList.map(v => (
                      <td key={v.id} className="p-4 border-l border-stone-200">
                        <div className="space-y-2">
                          <button
                            onClick={() => setSelectedVendorForDetail(v)}
                            className="w-full py-2 px-3 border border-stone-300 hover:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Profile</span>
                          </button>
                          <button
                            onClick={() => setSelectedVendorForBooking({ vendor: v })}
                            className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <CalendarCheck className="w-3.5 h-3.5" />
                            <span>Book Provider</span>
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
