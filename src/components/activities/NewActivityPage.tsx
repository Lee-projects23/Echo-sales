import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';

export const NewActivityPage: React.FC = () => {
  const { activities, setSelectedActivityId, setActiveTab, t } = usePortal();

  return (
    <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      <div className="mb-8">
        <GlobalBackButton />
        <div className="mt-4">
          <p className="ed-label mb-4">Incidents &amp; Repairs</p>
          <h1 className="ed-h1">{t('newActivity')}</h1>
          <p className="ed-sub mt-3 max-w-xl">
            Site incidents, urgent client repairs, and field activity resolution orders.
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="py-20 border-t border-b border-neutral-900/10 dark:border-white/10 text-center">
          <AlertCircle className="w-6 h-6 mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
          <p className="font-serif text-xl text-neutral-950 dark:text-neutral-50">
            No new activity has been assigned.
          </p>
          <p className="ed-sub mt-2 max-w-md mx-auto">
            When your Operations Coordinator raises an emergency ticket or incident, it will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-t border-b border-neutral-900/10 dark:border-white/10">
                <th className="ed-th w-12 text-center">No.</th>
                <th className="ed-th">Client</th>
                <th className="ed-th">Problem</th>
                <th className="ed-th">Date</th>
                <th className="ed-th">Time</th>
                <th className="ed-th">Status</th>
                <th className="ed-th text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/10 dark:divide-white/10">
              {activities.map((act) => (
                <tr key={act.id} className="hover:bg-neutral-900/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="ed-td text-center font-mono text-xs text-neutral-400 dark:text-neutral-500">
                    {act.activityNumber}
                  </td>

                  <td className="ed-td">
                    <div className="font-medium">{act.clientName}</div>
                    <div className="ed-mono">{act.siteName}</div>
                  </td>

                  <td className="ed-td max-w-xs truncate font-medium">{act.problem}</td>

                  <td className="ed-td font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {act.date}
                  </td>

                  <td className="ed-td font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {act.time}
                  </td>

                  <td className="ed-td">
                    <span className="ed-tag text-neutral-700 dark:text-neutral-300">
                      {act.status}
                    </span>
                  </td>

                  <td className="ed-td text-right">
                    <button
                      onClick={() => {
                        setSelectedActivityId(act.id);
                        setActiveTab('activity-detail');
                      }}
                      className="ed-link"
                    >
                      <span>{t('viewDetails')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};