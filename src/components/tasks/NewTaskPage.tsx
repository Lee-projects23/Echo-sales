import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  ArrowRight,
  Filter,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
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

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Clock className="w-3 h-3" /> Submitted
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            In Progress
          </span>
        );
      case 'Re-upload Requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-3 h-3" /> Re-upload Requested
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150">
      <GlobalBackButton />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {t('newTask')}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Assigned client field tasks, required evidence verification, and review statuses
          </p>
        </div>

        {/* Task History Filters (Tabs) */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All Tasks ({assignedTasks.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'pending'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('submitted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'submitted'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Submitted
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'approved'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveFilter('reupload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'reupload'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Re-upload
          </button>
        </div>
      </div>

      {/* Numbered Table matching specifications */}
      <div className="apple-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 text-neutral-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">No.</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Task</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-neutral-500">
                    No tasks found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-neutral-500">
                      {task.taskNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {task.clientName}
                      </div>
                      <div className="text-[11px] text-neutral-500">{task.companyName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-neutral-900 dark:text-white max-w-xs truncate">
                        {task.taskTitle}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                      {task.scheduledDate}
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                      {task.scheduledTime}
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(task.status)}</td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setActiveTab('task-detail');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs cursor-pointer"
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
    </div>
  );
};
