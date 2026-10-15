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
  Info,
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
      <div className="echo-modal max-w-sm">
        <div
          className="flex items-center justify-between gap-3 pb-5 mb-6"
          style={{ borderBottom: 'var(--echo-rule) solid var(--echo-border)' }}
        >
          <h3 className="ed-h3">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="echo-icon-tile hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
            style={{ width: '1.75rem', height: '1.75rem' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="animate-echo-fade">
      {/* ================= Masthead ================= */}
      <section className="em-section pt-14 sm:pt-20 pb-12">
        <GlobalBackButton />
        <div className="mt-7">
          <p className="ed-label mb-7">Credentials</p>
          <h1 className="ed-h1">{t('profileSettings')}</h1>
          <p className="ed-sub mt-6 max-w-xl text-[14px]">
            Official employee credentials, organizational placement, and contractual parameters.
          </p>
        </div>
      </section>

      {/* ================= Admin notice ================= */}
      <section
        className="em-section pb-12"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div
          className="mt-10 flex items-start gap-4 p-6"
          style={{
            background: 'var(--echo-surface)',
            border: 'var(--echo-rule) solid var(--echo-border)',
            borderLeft: '2px solid var(--echo-accent)',
          }}
        >
          <span className="echo-icon-tile echo-icon-tile--info shrink-0">
            <Info className="w-4 h-4" />
          </span>
          <div className="text-[13px] leading-relaxed text-[var(--echo-ink-2)]">
            <span className="ed-h3 block mb-2">Admin-Governed Profile</span>
            Profile information is managed exclusively by your administrator through the ECHO Admin
            Portal. Employees cannot modify contractual terms, salary grades, or designated roles
            directly.
          </div>
        </div>
      </section>

      {/* ================= Editorial profile header ================= */}
      <section
        className="em-invert em-section py-14"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="em-split items-center">
          <div className="em-split-lead">
            <div className="flex flex-col sm:flex-row sm:items-center gap-7">
              <img
                src={currentEmployee.avatarUrl}
                alt={currentEmployee.name}
                className="w-24 h-24 object-cover grayscale-[0.15] shrink-0"
                style={{ border: 'var(--echo-rule) solid var(--echo-invert-rule-strong)' }}
                referrerPolicy="no-referrer"
              />
              <div>
                <h2
                  className="font-serif text-[clamp(2rem,4.6vw,3.25rem)] leading-[0.98] tracking-[-0.025em]"
                  style={{ color: 'var(--echo-invert-ink)' }}
                >
                  {currentEmployee.name}
                </h2>
                <p className="ed-meta mt-4">
                  {currentEmployee.employeeCode} · {currentEmployee.designation}
                </p>
                <span className="echo-chip mt-5">
                  <Lock className="w-3 h-3" /> Read-Only Profile
                </span>
              </div>
            </div>
          </div>

          <div className="em-split-side">
            <dl>
              {[
                ['Department', currentEmployee.department],
                ['Designation', currentEmployee.designation],
                ['Monthly Salary', currentEmployee.salary],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-5 py-4"
                  style={{ borderTop: 'var(--echo-rule) solid var(--echo-invert-rule)' }}
                >
                  <dt className="ed-meta">{k}</dt>
                  <dd
                    className="text-[14px] font-bold tracking-[-0.01em] text-right truncate max-w-[60%]"
                    style={{ color: 'var(--echo-invert-ink)' }}
                  >
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ================= Detail ledger ================= */}
      <section
        className="em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14">
          {details.map((d) => (
            <div
              key={d.label}
              className="flex items-start gap-4 py-6"
              style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
            >
              <span className="text-[var(--echo-ink-3)] mt-1 shrink-0">{d.icon}</span>
              <div className="min-w-0">
                <div className="echo-kpi-label">{d.label}</div>
                <div
                  className={`mt-3 text-[15px] text-[var(--echo-ink)] ${d.mono ? 'font-mono text-[13px]' : ''}`}
                >
                  {d.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div
          className="mt-10 pt-8 flex flex-wrap items-center justify-between gap-4"
          style={{ borderTop: 'var(--echo-rule) solid var(--echo-ink)' }}
        >
          <button type="button" onClick={() => setShowResetConfirm(true)} className="ed-btn-ghost">
            <RotateCcw className="w-4 h-4" />
            <span>Reset Local Storage &amp; Cache</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSignOutConfirm(true)}
            className="ed-btn-ghost hover:!text-[var(--echo-danger)] hover:!border-[var(--echo-danger)]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </section>

      {/* ================= Dialogs ================= */}
      {showResetConfirm && (
        <ModalShell title="Reset Local Cache" onClose={() => setShowResetConfirm(false)}>
          <p className="text-[13px] leading-relaxed text-[var(--echo-ink-2)]">
            This will clear any local cached records or corrupted tokens and reset mock workspace
            data to its original fresh state.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
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

      {showSignOutConfirm && (
        <ModalShell title="Confirm Sign Out" onClose={() => setShowSignOutConfirm(false)}>
          <p className="text-[13px] leading-relaxed text-[var(--echo-ink-2)]">
            Are you sure you want to sign out of the ECHO Employee Portal? Any unsubmitted task
            drafts will remain saved locally.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
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
