import React from 'react';
import { AlertCircle, ArrowRight, Siren } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { StatusChip } from '../common/StatusChip';

export const NewActivityPage: React.FC = () => {
  const { activities, setSelectedActivityId, setActiveTab, t } = usePortal();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-echo-fade">
      <div className="mb-8">
        <GlobalBackButton />
        <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="ed-label mb-4">Incidents &amp; Repairs</p>
            <h1 className="ed-h1">{t('newActivity')}</h1>
            <p className="ed-sub mt-3 max-w-xl">
              Site incidents, urgent client repairs, and field activity resolution orders.
            </p>
          </div>
          <span className="echo-chip echo-chip--danger self-start sm:self-auto">
            <Siren className="w-3.5 h-3.5" />
            {activities.length} open incidents
          </span>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="echo-empty">
          <span className="echo-icon-tile echo-icon-tile--warning mb-5">
            <AlertCircle className="w-5 h-5" />
          </span>
          <p className="ed-h2">No new activity has been assigned.</p>
          <p className="ed-sub mt-2 max-w-md">
            When your Operations Coordinator raises an emergency ticket or incident, it will appear here.
          </p>
        </div>
      ) : (
        <div className="echo-card overflow-hidden">
          <div className="overflow-x-auto echo-scroll">
            <table className="w-full text-left min-w-[820px]">
              <thead>
                <tr className="border-b border-[var(--echo-border)] bg-[var(--echo-surface-2)]">
                  <th className="ed-th w-14 text-center">No.</th>
                  <th className="ed-th">Client</th>
                  <th className="ed-th">Problem</th>
                  <th className="ed-th">Date</th>
                  <th className="ed-th">Time</th>
                  <th className="ed-th">Status</th>
                  <th className="ed-th text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--echo-border)]">
                {activities.map((act) => (
                  <tr key={act.id} className="transition-colors hover:bg-[var(--echo-surface-2)]">
                    <td className="ed-td text-center font-mono text-[12px] text-[var(--echo-ink-3)]">
                      {act.activityNumber}
                    </td>

                    <td className="ed-td">
                      <div className="font-medium">{act.clientName}</div>
                      <div className="ed-mono mt-0.5">{act.siteName}</div>
                    </td>

                    <td className="ed-td max-w-xs truncate font-medium">{act.problem}</td>

                    <td className="ed-td font-mono text-[12px] text-[var(--echo-ink-3)]">
                      {act.date}
                    </td>

                    <td className="ed-td font-mono text-[12px] text-[var(--echo-ink-3)]">
                      {act.time}
                    </td>

                    <td className="ed-td">
                      <StatusChip status={act.status} />
                    </td>

                    <td className="ed-td text-right">
                      <button
                        onClick={() => {
                          setSelectedActivityId(act.id);
                          setActiveTab('activity-detail');
                        }}
                        className="ed-link justify-end"
                      >
                        <span>{t('viewDetails')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
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
