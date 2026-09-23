import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from './GlobalBackButton';

interface AccessDeniedProps {
  moduleName: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ moduleName }) => {
  const { setActiveTab, t } = usePortal();

  return (
    <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <GlobalBackButton />

      <div className="mt-12 py-20 border-t border-b border-neutral-900/10 dark:border-white/10 text-center">
        <div className="w-12 h-12 border border-neutral-900/20 dark:border-white/20 flex items-center justify-center text-neutral-500 dark:text-neutral-400 mx-auto mb-6">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h2 className="ed-h1">{t('accessDenied')}</h2>

        <p className="ed-sub mt-4 max-w-md mx-auto leading-relaxed">
          Your administrator has not enabled <strong>{moduleName}</strong> access for your account.
          Please contact your Operations Director if you require this clearance.
        </p>

        <div className="mt-10 flex items-center justify-center">
          <button onClick={() => setActiveTab('home')} className="ed-btn">
            <span>Return to Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
};