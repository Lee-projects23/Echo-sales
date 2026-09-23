import React, { useState } from 'react';
import { Plus, ArrowRight, X } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
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
    <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-8">
        <GlobalBackButton />
        <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="ed-label mb-4">Formal Requests</p>
            <h1 className="ed-h1">{t('voucherCreation')}</h1>
            <p className="ed-sub mt-3 max-w-xl">
              Formal requests for shift permissions, leave approvals, expense advances, or incident notices.
            </p>
          </div>

          <button onClick={() => setShowModal(true)} className="ed-btn shrink-0">
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Voucher</span>
          </button>
        </div>
      </div>

      {/* Table of Vouchers */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-t border-b border-neutral-900/10 dark:border-white/10">
              <th className="ed-th w-12 text-center">No.</th>
              <th className="ed-th">Code</th>
              <th className="ed-th">Reason</th>
              <th className="ed-th">Date</th>
              <th className="ed-th">Time</th>
              <th className="ed-th">Status</th>
              <th className="ed-th text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/10 dark:divide-white/10">
            {vouchers.map((vch, index) => (
              <tr key={vch.id} className="hover:bg-neutral-900/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                <td className="ed-td text-center font-mono text-xs text-neutral-400 dark:text-neutral-500">
                  {index + 1}
                </td>

                <td className="ed-td font-mono font-medium">{vch.voucherCode}</td>

                <td className="ed-td">
                  <div className="font-medium">{vch.reason === 'Other' && vch.customReason ? vch.customReason : vch.reason}</div>
                  <div className="ed-mono truncate max-w-xs">{vch.description}</div>
                </td>

                <td className="ed-td font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {vch.date}
                </td>

                <td className="ed-td font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {vch.time}
                </td>

                <td className="ed-td">
                  <span className="ed-tag text-neutral-700 dark:text-neutral-300">{vch.status}</span>
                </td>

                <td className="ed-td text-right">
                  <button
                    onClick={() => {
                      setSelectedVoucherId(vch.id);
                      setActiveTab('voucher-detail');
                    }}
                    className="ed-link"
                  >
                    <span>{t('viewDetails')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Voucher Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-md bg-[#f7f5f0] dark:bg-[#0a0a09] border border-neutral-900/10 dark:border-white/10 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-900/10 dark:border-white/10 pb-4">
              <h3 className="ed-h3">Create Operational Voucher</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
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
                  className="ed-input"
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