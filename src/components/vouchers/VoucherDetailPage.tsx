import React from 'react';
import { ShieldCheck, Receipt, User, Hash, CalendarDays, Clock3, MessageSquare } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { StatusChip } from '../common/StatusChip';

export const VoucherDetailPage: React.FC = () => {
  const { selectedVoucherId, vouchers, currentEmployee, setActiveTab, t } = usePortal();

  const voucher = vouchers.find((v) => v.id === selectedVoucherId) || vouchers[0];

  const MetaTile: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
      <div className="echo-kpi-label">{label}</div>
      <div className="mt-3 text-[14px] font-medium text-[var(--echo-ink)]">{value}</div>
    </div>
  );

  return (
    <div className="animate-echo-fade">
      {/* ================= Masthead ================= */}
      <section className="em-section pt-14 sm:pt-20 pb-12">
        <GlobalBackButton onBack={() => setActiveTab('voucher-creation')} label="Back to Vouchers" />

        <div className="mt-7 em-split items-end">
          <div className="em-split-lead">
            <div className="flex flex-wrap items-center gap-4 mb-7">
              <span className="ed-label font-mono">{voucher.voucherCode}</span>
              <span className="w-10 h-px" style={{ background: 'var(--echo-border-strong)' }} />
              <span className="ed-meta">Filed: {voucher.createdAt}</span>
            </div>
            <h1 className="ed-h1">
              {voucher.reason === 'Other' && voucher.customReason ? voucher.customReason : voucher.reason}
            </h1>
          </div>

          <div className="em-split-side">
            <StatusChip status={voucher.status} dot />

            <div
              className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 pt-7"
              style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
            >
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
                  <span className="inline-flex items-center gap-1.5 font-mono text-[13px]">
                    <Hash className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
                    {currentEmployee.employeeCode}
                  </span>
                }
              />
              <MetaTile
                label="Target Date"
                value={
                  <span className="inline-flex items-center gap-1.5 font-mono text-[13px]">
                    <CalendarDays className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
                    {voucher.date}
                  </span>
                }
              />
              <MetaTile
                label="Time"
                value={
                  <span className="inline-flex items-center gap-1.5 font-mono text-[13px]">
                    <Clock3 className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
                    {voucher.time}
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= Justification + admin decision ================= */}
      <section
        className="em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="em-split items-start">
          <div className="em-split-lead">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-4 h-4 text-[var(--echo-accent)]" />
              <span className="ed-label">Employee Justification</span>
            </div>
            <p className="text-[16px] leading-relaxed text-[var(--echo-ink-2)]">{voucher.description}</p>
          </div>

          <div className="em-split-side">
            <div
              className="p-6"
              style={{
                background: 'var(--echo-surface-2)',
                border: 'var(--echo-rule) solid var(--echo-border)',
                borderLeft: '2px solid var(--echo-accent)',
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="ed-h3 flex items-center gap-2">
                  <span className="echo-icon-tile echo-icon-tile--info" style={{ width: '1.75rem', height: '1.75rem' }}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                  <span>Admin Decision &amp; Response</span>
                </div>
                {voucher.adminReviewedAt && <span className="ed-meta">{voucher.adminReviewedAt}</span>}
              </div>

              <p className="text-[14px] leading-relaxed text-[var(--echo-ink-2)]">
                {voucher.adminResponse || (
                  <span className="italic text-[var(--echo-ink-3)]">
                    Pending Operations Review. Admin response will be published here upon verification.
                  </span>
                )}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 ed-meta">
              <Receipt className="w-3.5 h-3.5" />
              {voucher.voucherCode} · {voucher.status}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
