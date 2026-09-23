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
    return `group w-full flex items-center justify-between py-2.5 text-[13px] transition-colors cursor-pointer border-l-2 pl-6 ${
      isActive
        ? 'border-neutral-950 dark:border-white font-medium text-neutral-950 dark:text-white'
        : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
    } ${isRestricted ? 'opacity-80' : ''}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 sm:left-0 sm:right-auto w-72 sm:w-80 h-full bg-[#f7f5f0] dark:bg-[#0a0a09] border-l sm:border-l-0 sm:border-r border-neutral-900/10 dark:border-white/10 z-50 flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-900/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentEmployee.avatarUrl}
              alt={currentEmployee.name}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-900/10 dark:ring-white/20 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <div className="font-serif text-sm text-neutral-950 dark:text-white truncate">
                {currentEmployee.name}
              </div>
              <div className="ed-mono truncate">{currentEmployee.employeeCode}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto py-6">
          {/* Main */}
          <div className="mb-8">
            <div className="ed-label pl-6 pr-4 pb-2">Index</div>

            <button onClick={() => handleNav('home')} className={navItemClass('home')}>
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 opacity-60" />
                <span>{t('home')}</span>
              </div>
            </button>

            <button onClick={() => handleNav('dashboard')} className={navItemClass('dashboard')}>
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 opacity-60" />
                <span>{t('dashboard')}</span>
              </div>
            </button>

            <button onClick={() => handleNav('new-task')} className={navItemClass('new-task')}>
              <div className="flex items-center gap-3">
                <CheckSquare className="w-4 h-4 opacity-60" />
                <span>{t('newTask')}</span>
              </div>
            </button>

            <button onClick={() => handleNav('new-activity')} className={navItemClass('new-activity')}>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 opacity-60" />
                <span>{t('newActivity')}</span>
              </div>
            </button>

            <button onClick={() => handleNav('attendance')} className={navItemClass('attendance')}>
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-4 h-4 opacity-60" />
                <span>{t('attendance')}</span>
              </div>
            </button>
          </div>

          {/* Personal */}
          <div className="mb-8">
            <div className="ed-label pl-6 pr-4 pb-2">Personal</div>

            <button
              onClick={() => handleNav('personal-vault')}
              className={navItemClass('personal-vault', !currentEmployee.permissions.personalVault)}
            >
              <div className="flex items-center gap-3">
                <FolderLock className="w-4 h-4 opacity-60" />
                <span>{t('personalVault')}</span>
              </div>
              {!currentEmployee.permissions.personalVault && (
                <Lock className="w-3 h-3 opacity-40" />
              )}
            </button>

            <button
              onClick={() => handleNav('photo-gallery')}
              className={navItemClass('photo-gallery', !currentEmployee.permissions.photoGallery)}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 opacity-60" />
                <span>{t('photoGallery')}</span>
              </div>
              {!currentEmployee.permissions.photoGallery && (
                <Lock className="w-3 h-3 opacity-40" />
              )}
            </button>

            <button
              onClick={() => handleNav('company-group')}
              className={navItemClass('company-group', !currentEmployee.permissions.companyGroup)}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 opacity-60" />
                <span>{t('companyGroup')}</span>
              </div>
              {!currentEmployee.permissions.companyGroup && (
                <Lock className="w-3 h-3 opacity-40" />
              )}
            </button>

            <button
              onClick={() => handleNav('voucher-creation')}
              className={navItemClass('voucher-creation', !currentEmployee.permissions.voucherCreation)}
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4 opacity-60" />
                <span>{t('voucherCreation')}</span>
              </div>
            </button>
          </div>

          {/* Settings */}
          <div className="mb-8">
            <div className="ed-label pl-6 pr-4 pb-2">Settings</div>

            <button onClick={() => handleNav('language')} className={navItemClass('language')}>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 opacity-60" />
                <span>{t('language')}</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('profile-settings')}
              className={navItemClass('profile-settings')}
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4 opacity-60" />
                <span>{t('profileSettings')}</span>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                signOut();
              }}
              className="w-full flex items-center gap-3 py-2.5 pl-6 text-[13px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white border-l-2 border-transparent transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 opacity-60" />
              <span>{t('signOut')}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-900/10 dark:border-white/10 ed-mono flex items-center justify-between">
          <span>ECHO OS v3.2</span>
          <span>Companion to Admin</span>
        </div>
      </aside>
    </>
  );
};