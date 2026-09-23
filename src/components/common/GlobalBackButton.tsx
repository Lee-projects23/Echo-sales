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
      className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
      <span>{label || t('backToHome')}</span>
    </button>
  );
};