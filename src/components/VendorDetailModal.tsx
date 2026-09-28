import React, { useState } from 'react';
import { Vendor, VendorPackage } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  MapPin,
  CheckCircle,
  Heart,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Calendar,
  Share2,
  CalendarCheck,
  ChevronRight,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface VendorDetailModalProps {
  vendor: Vendor;
  onClose: () => void;
}

export const VendorDetailModal: React.FC<VendorDetailModalProps> = ({ vendor, onClose }) => {
  const {
    toggleSaveVendor,
    isVendorSaved,
    setSelectedVendorForBooking,
    addVendorReview,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<VendorPackage | null>(
    vendor.packages[0] || null
  );
  const [activeTab, setActiveTab] = useState<'packages' | 'about' | 'reviews'>('packages');

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newEventType, setNewEventType] = useState('Birthday');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isSaved = isVendorSaved(vendor.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addVendorReview(vendor.id, {
      rating: newRating,
      comment: newComment.trim(),
      eventType: newEventType,
    });
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const handleOpenBooking = (pkg?: VendorPackage) => {
    onClose();
    setSelectedVendorForBooking({
      vendor,
      pkg: pkg || selectedPackage || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
        
        {/* Sticky Header with Title and Close */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              {vendor.category}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-slate-500">{vendor.locality}, {vendor.city}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveVendor(vendor.id)}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'border-stone-200 text-slate-600 hover:bg-stone-50'
              }`}
              title="Save Vendor"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-stone-200 text-slate-600 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-stone-100">
              <img
                src={vendor.images[activeImageIndex] || vendor.images[0]}
                alt={vendor.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-medium">
                Photo {activeImageIndex + 1} of {vendor.images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {vendor.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {vendor.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-rose-600 scale-102 ring-2 ring-rose-500/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Info & Trust Lockup */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  {vendor.name}
                </h2>
                {vendor.verified && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  <span>{vendor.rating.toFixed(1)}</span>
                </div>
                <span>·</span>
                <span>{vendor.reviewCount} customer reviews</span>
                <span>·</span>
                <span>{vendor.experienceYears} years in business</span>
                <span>·</span>
                <span className="text-emerald-700 font-medium">{vendor.responseTime}</span>
              </div>

              <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{vendor.fullAddress}</span>
              </div>
            </div>

            {/* Starting Price Block */}
            <div className="text-left sm:text-right bg-stone-50 p-3.5 rounded-xl border border-stone-200 shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Starting from</span>
              <span className="text-2xl font-bold text-slate-900 tabular-nums">
                ₹{vendor.startingPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 block">{vendor.priceUnit}</span>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-3 border-b border-stone-200 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('packages')}
              className={`pb-3 transition-colors cursor-pointer relative ${
                activeTab === 'packages'
                  ? 'text-rose-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Curated Packages ({vendor.packages.length})
              {activeTab === 'packages' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 transition-colors cursor-pointer relative ${
                activeTab === 'about'
                  ? 'text-rose-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              About & Services
              {activeTab === 'about' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-colors cursor-pointer relative ${
                activeTab === 'reviews'
                  ? 'text-rose-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reviews ({vendor.reviews.length})
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />
              )}
            </button>
          </div>

          {/* Tab 1: Packages Showcase */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vendor.packages.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/30 shadow-md ring-1 ring-rose-500'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-2.5 right-4 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Most Popular
                        </div>
                      )}

                      <div>
                        <h4 className="font-display text-base font-bold text-slate-900 mb-1">
                          {pkg.name}
                        </h4>
                        <div className="text-xl font-bold text-slate-900 tabular-nums mb-2">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </div>
                        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                          {pkg.description}
                        </p>

                        <div className="border-t border-stone-100 pt-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Included in this package:
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {pkg.inclusions.map((inc, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenBooking(pkg);
                          }}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
                              : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                          }`}
                        >
                          Select & Book Package
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: About & Services */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-5">
                <div>
                  <h4 className="font-display text-lg font-bold text-slate-900 mb-2">
                    About {vendor.name}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {vendor.about}
                  </p>
                </div>

                <div>
                  <h4 className="font-display text-lg font-bold text-slate-900 mb-3">
                    Available Services & Offerings
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {vendor.services.map((srv, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-slate-800"
                      >
                        <CheckCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {vendor.guestCapacity && (
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Guest Capacity:</span>
                      <span>Suitable for {vendor.guestCapacity.min} to {vendor.guestCapacity.max} guests comfortably.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact & Business Hours Card */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Business & Booking Hours
                </h4>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{vendor.contact.hours}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="font-semibold">{vendor.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>WhatsApp: {vendor.contact.whatsapp}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{vendor.contact.email}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Transactions protected by LocalEvent Guarantee.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Existing Reviews List */}
              <div className="space-y-3">
                {vendor.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{rev.userName}</span>
                        {rev.verifiedBooking && (
                          <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                            Verified Booking
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                        <span>{rev.rating}</span>
                      </div>
                      <span>·</span>
                      <span className="text-slate-600">{rev.eventType}</span>
                    </div>

                    <p className="text-slate-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add a Review Form */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200">
                <h4 className="font-display text-base font-bold text-slate-900 mb-3">
                  Write a Customer Review
                </h4>

                {reviewSubmitted && (
                  <div className="mb-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    Thank you! Your verified review has been posted.
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Rating (Stars)
                      </label>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-semibold cursor-pointer"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Exceptional)</option>
                        <option value="4">⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                        <option value="3">⭐⭐⭐ 3 Stars (Average)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Event Type
                      </label>
                      <input
                        type="text"
                        value={newEventType}
                        onChange={(e) => setNewEventType(e.target.value)}
                        placeholder="e.g. Birthday Party, Wedding, Reception"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Your Experience
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share details about punctuality, food quality, stage setup, or photography style..."
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 z-20 bg-stone-50 px-6 py-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Selected: <span className="font-bold text-slate-900">{selectedPackage ? selectedPackage.name : 'Starting Rate'}</span>
            {selectedPackage && (
              <span className="font-bold text-rose-600 ml-2 tabular-nums">
                ₹{selectedPackage.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => handleOpenBooking()}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Request Booking</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
