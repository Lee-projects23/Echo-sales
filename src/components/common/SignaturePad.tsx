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
    <div className="echo-card echo-card--pad space-y-4">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--echo-border)] pb-3">
        <label className="ed-label">Enter Name for Signature</label>
        {confirmed && (
          <span className="ed-tag !text-[var(--echo-positive)] !bg-[var(--echo-positive-soft)] !border-[color-mix(in_srgb,var(--echo-positive)_25%,transparent)]">
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
            <div className="rounded-[var(--echo-radius-sm)] border border-[var(--echo-border)] bg-[var(--echo-surface-2)] px-4 py-6 flex flex-col items-center justify-center">
              <span className="ed-label mb-2">Live Signature Preview</span>
              <div className="text-2xl font-serif italic tracking-wider text-[var(--echo-ink)] py-2 font-medium">
                {name}
              </div>
              <div className="w-48 h-px bg-[var(--echo-border-strong)] mt-1" />
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!name.trim()}
            className="ed-btn w-full justify-center"
          >
            Confirm Signature
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-[var(--echo-radius-sm)] border border-[var(--echo-border)] bg-[var(--echo-surface-2)] px-5 py-6 flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-serif italic tracking-wider text-[var(--echo-ink)] py-1">
              {name}
            </div>
            <div className="w-56 h-px bg-[var(--echo-border-strong)] my-2" />
            <div className="text-[11px] font-mono text-[var(--echo-ink-3)]">
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