import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Calendar, User, Receipt, ShieldCheck } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';

export const VoucherDetailPage: React.FC = () => {
  const { selectedVoucherId, vouchers, currentEmployee, setActiveTab, t } = usePortal();

  const voucher = vouchers.find((v) => v.id === selectedVoucherId) || vouchers[0];

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150">
      <GlobalBackButton onBack={() => setActiveTab('voucher-creation')} label="Back to Vouchers" />

      {/* Main Card */}
      <div className="apple-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 font-mono">
                {voucher.voucherCode}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs text-neutral-500 font-mono">
                Filed: {voucher.createdAt}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {voucher.reason === 'Other' && voucher.customReason ? voucher.customReason : voucher.reason}
            </h1>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${
              voucher.status === 'Approved'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : voucher.status === 'Rejected'
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
            }`}
          >
            {voucher.status}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
            <span className="text-[11px] text-neutral-500 block mb-0.5">Employee</span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              {currentEmployee.name}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
            <span className="text-[11px] text-neutral-500 block mb-0.5">Employee Code</span>
            <span className="font-semibold text-neutral-900 dark:text-white font-mono">
              {currentEmployee.employeeCode}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
            <span className="text-[11px] text-neutral-500 block mb-0.5">Target Date</span>
            <span className="font-semibold text-neutral-900 dark:text-white font-mono">
              {voucher.date}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
            <span className="text-[11px] text-neutral-500 block mb-0.5">Time</span>
            <span className="font-semibold text-neutral-900 dark:text-white font-mono">
              {voucher.time}
            </span>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 space-y-2">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Employee Justification
          </div>
          <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
            {voucher.description}
          </p>
        </div>

        {/* Admin Response Block */}
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-500" />
              <span>Admin Decision & Response</span>
            </div>
            {voucher.adminReviewedAt && (
              <span className="text-[11px] text-neutral-400 font-mono">
                {voucher.adminReviewedAt}
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {voucher.adminResponse || (
              <span className="italic text-neutral-400">
                Pending Operations Review. Admin response will be published here upon verification.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
