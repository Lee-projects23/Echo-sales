import React from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';

export const NewActivityPage: React.FC = () => {
  const { activities, setSelectedActivityId, setActiveTab, t } = usePortal();

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150">
      <GlobalBackButton />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {t('newActivity')}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Site incidents, urgent client repairs, and field activity resolution orders
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="apple-card rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            Sorry, no new activity was assigned.
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            When your Operations Coordinator raises an emergency ticket or incident, it will appear here.
          </p>
        </div>
      ) : (
        <div className="apple-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 text-neutral-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">No.</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Problem</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {activities.map((act) => (
                  <tr
                    key={act.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-neutral-500">
                      {act.activityNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {act.clientName}
                      </div>
                      <div className="text-[11px] text-neutral-500">{act.siteName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-neutral-900 dark:text-white max-w-xs truncate">
                        {act.problem}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                      {act.date}
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                      {act.time}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          act.status === 'Work Completed'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : act.status === 'Awaiting Admin Verification'
                            ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                            : act.status === 'In Progress'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {act.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedActivityId(act.id);
                          setActiveTab('activity-detail');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs cursor-pointer"
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
        </div>
      )}
    </div>
  );
};
