import React, { useState } from 'react';
import { ArrowRight, ListChecks } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { StatusChip } from '../common/StatusChip';
import { TaskStatus } from '../../types';

export const NewTaskPage: React.FC = () => {
  const { assignedTasks, setSelectedTaskId, setActiveTab, t } = usePortal();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'submitted' | 'approved' | 'reupload'>('all');

  const filteredTasks = assignedTasks.filter((task) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return task.status === 'Pending' || task.status === 'In Progress';
    if (activeFilter === 'submitted') return task.status === 'Submitted';
    if (activeFilter === 'approved') return task.status === 'Approved';
    if (activeFilter === 'reupload') return task.status === 'Re-upload Requested';
    return true;
  });

  const filters: { key: typeof activeFilter; label: string }[] = [
    { key: 'all', label: `All (${assignedTasks.length})` },
    { key: 'pending', label: 'Pending' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'approved', label: 'Approved' },
    { key: 'reupload', label: 'Re-upload' },
  ];

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

      {/* Filter Tabs */}
      <div className="echo-segment mb-5 flex-wrap">
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

      {/* Task Table */}
      <div className="echo-card overflow-hidden">
        <div className="overflow-x-auto echo-scroll">
          <table className="w-full text-left min-w-[820px]">
            <thead>
              <tr className="border-b border-[var(--echo-border)] bg-[var(--echo-surface-2)]">
                <th className="ed-th w-14 text-center">No.</th>
                <th className="ed-th">Client</th>
                <th className="ed-th">Task</th>
                <th className="ed-th">Date</th>
                <th className="ed-th">Time</th>
                <th className="ed-th">Status</th>
                <th className="ed-th text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--echo-border)]">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="ed-td py-14 text-center text-[var(--echo-ink-3)]">
                    No tasks found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="transition-colors hover:bg-[var(--echo-surface-2)]"
                  >
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
    </div>
  );
};
