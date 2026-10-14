import React, { useMemo, useState } from 'react';
import { ArrowRight, Plus, Receipt, Search, X } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { StatusChip } from '../common/StatusChip';
import { Voucher } from '../../types';

type VoucherFilter = 'all' | 'pending' | 'approved' | 'rejected';

export const VoucherCreationPage: React.FC = () => {
  const { vouchers, createVoucher, setSelectedVoucherId, setActiveTab, t } = usePortal();

  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState<Voucher['reason']>('Permission Request');
  const [customReason, setCustomReason] = useState('');
  const [date, setDate] = useState('2026-09-23');
  const [time, setTime] = useState('02:30 PM');
  const [description, setDescription] = useState('');

  const [activeFilter, setActiveFilter] = useState<VoucherFilter>('all');
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    createVoucher({
      reason,
      customReason: reason === 'Other' ? customReason : undefined,
      date,
      time,
      description: description.trim(),
    });

    setDescription('');
    setCustomReason('');
    setShowModal(false);
  };

  const statusCounts = useMemo(
    () => ({
      all: vouchers.length,
      pending: vouchers.filter((v) => v.status === 'Submitted for Admin Review').length,
      approved: vouchers.filter((v) => v.status === 'Approved').length,
      rejected: vouchers.filter((v) => v.status === 'Rejected').length,
    }),
    [vouchers]
  );

  const filters: { key: VoucherFilter; label: string }[] = [
    { key: 'all', label: `All (${statusCounts.all})` },
    { key: 'pending', label: `Pending (${statusCounts.pending})` },
    { key: 'approved', label: `Approved (${statusCounts.approved})` },
    { key: 'rejected', label: `Rejected (${statusCounts.rejected})` },
  ];

  const filteredVouchers = vouchers.filter((vch) => {
    if (activeFilter === 'pending' && vch.status !== 'Submitted for Admin Review') return false;
    if (activeFilter === 'approved' && vch.status !== 'Approved') return false;
    if (activeFilter === 'rejected' && vch.status !== 'Rejected') return false;

    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      vch.voucherCode.toLowerCase().includes(q) ||
      vch.reason.toLowerCase().includes(q) ||
      (vch.customReason ?? '').toLowerCase().includes(q) ||
      vch.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-echo-fade">
      {/* Header */}
      <div className="mb-8">
        <GlobalBackButton />
        <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="ed-label mb-4">Formal Requests</p>
            <h1 className="ed-h1">{t('voucherCreation')}</h1>
            <p className="ed-sub mt-3 max-w-xl">
              Formal requests for shift permissions, leave approvals, expense advances, or incident notices.
            </p>
          </div>

          <button onClick={() => setShowModal(true)} className="ed-btn shrink-0">
            <Plus className="w-4 h-4" />
            <span>Create New Voucher</span>
          </button>
        </div>
      </div>

      {/* Voucher summary strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Filed', value: statusCounts.all },
          { label: 'Pending review', value: statusCounts.pending },
          { label: 'Approved', value: statusCounts.approved },
          { label: 'Rejected', value: statusCounts.rejected },
        ].map((s) => (
          <div key={s.label} className="echo-kpi">
            <div className="echo-kpi-label">{s.label}</div>
            <div className="echo-kpi-value mt-2.5">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <div className="echo-segment flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className="echo-segment-item"
              data-active={activeFilter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--echo-ink-3)] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search code, reason, or detail..."
            aria-label="Search vouchers"
            className="ed-input pl-9 pr-9"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--echo-ink-3)] hover:text-[var(--echo-ink)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table of Vouchers */}
      <div className="echo-card overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--echo-border)] bg-[var(--echo-surface-2)]">
          <span className="echo-icon-tile" style={{ width: '1.75rem', height: '1.75rem' }}>
            <Receipt className="w-3.5 h-3.5" />
          </span>
          <span className="ed-h3">Filed Vouchers</span>
          <span className="echo-chip ml-auto">{filteredVouchers.length} shown</span>
        </div>

        <div className="overflow-x-auto echo-scroll">
          <table className="w-full text-left min-w-[860px]">
            <thead>
              <tr className="border-b border-[var(--echo-border)]">
                <th className="ed-th w-14 text-center">No.</th>
                <th className="ed-th">Code</th>
                <th className="ed-th">Reason</th>
                <th className="ed-th">Date</th>
                <th className="ed-th">Time</th>
                <th className="ed-th">Status</th>
                <th className="ed-th text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--echo-border)]">
              {filteredVouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="ed-td py-14 text-center text-[var(--echo-ink-3)]">
                    No vouchers found matching the current filter or search.
                  </td>
                </tr>
              ) : (
                filteredVouchers.map((vch, index) => (
                  <tr key={vch.id} className="transition-colors hover:bg-[var(--echo-surface-2)]">
                    <td className="ed-td text-center font-mono text-[12px] text-[var(--echo-ink-3)]">
                      {index + 1}
                    </td>

                    <td className="ed-td font-mono font-medium">{vch.voucherCode}</td>

                    <td className="ed-td">
                      <div className="font-medium">
                        {vch.reason === 'Other' && vch.customReason ? vch.customReason : vch.reason}
                      </div>
                      <div className="ed-mono mt-0.5 truncate max-w-xs">{vch.description}</div>
                    </td>

                    <td className="ed-td font-mono text-[12px] text-[var(--echo-ink-3)]">
                      {vch.date}
                    </td>

                    <td className="ed-td font-mono text-[12px] text-[var(--echo-ink-3)]">
                      {vch.time}
                    </td>

                    <td className="ed-td">
                      <StatusChip status={vch.status} />
                    </td>

                    <td className="ed-td text-right">
                      <button
                        onClick={() => {
                          setSelectedVoucherId(vch.id);
                          setActiveTab('voucher-detail');
                        }}
                        className="ed-link justify-end"
                      >
                        <span>{t('viewDetails')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Voucher Modal */}
      {showModal && (
        <div className="echo-modal-scrim">
          <div className="echo-modal max-w-md space-y-6">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--echo-border)] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="echo-icon-tile echo-icon-tile--accent" style={{ width: '1.75rem', height: '1.75rem' }}>
                  <Receipt className="w-3.5 h-3.5" />
                </span>
                <h3 className="ed-h3">Create Operational Voucher</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close"
                className="echo-icon-tile hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
                style={{ width: '1.75rem', height: '1.75rem' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="ed-label block mb-2">Voucher Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as Voucher['reason'])}
                  className="ed-input"
                >
                  <option value="Late">Late</option>
                  <option value="Permission Request">Permission Request</option>
                  <option value="Leave Request">Leave Request</option>
                  <option value="Unexpected">Unexpected</option>
                  <option value="Advance Request">Advance Request</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {reason === 'Other' && (
                <div>
                  <label className="ed-label block mb-2">Custom Reason</label>
                  <input
                    type="text"
                    required
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Specify custom reason..."
                    className="ed-input"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="ed-label block mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="ed-input font-mono"
                  />
                </div>

                <div>
                  <label className="ed-label block mb-2">Time (AM/PM)</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 02:30 PM"
                    className="ed-input font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="ed-label block mb-2">Explanation / Justification</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide full operational justification for Operations Director review..."
                  className="ed-input resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="ed-btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="ed-btn">
                  Submit Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
