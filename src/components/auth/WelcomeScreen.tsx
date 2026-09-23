import React, { useState } from 'react';
import { ArrowRight, Shield } from 'lucide-react';
import { welcomeBackdropImg } from '../../data/mockData';
import { SignInModal } from './SignInModal';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#0a0a09] text-[#f7f5f0] selection:bg-white selection:text-neutral-950">
      {/* Full-bleed image with quiet monochrome scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={welcomeBackdropImg}
          alt="ECHO Architecture"
          className="w-full h-full object-cover filter grayscale contrast-125 brightness-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a09] via-[#0a0a09]/70 to-[#0a0a09]/40" />
      </div>

      {/* Foreground Content — left-aligned editorial layout */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16">
        <div className="max-w-2xl">
          {/* Quiet eyebrow */}
          <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-300 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-100" />
            <span>ECHO Operational Companion</span>
          </div>

          {/* Large editorial wordmark */}
          <h1 className="font-serif font-light text-[clamp(4rem,14vw,9rem)] leading-[0.9] tracking-[-0.02em] mb-6">
            ECHO
          </h1>

          <div className="h-px w-full max-w-md bg-white/20 mb-6" />

          <p className="font-serif text-2xl sm:text-3xl font-light text-neutral-100 mb-4 leading-snug">
            Employee Operations Portal
          </p>

          <p className="text-sm text-neutral-300 max-w-md leading-relaxed font-light">
            Connected workspace for field task execution, daily attendance, evidence
            verification, and company workflows.
          </p>

          {/* Enter Workspace */}
          <button
            onClick={() => setShowSignIn(true)}
            className="group mt-10 inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-[11px] font-semibold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-neutral-950 transition-colors duration-300 cursor-pointer"
          >
            <span>Enter Workspace</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <div className="mt-14 flex items-center gap-6 text-[11px] uppercase tracking-[0.16em] text-neutral-400">
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