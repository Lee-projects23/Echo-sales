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
    <div className="echo-card echo-card--pad space-y-5">
      <div
        className="flex items-center justify-between gap-3 pb-4"
        style={{ borderBottom: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <label className="ed-label">Enter Name for Signature</label>
        {confirmed && (
          <span
            className="echo-chip"
            style={{
              background: 'var(--echo-positive-soft)',
              color: 'var(--echo-positive)',
              borderColor: 'color-mix(in srgb, var(--echo-positive) 34%, transparent)',
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Signature Verified
          </span>
        )}
      </div>

      {!confirmed ? (
        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your full legal name..."
            aria-label="Signature name"
            className="ed-input"
          />

          {name.trim() && (
            <div
              className="px-4 py-7 flex flex-col items-center justify-center"
              style={{
                background: 'var(--echo-surface-2)',
                border: 'var(--echo-rule) solid var(--echo-border)',
              }}
            >
              <span className="ed-label mb-3">Live Signature Preview</span>
              <div className="text-[26px] font-serif italic tracking-wide text-[var(--echo-ink)] py-1">
                {name}
              </div>
              <div className="w-48 h-px bg-[var(--echo-border-strong)] mt-2" />
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
        <div className="space-y-4">
          <div
            className="px-5 py-7 flex flex-col items-center justify-center text-center"
            style={{
              background: 'var(--echo-surface-2)',
              border: 'var(--echo-rule) solid var(--echo-border)',
            }}
          >
            <div className="text-[34px] font-serif italic tracking-wide text-[var(--echo-ink)] py-1">
              {name}
            </div>
            <div className="w-56 h-px bg-[var(--echo-accent)] my-3" />
            <div className="ed-meta">Digitally Signed · {new Date().toLocaleDateString()}</div>
          </div>

          <button type="button" onClick={handleReset} className="ed-textbtn">
            <Edit3 className="w-3.5 h-3.5" />
            <span>Change or re-sign</span>
          </button>
        </div>
      )}
    </div>
  );
};
