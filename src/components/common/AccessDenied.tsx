import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from './GlobalBackButton';

interface AccessDeniedProps {
  moduleName: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ moduleName }) => {
  const { setActiveTab, t } = usePortal();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <GlobalBackButton />

      <div className="echo-card echo-card--pad lg:p-10 mt-10 text-center">
        <span className="echo-icon-tile echo-icon-tile--warning mx-auto mb-6" style={{ width: '3rem', height: '3rem' }}>
          <ShieldAlert className="w-6 h-6" />
        </span>

        <h2 className="ed-h1 !text-3xl">{t('accessDenied')}</h2>

        <p className="ed-sub mt-4 max-w-md mx-auto leading-relaxed">
          Your administrator has not enabled <strong className="text-[var(--echo-ink-2)]">{moduleName}</strong> access for your account.
          Please contact your Operations Director if you require this clearance.
        </p>

        <div className="mt-8 flex items-center justify-center">
          <button onClick={() => setActiveTab('home')} className="ed-btn">
            <Lock className="w-4 h-4" />
            <span>Return to Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
