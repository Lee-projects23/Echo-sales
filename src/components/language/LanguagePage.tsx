import React from 'react';
import { Check, Globe, Languages } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { LanguageCode } from '../../types';

export const LanguagePage: React.FC = () => {
  const { language, setLanguage, t } = usePortal();

  const languageOptions: { code: LanguageCode; native: string; english: string; region: string }[] = [
    {
      code: 'en',
      native: 'English',
      english: 'English (US & Global)',
      region: 'Primary Operational Standard',
    },
    {
      code: 'ta',
      native: 'தமிழ்',
      english: 'Tamil',
      region: 'Tamil Nadu & Regional Field Operations',
    },
    {
      code: 'hi',
      native: 'हिन्दी',
      english: 'Hindi',
      region: 'National Operations & Field Logistics',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-echo-fade">
      <div className="mb-10">
        <GlobalBackButton />
        <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="ed-label mb-4">Interface</p>
            <h1 className="ed-h1">{t('language')}</h1>
            <p className="ed-sub mt-3 max-w-xl">
              Select preferred interface language for workflows, task checklists, and communications.
            </p>
          </div>
          <span className="echo-chip echo-chip--accent self-start sm:self-auto">
            <Languages className="w-3.5 h-3.5" />
            {languageOptions.length} available
          </span>
        </div>
      </div>

      {/* Language Options */}
      <div className="space-y-3">
        {languageOptions.map((opt) => {
          const isSelected = language === opt.code;

          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLanguage(opt.code)}
              aria-pressed={isSelected}
              className={`echo-card echo-card-hover w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer ${
                isSelected
                  ? '!border-[var(--echo-accent)] !bg-[var(--echo-accent-soft)]'
                  : ''
              }`}
            >
              <div className="flex items-center gap-5 min-w-0">
                <span
                  className={`echo-icon-tile shrink-0 ${isSelected ? 'echo-icon-tile--accent' : ''}`}
                >
                  <Globe className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-2xl font-bold tracking-[-0.02em] text-[var(--echo-ink)] shrink-0 leading-none">
                    {opt.native}
                  </div>
                  <div className="text-[13px] text-[var(--echo-ink)] mt-2 truncate">
                    {opt.english}
                  </div>
                  <div className="ed-mono mt-1">{opt.region}</div>
                </div>
              </div>

              {isSelected ? (
                <span className="ed-tag shrink-0">
                  <Check className="w-3.5 h-3.5" />
                  Selected
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-start gap-3 text-[13px] text-[var(--echo-ink-3)] max-w-2xl leading-relaxed">
        <span className="echo-rule !inline-block mt-2.5 shrink-0" />
        <p>
          Localization architecture covers navigation tabs, task action buttons, attendance prompts,
          checklists, notifications, and form validation across English, தமிழ், and हिन्दी.
        </p>
      </div>
    </div>
  );
};
