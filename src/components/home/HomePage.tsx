import React from 'react';
import {
  Clock,
  CheckCircle2,
  PlayCircle,
  Calendar,
  AlertCircle,
  ArrowRight,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const HomePage: React.FC<HomePageHookProps> = () => {
  const {
    currentEmployee,
    todayAttendance,
    handleCheckIn,
    handleCheckOut,
    regularTasks,
    startRegularTask,
    completeRegularTask,
    assignedTasks,
    setActiveTab,
    setSelectedTaskId,
    t,
  } = usePortal();

  // Get current hour for dynamic greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t('goodMorning') : hour < 17 ? t('goodAfternoon') : t('goodEvening');

  // Filter regular tasks scheduled for today (23 Sep 2026 is a Wednesday: day of week = 3, day of month = 23)
  const todayDayOfWeek = 3; // Wednesday
  const todayDayOfMonth = 23;

  const scheduledTodayTasks = regularTasks.filter((task) => {
    if (task.frequency === 'daily') return true;
    if (task.frequency === 'weekly' && task.scheduledDays?.includes(todayDayOfWeek)) return true;
    if (task.frequency === 'monthly' && task.scheduledDates?.includes(todayDayOfMonth)) return true;
    return false;
  });

  // Newly assigned pending tasks
  const pendingAssignedTasks = assignedTasks.filter(
    (t) => t.status === 'Pending' || t.status === 'In Progress' || t.status === 'Re-upload Requested'
  );

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in duration-150">
      {/* Top Greeting Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {greeting}, {currentEmployee.name.split(' ')[0]}.
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          {t('hereIsToday')}
        </p>
      </div>

      {/* PRIORITY 1: TODAY'S ATTENDANCE */}
      <section className="apple-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {t('todayAttendance')}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs font-mono text-neutral-500">23 Sep 2026</span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  todayAttendance.status === 'Checked In'
                    ? 'bg-emerald-500 ring-4 ring-emerald-500/20'
                    : todayAttendance.status === 'Present'
                    ? 'bg-sky-500 ring-4 ring-sky-500/20'
                    : todayAttendance.status === 'Late'
                    ? 'bg-amber-500 ring-4 ring-amber-500/20'
                    : 'bg-neutral-400 ring-4 ring-neutral-400/20'
                }`}
              />
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                {todayAttendance.status === 'Checked In' && todayAttendance.checkIn ? (
                  <>Checked in at <span className="font-mono">{todayAttendance.checkIn}</span></>
                ) : todayAttendance.status === 'Present' && todayAttendance.checkOut ? (
                  <>Checked out at <span className="font-mono">{todayAttendance.checkOut}</span></>
                ) : todayAttendance.status === 'Late' && todayAttendance.checkIn ? (
                  <>Late Check-In at <span className="font-mono">{todayAttendance.checkIn}</span></>
                ) : (
                  'Not Checked In'
                )}
              </h2>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md">
              {todayAttendance.status === 'Not Checked In'
                ? 'Standard shift cutoff: 9:15 AM. Check in upon arrival at assigned site or facility.'
                : todayAttendance.status === 'Checked In' || todayAttendance.status === 'Late'
                ? 'Shift is currently active. Record your check-out when daily field assignments are completed.'
                : 'Shift completed for today. Total working hours recorded and synced with Admin Payroll.'}
            </p>
          </div>

          {/* Action Control Button */}
          <div className="shrink-0 flex items-center gap-3">
            {todayAttendance.status === 'Not Checked In' ? (
              <button
                onClick={handleCheckIn}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>{t('checkIn')}</span>
              </button>
            ) : todayAttendance.status === 'Checked In' || todayAttendance.status === 'Late' ? (
              <button
                onClick={handleCheckOut}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>{t('checkOut')}</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Shift Complete · 8h 52m</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PRIORITY 2: TODAY'S REGULAR TASKS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {t('todayRegularTasks')}
            </h2>
            <p className="text-xs text-neutral-500">
              Recurring operational checklists scheduled for today ({scheduledTodayTasks.length} items)
            </p>
          </div>

          <div className="text-xs font-mono tabular-nums text-neutral-500">
            {scheduledTodayTasks.filter((t) => t.status === 'Completed').length} /{' '}
            {scheduledTodayTasks.length} Completed
          </div>
        </div>

        {/* Regular Tasks List - Rendered One by One */}
        <div className="space-y-3">
          {scheduledTodayTasks.map((task, index) => {
            const isCompleted = task.status === 'Completed';
            const isInProgress = task.status === 'In Progress';

            return (
              <div
                key={task.id}
                className={`apple-card rounded-2xl p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted ? 'opacity-70 bg-neutral-50 dark:bg-neutral-900/40' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 shrink-0 mt-0.5">
                    {index + 1}
                  </div>

                  <div className="space-y-1">
                    <h3
                      className={`text-sm font-semibold text-neutral-900 dark:text-white ${
                        isCompleted ? 'line-through text-neutral-500 dark:text-neutral-400' : ''
                      }`}
                    >
                      {task.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 font-mono">
                      <span>Scheduled: {task.scheduledTime}</span>
                      <span>·</span>
                      <span className="capitalize">{task.frequency}</span>
                      <span>·</span>
                      <span
                        className={
                          isCompleted
                            ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                            : isInProgress
                            ? 'text-sky-600 dark:text-sky-400 font-semibold'
                            : 'text-neutral-500'
                        }
                      >
                        {isCompleted
                          ? `Completed at ${task.completedAt || '9:45 AM'}`
                          : isInProgress
                          ? 'In Progress'
                          : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:self-center pl-12 sm:pl-0">
                  {isCompleted ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('completed')}</span>
                    </div>
                  ) : isInProgress ? (
                    <button
                      onClick={() => completeRegularTask(task.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('completeTask')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => startRegularTask(task.id)}
                      className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>{t('startTask')}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRIORITY 3: ASSIGNED WORK / NEW TASKS HIGHLIGHT */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Assigned Work
            </h2>
            <p className="text-xs text-neutral-500">
              New client field tasks requiring evidence submission & verification
            </p>
          </div>

          <button
            onClick={() => setActiveTab('new-task')}
            className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({assignedTasks.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingAssignedTasks.slice(0, 2).map((task) => (
            <div
              key={task.id}
              onClick={() => {
                setSelectedTaskId(task.id);
                setActiveTab('task-detail');
              }}
              className="apple-card rounded-2xl p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
                    Task #{task.taskNumber}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      task.status === 'Re-upload Requested'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : task.status === 'In Progress'
                        ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-sky-500 transition-colors">
                  {task.taskTitle}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                  {task.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                <span className="font-mono text-[11px]">{task.clientName}</span>
                <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Details <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

interface HomePageHookProps {}
