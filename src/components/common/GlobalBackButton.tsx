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
      className="group inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--echo-ink-3)] hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
      <span>{label || t('backToHome')}</span>
    </button>
  );
};
