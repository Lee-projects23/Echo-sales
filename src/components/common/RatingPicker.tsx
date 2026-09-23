import React from 'react';
import { Star } from 'lucide-react';

interface RatingPickerProps {
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const RatingPicker: React.FC<RatingPickerProps> = ({ value, onChange, disabled = false }) => {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/60 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          Rate Completion
        </label>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Employee Submitted Mark: <strong className="text-neutral-900 dark:text-white font-mono">{value || 0} / 5</strong>
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            className={`p-2 rounded-xl transition-all ${
              disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:scale-110 active:scale-95'
            } ${
              star <= value
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-neutral-300 dark:text-neutral-700 bg-neutral-200 dark:bg-neutral-800 hover:text-amber-300'
            }`}
          >
            <Star className={`w-6 h-6 ${star <= value ? 'fill-amber-400' : ''}`} />
          </button>
        ))}
      </div>
      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
        Rate your completion thoroughness on a 1–5 scale. This score is recorded directly into your task submission log.
      </p>
    </div>
  );
};
