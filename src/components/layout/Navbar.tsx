import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  Search,
  Bell,
  Menu,
  X,
  CheckCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const {
    currentEmployee,
    allEmployees,
    switchEmployee,
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSelectedTaskId,
    setSelectedActivityId,
    setSelectedVoucherId,
    searchQuery,
    setSearchQuery,
    assignedTasks,
    activities,
    vouchers,
    vaultItems,
    signOut,
    t,
  } = usePortal();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filtered notifications
  const displayedNotifications = notifications.filter((n) =>
    notifFilter === 'unread' ? !n.read : true
  );

  // Search Results
  const searchResults = searchQuery.trim()
    ? [
        ...assignedTasks
          .filter(
            (t) =>
              t.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.clientName.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((t) => ({
            id: t.id,
            type: 'task' as const,
            title: t.taskTitle,
            subtitle: `${t.clientName} · ${t.scheduledDate}`,
            targetTab: 'task-detail' as const,
          })),
        ...activities
          .filter(
            (a) =>
              a.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
              a.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              a.siteName.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((a) => ({
            id: a.id,
            type: 'activity' as const,
            title: a.problem,
            subtitle: `${a.siteName} · ${a.status}`,
            targetTab: 'activity-detail' as const,
          })),
        ...vouchers
          .filter(
            (v) =>
              v.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
              v.voucherCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
              v.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((v) => ({
            id: v.id,
            type: 'voucher' as const,
            title: `${v.voucherCode}: ${v.reason}`,
            subtitle: `${v.date} · ${v.status}`,
            targetTab: 'voucher-detail' as const,
          })),
      ]
    : [];

  const handleSearchResultClick = (item: (typeof searchResults)[0]) => {
    if (item.type === 'task') {
      setSelectedTaskId(item.id);
      setActiveTab('task-detail');
    } else if (item.type === 'activity') {
      setSelectedActivityId(item.id);
      setActiveTab('activity-detail');
    } else if (item.type === 'voucher') {
      setSelectedVoucherId(item.id);
      setActiveTab('voucher-detail');
    }
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleNotificationClick = (n: (typeof notifications)[0]) => {
    markNotificationAsRead(n.id);
    setIsNotifOpen(false);
    if (n.targetPage) {
      if (n.targetPage === 'new-task' && n.targetId) {
        setSelectedTaskId(n.targetId);
        setActiveTab('task-detail');
      } else if (n.targetPage === 'new-activity' && n.targetId) {
        setSelectedActivityId(n.targetId);
        setActiveTab('activity-detail');
      } else if (n.targetPage === 'voucher-creation' && n.targetId) {
        setSelectedVoucherId(n.targetId);
        setActiveTab('voucher-detail');
      } else {
        setActiveTab(n.targetPage);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 border-b border-neutral-200/80 dark:border-neutral-800/80 apple-glass">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Zone: ECHO Wordmark + Home + Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => {
              setSelectedTaskId(null);
              setSelectedActivityId(null);
              setSelectedVoucherId(null);
              setActiveTab('home');
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
              ECHO
            </span>
            <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400">
              Employee
            </span>
          </button>

          <span className="text-neutral-300 dark:text-neutral-700">/</span>

          <button
            onClick={() => {
              setSelectedTaskId(null);
              setSelectedActivityId(null);
              setSelectedVoucherId(null);
              setActiveTab('home');
            }}
            className={`text-xs font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'home'
                ? 'text-neutral-900 dark:text-white bg-neutral-200/50 dark:bg-neutral-800/50'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {t('home')}
          </button>

          {/* Light/Dark Toggle beside Home button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Center Zone: Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-900/90 border border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchFocused && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50">
              <div className="p-2 border-b border-neutral-100 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Matching Results ({searchResults.length})
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-neutral-500">
                    No matching tasks, activities, or vouchers found.
                  </div>
                ) : (
                  searchResults.map((res) => (
                    <button
                      key={`${res.type}-${res.id}`}
                      onClick={() => handleSearchResultClick(res)}
                      className="w-full p-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors flex items-start gap-2.5 cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center shrink-0 mt-0.5">
                        {res.type === 'task' ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : res.type === 'activity' ? (
                          <AlertCircle className="w-3.5 h-3.5" />
                        ) : (
                          <FileText className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                          {res.title}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate">{res.subtitle}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Zone: Notifications, Profile, Menu Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notification Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label="View notifications"
              className="relative w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-950 animate-pulse" />
              )}
            </button>

            {/* Notification Drawer / Panel */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                      {t('notifications')}
                    </span>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px]">
                      <button
                        onClick={() => setNotifFilter('all')}
                        className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                          notifFilter === 'all'
                            ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setNotifFilter('unread')}
                        className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                          notifFilter === 'unread'
                            ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        Unread
                      </button>
                    </div>

                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                        title={t('markAllAsRead')}
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {displayedNotifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-500">
                      No notifications to display.
                    </div>
                  ) : (
                    displayedNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors flex items-start gap-3 cursor-pointer ${
                          !notif.read ? 'bg-sky-50/40 dark:bg-sky-950/20' : ''
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            !notif.read ? 'bg-sky-500' : 'bg-transparent'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-white mb-0.5">
                            <span className="truncate">{notif.title}</span>
                            <span className="text-[10px] text-neutral-400 font-normal shrink-0 ml-2">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile User Icon & Account Switcher Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
            >
              <img
                src={currentEmployee.avatarUrl}
                alt={currentEmployee.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-neutral-300 dark:ring-neutral-700"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 hidden lg:inline-block">
                {currentEmployee.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400 hidden lg:inline-block" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50 p-2 space-y-1">
                <div className="p-2.5 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">
                    {currentEmployee.name}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    {currentEmployee.employeeCode} · {currentEmployee.designation}
                  </div>
                </div>

                <div className="pt-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 px-2">
                  Switch Demo Employee
                </div>

                {allEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      switchEmployee(emp.id);
                      setIsProfileOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      emp.id === currentEmployee.id
                        ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-white'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={emp.avatarUrl}
                        alt={emp.name}
                        className="w-5 h-5 rounded-md object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span>{emp.name}</span>
                    </div>
                    {emp.id === currentEmployee.id && (
                      <span className="text-[10px] text-sky-500 font-medium">Active</span>
                    )}
                  </button>
                ))}

                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-1">
                  <button
                    onClick={() => {
                      setActiveTab('profile-settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t('profileSettings')}</span>
                  </button>

                  <button
                    onClick={() => {
                      signOut();
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('signOut')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Menu Button (Sidebar Toggle) */}
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
