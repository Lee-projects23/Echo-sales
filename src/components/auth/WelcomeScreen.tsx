import React, { useState } from 'react';
import { ArrowRight, Sparkles, Shield } from 'lucide-react';
import { welcomeBackdropImg } from '../../data/mockData';
import { SignInModal } from './SignInModal';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-950 text-white selection:bg-white selection:text-neutral-900">
      {/* Background Image with subtle Apple-inspired atmospheric scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={welcomeBackdropImg}
          alt="ECHO Architecture"
          className="w-full h-full object-cover scale-105 filter brightness-40 contrast-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-6 py-12 text-center flex flex-col items-center">
        {/* ECHO Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-neutral-200 text-xs font-medium tracking-widest uppercase mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>ECHO Operational Companion</span>
        </div>

        {/* Minimalist Apple-inspired Wordmark */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4 leading-none font-sans">
          ECHO
        </h1>

        <p className="text-lg sm:text-xl text-neutral-300 font-normal max-w-md mx-auto mb-10 leading-relaxed">
          Employee Operations Portal
        </p>

        <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-10 leading-relaxed font-light">
          Connected workspace for field task execution, daily attendance, evidence verification, and company workflows.
        </p>

        {/* Enter Workspace Button */}
        <button
          onClick={() => setShowSignIn(true)}
          className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-white text-neutral-950 text-sm font-semibold hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/40 cursor-pointer"
        >
          <span>Enter Workspace</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        <div className="mt-16 flex items-center gap-6 text-xs text-neutral-500 font-mono">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-neutral-400" /> End-to-end synchronized with Admin
          </span>
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
