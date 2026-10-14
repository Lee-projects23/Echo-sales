import React, { useMemo, useState } from 'react';
import { AlertCircle, ArrowRight, Search, Siren, X } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { StatusChip } from '../common/StatusChip';
import { ActivityStatus } from '../../types';

type ActivityFilter = 'all' | 'open' | 'progress' | 'verification' | 'completed';

export const NewActivityPage: React.FC = () => {
  const { activities, setSelectedActivityId, setActiveTab, t } = usePortal();

  const [activeFilter, setActiveFilter] = useState<ActivityFilter>('all');
  const [query, setQuery] = useState('');

  const matchesFilter = (status: ActivityStatus, filter: ActivityFilter): boolean => {
    if (filter === 'all') return true;
    if (filter === 'open') return status === 'Raised' || status === 'Acknowledged' || status === 'Assigned';
    if (filter === 'progress') return status === 'In Progress' || status === 'Work Completed';
    if (filter === 'verification') return status === 'Awaiting Admin Verification';
    return status === 'Resolved' || status === 'Closed';
  };

  const statusCounts = useMemo(
    () => ({
      all: activities.length,
      open: activities.filter((a) => matchesFilter(a.status, 'open')).length,
      progress: activities.filter((a) => matchesFilter(a.status, 'progress')).length,
      verification: activities.filter((a) => matchesFilter(a.status, 'verification')).length,
      completed: activities.filter((a) => matchesFilter(a.status, 'completed')).length,
    }),
    [activities]
  );

  const filters: { key: ActivityFilter; label: string }[] = [
    { key: 'all', label: `All (${statusCounts.all})` },
    { key: 'open', label: `Open (${statusCounts.open})` },
    { key: 'progress', label: `In Progress (${statusCounts.progress})` },
    { key: 'verification', label: `Verification (${statusCounts.verification})` },
    { key: 'completed', label: `Resolved (${statusCounts.completed})` },
  ];

  const filteredActivities = activities.filter((act) => {
    if (!matchesFilter(act.status, activeFilter)) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      act.problem.toLowerCase().includes(q) ||
      act.clientName.toLowerCase().includes(q) ||
      act.siteName.toLowerCase().includes(q) ||
      `#${act.activityNumber}`.includes(q)
    );
  });

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
            {statusCounts.open} open incidents
          </span>
        </div>
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <div className="echo-segment flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className="echo-segment-item"
              data-active={activeFilter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--echo-ink-3)] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activities or sites..."
            aria-label="Search activities"
            className="ed-input pl-9 pr-9"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--echo-ink-3)] hover:text-[var(--echo-ink)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {filteredActivities.length === 0 && activities.length === 0 ? (
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
            <table className="w-full text-left min-w-[860px]">
              <thead>
                <tr className="border-b border-[var(--echo-border)] bg-[var(--echo-surface-2)]">
                  <th className="ed-th w-14 text-center">No.</th>
                  <th className="ed-th">Client</th>
                  <th className="ed-th">Problem</th>
                  <th className="ed-th">Reported</th>
                  <th className="ed-th">Status</th>
                  <th className="ed-th text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--echo-border)]">
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="ed-td py-14 text-center text-[var(--echo-ink-3)]">
                      No activities found matching the current filter or search.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((act) => (
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
                        <span className="block text-[11px]">{act.time}</span>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="ed-mono mt-4">
        Showing {filteredActivities.length} of {activities.length} activities
      </p>
    </div>
  );
};
