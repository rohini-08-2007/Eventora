import React, { useState } from 'react';
import { Vendor, VendorPackage } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  CalendarCheck,
  CheckCircle,
  IndianRupee,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
} from 'lucide-react';

interface BookingModalProps {
  data: {
    vendor: Vendor;
    pkg?: VendorPackage;
  };
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ data, onClose }) => {
  const { currentEvent, createBooking, currentUser, setActiveTab } = useApp();
  const { vendor, pkg } = data;

  const [selectedPackage, setSelectedPackage] = useState<VendorPackage | null>(
    pkg || vendor.packages[0] || null
  );
  const [eventDate, setEventDate] = useState(currentEvent.date || '2026-10-18');
  const [eventLocation, setEventLocation] = useState(currentEvent.location || 'Visakhapatnam (MVP Colony)');
  const [guestCount, setGuestCount] = useState(currentEvent.guestCount || 100);
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const price = selectedPackage ? selectedPackage.price : vendor.startingPrice;
  const platformFee = 0; // Free for hosts
  const gstAmount = Math.round(price * 0.18);
  const totalAmount = price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBooking({
      vendorId: vendor.id,
      vendorName: vendor.name,
      category: vendor.category,
      packageName: selectedPackage ? selectedPackage.name : 'Custom Event Service',
      price: totalAmount,
      eventDate,
      location: eventLocation,
      guestCount: Number(guestCount) || 100,
      status: 'Pending',
      notes,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
    });

    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-rose-600" />
            <h3 className="font-display text-lg font-bold text-slate-900">
              Request Vendor Booking
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <h4 className="font-display text-2xl font-bold text-slate-900">
                  Booking Request Submitted!
                </h4>
                <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                  Your request has been received by <span className="font-bold text-slate-800">{vendor.name}</span>. The service provider typically confirms within 15–30 minutes.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-left max-w-md mx-auto space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-900">{selectedPackage?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-bold text-slate-900">{eventDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Total:</span>
                  <span className="font-bold text-rose-600">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-amber-600">Pending Confirmation</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('dashboard');
                  }}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  View in My Event Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Vendor Summary Card */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <img
                  src={vendor.images[0]}
                  alt={vendor.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-display text-sm font-bold text-slate-900">
                    {vendor.name}
                  </h4>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{vendor.locality}, Visakhapatnam</span>
                  </div>
                  <div className="text-[11px] font-semibold text-rose-600 mt-0.5">
                    {vendor.category} · {vendor.subcategory}
                  </div>
                </div>
              </div>

              {/* Package Selection */}
              {vendor.packages.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Select Package
                  </label>
                  <div className="space-y-2">
                    {vendor.packages.map((pkgItem) => {
                      const isSelected = selectedPackage?.id === pkgItem.id;
                      return (
                        <label
                          key={pkgItem.id}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'border-rose-500 bg-rose-50/40 ring-1 ring-rose-500'
                              : 'border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="vendorPackage"
                              checked={isSelected}
                              onChange={() => setSelectedPackage(pkgItem)}
                              className="text-rose-600 focus:ring-rose-500 cursor-pointer"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{pkgItem.name}</span>
                              <span className="text-slate-500 text-[11px] line-clamp-1">{pkgItem.description}</span>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900 tabular-nums ml-2">
                            ₹{pkgItem.price.toLocaleString('en-IN')}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Date & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Event Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Expected Guests
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="10"
                      required
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Special Notes / Custom Requirements
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need floral canopy in yellow & gold, start setup by 10 AM, vegetarian kitchen..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-slate-800"
                />
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                <div className="font-bold text-slate-900 border-b border-stone-200 pb-1.5 flex items-center justify-between">
                  <span>Booking Summary</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    No advance payment required now
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Base Package:</span>
                  <span className="font-medium text-slate-900 tabular-nums">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Platform & Coordination Fee:</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-rose-600 tabular-nums">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified vendor guarantee</span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Request Booking
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
