import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
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

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'Approved':
      case 'Submitted':
      case 'In Progress':
      case 'Re-upload Requested':
      case 'Rejected':
        return (
          <span className="ed-tag text-neutral-700 dark:text-neutral-300">{status}</span>
        );
      default:
        return <span className="ed-tag text-neutral-400 dark:text-neutral-500">Pending</span>;
    }
  };

  const filters: { key: typeof activeFilter; label: string }[] = [
    { key: 'all', label: `All (${assignedTasks.length})` },
    { key: 'pending', label: 'Pending' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'approved', label: 'Approved' },
    { key: 'reupload', label: 'Re-upload' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-8">
        <GlobalBackButton />
        <div className="mt-4">
          <p className="ed-label mb-4">Work Orders</p>
          <h1 className="ed-h1">{t('newTask')}</h1>
          <p className="ed-sub mt-3 max-w-xl">
            Assigned client field tasks, required evidence verification, and review statuses.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-neutral-900/10 dark:border-white/10">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`pb-3 -mb-px text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors cursor-pointer border-b-2 ${
              activeFilter === f.key
                ? 'text-neutral-950 dark:text-white border-neutral-950 dark:border-white'
                : 'text-neutral-400 dark:text-neutral-500 border-transparent hover:text-neutral-950 dark:hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-t border-b border-neutral-900/10 dark:border-white/10">
              <th className="ed-th w-12 text-center">No.</th>
              <th className="ed-th">Client</th>
              <th className="ed-th">Task</th>
              <th className="ed-th">Date</th>
              <th className="ed-th">Time</th>
              <th className="ed-th">Status</th>
              <th className="ed-th text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/10 dark:divide-white/10">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="ed-td py-10 text-center text-neutral-500">
                  No tasks found matching current filter.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-neutral-900/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="ed-td text-center font-mono text-xs text-neutral-400 dark:text-neutral-500">
                    {task.taskNumber}
                  </td>

                  <td className="ed-td">
                    <div className="font-medium">{task.clientName}</div>
                    <div className="ed-mono">{task.companyName}</div>
                  </td>

                  <td className="ed-td max-w-xs truncate font-medium">{task.taskTitle}</td>

                  <td className="ed-td font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {task.scheduledDate}
                  </td>

                  <td className="ed-td font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {task.scheduledTime}
                  </td>

                  <td className="ed-td">{getStatusLabel(task.status)}</td>

                  <td className="ed-td text-right">
                    <button
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        setActiveTab('task-detail');
                      }}
                      className="ed-link"
                    >
                      <span>{t('viewFullDetails')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};