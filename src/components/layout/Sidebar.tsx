import React from 'react';
import {
  Home,
  LayoutDashboard,
  CheckSquare,
  AlertCircle,
  CalendarCheck,
  FolderLock,
  Image as ImageIcon,
  Users,
  Receipt,
  Globe,
  UserCheck,
  LogOut,
  X,
  Lock,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { NavigationTab } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    currentEmployee,
    setSelectedTaskId,
    setSelectedActivityId,
    setSelectedVoucherId,
    signOut,
    t,
  } = usePortal();

  const handleNav = (tab: NavigationTab) => {
    setSelectedTaskId(null);
    setSelectedActivityId(null);
    setSelectedVoucherId(null);
    setActiveTab(tab);
    onClose();
  };

  const iconClass = 'w-4 h-4 shrink-0';

  const navItemClass = (isRestricted = false) =>
    `echo-nav-item ${isRestricted ? 'opacity-70' : ''}`.trim();

  /** One navigation row: icon + label, with a lock badge when access is withheld. */
  const NavRow: React.FC<{
    tab: NavigationTab;
    label: string;
    icon: React.ReactNode;
    restricted?: boolean;
  }> = ({ tab, label, icon, restricted = false }) => (
    <button
      onClick={() => handleNav(tab)}
      className={navItemClass(restricted)}
      data-active={activeTab === tab}
      aria-current={activeTab === tab ? 'page' : undefined}
    >
      {icon}
      <span className="truncate">{label}</span>
      {restricted && <Lock className="w-3 h-3 ml-auto opacity-60" />}
    </button>
  );

  const GroupLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="echo-nav-group-label">{children}</div>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] transition-opacity"
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 sm:left-0 sm:right-auto w-72 sm:w-80 h-full bg-[var(--echo-surface)] sm:bg-[var(--echo-bg)] border-l sm:border-l-0 sm:border-r border-[var(--echo-border)] z-50 flex flex-col shadow-[var(--echo-shadow-lg)] sm:shadow-none animate-echo-drawer-right sm:animate-echo-drawer-left">
        {/* Header */}
        <div className="px-5 py-5 border-b border-[var(--echo-border)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentEmployee.avatarUrl}
              alt={currentEmployee.name}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-[var(--echo-border-strong)] shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <div className="text-[14px] font-bold tracking-[-0.01em] text-[var(--echo-ink)] truncate">
                {currentEmployee.name}
              </div>
              <div className="ed-mono truncate mt-0.5">{currentEmployee.employeeCode}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="echo-icon-tile hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto echo-scroll px-3 py-5 space-y-6">
          {/* Main */}
          <div>
            <GroupLabel>Operations</GroupLabel>

            <div className="space-y-0.5">
              <NavRow tab="home" label={t('home')} icon={<Home className={iconClass} />} />
              <NavRow
                tab="dashboard"
                label={t('dashboard')}
                icon={<LayoutDashboard className={iconClass} />}
              />
              <NavRow
                tab="new-task"
                label={t('newTask')}
                icon={<CheckSquare className={iconClass} />}
              />
              <NavRow
                tab="new-activity"
                label={t('newActivity')}
                icon={<AlertCircle className={iconClass} />}
              />
              <NavRow
                tab="attendance"
                label={t('attendance')}
                icon={<CalendarCheck className={iconClass} />}
              />
            </div>
          </div>

          {/* Personal */}
          <div>
            <GroupLabel>Personal</GroupLabel>

            <div className="space-y-0.5">
              <NavRow
                tab="personal-vault"
                label={t('personalVault')}
                icon={<FolderLock className={iconClass} />}
                restricted={!currentEmployee.permissions.personalVault}
              />

              <NavRow
                tab="photo-gallery"
                label={t('photoGallery')}
                icon={<ImageIcon className={iconClass} />}
                restricted={!currentEmployee.permissions.photoGallery}
              />

              <NavRow
                tab="company-group"
                label={t('companyGroup')}
                icon={<Users className={iconClass} />}
                restricted={!currentEmployee.permissions.companyGroup}
              />

              <NavRow
                tab="voucher-creation"
                label={t('voucherCreation')}
                icon={<Receipt className={iconClass} />}
                restricted={!currentEmployee.permissions.voucherCreation}
              />
            </div>
          </div>

          {/* Settings */}
          <div>
            <GroupLabel>Settings</GroupLabel>

            <div className="space-y-0.5">
              <NavRow tab="language" label={t('language')} icon={<Globe className={iconClass} />} />
              <NavRow
                tab="profile-settings"
                label={t('profileSettings')}
                icon={<UserCheck className={iconClass} />}
              />

              <button
                onClick={() => {
                  onClose();
                  signOut();
                }}
                className="echo-nav-item hover:!bg-[var(--echo-danger-soft)] hover:!text-[var(--echo-danger)]"
              >
                <LogOut className={iconClass} />
                <span>{t('signOut')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[var(--echo-border)] flex items-center justify-between ed-mono">
          <span>ECHO OS v3.2</span>
          <span>Companion to Admin</span>
        </div>
      </aside>
    </>
  );
};
