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
      className="group inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors mb-4 cursor-pointer"
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
      <span>{label || t('backToHome')}</span>
    </button>
  );
};
