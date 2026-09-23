import React, { useState } from 'react';
import { Check, Edit3, ShieldCheck } from 'lucide-react';

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
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/60 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          Enter Name for Signature
        </label>
        {confirmed && (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
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
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
          />

          {name.trim() && (
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col items-center justify-center">
              <span className="text-xs text-neutral-400 mb-1">Live Signature Preview</span>
              <div className="text-2xl font-serif italic tracking-wider text-neutral-900 dark:text-white py-2 font-medium">
                {name}
              </div>
              <div className="w-48 h-px bg-neutral-300 dark:bg-neutral-700 mt-1" />
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!name.trim()}
            className="w-full py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold disabled:opacity-50 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm cursor-pointer"
          >
            Confirm Signature
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-serif italic tracking-wider text-neutral-900 dark:text-white py-1">
              {name}
            </div>
            <div className="w-56 h-px bg-emerald-500/30 my-2" />
            <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              Digitally Signed · {new Date().toLocaleDateString()}
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white underline cursor-pointer"
          >
            Change or re-sign
          </button>
        </div>
      )}
    </div>
  );
};
