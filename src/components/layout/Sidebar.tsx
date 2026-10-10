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

  const navItemClass = (tab: NavigationTab, isRestricted = false) => {
    const isActive = activeTab === tab;
    return `group w-full flex items-center justify-between gap-3 rounded-full px-4 py-2.5 text-[13px] font-medium transition-all duration-200 cursor-pointer ${
      isActive
        ? 'bg-[var(--echo-accent-soft)] text-[var(--echo-accent)]'
        : 'text-[var(--echo-ink-2)] hover:bg-[var(--echo-surface-3)] hover:text-[var(--echo-ink)]'
    } ${isRestricted ? 'opacity-70' : ''}`;
  };

  const groupLabelClass = 'ed-label px-4 pb-2 pt-1';

  const iconClass = 'w-4 h-4 shrink-0';

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
              <div className="text-[14px] font-semibold text-[var(--echo-ink)] truncate">
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
            <div className={groupLabelClass}>Index</div>

            <div className="space-y-0.5">
              <button onClick={() => handleNav('home')} className={navItemClass('home')}>
                <div className="flex items-center gap-3">
                  <Home className={iconClass} />
                  <span>{t('home')}</span>
                </div>
              </button>

              <button onClick={() => handleNav('dashboard')} className={navItemClass('dashboard')}>
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={iconClass} />
                  <span>{t('dashboard')}</span>
                </div>
              </button>

              <button onClick={() => handleNav('new-task')} className={navItemClass('new-task')}>
                <div className="flex items-center gap-3">
                  <CheckSquare className={iconClass} />
                  <span>{t('newTask')}</span>
                </div>
              </button>

              <button onClick={() => handleNav('new-activity')} className={navItemClass('new-activity')}>
                <div className="flex items-center gap-3">
                  <AlertCircle className={iconClass} />
                  <span>{t('newActivity')}</span>
                </div>
              </button>

              <button onClick={() => handleNav('attendance')} className={navItemClass('attendance')}>
                <div className="flex items-center gap-3">
                  <CalendarCheck className={iconClass} />
                  <span>{t('attendance')}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Personal */}
          <div>
            <div className={groupLabelClass}>Personal</div>

            <div className="space-y-0.5">
              <button
                onClick={() => handleNav('personal-vault')}
                className={navItemClass('personal-vault', !currentEmployee.permissions.personalVault)}
              >
                <div className="flex items-center gap-3">
                  <FolderLock className={iconClass} />
                  <span>{t('personalVault')}</span>
                </div>
                {!currentEmployee.permissions.personalVault && (
                  <Lock className="w-3 h-3 opacity-60" />
                )}
              </button>

              <button
                onClick={() => handleNav('photo-gallery')}
                className={navItemClass('photo-gallery', !currentEmployee.permissions.photoGallery)}
              >
                <div className="flex items-center gap-3">
                  <ImageIcon className={iconClass} />
                  <span>{t('photoGallery')}</span>
                </div>
                {!currentEmployee.permissions.photoGallery && (
                  <Lock className="w-3 h-3 opacity-60" />
                )}
              </button>

              <button
                onClick={() => handleNav('company-group')}
                className={navItemClass('company-group', !currentEmployee.permissions.companyGroup)}
              >
                <div className="flex items-center gap-3">
                  <Users className={iconClass} />
                  <span>{t('companyGroup')}</span>
                </div>
                {!currentEmployee.permissions.companyGroup && (
                  <Lock className="w-3 h-3 opacity-60" />
                )}
              </button>

              <button
                onClick={() => handleNav('voucher-creation')}
                className={navItemClass('voucher-creation', !currentEmployee.permissions.voucherCreation)}
              >
                <div className="flex items-center gap-3">
                  <Receipt className={iconClass} />
                  <span>{t('voucherCreation')}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Settings */}
          <div>
            <div className={groupLabelClass}>Settings</div>

            <div className="space-y-0.5">
              <button onClick={() => handleNav('language')} className={navItemClass('language')}>
                <div className="flex items-center gap-3">
                  <Globe className={iconClass} />
                  <span>{t('language')}</span>
                </div>
              </button>

              <button
                onClick={() => handleNav('profile-settings')}
                className={navItemClass('profile-settings')}
              >
                <div className="flex items-center gap-3">
                  <UserCheck className={iconClass} />
                  <span>{t('profileSettings')}</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  signOut();
                }}
                className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-[13px] font-medium text-[var(--echo-ink-3)] hover:bg-[var(--echo-danger-soft)] hover:text-[var(--echo-danger)] transition-colors cursor-pointer"
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
