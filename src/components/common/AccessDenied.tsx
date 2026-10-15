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
    <div className="animate-echo-fade">
      <section className="em-section pt-14 sm:pt-20 pb-12">
        <GlobalBackButton />
        <div className="mt-7">
          <p className="ed-label mb-7">Restricted Module</p>
          <h1 className="ed-h1">{t('accessDenied')}</h1>
        </div>
      </section>

      <section
        className="em-section pb-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="mt-12 max-w-2xl">
          <span className="echo-icon-tile echo-icon-tile--warning mb-8" style={{ width: '3rem', height: '3rem' }}>
            <ShieldAlert className="w-6 h-6" />
          </span>

          <p className="text-[16px] leading-relaxed text-[var(--echo-ink-2)]">
            Your administrator has not enabled <strong className="text-[var(--echo-ink)]">{moduleName}</strong>{' '}
            access for your account. Please contact your Operations Director if you require this
            clearance.
          </p>

          <div className="mt-10">
            <button onClick={() => setActiveTab('home')} className="ed-btn">
              <Lock className="w-4 h-4" />
              <span>Return to Workspace</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
