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
  Lock,
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

  const ModalShell: React.FC<{
    title: string;
    onClose: () => void;
    children: React.ReactNode;
  }> = ({ title, onClose, children }) => (
    <div className="echo-modal-scrim">
      <div className="echo-modal max-w-sm space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="ed-h3">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="echo-icon-tile hover:text-[var(--echo-ink)] transition-colors cursor-pointer" style={{ width: '1.875rem', height: '1.875rem' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-echo-fade">
      <div className="mb-10">
        <GlobalBackButton />
        <div className="mt-5">
          <p className="ed-label mb-4">Credentials</p>
          <h1 className="ed-h1">{t('profileSettings')}</h1>
          <p className="ed-sub mt-3 max-w-xl">
            Official employee credentials, organizational placement, and contractual parameters.
          </p>
        </div>
      </div>

      {/* Admin Notice */}
      <div className="echo-card echo-card--pad mb-8 flex items-start gap-4">
        <span className="echo-icon-tile echo-icon-tile--info shrink-0">
          <Shield className="w-4 h-4" />
        </span>
        <div className="text-[13px] leading-relaxed text-[var(--echo-ink-2)]">
          <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--echo-ink)] block mb-1.5">
            Admin-Governed Profile
          </span>
          Profile information is managed exclusively by your administrator through the ECHO Admin Portal.
          Employees cannot modify contractual terms, salary grades, or designated roles directly.
        </div>
      </div>

      {/* Profile */}
      <div className="echo-card overflow-hidden">
        {/* Identity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 sm:p-8 border-b border-[var(--echo-border)]">
          <img
            src={currentEmployee.avatarUrl}
            alt={currentEmployee.name}
            className="w-20 h-20 rounded-full object-cover ring-1 ring-[var(--echo-border-strong)] shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-2 min-w-0">
            <div className="text-3xl font-bold tracking-[-0.03em] text-[var(--echo-ink)] leading-tight">
              {currentEmployee.name}
            </div>
            <div className="ed-mono">
              {currentEmployee.employeeCode} · {currentEmployee.designation}
            </div>
            <span className="ed-tag">
              <Lock className="w-3 h-3" /> Read-Only Profile
            </span>
          </div>
        </div>

        {/* Detail List */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {details.map((d, idx) => (
            <div
              key={d.label}
              className={`py-5 px-6 border-b border-[var(--echo-border)] ${
                idx % 2 !== 0 ? 'md:border-l' : ''
              }`}
            >
              <div className="echo-kpi-label mb-2 flex items-center gap-1.5">{d.icon}{d.label}</div>
              <div className={`text-[14px] text-[var(--echo-ink)] ${d.mono ? 'font-mono' : ''}`}>
                {d.value}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => setShowResetConfirm(true)} className="ed-btn-ghost">
            <RotateCcw className="w-4 h-4" />
            <span>Reset Local Storage &amp; Cache</span>
          </button>

          <button type="button" onClick={() => setShowSignOutConfirm(true)} className="ed-btn-ghost !text-[var(--echo-danger)] !border-[color-mix(in_srgb,var(--echo-danger)_30%,transparent)] hover:!bg-[var(--echo-danger-soft)] hover:!border-[var(--echo-danger)]">
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>

      {/* Reset Dialog */}
      {showResetConfirm && (
        <ModalShell title="Reset Local Cache" onClose={() => setShowResetConfirm(false)}>
          <p className="text-[13px] leading-relaxed text-[var(--echo-ink-2)]">
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
        </ModalShell>
      )}

      {/* Sign Out Dialog */}
      {showSignOutConfirm && (
        <ModalShell title="Confirm Sign Out" onClose={() => setShowSignOutConfirm(false)}>
          <p className="text-[13px] leading-relaxed text-[var(--echo-ink-2)]">
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
        </ModalShell>
      )}
    </div>
  );
};
