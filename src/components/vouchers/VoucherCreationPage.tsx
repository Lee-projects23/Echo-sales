import React, { useState } from 'react';
import { Plus, ArrowRight, X, Receipt } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { StatusChip } from '../common/StatusChip';
import { Voucher } from '../../types';

export const VoucherCreationPage: React.FC = () => {
  const { vouchers, createVoucher, setSelectedVoucherId, setActiveTab, t } = usePortal();

  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState<Voucher['reason']>('Permission Request');
  const [customReason, setCustomReason] = useState('');
  const [date, setDate] = useState('2026-09-23');
  const [time, setTime] = useState('02:30 PM');
  const [description, setDescription] = useState('');

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

      {/* Table of Vouchers */}
      <div className="echo-card overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--echo-border)] bg-[var(--echo-surface-2)]">
          <Receipt className="w-4 h-4 text-[var(--echo-accent)]" />
          <span className="ed-h3">Filed Vouchers</span>
          <span className="ed-tag ml-auto">{vouchers.length}</span>
        </div>

        <div className="overflow-x-auto echo-scroll">
          <table className="w-full text-left min-w-[820px]">
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
              {vouchers.map((vch, index) => (
                <tr key={vch.id} className="transition-colors hover:bg-[var(--echo-surface-2)]">
                  <td className="ed-td text-center font-mono text-[12px] text-[var(--echo-ink-3)]">
                    {index + 1}
                  </td>

                  <td className="ed-td font-mono font-medium">{vch.voucherCode}</td>

                  <td className="ed-td">
                    <div className="font-medium">{vch.reason === 'Other' && vch.customReason ? vch.customReason : vch.reason}</div>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Voucher Modal */}
      {showModal && (
        <div className="echo-modal-scrim">
          <div className="echo-modal max-w-md space-y-6">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--echo-border)] pb-4">
              <h3 className="ed-h3">Create Operational Voucher</h3>
              <button onClick={() => setShowModal(false)} aria-label="Close" className="echo-icon-tile hover:text-[var(--echo-ink)] transition-colors cursor-pointer" style={{ width: '1.875rem', height: '1.875rem' }}>
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
