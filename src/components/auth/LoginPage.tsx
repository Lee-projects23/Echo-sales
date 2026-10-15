import React from 'react';
import { ShieldCheck, Sun, Moon } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { SignInPanel } from './SignInModal';
import { welcomeBackdropImg } from '../../data/mockData';

interface LoginPageProps {
  onEnter: () => void;
}

/**
 * Screen 2 — the login page.
 * Editorial split composition: charcoal branding panel with the oversized
 * ECHO wordmark, balanced against a warm cream functional column carrying the
 * unchanged sign-in form. Responsive to a single column on small screens.
 */
export const LoginPage: React.FC<LoginPageProps> = ({ onEnter }) => {
  const { theme, toggleTheme } = usePortal();

  return (
    <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-12 echo-ambient">
      {/* ---- Branding / atmosphere column ---- */}
      <section className="em-invert relative lg:col-span-7 flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        {/* Grayscale image panel — restrained atmosphere */}
        <div className="absolute inset-0 z-0 opacity-[0.16]">
          <img
            src={welcomeBackdropImg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(100%) contrast(1.1)' }}
            referrerPolicy="no-referrer"
          />
        </div>
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(20,17,14,0.35) 0%, rgba(20,17,14,0.86) 55%, rgba(20,17,14,0.96) 100%)',
          }}
        />

        <div className="relative z-10">
          <span className="ed-label">ECHO Operational Companion</span>
        </div>

        <div className="relative z-10 py-14 lg:py-0">
          <h1 className="em-wordmark text-[clamp(4rem,13vw,9rem)]" style={{ fontWeight: 400 }}>
            ECHO
          </h1>

          <div className="mt-9 h-px w-20" style={{ background: 'var(--echo-invert-rule-strong)' }} />

          <h2
            className="mt-9 font-serif text-[clamp(2rem,5.2vw,3.75rem)] leading-[0.98] tracking-[-0.025em]"
            style={{ color: 'var(--echo-invert-ink)', fontWeight: 400 }}
          >
            Your work.
            <br />
            <span style={{ color: 'var(--echo-accent)' }}>In focus.</span>
          </h2>

          <p
            className="mt-8 max-w-md text-[14px] leading-relaxed"
            style={{ color: 'var(--echo-invert-ink-2)' }}
          >
            A single, deliberate workspace for field execution — attendance, assigned tasks,
            evidence verification, vouchers, and the operational record that surrounds them.
          </p>
        </div>

        <div className="relative z-10 hidden lg:flex items-center gap-8">
          {[
            { k: 'Attendance', v: 'Daily record' },
            { k: 'Tasks', v: 'Evidence workflow' },
            { k: 'Vouchers', v: 'Formal requests' },
          ].map((item) => (
            <div key={item.k} className="flex flex-col gap-1.5">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: 'var(--echo-invert-ink)' }}
              >
                {item.k}
              </span>
              <span className="ed-meta">{item.v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Functional login column ---- */}
      <section className="relative lg:col-span-5 flex flex-col justify-center bg-[var(--echo-surface)] px-6 py-14 sm:px-12 lg:px-14">
        <div className="w-full max-w-[26rem] mx-auto">
          <div className="flex items-center justify-between mb-12">
            <span className="ed-label">Sign In</span>
            <button
              onClick={toggleTheme}
              aria-label="Toggle visual theme"
              title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              className="inline-flex items-center gap-2 ed-meta cursor-pointer hover:text-[var(--echo-ink)] transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {theme === 'dark' ? 'Day' : 'Night'}
            </button>
          </div>

          <SignInPanel onSuccess={onEnter} />

          <div
            className="mt-12 pt-6 flex items-start gap-3 text-[11px] leading-relaxed"
            style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)', color: 'var(--echo-ink-3)' }}
          >
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Profile credentials, permissions, and role access are governed by the ECHO Admin
              Portal. Employees cannot modify contractual terms or role assignments here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
