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
    return `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
      isActive
        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
    } ${isRestricted ? 'opacity-80' : ''}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 sm:left-0 sm:right-auto w-72 sm:w-80 h-full bg-white dark:bg-neutral-900 border-l sm:border-l-0 sm:border-r border-neutral-200 dark:border-neutral-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right sm:slide-in-from-left duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentEmployee.avatarUrl}
              alt={currentEmployee.name}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                {currentEmployee.name}
              </div>
              <div className="text-[11px] text-neutral-500 font-mono truncate">
                {currentEmployee.employeeCode}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main */}
          <div className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Main
            </div>

            <button onClick={() => handleNav('home')} className={navItemClass('home')}>
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4" />
                <span>{t('home')}</span>
              </div>
            </button>

            <button onClick={() => handleNav('dashboard')} className={navItemClass('dashboard')}>
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>{t('dashboard')}</span>
              </div>
            </button>

            <button onClick={() => handleNav('new-task')} className={navItemClass('new-task')}>
              <div className="flex items-center gap-3">
                <CheckSquare className="w-4 h-4" />
                <span>{t('newTask')}</span>
              </div>
            </button>

            <button onClick={() => handleNav('new-activity')} className={navItemClass('new-activity')}>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4" />
                <span>{t('newActivity')}</span>
              </div>
            </button>

            <button onClick={() => handleNav('attendance')} className={navItemClass('attendance')}>
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-4 h-4" />
                <span>{t('attendance')}</span>
              </div>
            </button>
          </div>

          {/* Personal */}
          <div className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Personal
            </div>

            <button
              onClick={() => handleNav('personal-vault')}
              className={navItemClass('personal-vault', !currentEmployee.permissions.personalVault)}
            >
              <div className="flex items-center gap-3">
                <FolderLock className="w-4 h-4" />
                <span>{t('personalVault')}</span>
              </div>
              {!currentEmployee.permissions.personalVault && (
                <Lock className="w-3 h-3 text-neutral-400" />
              )}
            </button>

            <button
              onClick={() => handleNav('photo-gallery')}
              className={navItemClass('photo-gallery', !currentEmployee.permissions.photoGallery)}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4" />
                <span>{t('photoGallery')}</span>
              </div>
              {!currentEmployee.permissions.photoGallery && (
                <Lock className="w-3 h-3 text-neutral-400" />
              )}
            </button>

            <button
              onClick={() => handleNav('company-group')}
              className={navItemClass('company-group', !currentEmployee.permissions.companyGroup)}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>{t('companyGroup')}</span>
              </div>
              {!currentEmployee.permissions.companyGroup && (
                <Lock className="w-3 h-3 text-neutral-400" />
              )}
            </button>

            <button
              onClick={() => handleNav('voucher-creation')}
              className={navItemClass('voucher-creation', !currentEmployee.permissions.voucherCreation)}
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4" />
                <span>{t('voucherCreation')}</span>
              </div>
            </button>
          </div>

          {/* Settings */}
          <div className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Settings
            </div>

            <button onClick={() => handleNav('language')} className={navItemClass('language')}>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4" />
                <span>{t('language')}</span>
              </div>
            </button>

            <button
              onClick={() => handleNav('profile-settings')}
              className={navItemClass('profile-settings')}
            >
              <div className="flex items-center gap-3">
                <UserCheck className="w-4 h-4" />
                <span>{t('profileSettings')}</span>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                signOut();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('signOut')}</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>ECHO OS v3.2</span>
          <span>Companion to Admin</span>
        </div>
      </aside>
    </>
  );
};
