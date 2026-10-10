import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { welcomeBackdropImg } from '../../data/mockData';
import { SignInModal } from './SignInModal';
import { usePortal } from '../../context/PortalContext';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const { theme } = usePortal();
  const [showSignIn, setShowSignIn] = useState(false);

  const isDark = theme === 'dark';

  return (
    <div
      className={`relative min-h-screen w-full flex items-center overflow-hidden transition-colors duration-300 ${
        isDark ? 'text-[var(--echo-ink)]' : 'text-[var(--echo-ink)]'
      }`}
    >
      {/* Full-bleed image with quiet scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={welcomeBackdropImg}
          alt="ECHO Architecture"
          className={`w-full h-full object-cover filter grayscale ${
            isDark ? 'contrast-125 brightness-[0.35]' : 'contrast-90 brightness-[1.4] opacity-25'
          }`}
          referrerPolicy="no-referrer"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isDark
              ? 'from-[var(--echo-bg)] via-[var(--echo-bg)]/80 to-[var(--echo-bg)]/50'
              : 'from-[var(--echo-bg)] via-[var(--echo-bg)]/80 to-[var(--echo-bg)]/40'
          }`}
        />
      </div>

      {/* Foreground Content — premium hero layout */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="echo-chip mb-10 !bg-[var(--echo-overlay)] !border-[var(--echo-border-strong)] text-[var(--echo-ink-2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--echo-accent)]" />
            <span className="tracking-[0.14em] uppercase">ECHO Operational Companion</span>
          </div>

          {/* Large wordmark */}
          <h1 className="font-serif font-light text-[clamp(4rem,14vw,9rem)] leading-[0.9] tracking-[-0.03em] mb-6 text-[var(--echo-ink)]">
            ECHO
          </h1>

          <div className="h-px w-full max-w-md mb-6 bg-[var(--echo-border-strong)]" />

          <p className="font-serif text-2xl sm:text-3xl font-light mb-4 leading-snug text-[var(--echo-ink)]">
            Employee Operations Portal
          </p>

          <p className="text-[15px] max-w-md leading-relaxed text-[var(--echo-ink-2)]">
            Connected workspace for field task execution, daily attendance, evidence
            verification, and company workflows.
          </p>

          {/* Enter Workspace */}
          <button
            onClick={() => setShowSignIn(true)}
            className="group mt-10 ed-btn !px-8 !py-3.5"
          >
            <span>Enter Workspace</span>
          </button>

          <div className="mt-14 flex flex-wrap items-center gap-6 text-[12px] font-medium text-[var(--echo-ink-3)]">
            <span className="echo-chip">
              <Shield className="w-3.5 h-3.5" /> Synchronized with Admin
            </span>
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          onSuccess={() => {
            setShowSignIn(false);
            onEnter();
          }}
        />
      )}
    </div>
  );
};