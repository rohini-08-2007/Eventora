import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, CheckCircle, Calendar, AlertCircle, Check } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
  } = useApp();

  if (!isNotificationOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'task':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-700" />
            <h3 className="font-display font-bold text-slate-900 text-sm">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] text-rose-600 font-semibold hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.type === 'booking' || notif.type === 'task') {
                    setActiveTab('dashboard');
                    setIsNotificationOpen(false);
                  }
                }}
                className={`p-3.5 rounded-xl transition-all cursor-pointer ${
                  notif.read ? 'bg-white opacity-75' : 'bg-rose-50/40 border border-rose-100/60 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-stone-100">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 text-center">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setIsNotificationOpen(false);
            }}
            className="text-xs font-semibold text-slate-700 hover:text-rose-600 transition-colors"
          >
            View Event Checklist & Reminders →
          </button>
        </div>

      </div>
    </div>
  );
};
