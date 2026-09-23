import React from 'react';
import { Check, Globe, Sparkles } from 'lucide-react';
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
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150">
      <GlobalBackButton />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {t('language')}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Select preferred interface language for workflows, task checklists, and communications
        </p>
      </div>

      {/* Language Options Cards */}
      <div className="space-y-3">
        {languageOptions.map((opt) => {
          const isSelected = language === opt.code;

          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLanguage(opt.code)}
              className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/80 shadow-sm'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    isSelected
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                </div>

                <div>
                  <div className="text-sm font-bold text-neutral-900 dark:text-white">
                    {opt.native} — {opt.english}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">{opt.region}</div>
                </div>
              </div>

              {isSelected ? (
                <div className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border border-neutral-300 dark:border-neutral-700" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 text-xs text-neutral-500 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Localization architecture covers navigation tabs, task action buttons, attendance prompts,
          checklists, notifications, and form validation across English, தமிழ், and हिन्दी.
        </p>
      </div>
    </div>
  );
};
