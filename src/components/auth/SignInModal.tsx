import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, X, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export interface SignInPanelProps {
  /** Called after credentials validate and the workspace is entered. */
  onSuccess?: () => void;
  /** Hides the "forgot password" affordance when embedded in a compact surface. */
  compact?: boolean;
}
/**
 * The ECHO sign-in form. Authentication behaviour is unchanged — the same
 * demo-employee lookup and the same forgot-password review flow as before.
 * Only the presentation is restyled.
 */
export const SignInPanel: React.FC<SignInPanelProps> = ({ onSuccess, compact = false }) => {
  const { allEmployees, switchEmployee, setIsAuthenticated, setHasEnteredWorkspace } = usePortal();

  const [email, setEmail] = useState('arjun@echo.demo');
  const [password, setPassword] = useState('Echo@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check credentials against mock employees
    const matchedEmployee = allEmployees.find(
      (emp) => emp.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matchedEmployee && password === 'Echo@123') {
      switchEmployee(matchedEmployee.id);
      setIsAuthenticated(true);
      setHasEnteredWorkspace(true);
      onSuccess?.();
    } else {
      setErrorMessage('Invalid credentials. Use demo email with password Echo@123.');
    }
  };

  const selectQuickAccount = (empEmail: string) => {
    setEmail(empEmail);
    setPassword('Echo@123');
    setErrorMessage('');
  };

  if (showForgotPassword) {
    return (
      <div className="space-y-6">
        <div>
          <span className="ed-label">Password Recovery</span>
          <h2 className="ed-h2 mt-3">Reset Password</h2>
          <p className="ed-sub mt-3">
            Enter your registered employee email to request an admin password reset token.
          </p>
        </div>

        {forgotSent ? (
          <div className="space-y-6">
            <div
              className="p-4 text-[13px] leading-relaxed flex items-start gap-3"
              style={{
                background: 'var(--echo-positive-soft)',
                border: 'var(--echo-rule) solid color-mix(in srgb, var(--echo-positive) 34%, transparent)',
                color: 'var(--echo-positive)',
              }}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                Password reset notification dispatched to Operations Admin for employee account{' '}
                <strong>{forgotEmail}</strong>. Default test credentials remain{' '}
                <code className="px-1 py-0.5 font-mono" style={{ background: 'var(--echo-positive-soft)' }}>
                  Echo@123
                </code>
                .
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="ed-btn w-full justify-center"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setForgotSent(true);
            }}
            className="space-y-5"
          >
            <div>
              <label className="ed-label block mb-2">Employee Email</label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@echo.demo"
                className="ed-input"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="ed-btn-ghost flex-1 justify-center"
              >
                Cancel
              </button>
              <button type="submit" className="ed-btn flex-1 justify-center">
                Send Request
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <span className="ed-label">ECHO Authentication</span>
        <h2 className="ed-h2 mt-3">Employee Sign In</h2>
        <p className="ed-sub mt-3">Sign in to your operational field workspace.</p>
      </div>

      {/* Quick Demo Switcher */}
      <div className="echo-segment mb-6">
        {allEmployees.map((emp) => (
          <button
            key={emp.id}
            type="button"
            onClick={() => selectQuickAccount(emp.email)}
            className="echo-segment-item"
            data-active={email === emp.email}
          >
            {emp.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <form onSubmit={handleSignIn} className="space-y-5">
        <div>
          <label className="ed-label block mb-2">Email / Login Identifier</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--echo-ink-3)] pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@echo.demo"
              className="ed-input pl-10"
            />
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label className="ed-label">Password</label>
            {!compact && (
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotPassword(true);
                }}
                className="ed-link"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--echo-ink-3)] pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="ed-input pl-10 pr-10 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--echo-ink-3)] hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div
            className="p-3.5 flex items-start gap-2.5 text-[13px]"
            style={{
              background: 'var(--echo-danger-soft)',
              border: 'var(--echo-rule) solid color-mix(in srgb, var(--echo-danger) 34%, transparent)',
              color: 'var(--echo-danger)',
            }}
          >
            <X className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <label className="flex items-center gap-2.5 cursor-pointer select-none text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--echo-ink-3)]">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span>Remember me</span>
        </label>

        <button type="submit" className="ed-btn w-full justify-center !py-4">
          <span>Sign In</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <p className="flex items-center gap-2 ed-meta">
          <Check className="w-3 h-3" />
          Synchronized with the ECHO Admin Portal
        </p>
      </form>
    </div>
  );
};

export default SignInPanel;

/* ------------------------------------------------------------------ */
/* Retained modal shell around the shared sign-in panel                */
/* The portal now presents the full-page LoginPage on entry; this      */
/* wrapper keeps the existing API and behaviour available unchanged.   */
/* ------------------------------------------------------------------ */

interface SignInModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ onClose, onSuccess }) => (
  <div className="echo-modal-scrim">
    <div className="echo-modal max-w-md relative">
      <button
        onClick={onClose}
        aria-label="Close sign in"
        className="absolute top-5 right-5 echo-icon-tile hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
        style={{ width: '1.875rem', height: '1.875rem' }}
      >
        <X className="w-4 h-4" />
      </button>
      <SignInPanel onSuccess={onSuccess} compact />
    </div>
  </div>
);
