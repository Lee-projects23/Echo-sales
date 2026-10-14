import React, { useMemo, useState } from 'react';
import { ArrowRight, ListChecks, Search, X } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { StatusChip } from '../common/StatusChip';
import { TaskStatus } from '../../types';

export const NewTaskPage: React.FC = () => {
  const { assignedTasks, setSelectedTaskId, setActiveTab, t } = usePortal();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'submitted' | 'approved' | 'reupload'>('all');
  const [query, setQuery] = useState('');

  const statusCounts = useMemo(
    () => ({
      all: assignedTasks.length,
      pending: assignedTasks.filter((x) => x.status === 'Pending' || x.status === 'In Progress').length,
      submitted: assignedTasks.filter((x) => x.status === 'Submitted').length,
      approved: assignedTasks.filter((x) => x.status === 'Approved').length,
      reupload: assignedTasks.filter((x) => x.status === 'Re-upload Requested').length,
    }),
    [assignedTasks]
  );

  const filters: { key: typeof activeFilter; label: string }[] = [
    { key: 'all', label: `All (${statusCounts.all})` },
    { key: 'pending', label: `Pending (${statusCounts.pending})` },
    { key: 'submitted', label: `Submitted (${statusCounts.submitted})` },
    { key: 'approved', label: `Approved (${statusCounts.approved})` },
    { key: 'reupload', label: `Re-upload (${statusCounts.reupload})` },
  ];

  const filteredTasks = assignedTasks.filter((task) => {
    if (activeFilter === 'pending') {
      if (!(task.status === 'Pending' || task.status === 'In Progress')) return false;
    } else if (activeFilter === 'submitted') {
      if (task.status !== 'Submitted') return false;
    } else if (activeFilter === 'approved') {
      if (task.status !== 'Approved') return false;
    } else if (activeFilter === 'reupload') {
      if (task.status !== 'Re-upload Requested') return false;
    }

    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      task.taskTitle.toLowerCase().includes(q) ||
      task.clientName.toLowerCase().includes(q) ||
      task.companyName.toLowerCase().includes(q) ||
      `#${task.taskNumber}`.includes(q)
    );
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-echo-fade">
      {/* Header */}
      <div className="mb-8">
        <GlobalBackButton />
        <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="ed-label mb-4">Work Orders</p>
            <h1 className="ed-h1">{t('newTask')}</h1>
            <p className="ed-sub mt-3 max-w-xl">
              Assigned client field tasks, required evidence verification, and review statuses.
            </p>
          </div>
          <span className="echo-chip echo-chip--accent self-start sm:self-auto">
            <ListChecks className="w-3.5 h-3.5" />
            {assignedTasks.length} work orders
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
            placeholder="Search tasks or clients..."
            aria-label="Search assigned tasks"
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

      {/* Task Table */}
      <div className="echo-card overflow-hidden">
        <div className="overflow-x-auto echo-scroll">
          <table className="w-full text-left min-w-[860px]">
            <thead>
              <tr className="border-b border-[var(--echo-border)] bg-[var(--echo-surface-2)]">
                <th className="ed-th w-14 text-center">No.</th>
                <th className="ed-th">Client</th>
                <th className="ed-th">Task</th>
                <th className="ed-th">Due Date</th>
                <th className="ed-th">Time</th>
                <th className="ed-th">Status</th>
                <th className="ed-th text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--echo-border)]">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="ed-td py-14 text-center text-[var(--echo-ink-3)]">
                    No tasks found matching the current filter or search.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="transition-colors hover:bg-[var(--echo-surface-2)]">
                    <td className="ed-td text-center font-mono text-[12px] text-[var(--echo-ink-3)]">
                      {task.taskNumber}
                    </td>

                    <td className="ed-td">
                      <div className="font-medium">{task.clientName}</div>
                      <div className="ed-mono mt-0.5">{task.companyName}</div>
                    </td>

                    <td className="ed-td max-w-xs truncate font-medium">{task.taskTitle}</td>

                    <td className="ed-td font-mono text-[12px] text-[var(--echo-ink-3)]">
                      {task.scheduledDate}
                    </td>

                    <td className="ed-td font-mono text-[12px] text-[var(--echo-ink-3)]">
                      {task.scheduledTime}
                    </td>

                    <td className="ed-td">
                      <StatusChip status={task.status} />
                    </td>

                    <td className="ed-td text-right">
                      <button
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setActiveTab('task-detail');
                        }}
                        className="ed-link justify-end"
                      >
                        <span>{t('viewFullDetails')}</span>
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

      <p className="ed-mono mt-4">
        Showing {filteredTasks.length} of {assignedTasks.length} assigned tasks
        {activeFilter !== 'all' && ` · filtered by ${filters.find((f) => f.key === activeFilter)?.label.replace(/\s*\(\d+\)$/, '')}`}
      </p>
    </div>
  );
};
