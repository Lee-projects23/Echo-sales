import React, { useEffect, useState } from 'react';
import { usePortal } from '../../context/PortalContext';

interface WelcomeScreenProps {
  /** Called once the intro has finished revealing. */
  onEnter: () => void;
}

const INTRO_DURATION = 2600;
const INTRO_DURATION_REDUCED = 400;

const prefersReducedMotion = () => {
  try {
    return (
      typeof window !== 'undefined' &&
      !!window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  } catch {
    return false;
  }
};

/**
 * Screen 1 — ECHO brand intro.
 * Minimal full-bleed ivory composition: centered editorial wordmark, a
 * restrained "EMPLOYEE PORTAL" subtitle, and a quiet hairline rule.
 * Brief by design, and skipped for reduced-motion preferences.
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const { theme, toggleTheme } = usePortal();
  const [leaving, setLeaving] = useState(false);
  const reduced = prefersReducedMotion();
  const duration = reduced ? INTRO_DURATION_REDUCED : INTRO_DURATION;

  useEffect(() => {
    let leaveTimer: number | undefined;
    const doneTimer = window.setTimeout(() => {
      setLeaving(true);
      leaveTimer = window.setTimeout(onEnter, reduced ? 60 : 520);
    }, duration);

    return () => {
      window.clearTimeout(doneTimer);
      if (leaveTimer) window.clearTimeout(leaveTimer);
    };
  }, [duration, onEnter, reduced]);

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden transition-opacity duration-500"
      style={{
        background: 'var(--echo-bg)',
        color: 'var(--echo-ink)',
        opacity: leaving ? 0 : 1,
      }}
      role="status"
      aria-label="ECHO Employee Portal is starting"
    >
      {/* Very quiet hairline frame — the only decoration */}
      <div
        className="pointer-events-none absolute inset-5 sm:inset-8"
        style={{ border: 'var(--echo-rule) solid var(--echo-border)' }}
      />

      {/* Theme control stays available without adding any auth surface */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle visual theme"
        title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
        className="absolute top-8 right-8 sm:top-11 sm:right-11 ed-meta cursor-pointer hover:text-[var(--echo-ink)] transition-colors"
      >
        {theme === 'dark' ? 'DAY' : 'NIGHT'}
      </button>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <h1
          className="em-wordmark text-[clamp(4.5rem,20vw,13rem)] animate-echo-wordmark"
          style={{ fontWeight: 400 }}
        >
          ECHO
        </h1>

        <div
          className="mt-7 h-px w-16 sm:w-24 animate-echo-rule"
          style={{ background: 'var(--echo-accent)' }}
        />

        <p
          className="mt-7 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.42em] animate-echo-fade"
          style={{ color: 'var(--echo-ink-3)', animationDelay: '0.5s' }}
        >
          Employee Portal
        </p>
      </div>
    </div>
  );
};
