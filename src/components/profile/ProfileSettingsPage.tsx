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
  X,
  RotateCcw,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';

export const ProfileSettingsPage: React.FC = () => {
  const { currentEmployee, signOut, resetWorkspaceData, t } = usePortal();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const details: { label: string; icon: React.ReactNode; value: string; mono?: boolean }[] = [
    { label: 'Full Legal Name', icon: <User className="w-3.5 h-3.5" />, value: currentEmployee.name },
    { label: 'Employee ID', icon: <Shield className="w-3.5 h-3.5" />, value: currentEmployee.employeeCode, mono: true },
    { label: 'Work Email', icon: <Mail className="w-3.5 h-3.5" />, value: currentEmployee.email, mono: true },
    { label: 'Contact Phone', icon: <Phone className="w-3.5 h-3.5" />, value: currentEmployee.phone, mono: true },
    { label: 'Designation', icon: <Briefcase className="w-3.5 h-3.5" />, value: currentEmployee.designation },
    { label: 'Department', icon: <Building className="w-3.5 h-3.5" />, value: currentEmployee.department },
    { label: 'Monthly Salary', icon: <DollarSign className="w-3.5 h-3.5" />, value: currentEmployee.salary, mono: true },
    {
      label: 'Contract Period',
      icon: <Calendar className="w-3.5 h-3.5" />,
      value: `${currentEmployee.agreementStart} — ${currentEmployee.agreementEnd}`,
      mono: true,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      <div className="mb-10">
        <GlobalBackButton />
        <div className="mt-4">
          <p className="ed-label mb-4">Credentials</p>
          <h1 className="ed-h1">{t('profileSettings')}</h1>
          <p className="ed-sub mt-3 max-w-xl">
            Official employee credentials, organizational placement, and contractual parameters.
          </p>
        </div>
      </div>

      {/* Admin Notice */}
      <div className="mb-10 flex items-start gap-4 border border-neutral-900/10 dark:border-white/10 p-5">
        <Shield className="w-4 h-4 shrink-0 mt-0.5 text-neutral-500" />
        <div className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
          <span className="font-semibold uppercase tracking-[0.14em] block mb-1">
            Admin-Governed Profile
          </span>
          Profile information is managed exclusively by your administrator through the ECHO Admin Portal.
          Employees cannot modify contractual terms, salary grades, or designated roles directly.
        </div>
      </div>

      {/* Profile */}
      <div className="mb-12">
        {/* Identity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-neutral-900/10 dark:border-white/10 pb-8">
          <img
            src={currentEmployee.avatarUrl}
            alt={currentEmployee.name}
            className="w-20 h-20 rounded-full object-cover ring-1 ring-neutral-900/15 dark:ring-white/20 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1.5">
            <div className="font-serif text-3xl text-neutral-950 dark:text-neutral-50">
              {currentEmployee.name}
            </div>
            <div className="ed-mono">
              {currentEmployee.employeeCode} · {currentEmployee.designation}
            </div>
            <span className="ed-tag text-neutral-400 dark:text-neutral-500">
              <RotateCcw className="w-3 h-3" /> Read-Only Profile
            </span>
          </div>
        </div>

        {/* Detail List */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {details.map((d, idx) => (
            <div
              key={d.label}
              className={`py-5 pr-6 ${idx % 2 !== 0 ? 'md:border-l border-neutral-900/10 dark:border-white/10 md:pl-8' : ''} border-b border-neutral-900/10 dark:border-white/10`}
            >
              <div className="ed-label mb-2 flex items-center gap-1.5">{d.icon}{d.label}</div>
              <div className={`text-sm text-neutral-950 dark:text-neutral-50 ${d.mono ? 'font-mono' : ''}`}>
                {d.value}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => setShowResetConfirm(true)} className="ed-btn-ghost">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Local Storage &amp; Cache</span>
          </button>

          <button type="button" onClick={() => setShowSignOutConfirm(true)} className="ed-btn-ghost">
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>

      {/* Reset Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm bg-[#f7f5f0] dark:bg-[#0a0a09] border border-neutral-900/10 dark:border-white/10 p-7 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="ed-h3">Reset Local Cache</h3>
              <button onClick={() => setShowResetConfirm(false)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              This will clear any local cached records or corrupted tokens and reset mock workspace data to its original fresh state.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowResetConfirm(false)} className="ed-btn-ghost">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  resetWorkspaceData();
                }}
                className="ed-btn"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Dialog */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm bg-[#f7f5f0] dark:bg-[#0a0a09] border border-neutral-900/10 dark:border-white/10 p-7 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="ed-h3">Confirm Sign Out</h3>
              <button onClick={() => setShowSignOutConfirm(false)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              Are you sure you want to sign out of the ECHO Employee Portal? Any unsubmitted task drafts will remain saved locally.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowSignOutConfirm(false)} className="ed-btn-ghost">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSignOutConfirm(false);
                  signOut();
                }}
                className="ed-btn"
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