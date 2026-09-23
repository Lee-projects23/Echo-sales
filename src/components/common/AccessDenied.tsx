import React from 'react';
import { ShieldAlert, Home } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from './GlobalBackButton';

interface AccessDeniedProps {
  moduleName: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ moduleName }) => {
  const { setActiveTab, t } = usePortal();

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <GlobalBackButton />

      <div className="apple-card rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
          {t('accessDenied')}
        </h2>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mb-8 leading-relaxed">
          Your administrator has not enabled <strong>{moduleName}</strong> access for your account. Please contact your Operations Director if you require this clearance.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
