import React, { useEffect, useState } from 'react';

interface WelcomeScreenProps {
  /** Called once the intro has finished revealing. */
  onEnter: () => void;
}

const INTRO_DURATION = 2000;
const INTRO_DURATION_REDUCED = 400;

// The intro always renders in its own warm-cream key, independent of the
// visitor's saved theme, so it matches the reference composition exactly.
const IVORY = '#f2ede3';
const INK = '#14110e';
const MUTED = '#6b6152';
const RULE = 'rgba(20, 17, 14, 0.17)';
const CRIMSON = '#8e1d2b';

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
 * Screen 1 — the ECHO brand intro.
 * A full-viewport, full-bleed warm-cream field with only the centered serif
 * ECHO wordmark and a restrained "EMPLOYEE PORTAL" subtitle. No navigation,
 * cards, buttons, frames, or other content. Plays once at the start of the
 * real entry sequence, then fades into the login page.
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-500"
      style={{
        background: IVORY,
        color: INK,
        opacity: leaving ? 0 : 1,
      }}
      role="status"
      aria-label="ECHO Employee Portal is starting"
    >
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <h1
          className="em-wordmark text-[clamp(4.5rem,20vw,13rem)] animate-echo-wordmark"
          style={{ fontWeight: 400, color: INK }}
        >
          ECHO
        </h1>

        <div
          className="mt-7 h-px w-16 sm:w-24 animate-echo-rule"
          style={{ background: CRIMSON, transformOrigin: 'center' }}
        />

        <p
          className="mt-7 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.42em] animate-echo-fade"
          style={{ color: MUTED, animationDelay: '0.4s' }}
        >
          Employee Portal
        </p>
      </div>

      {/* Quiet hairline progress rule along the very bottom edge */}
      <div
        className="absolute bottom-0 left-0 h-px origin-left animate-echo-rule"
        style={{ width: '100%', background: RULE, animationDelay: '0.15s' }}
        aria-hidden="true"
      />
    </div>
  );
};

export default WelcomeScreen;
