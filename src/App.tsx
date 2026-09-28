import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { EventTypesGrid } from './components/EventTypesGrid';
import { MarketplaceView } from './components/MarketplaceView';
import { PlanEventPage } from './components/PlanEventPage';
import { EventDashboard } from './components/EventDashboard';
import { VendorComparison } from './components/VendorComparison';
import { VendorPortal } from './components/VendorPortal';
import { UserDashboard } from './components/UserDashboard';
import { VendorCard } from './components/VendorCard';
import { VendorDetailModal } from './components/VendorDetailModal';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import {
  ShieldCheck,
  CalendarCheck,
  IndianRupee,
  Sparkles,
  ArrowRight,
  Star,
  Users,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedVendorForDetail,
    setSelectedVendorForDetail,
    selectedVendorForBooking,
    setSelectedVendorForBooking,
    vendors,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div>
            <HeroSection />

            {/* Event Formats Grid */}
            <EventTypesGrid />

            {/* Featured Vendors in Visakhapatnam */}
            <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Top Rated Specialists</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                    Featured Vizag Event Specialists
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Handpicked wedding decorators, beachside venues, authentic caterers & photographers.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('explore')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <span>Explore all 120+ vendors</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 3 Featured Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.slice(0, 3).map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            </section>

            {/* Why LocalEvent Trust Strip */}
            <section className="py-16 bg-white border-y border-stone-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Everything you need for your perfect event
                  </h2>
                  <p className="text-sm text-slate-600 mt-2">
                    Designed specifically for Indian families and modern event planners in coastal Andhra.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      100% Verified Local Experts
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Every caterer, decorator, and photographer is physically verified in Visakhapatnam with authentic portfolios and real customer reviews.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
                      <CalendarCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      Integrated Event Command
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Manage your budget tracker, milestone day-of timeline, and task checklist in one organized dashboard without scattered spreadsheets.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                      <IndianRupee className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      Transparent Indian ₹ Rates
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Compare transparent per-plate and per-event packages directly. No middleman commissions or opaque hidden surcharges.
                    </p>
                  </div>

                </div>
              </div>
            </section>

            {/* Big Action Callout */}
            <section className="py-16 sm:py-20 bg-[#FAF8F5]">
              <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                      Ready to create your dream celebration?
                    </h3>
                    <p className="text-sm text-stone-100">
                      Set up your custom event in under 2 minutes. Organize your budget, connect with Vizag’s best vendors, and relax.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('plan')}
                    className="px-7 py-3.5 bg-white text-rose-700 hover:bg-stone-50 font-bold text-sm rounded-xl shadow-md transition-all self-start md:self-auto cursor-pointer whitespace-nowrap"
                  >
                    Start Planning Now →
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: EXPLORE SERVICES MARKETPLACE */}
        {activeTab === 'explore' && <MarketplaceView />}

        {/* TAB 3: PLAN EVENT FORM */}
        {activeTab === 'plan' && <PlanEventPage />}

        {/* TAB 4: MY EVENT DASHBOARD */}
        {activeTab === 'dashboard' && <EventDashboard />}

        {/* TAB 5: VENDOR COMPARISON */}
        {activeTab === 'compare' && <VendorComparison />}

        {/* TAB 6: SERVICE PROVIDER PORTAL */}
        {activeTab === 'vendor-portal' && <VendorPortal />}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      {selectedVendorForDetail && (
        <VendorDetailModal
          vendor={selectedVendorForDetail}
          onClose={() => setSelectedVendorForDetail(null)}
        />
      )}

      {selectedVendorForBooking && (
        <BookingModal
          data={selectedVendorForBooking}
          onClose={() => setSelectedVendorForBooking(null)}
        />
      )}

      <AuthModal />
      <NotificationDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
