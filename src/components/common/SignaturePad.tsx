import React, { useState } from 'react';
import { Edit3, ShieldCheck } from 'lucide-react';

interface SignaturePadProps {
  onSignatureConfirmed: (name: string) => void;
  initialName?: string;
  isConfirmed?: boolean;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSignatureConfirmed,
  initialName = '',
  isConfirmed = false,
}) => {
  const [name, setName] = useState(initialName);
  const [confirmed, setConfirmed] = useState(isConfirmed);

  const handleConfirm = () => {
    if (!name.trim()) return;
    setConfirmed(true);
    onSignatureConfirmed(name.trim());
  };

  const handleReset = () => {
    setConfirmed(false);
  };

  return (
    <div className="border border-neutral-900/10 dark:border-white/10 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-900/10 dark:border-white/10 pb-3">
        <label className="ed-label">Enter Name for Signature</label>
        {confirmed && (
          <span className="inline-flex items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-200 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Signature Verified
          </span>
        )}
      </div>

      {!confirmed ? (
        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your full legal name..."
            className="ed-input"
          />

          {name.trim() && (
            <div className="px-4 py-6 border border-neutral-900/10 dark:border-white/10 bg-neutral-900/[0.02] dark:bg-white/[0.02] flex flex-col items-center justify-center">
              <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-400 mb-2">
                Live Signature Preview
              </span>
              <div className="text-2xl font-serif italic tracking-wider text-neutral-950 dark:text-white py-2 font-medium">
                {name}
              </div>
              <div className="w-48 h-px bg-neutral-900/15 dark:bg-white/15 mt-1" />
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!name.trim()}
            className="ed-btn w-full justify-center disabled:opacity-40"
          >
            Confirm Signature
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="px-5 py-6 border border-neutral-900/10 dark:border-white/10 flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-serif italic tracking-wider text-neutral-950 dark:text-white py-1">
              {name}
            </div>
            <div className="w-56 h-px bg-neutral-900/15 dark:bg-white/15 my-2" />
            <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              Digitally Signed · {new Date().toLocaleDateString()}
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="ed-textbtn"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Change or re-sign</span>
          </button>
        </div>
      )}
    </div>
  );
};