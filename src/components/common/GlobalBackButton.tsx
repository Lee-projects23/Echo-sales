import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

interface GlobalBackButtonProps {
  label?: string;
  onBack?: () => void;
}

export const GlobalBackButton: React.FC<GlobalBackButtonProps> = ({ label, onBack }) => {
  const { setActiveTab, setSelectedTaskId, setSelectedActivityId, setSelectedVoucherId, t } = usePortal();

  const handleClick = () => {
    if (onBack) {
      onBack();
    } else {
      setSelectedTaskId(null);
      setSelectedActivityId(null);
      setSelectedVoucherId(null);
      setActiveTab('home');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group inline-flex items-center gap-2 rounded-full border border-[var(--echo-border)] bg-[var(--echo-surface)] px-3 py-1.5 text-[12px] font-semibold text-[var(--echo-ink-2)] shadow-[var(--echo-shadow-sm)] transition-colors hover:border-[var(--echo-border-strong)] hover:text-[var(--echo-ink)] cursor-pointer"
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
      <span>{label || t('backToHome')}</span>
    </button>
  );
};