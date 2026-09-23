import React, { useState } from 'react';
import {
  User,
  Shield,
  Phone,
  Mail,
  Briefcase,
  Building,
  DollarSign,
  Calendar,
  LogOut,
  Info,
  X,
  Lock,
  RotateCcw,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';

export const ProfileSettingsPage: React.FC = () => {
  const { currentEmployee, signOut, resetWorkspaceData, t } = usePortal();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150">
      <GlobalBackButton />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {t('profileSettings')}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Official employee credentials, organizational placement, and contractual parameters
        </p>
      </div>

      {/* Admin Notice Banner */}
      <div className="rounded-2xl p-4 bg-sky-500/10 border border-sky-500/20 text-sky-800 dark:text-sky-300 flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-sky-500" />
        <div className="text-xs leading-relaxed">
          <span className="font-semibold block mb-0.5">Admin-Governed Profile</span>
          Profile information is managed exclusively by your administrator through the ECHO Admin Portal.
          Employees cannot modify contractual terms, salary grades, or designated roles directly.
        </div>
      </div>

      {/* Profile Card */}
      <div className="apple-card rounded-3xl p-6 sm:p-8 space-y-8">
        {/* User Identity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-neutral-100 dark:border-neutral-800 pb-6">
          <div className="relative">
            <img
              src={currentEmployee.avatarUrl}
              alt={currentEmployee.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-neutral-200 dark:ring-neutral-700 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900 flex items-center justify-center text-white">
              <Shield className="w-3 h-3" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {currentEmployee.name}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
                <Lock className="w-2.5 h-2.5" /> Read-Only
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-mono">
              {currentEmployee.employeeCode} · {currentEmployee.designation}
            </p>
          </div>
        </div>

        {/* 2-Column Detail List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Full Legal Name
            </span>
            <span className="font-semibold text-neutral-900 dark:text-white text-sm block">
              {currentEmployee.name}
            </span>
          </div>

          <div className="space-y-1 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Employee ID
            </span>
            <span className="font-mono font-semibold text-neutral-900 dark:text-white text-sm block">
              {currentEmployee.employeeCode}
            </span>
          </div>

          <div className="space-y-1 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Work Email
            </span>
            <span className="font-mono font-semibold text-neutral-900 dark:text-white text-sm block">
              {currentEmployee.email}
            </span>
          </div>

          <div className="space-y-1 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Contact Phone
            </span>
            <span className="font-mono font-semibold text-neutral-900 dark:text-white text-sm block">
              {currentEmployee.phone}
            </span>
          </div>

          <div className="space-y-1 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> Designation
            </span>
            <span className="font-semibold text-neutral-900 dark:text-white text-sm block">
              {currentEmployee.designation}
            </span>
          </div>

          <div className="space-y-1 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" /> Department
            </span>
            <span className="font-semibold text-neutral-900 dark:text-white text-sm block">
              {currentEmployee.department}
            </span>
          </div>

          <div className="space-y-1 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Monthly Salary
            </span>
            <span className="font-mono font-semibold text-neutral-900 dark:text-white text-sm block">
              {currentEmployee.salary}
            </span>
          </div>

          <div className="space-y-1 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Contract Agreement Period
            </span>
            <span className="font-mono font-semibold text-neutral-900 dark:text-white text-sm block">
              {currentEmployee.agreementStart} — {currentEmployee.agreementEnd}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Local Storage & Cache</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSignOutConfirm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Reset Local Cache
              </h3>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              This will clear any local cached records or corrupted tokens and reset mock workspace data to its original fresh state.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  resetWorkspaceData();
                }}
                className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Dialog */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Confirm Sign Out
              </h3>
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Are you sure you want to sign out of the ECHO Employee Portal? Any unsubmitted task drafts will remain saved locally.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSignOutConfirm(false);
                  signOut();
                }}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
