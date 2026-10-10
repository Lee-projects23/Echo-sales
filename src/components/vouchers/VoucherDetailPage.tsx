import React from 'react';
import { ShieldCheck, Receipt, User, Hash, CalendarDays, Clock3, MessageSquare } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { StatusChip } from '../common/StatusChip';

export const VoucherDetailPage: React.FC = () => {
  const { selectedVoucherId, vouchers, currentEmployee, setActiveTab, t } = usePortal();

  const voucher = vouchers.find((v) => v.id === selectedVoucherId) || vouchers[0];

  const MetaTile: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="rounded-[var(--echo-radius-sm)] border border-[var(--echo-border)] bg-[var(--echo-surface-2)] p-4">
      <div className="echo-kpi-label">{label}</div>
      <div className="mt-2 text-[14px] font-medium text-[var(--echo-ink)]">{value}</div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-echo-fade">
      <GlobalBackButton onBack={() => setActiveTab('voucher-creation')} label="Back to Vouchers" />

      {/* Header */}
      <header className="echo-card echo-card--pad lg:p-8 mt-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="ed-label font-mono">{voucher.voucherCode}</span>
              <span className="echo-rule" />
              <span className="ed-mono">Filed: {voucher.createdAt}</span>
            </div>
            <h1 className="ed-h1">
              {voucher.reason === 'Other' && voucher.customReason ? voucher.customReason : voucher.reason}
            </h1>
          </div>

          <StatusChip status={voucher.status} className="self-start" />
        </div>

        {/* Info Grid */}
        <div className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetaTile
            label="Employee"
            value={
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
                {currentEmployee.name}
              </span>
            }
          />
          <MetaTile
            label="Employee Code"
            value={
              <span className="inline-flex items-center gap-1.5 font-mono">
                <Hash className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
                {currentEmployee.employeeCode}
              </span>
            }
          />
          <MetaTile
            label="Target Date"
            value={
              <span className="inline-flex items-center gap-1.5 font-mono">
                <CalendarDays className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
                {voucher.date}
              </span>
            }
          />
          <MetaTile
            label="Time"
            value={
              <span className="inline-flex items-center gap-1.5 font-mono">
                <Clock3 className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
                {voucher.time}
              </span>
            }
          />
        </div>
      </header>

      {/* Explanation */}
      <section className="echo-card echo-card--pad mb-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-[var(--echo-accent)]" />
          <div className="ed-label">Employee Justification</div>
        </div>
        <p className="text-[14px] leading-relaxed text-[var(--echo-ink-2)]">
          {voucher.description}
        </p>
      </section>

      {/* Admin Response */}
      <section className="echo-card echo-card--pad">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="ed-h3 flex items-center gap-2">
            <span className="echo-icon-tile echo-icon-tile--info" style={{ width: '1.75rem', height: '1.75rem' }}>
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            <span>Admin Decision &amp; Response</span>
          </div>
          {voucher.adminReviewedAt && <span className="ed-mono">{voucher.adminReviewedAt}</span>}
        </div>

        <p className="text-[14px] leading-relaxed text-[var(--echo-ink-2)]">
          {voucher.adminResponse || (
            <span className="italic text-[var(--echo-ink-3)]">
              Pending Operations Review. Admin response will be published here upon verification.
            </span>
          )}
        </p>
      </section>
    </div>
  );
};
