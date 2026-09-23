import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';

export const VoucherDetailPage: React.FC = () => {
  const { selectedVoucherId, vouchers, currentEmployee, setActiveTab, t } = usePortal();

  const voucher = vouchers.find((v) => v.id === selectedVoucherId) || vouchers[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      <GlobalBackButton onBack={() => setActiveTab('voucher-creation')} label="Back to Vouchers" />

      {/* Header */}
      <header className="mt-6 mb-10 border-b border-neutral-900/10 dark:border-white/10 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="ed-label font-mono">{voucher.voucherCode}</span>
              <span className="h-px w-6 bg-neutral-900/20 dark:bg-white/20" />
              <span className="ed-mono">Filed: {voucher.createdAt}</span>
            </div>
            <h1 className="ed-h1">
              {voucher.reason === 'Other' && voucher.customReason ? voucher.customReason : voucher.reason}
            </h1>
          </div>

          <span className="ed-tag text-neutral-700 dark:text-neutral-300 self-start">
            {voucher.status}
          </span>
        </div>

        {/* Info Grid */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-3">
            <div className="ed-label mb-1.5">Employee</div>
            <div className="text-sm text-neutral-950 dark:text-neutral-50">{currentEmployee.name}</div>
          </div>
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-3">
            <div className="ed-label mb-1.5">Employee Code</div>
            <div className="font-mono text-sm text-neutral-950 dark:text-neutral-50">{currentEmployee.employeeCode}</div>
          </div>
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-3">
            <div className="ed-label mb-1.5">Target Date</div>
            <div className="font-mono text-sm text-neutral-950 dark:text-neutral-50">{voucher.date}</div>
          </div>
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-3">
            <div className="ed-label mb-1.5">Time</div>
            <div className="font-mono text-sm text-neutral-950 dark:text-neutral-50">{voucher.time}</div>
          </div>
        </div>
      </header>

      {/* Explanation */}
      <section className="mb-10">
        <div className="ed-label mb-2">Employee Justification</div>
        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {voucher.description}
        </p>
      </section>

      {/* Admin Response */}
      <section className="border border-neutral-900/10 dark:border-white/10 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="ed-h3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neutral-500" />
            <span>Admin Decision &amp; Response</span>
          </div>
          {voucher.adminReviewedAt && <span className="ed-mono">{voucher.adminReviewedAt}</span>}
        </div>

        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {voucher.adminResponse || (
            <span className="italic text-neutral-400 dark:text-neutral-500">
              Pending Operations Review. Admin response will be published here upon verification.
            </span>
          )}
        </p>
      </section>
    </div>
  );
};