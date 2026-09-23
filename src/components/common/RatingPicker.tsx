import React from 'react';
import { Star } from 'lucide-react';

interface RatingPickerProps {
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const RatingPicker: React.FC<RatingPickerProps> = ({ value, onChange, disabled = false }) => {
  return (
    <div className="border border-neutral-900/10 dark:border-white/10 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-900/10 dark:border-white/10 pb-3">
        <label className="ed-label">Rate Completion</label>
        <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
          Submitted Mark: <strong className="text-neutral-950 dark:text-white">{value || 0} / 5</strong>
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            className={`w-10 h-10 border flex items-center justify-center transition-all ${
              disabled
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:-translate-y-0.5'
            } ${
              star <= value
                ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 border-neutral-950 dark:border-white'
                : 'border-neutral-900/15 dark:border-white/15 text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Star className={`w-4 h-4 ${star <= value ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>
      <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        Rate your completion thoroughness on a 1–5 scale. This score is recorded directly into your task submission log.
      </p>
    </div>
  );
};