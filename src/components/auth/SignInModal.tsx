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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#f7f5f0] dark:bg-[#0a0a09] border border-neutral-900/10 dark:border-white/10 overflow-hidden text-neutral-900 dark:text-neutral-100 p-8 sm:p-10">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!showForgotPassword ? (
          <div>
            <div className="mb-8">
              <span className="ed-label">ECHO Authentication</span>
              <h2 className="ed-h1 text-3xl mt-2">Employee Sign In</h2>
              <p className="ed-sub mt-3 text-xs">
                Sign in to your operational field workspace.
              </p>
            </div>

            {/* Quick Demo Switcher */}
            <div className="mb-6 flex items-center gap-4 text-[11px]">
              {allEmployees.map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => selectQuickAccount(emp.email)}
                  className={`uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer ${
                    email === emp.email
                      ? 'text-neutral-950 dark:text-white underline underline-offset-4'
                      : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  {emp.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="ed-label block mb-2">Email / Login Identifier</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
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
                    className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 text-xs border border-neutral-900/20 dark:border-white/20 text-neutral-700 dark:text-neutral-300">
                  {errorMessage}
                </div>
              )}

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-500 dark:text-neutral-400 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded-none border-neutral-400 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button type="submit" className="ed-btn w-full">
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <span className="ed-label">Password Recovery</span>
              <h2 className="ed-h1 text-3xl mt-2">Reset Password</h2>
              <p className="ed-sub mt-3 text-xs">
                Enter your registered employee email to request an admin password reset token.
              </p>
            </div>

            {forgotSent ? (
              <div className="space-y-5">
                <div className="p-4 border border-neutral-900/10 dark:border-white/10 text-xs leading-relaxed flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-neutral-500" />
                  <div>
                    Password reset notification dispatched to Operations Admin for employee account{' '}
                    <strong>{forgotEmail}</strong>. Default test credentials remain{' '}
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