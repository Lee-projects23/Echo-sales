import React from 'react';
import { Star } from 'lucide-react';

interface RatingPickerProps {
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const RatingPicker: React.FC<RatingPickerProps> = ({ value, onChange, disabled = false }) => {
  return (
    <div className="echo-card echo-card--pad space-y-4">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--echo-border)] pb-3">
        <label className="ed-label">Rate Completion</label>
        <span className="text-[11px] font-mono text-[var(--echo-ink-3)]">
          Submitted Mark: <strong className="text-[var(--echo-ink)]">{value || 0} / 5</strong>
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            aria-label={`Rate ${star} of 5`}
            className={`w-10 h-10 rounded-[var(--echo-radius-sm)] border flex items-center justify-center transition-all ${
              disabled
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:-translate-y-0.5'
            } ${
              star <= value
                ? 'bg-[var(--echo-accent)] text-[var(--echo-accent-ink)] border-transparent shadow-[var(--echo-shadow-accent)]'
                : 'border-[var(--echo-border-strong)] text-[var(--echo-ink-3)] hover:text-[var(--echo-ink)] hover:border-[var(--echo-ink-3)]'
            }`}
          >
            <Star className={`w-4 h-4 ${star <= value ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>
      <p className="text-[12px] leading-relaxed text-[var(--echo-ink-3)]">
        Rate your completion thoroughness on a 1–5 scale. This score is recorded directly into your task submission log.
      </p>
    </div>
  );
};