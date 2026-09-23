import React, { useState } from 'react';
import { ArrowRight, Shield } from 'lucide-react';
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
        isDark
          ? 'bg-[#0a0a09] text-[#f7f5f0] selection:bg-white selection:text-neutral-950'
          : 'bg-[#f7f5f0] text-neutral-950 selection:bg-neutral-950 selection:text-white'
      }`}
    >
      {/* Full-bleed image with quiet monochrome scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={welcomeBackdropImg}
          alt="ECHO Architecture"
          className={`w-full h-full object-cover filter grayscale ${
            isDark ? 'contrast-125 brightness-50' : 'contrast-90 brightness-[1.4] opacity-25'
          }`}
          referrerPolicy="no-referrer"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isDark
              ? 'from-[#0a0a09] via-[#0a0a09]/70 to-[#0a0a09]/40'
              : 'from-[#f7f5f0] via-[#f7f5f0]/75 to-[#f7f5f0]/30'
          }`}
        />
      </div>

      {/* Foreground Content — left-aligned editorial layout */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16">
        <div className="max-w-2xl">
          {/* Quiet eyebrow */}
          <div
            className={`flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.24em] mb-10 ${
              isDark ? 'text-neutral-300' : 'text-neutral-500'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-neutral-100' : 'bg-neutral-950'}`} />
            <span>ECHO Operational Companion</span>
          </div>

          {/* Large editorial wordmark */}
          <h1 className="font-serif font-light text-[clamp(4rem,14vw,9rem)] leading-[0.9] tracking-[-0.02em] mb-6">
            ECHO
          </h1>

          <div className={`h-px w-full max-w-md mb-6 ${isDark ? 'bg-white/20' : 'bg-neutral-950/20'}`} />

          <p className="font-serif text-2xl sm:text-3xl font-light mb-4 leading-snug">
            Employee Operations Portal
          </p>

          <p className={`text-sm max-w-md leading-relaxed font-light ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
            Connected workspace for field task execution, daily attendance, evidence
            verification, and company workflows.
          </p>

          {/* Enter Workspace */}
          <button
            onClick={() => setShowSignIn(true)}
            className={`group mt-10 inline-flex items-center gap-3 px-8 py-4 border text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 cursor-pointer ${
              isDark
                ? 'border-white/30 text-white hover:bg-white hover:text-neutral-950'
                : 'border-neutral-950/40 text-neutral-950 hover:bg-neutral-950 hover:text-white'
            }`}
          >
            <span>Enter Workspace</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <div className={`mt-14 flex items-center gap-6 text-[11px] uppercase tracking-[0.16em] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            <span className="flex items-center gap-1.5">
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