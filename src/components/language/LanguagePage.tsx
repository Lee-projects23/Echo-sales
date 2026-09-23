import React from 'react';
import { Check } from 'lucide-react';
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
    <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      <div className="mb-10">
        <GlobalBackButton />
        <div className="mt-4">
          <p className="ed-label mb-4">Interface</p>
          <h1 className="ed-h1">{t('language')}</h1>
          <p className="ed-sub mt-3 max-w-xl">
            Select preferred interface language for workflows, task checklists, and communications.
          </p>
        </div>
      </div>

      {/* Language Options */}
      <div>
        {languageOptions.map((opt, idx) => {
          const isSelected = language === opt.code;

          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLanguage(opt.code)}
              className={`w-full flex items-center justify-between gap-4 py-5 text-left transition-colors cursor-pointer border-t border-neutral-900/10 dark:border-white/10 ${
                idx === languageOptions.length - 1 ? 'border-b' : ''
              } ${isSelected ? 'bg-neutral-900/[0.03] dark:bg-white/[0.03]' : 'hover:bg-neutral-900/[0.02] dark:hover:bg-white/[0.02]'}`}
            >
              <div className="flex items-baseline gap-6 min-w-0">
                <span className="font-serif text-2xl text-neutral-950 dark:text-neutral-50 shrink-0">
                  {opt.native}
                </span>
                <div className="min-w-0">
                  <div className="text-sm text-neutral-950 dark:text-neutral-50 truncate">
                    {opt.english}
                  </div>
                  <div className="ed-mono mt-1">{opt.region}</div>
                </div>
              </div>

              {isSelected ? (
                <span className="inline-flex items-center gap-2 ed-tag text-neutral-950 dark:text-neutral-50">
                  <Check className="w-3.5 h-3.5" />
                  Selected
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex items-start gap-3 text-xs text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
        <span className="h-px w-8 mt-2 bg-neutral-900/20 dark:bg-white/20 shrink-0" />
        <p>
          Localization architecture covers navigation tabs, task action buttons, attendance prompts,
          checklists, notifications, and form validation across English, தமிழ், and हिन्दी.
        </p>
      </div>
    </div>
  );
};