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
    <div className="animate-echo-fade">
      {/* ================= Masthead ================= */}
      <section className="em-section pt-14 sm:pt-20 pb-12">
        <GlobalBackButton />
        <div className="mt-7 em-split items-end">
          <div className="em-split-lead">
            <p className="ed-label mb-7">Interface</p>
            <h1 className="ed-h1">{t('language')}</h1>
          </div>
          <div className="em-split-side">
            <p className="ed-sub max-w-sm text-[14px]">
              Select preferred interface language for workflows, task checklists, and communications.
            </p>
            <div className="mt-7">
              <span className="echo-chip echo-chip--accent">
                <Languages className="w-3 h-3" />
                {languageOptions.length} available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Options ================= */}
      <section
        className="em-section pb-16"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <ul className="mt-10" style={{ borderTop: 'var(--echo-rule) solid var(--echo-ink)' }}>
          {languageOptions.map((opt) => {
            const isSelected = language === opt.code;

            return (
              <li key={opt.code}>
                <button
                  type="button"
                  onClick={() => setLanguage(opt.code)}
                  aria-pressed={isSelected}
                  className="w-full flex items-center justify-between gap-5 py-8 text-left transition-colors cursor-pointer hover:bg-[var(--echo-surface-2)]"
                  style={{
                    borderTop: 'var(--echo-rule) solid var(--echo-border)',
                    borderLeft: `2px solid ${isSelected ? 'var(--echo-accent)' : 'transparent'}`,
                    paddingLeft: isSelected ? '1.25rem' : undefined,
                  }}
                >
                  <div className="flex items-center gap-6 min-w-0">
                    <span
                      className={`echo-icon-tile shrink-0 ${isSelected ? 'echo-icon-tile--accent' : ''}`}
                    >
                      <Globe className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-serif text-[clamp(1.75rem,3.6vw,2.5rem)] leading-none tracking-[-0.02em] text-[var(--echo-ink)]">
                        {opt.native}
                      </div>
                      <div className="text-[13px] text-[var(--echo-ink)] mt-3 truncate">{opt.english}</div>
                      <div className="ed-meta mt-2">{opt.region}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="echo-chip echo-chip--accent shrink-0">
                      <Check className="w-3 h-3" />
                      Selected
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div
          className="mt-12 pt-8 flex items-start gap-4 text-[13px] leading-relaxed text-[var(--echo-ink-3)] max-w-2xl"
          style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
        >
          <span className="w-10 h-px shrink-0 mt-2.5" style={{ background: 'var(--echo-border-strong)' }} />
          <p>
            Localization architecture covers navigation tabs, task action buttons, attendance prompts,
            checklists, notifications, and form validation across English, தமிழ், and हिन्दी.
          </p>
        </div>
      </section>
    </div>
  );
};
