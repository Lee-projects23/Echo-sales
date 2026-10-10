import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

interface SignInModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ onClose, onSuccess }) => {
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

    const matchedEmployee = allEmployees.find(
      (emp) => emp.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matchedEmployee && password === 'Echo@123') {
      switchEmployee(matchedEmployee.id);
      setIsAuthenticated(true);
      setHasEnteredWorkspace(true);
      onSuccess();
    } else {
      setErrorMessage('Invalid credentials. Use demo email with password Echo@123.');
    }
  };

  const selectQuickAccount = (empEmail: string) => {
    setEmail(empEmail);
    setPassword('Echo@123');
    setErrorMessage('');
  };

  return (
    <div className="echo-modal-scrim">
      <div className="echo-modal max-w-md p-8 sm:p-10">
        <button
          onClick={onClose}
          aria-label="Close sign in"
          className="absolute top-5 right-5 echo-icon-tile hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
          style={{ width: '1.875rem', height: '1.875rem' }}
        >
          <X className="w-4 h-4" />
        </button>

        {!showForgotPassword ? (
          <div>
            <div className="mb-8">
              <span className="ed-label">ECHO Authentication</span>
              <h2 className="ed-h1 !text-3xl mt-2">Employee Sign In</h2>
              <p className="ed-sub mt-3 text-[13px]">
                Sign in to your operational field workspace.
              </p>
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
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setShowForgotPassword(true);
                    }}
                    className="text-[12px] font-medium text-[var(--echo-ink-3)] hover:text-[var(--echo-accent)] cursor-pointer"
                  >
                    Forgot password?
                  </button>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--echo-ink-3)] hover:text-[var(--echo-ink)] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-[var(--echo-radius-sm)] border border-[color-mix(in_srgb,var(--echo-danger)_30%,transparent)] bg-[var(--echo-danger-soft)] p-3.5 text-[13px] text-[var(--echo-danger)]">
                  {errorMessage}
                </div>
              )}

              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-[13px] text-[var(--echo-ink-2)] select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button type="submit" className="ed-btn w-full">
                <span>Sign In</span>
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <span className="ed-label">Password Recovery</span>
              <h2 className="ed-h1 !text-3xl mt-2">Reset Password</h2>
              <p className="ed-sub mt-3 text-[13px]">
                Enter your registered employee email to request an admin password reset token.
              </p>
            </div>

            {forgotSent ? (
              <div className="space-y-5">
                <div className="echo-card echo-card--pad text-[13px] leading-relaxed flex items-start gap-3">
                  <span className="echo-icon-tile echo-icon-tile--positive shrink-0" style={{ width: '1.75rem', height: '1.75rem' }}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                  <div className="text-[var(--echo-ink-2)]">
                    Password reset notification dispatched to Operations Admin for employee account{' '}
                    <strong className="text-[var(--echo-ink)]">{forgotEmail}</strong>. Default test credentials remain{' '}
                    <code className="font-mono">Echo@123</code>.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="ed-btn w-full"
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

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="ed-btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="ed-btn flex-1">
                    Send Request
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};