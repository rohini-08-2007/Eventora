import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import { Bell, Heart, Scale, Calendar, User, Sparkles, Store } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    compareList,
    savedVendors,
    notifications,
    currentUser,
    setIsAuthModalOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    switchRole,
  } = useApp();

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const navLinks: { id: NavigationTab; label: string }[] = [
    { id: 'explore', label: 'Explore Services' },
    { id: 'plan', label: 'Plan Event' },
    { id: 'compare', label: 'Compare' },
    { id: 'dashboard', label: 'My Event' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Single text element Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 group text-left cursor-pointer focus-visible:outline-rose-500"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-purple-600 flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display text-2xl font-bold tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                LocalEvent
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-amber-700/80 tracking-wide">
                Vizag & AP
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links (anti-pill) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`relative py-1.5 transition-colors whitespace-nowrap cursor-pointer hover:text-slate-950 ${
                  isActive ? 'text-rose-600 font-semibold' : 'text-slate-600'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions & functional icons */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* Compare shortcut */}
          <button
            onClick={() => setActiveTab('compare')}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Compare Vendors"
            aria-label="Vendor Comparison"
          >
            <Scale className="w-5 h-5" />
            {compareList.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums">
                {compareList.length}
              </span>
            )}
          </button>

          {/* Saved Vendors shortcut */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Saved Vendors"
            aria-label="Saved Vendors"
          >
            <Heart className="w-5 h-5" />
            {savedVendors.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums">
                {savedVendors.length}
              </span>
            )}
          </button>

          {/* Notifications bell */}
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          <div className="h-6 w-px bg-stone-200 hidden sm:block" />

          {/* Service Provider Portal Button */}
          {currentUser.role === 'customer' ? (
            <button
              onClick={() => setActiveTab('vendor-portal')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>For Vendors</span>
            </button>
          ) : (
            <button
              onClick={() => switchRole('customer')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Switch to Host</span>
            </button>
          )}

          {/* User profile / Auth button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 transition-colors text-xs font-medium text-slate-800 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden bg-rose-100 flex items-center justify-center text-rose-600 font-semibold text-[10px]">
              {currentUser.name ? currentUser.name.charAt(0) : <User className="w-3 h-3" />}
            </div>
            <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
          </button>

        </div>
      </div>

      {/* Mobile Secondary Bar for small screens */}
      <div className="md:hidden flex items-center justify-around py-2.5 px-3 border-t border-stone-100 bg-stone-50/80 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-2 py-1 ${activeTab === 'home' ? 'text-rose-600 font-bold' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`px-2 py-1 ${activeTab === 'explore' ? 'text-rose-600 font-bold' : ''}`}
        >
          Explore
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`px-2 py-1 ${activeTab === 'plan' ? 'text-rose-600 font-bold' : ''}`}
        >
          Plan
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2 py-1 ${activeTab === 'dashboard' ? 'text-rose-600 font-bold' : ''}`}
        >
          My Event
        </button>
        <button
          onClick={() => setActiveTab('vendor-portal')}
          className={`px-2 py-1 ${activeTab === 'vendor-portal' ? 'text-purple-600 font-bold' : ''}`}
        >
          Vendors
        </button>
      </div>
    </header>
  );
};
