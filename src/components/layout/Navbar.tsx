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
  CalendarCheck,
  ListChecks,
  Megaphone,
  Receipt,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

type NotificationType = 'task' | 'activity' | 'voucher' | 'attendance' | 'admin' | 'group';

/** Icon + tone per notification type — presentation only. */
const NOTIF_META: Record<NotificationType, { icon: React.ReactNode; tone: string }> = {
  task: { icon: <ListChecks className="w-3.5 h-3.5" />, tone: 'echo-icon-tile--accent' },
  activity: { icon: <AlertCircle className="w-3.5 h-3.5" />, tone: 'echo-icon-tile--warning' },
  voucher: { icon: <Receipt className="w-3.5 h-3.5" />, tone: 'echo-icon-tile--neutral' },
  attendance: { icon: <CalendarCheck className="w-3.5 h-3.5" />, tone: 'echo-icon-tile--positive' },
  admin: { icon: <ShieldCheck className="w-3.5 h-3.5" />, tone: 'echo-icon-tile--accent' },
  group: { icon: <Users className="w-3.5 h-3.5" />, tone: 'echo-icon-tile--accent' },
};

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

  const goHome = () => {
    setSelectedTaskId(null);
    setSelectedActivityId(null);
    setSelectedVoucherId(null);
    setActiveTab('home');
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-[var(--echo-border)] apple-glass">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left Zone: Wordmark + Home + Theme */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <button onClick={goHome} className="flex items-center gap-2.5 cursor-pointer group" aria-label="ECHO home">
            <span
              className="echo-icon-tile echo-icon-tile--accent"
              style={{ width: '1.875rem', height: '1.875rem', borderRadius: '9px' }}
            >
              <span className="text-[13px] font-extrabold leading-none">E</span>
            </span>
            <span className="flex flex-col items-start leading-none">
              <span className="text-[17px] font-extrabold tracking-[0.16em] text-[var(--echo-ink)]">
                ECHO
              </span>
              <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--echo-ink-3)] mt-1">
                Employee Portal
              </span>
            </span>
          </button>

          <span className="hidden sm:block w-px h-5 bg-[var(--echo-border-strong)]" />

          <button
            onClick={goHome}
            className={`hidden sm:inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors cursor-pointer ${
              activeTab === 'home'
                ? 'bg-[var(--echo-accent-soft)] text-[var(--echo-accent)]'
                : 'text-[var(--echo-ink-3)] hover:text-[var(--echo-ink)] hover:bg-[var(--echo-surface-3)]'
            }`}
          >
            {t('home')}
          </button>

          {/* Theme toggle — Day / Night */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
            className="echo-icon-tile hover:text-[var(--echo-ink)] hover:border-[var(--echo-border-strong)] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Center Zone: Search */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="flex items-center rounded-full border border-[var(--echo-border)] bg-[var(--echo-surface-2)] px-4 transition-colors focus-within:border-[var(--echo-accent)] focus-within:bg-[var(--echo-surface)] focus-within:shadow-[0_0_0_3px_var(--echo-accent-soft)]">
            <Search className="w-3.5 h-3.5 mr-2.5 text-[var(--echo-ink-3)] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={t('searchPlaceholder')}
              className="w-full py-2 text-[13px] bg-transparent text-[var(--echo-ink)] placeholder:text-[var(--echo-ink-3)] focus:outline-none"
            />
          </div>

          {isSearchFocused && searchQuery.trim() && (
            <div className="echo-popover absolute top-full left-0 right-0 mt-2 z-50">
              <div className="ed-label px-4 py-3 border-b border-[var(--echo-border)]">
                Matching Results ({searchResults.length})
              </div>
              <div className="max-h-72 overflow-y-auto echo-scroll divide-y divide-[var(--echo-border)]">
                {searchResults.length === 0 ? (
                  <div className="p-6 text-center text-[13px] text-[var(--echo-ink-3)]">
                    No matching tasks, activities, or vouchers found.
                  </div>
                ) : (
                  searchResults.map((res) => (
                    <button
                      key={`${res.type}-${res.id}`}
                      onClick={() => handleSearchResultClick(res)}
                      className="w-full p-3.5 text-left hover:bg-[var(--echo-surface-2)] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[13px] font-medium text-[var(--echo-ink)] truncate">
                          {res.title}
                        </span>
                        <span className="ed-tag shrink-0">
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
                      <div className="ed-mono mt-1">{res.subtitle}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Zone: Notifications, Profile, Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Notification Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label="View notifications"
              className="echo-icon-tile relative hover:text-[var(--echo-ink)] hover:border-[var(--echo-border-strong)] transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--echo-danger)] ring-2 ring-[var(--echo-overlay)]" />
              )}
            </button>

            {/* Notification Panel */}
            {isNotifOpen && (
              <div className="echo-popover absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-96 z-50">
                {/* Header */}
                <div className="px-4 py-3.5 border-b border-[var(--echo-border)] flex items-center justify-between gap-3">
                  <span className="ed-h3">{t('notifications')}</span>
                  <span
                    className={
                      unreadNotificationsCount > 0
                        ? 'echo-chip echo-chip--accent'
                        : 'echo-chip'
                    }
                  >
                    {unreadNotificationsCount > 0 ? `${unreadNotificationsCount} unread` : 'All read'}
                  </span>
                </div>

                {/* Filters + mark all read */}
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-[var(--echo-border)]">
                  <div className="echo-segment">
                    <button
                      onClick={() => setNotifFilter('all')}
                      className="echo-segment-item"
                      data-active={notifFilter === 'all'}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      onClick={() => setNotifFilter('unread')}
                      className="echo-segment-item"
                      data-active={notifFilter === 'unread'}
                    >
                      Unread
                    </button>
                  </div>

                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="ed-link shrink-0"
                      title={t('markAllAsRead')}
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mark all read</span>
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto echo-scroll divide-y divide-[var(--echo-border)]">
                  {displayedNotifications.length === 0 ? (
                    <div className="p-10 text-center">
                      <span className="echo-icon-tile mx-auto mb-4">
                        <Megaphone className="w-4 h-4" />
                      </span>
                      <p className="text-[13px] text-[var(--echo-ink-3)]">
                        {notifFilter === 'unread'
                          ? 'You are all caught up — no unread notifications.'
                          : 'No notifications to display.'}
                      </p>
                    </div>
                  ) : (
                    displayedNotifications.map((notif) => {
                      const meta = NOTIF_META[notif.type as NotificationType] ?? NOTIF_META.admin;
                      return (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className="flex items-start gap-3 px-4 py-3.5 hover:bg-[var(--echo-surface-2)] transition-colors cursor-pointer"
                        >
                          <span className={`echo-icon-tile shrink-0 ${meta.tone}`} style={{ width: '1.875rem', height: '1.875rem' }}>
                            {meta.icon}
                          </span>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-3">
                              <span
                                className={`text-[13px] truncate ${
                                  notif.read
                                    ? 'font-medium text-[var(--echo-ink-2)]'
                                    : 'font-bold text-[var(--echo-ink)]'
                                }`}
                              >
                                {notif.title}
                              </span>
                              <span className="ed-mono shrink-0">{notif.timestamp}</span>
                            </div>
                            <p className="text-[12px] leading-relaxed text-[var(--echo-ink-3)] mt-1 line-clamp-2">
                              {notif.message}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              {!notif.read && (
                                <span className="echo-chip echo-chip--accent">
                                  <span className="echo-dot" />
                                  Unread
                                </span>
                              )}
                              <span className="ed-mono capitalize">{notif.type}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile + Account Switcher */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 cursor-pointer hover:bg-[var(--echo-surface-3)] transition-colors"
            >
              <img
                src={currentEmployee.avatarUrl}
                alt={currentEmployee.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-[var(--echo-border-strong)]"
                referrerPolicy="no-referrer"
              />
              <span className="text-[13px] font-semibold text-[var(--echo-ink)] hidden lg:inline-block">
                {currentEmployee.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
            </button>

            {isProfileOpen && (
              <div className="echo-popover absolute right-0 mt-3 w-64 p-2 z-50">
                <div className="px-3 py-3 mb-1 rounded-[var(--echo-radius-sm)] bg-[var(--echo-surface-2)]">
                  <div className="text-[15px] font-bold tracking-[-0.01em] text-[var(--echo-ink)]">
                    {currentEmployee.name}
                  </div>
                  <div className="ed-mono mt-1">
                    {currentEmployee.employeeCode} · {currentEmployee.designation}
                  </div>
                </div>

                <div className="ed-label px-3 pt-2 pb-1">Switch Demo Employee</div>

                <div className="space-y-0.5">
                  {allEmployees.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => {
                        switchEmployee(emp.id);
                        setIsProfileOpen(false);
                      }}
                      className={`w-full p-2 text-left flex items-center justify-between text-[13px] rounded-[var(--echo-radius-sm)] transition-colors cursor-pointer ${
                        emp.id === currentEmployee.id
                          ? 'bg-[var(--echo-accent-soft)] text-[var(--echo-accent)]'
                          : 'text-[var(--echo-ink-2)] hover:bg-[var(--echo-surface-2)] hover:text-[var(--echo-ink)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={emp.avatarUrl}
                          alt={emp.name}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <span className="truncate">{emp.name}</span>
                      </div>
                      {emp.id === currentEmployee.id && <span className="echo-chip shrink-0">Active</span>}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-[var(--echo-border)] space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveTab('profile-settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full p-2 text-left text-[13px] text-[var(--echo-ink-2)] hover:bg-[var(--echo-surface-2)] hover:text-[var(--echo-ink)] flex items-center gap-2.5 rounded-[var(--echo-radius-sm)] transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                    <span>{t('profileSettings')}</span>
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setIsProfileOpen(false);
                    }}
                    className="w-full p-2 text-left text-[13px] text-[var(--echo-ink-3)] hover:bg-[var(--echo-danger-soft)] hover:text-[var(--echo-danger)] flex items-center gap-2.5 rounded-[var(--echo-radius-sm)] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
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
            className="echo-icon-tile hover:text-[var(--echo-ink)] hover:border-[var(--echo-border-strong)] transition-colors cursor-pointer"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
