import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  Search,
  Bell,
  Menu,
  X,
  CheckCheck,
  AlertCircle,
  FileText,
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

  const displayedNotifications = notifications.filter((n) =>
    notifFilter === 'unread' ? !n.read : true
  );

  const searchResults = searchQuery.trim()
    ? [
        ...assignedTasks
          .filter(
            (x) =>
              x.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
              x.clientName.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((x) => ({
            id: x.id,
            type: 'task' as const,
            title: x.taskTitle,
            subtitle: `${x.clientName} · ${x.scheduledDate}`,
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
    <header className="sticky top-0 z-40 w-full h-16 border-b border-neutral-900/10 dark:border-white/10 apple-glass">
      <div className="max-w-7xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between gap-4">
        {/* Left Zone: Wordmark + Home */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <button
            onClick={() => {
              setSelectedTaskId(null);
              setSelectedActivityId(null);
              setSelectedVoucherId(null);
              setActiveTab('home');
            }}
            className="flex items-baseline gap-2 cursor-pointer group"
          >
            <span className="font-serif text-xl tracking-[0.08em] text-neutral-950 dark:text-white">
              ECHO
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-500">
              Employee Portal
            </span>
          </button>

          <span className="hidden sm:block w-px h-4 bg-neutral-900/10 dark:bg-white/10" />

          <button
            onClick={() => {
              setSelectedTaskId(null);
              setSelectedActivityId(null);
              setSelectedVoucherId(null);
              setActiveTab('home');
            }}
            className={`text-[11px] font-semibold uppercase tracking-[0.16em] py-1 transition-colors cursor-pointer ${
              activeTab === 'home'
                ? 'text-neutral-950 dark:text-white'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
            }`}
          >
            <span className={activeTab === 'home' ? 'underline underline-offset-8 decoration-1' : ''}>
              {t('home')}
            </span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Center Zone: Search */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="flex items-center border-b border-neutral-900/10 dark:border-white/10 focus-within:border-neutral-950 dark:focus-within:border-white transition-colors">
            <Search className="w-3.5 h-3.5 mr-2 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={t('searchPlaceholder')}
              className="w-full py-1.5 text-xs bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none tracking-wide"
            />
          </div>

          {isSearchFocused && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#121110] border border-neutral-900/10 dark:border-white/10 z-50">
              <div className="ed-label px-4 py-2.5 border-b border-neutral-900/10 dark:border-white/10">
                Matching Results ({searchResults.length})
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-neutral-900/10 dark:divide-white/10">
                {searchResults.length === 0 ? (
                  <div className="p-5 text-center text-xs text-neutral-500">
                    No matching tasks, activities, or vouchers found.
                  </div>
                ) : (
                  searchResults.map((res) => (
                    <button
                      key={`${res.type}-${res.id}`}
                      onClick={() => handleSearchResultClick(res)}
                      className="w-full p-3.5 text-left hover:bg-neutral-900/[0.03] dark:hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                          {res.title}
                        </span>
                        <span className="ed-tag text-neutral-400 dark:text-neutral-500">
                          {res.type === 'task' ? (
                            <FileText className="w-3 h-3" />
                          ) : res.type === 'activity' ? (
                            <AlertCircle className="w-3 h-3" />
                          ) : (
                            <FileText className="w-3 h-3" />
                          )}
                          {res.type}
                        </span>
                      </div>
                      <div className="ed-mono mt-0.5">{res.subtitle}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Zone: Notifications, Profile, Menu */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notification Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label="View notifications"
              className="relative p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-neutral-950 dark:bg-white" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-[#121110] border border-neutral-900/10 dark:border-white/10 z-50">
                <div className="px-4 py-3 border-b border-neutral-900/10 dark:border-white/10 flex items-center justify-between">
                  <span className="ed-h3">{t('notifications')}</span>
                  <span className="ed-tag text-neutral-400">
                    {unreadNotificationsCount > 0
                      ? `${unreadNotificationsCount} unread`
                      : 'All read'}
                  </span>
                </div>

                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-900/10 dark:border-white/10">
                  <div className="flex items-center gap-4 text-[11px]">
                    <button
                      onClick={() => setNotifFilter('all')}
                      className={`uppercase tracking-[0.14em] font-semibold cursor-pointer ${
                        notifFilter === 'all'
                          ? 'text-neutral-950 dark:text-white underline underline-offset-4'
                          : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setNotifFilter('unread')}
                      className={`uppercase tracking-[0.14em] font-semibold cursor-pointer ${
                        notifFilter === 'unread'
                          ? 'text-neutral-950 dark:text-white underline underline-offset-4'
                          : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                      }`}
                    >
                      Unread
                    </button>
                  </div>

                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="p-1 text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                      title={t('markAllAsRead')}
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-neutral-900/10 dark:divide-white/10">
                  {displayedNotifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-500">
                      No notifications to display.
                    </div>
                  ) : (
                    displayedNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className="px-4 py-3.5 text-left hover:bg-neutral-900/[0.03] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span
                            className={`text-xs font-medium truncate ${
                              notif.read
                                ? 'text-neutral-500 dark:text-neutral-400'
                                : 'text-neutral-950 dark:text-white'
                            }`}
                          >
                            {notif.title}
                          </span>
                          <span className="ed-mono shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>
                        {!notif.read && (
                          <span className="inline-block w-1 h-1 rounded-full bg-neutral-950 dark:bg-white mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile + Account Switcher */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 py-1 cursor-pointer group"
            >
              <img
                src={currentEmployee.avatarUrl}
                alt={currentEmployee.name}
                className="w-6 h-6 rounded-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 hidden lg:inline-block">
                {currentEmployee.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#121110] border border-neutral-900/10 dark:border-white/10 z-50 p-4 space-y-3">
                <div className="pb-3 border-b border-neutral-900/10 dark:border-white/10">
                  <div className="font-serif text-base text-neutral-950 dark:text-white">
                    {currentEmployee.name}
                  </div>
                  <div className="ed-mono mt-0.5">
                    {currentEmployee.employeeCode} · {currentEmployee.designation}
                  </div>
                </div>

                <div className="ed-label pt-1">Switch Demo Employee</div>

                <div className="space-y-1">
                  {allEmployees.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => {
                        switchEmployee(emp.id);
                        setIsProfileOpen(false);
                      }}
                      className={`w-full p-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        emp.id === currentEmployee.id
                          ? 'text-neutral-950 dark:text-white'
                          : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.avatarUrl}
                          alt={emp.name}
                          className="w-5 h-5 rounded-full object-cover grayscale"
                          referrerPolicy="no-referrer"
                        />
                        <span>{emp.name}</span>
                      </div>
                      {emp.id === currentEmployee.id && (
                        <span className="ed-tag text-neutral-500 dark:text-neutral-400">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-3 border-t border-neutral-900/10 dark:border-white/10 space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('profile-settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full p-2 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-900/[0.03] dark:hover:bg-white/[0.04] flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t('profileSettings')}</span>
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setIsProfileOpen(false);
                    }}
                    className="w-full p-2 text-left text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('signOut')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};