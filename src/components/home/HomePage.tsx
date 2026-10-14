import React from 'react';
import {
  Clock,
  CheckCircle2,
  PlayCircle,
  ArrowRight,
  ShieldAlert,
  Lock,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { StatusChip } from '../common/StatusChip';

export const HomePage: React.FC<HomePageHookProps> = () => {
  const {
    currentEmployee,
    todayAttendance,
    handleCheckIn,
    handleCheckOut,
    regularTasks,
    todayRegularTasks,
    regularTasksCompletedToday,
    regularTasksTotalToday,
    canCheckOut,
    startRegularTask,
    completeRegularTask,
    assignedTasks,
    setActiveTab,
    setSelectedTaskId,
    t,
  } = usePortal();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t('goodMorning') : hour < 17 ? t('goodAfternoon') : t('goodEvening');

  const todayDayOfWeek = 3; // Wednesday
  const todayDayOfMonth = 23;

  const scheduledTodayTasks = regularTasks.filter((task) => {
    if (task.frequency === 'daily') return true;
    if (task.frequency === 'weekly' && task.scheduledDays?.includes(todayDayOfWeek)) return true;
    if (task.frequency === 'monthly' && task.scheduledDates?.includes(todayDayOfMonth)) return true;
    return false;
  });

  const pendingAssignedTasks = assignedTasks.filter(
    (x) => x.status === 'Pending' || x.status === 'In Progress' || x.status === 'Re-upload Requested'
  );

  const attendanceStatusLabel = () => {
    if (todayAttendance.status === 'Checked In' && todayAttendance.checkIn) {
      return <>Checked in at <span className="font-mono text-base">{todayAttendance.checkIn}</span></>;
    }
    if (todayAttendance.status === 'Present' && todayAttendance.checkOut) {
      return <>Checked out at <span className="font-mono text-base">{todayAttendance.checkOut}</span></>;
    }
    if (todayAttendance.status === 'Late' && todayAttendance.checkIn) {
      return <>Late check-in at <span className="font-mono text-base">{todayAttendance.checkIn}</span></>;
    }
    return 'Not checked in';
  };

  const attendanceDetailText = () => {
    if (todayAttendance.status === 'Not Checked In') {
      return 'Standard shift cutoff: 9:15 AM. Check in upon arrival at assigned site or facility.';
    }
    if (todayAttendance.status === 'Checked In' || todayAttendance.status === 'Late') {
      return 'Shift currently active. Record your check-out when daily field assignments are completed.';
    }
    return 'Shift completed for today. Total working hours recorded and synced with Admin Payroll.';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-echo-fade">
      {/* Greeting */}
      <header className="mb-10">
        <p className="ed-label mb-4">Wednesday · 23 September 2026</p>
        <h1 className="ed-h1">
          {greeting}, {currentEmployee.name.split(' ')[0]}.
        </h1>
        <p className="ed-sub mt-3 max-w-xl">{t('hereIsToday')}</p>
      </header>

      {/* Today's Attendance — hero card */}
      <section className="mb-8">
        <div className="echo-card echo-card--pad lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="echo-section-head">
                <span className="ed-label">{t('todayAttendance')}</span>
                <span className="echo-rule" />
                <span className="ed-mono">23 Sep 2026</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] leading-snug text-[var(--echo-ink)]">
                {attendanceStatusLabel()}
              </h2>

              <p className="ed-sub mt-3 max-w-lg">{attendanceDetailText()}</p>
            </div>

            <div className="shrink-0 flex flex-col items-start lg:items-end gap-3">
              {todayAttendance.status === 'Not Checked In' ? (
                <button onClick={handleCheckIn} className="ed-btn">
                  <Clock className="w-4 h-4" />
                  <span>{t('checkIn')}</span>
                </button>
              ) : todayAttendance.status === 'Checked In' || todayAttendance.status === 'Late' ? (
                canCheckOut ? (
                  <>
                    <button onClick={() => handleCheckOut()} className="ed-btn">
                      <Clock className="w-4 h-4" />
                      <span>{t('checkOut')}</span>
                    </button>
                    <span className="ed-mono">
                      {regularTasksCompletedToday} / {regularTasksTotalToday} Regular Tasks · Available
                    </span>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleCheckOut()}
                      disabled
                      className="ed-btn"
                      title="Complete all required tasks before checking out."
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>{t('checkOut')} — Locked</span>
                    </button>
                    <span className="ed-mono inline-flex items-center gap-1.5">
                      <Lock className="w-3 h-3" />
                      {regularTasksCompletedToday} / {regularTasksTotalToday} Regular Tasks · Complete all required tasks
                    </span>
                  </>
                )
              ) : (
                <div className="ed-tag">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Shift Complete · 8h 52m</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Today's Regular Tasks */}
      <section className="pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="ed-h2">{t('todayRegularTasks')}</h2>
            <p className="ed-sub mt-1">
              Recurring operational checklists scheduled for today ({scheduledTodayTasks.length} items)
            </p>
          </div>
          <div className="echo-segment">
            <span className="echo-segment-item" data-active="true">
              {scheduledTodayTasks.filter((x) => x.status === 'Completed').length} /{' '}
              {scheduledTodayTasks.length} Completed
            </span>
          </div>
        </div>

        <div className="echo-card divide-y divide-[var(--echo-border)] overflow-hidden">
          {scheduledTodayTasks.map((task, index) => {
            const isCompleted = task.status === 'Completed';
            const isInProgress = task.status === 'In Progress';

            return (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-5 transition-colors hover:bg-[var(--echo-surface-2)]"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <span
                    className={`echo-icon-tile shrink-0 ${
                      isCompleted
                        ? 'echo-icon-tile--positive'
                        : isInProgress
                        ? 'echo-icon-tile--accent'
                        : ''
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="font-mono text-[11px] tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                  </span>

                  <div className="min-w-0">
                    <h3
                      className={`text-[15px] font-medium leading-snug ${
                        isCompleted
                          ? 'line-through text-[var(--echo-ink-3)]'
                          : 'text-[var(--echo-ink)]'
                      }`}
                    >
                      {task.title}
                    </h3>

                    <div className="ed-mono mt-1.5 flex flex-wrap items-center gap-2">
                      <span>Scheduled {task.scheduledTime}</span>
                      <span aria-hidden>·</span>
                      <span className="capitalize">{task.frequency}</span>
                      <span aria-hidden>·</span>
                      <span>
                        {isCompleted
                          ? `Completed at ${task.completedAt || '9:45 AM'}`
                          : isInProgress
                          ? 'In Progress'
                          : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 sm:self-center">
                  {isCompleted ? (
                    <span className="ed-tag">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t('completed')}
                    </span>
                  ) : isInProgress ? (
                    <button onClick={() => completeRegularTask(task.id)} className="ed-btn">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('completeTask')}</span>
                    </button>
                  ) : (
                    <button onClick={() => startRegularTask(task.id)} className="ed-btn-ghost">
                      <PlayCircle className="w-4 h-4" />
                      <span>{t('startTask')}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Assigned Work */}
      <section className="pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="ed-h2">Assigned Work</h2>
            <p className="ed-sub mt-1">
              New client field tasks requiring evidence submission &amp; verification
            </p>
          </div>

          <button
            onClick={() => setActiveTab('new-task')}
            className="ed-link shrink-0"
          >
            <span>View All ({assignedTasks.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="echo-card divide-y divide-[var(--echo-border)] overflow-hidden">
          {pendingAssignedTasks.slice(0, 4).map((task) => (
            <div
              key={task.id}
              onClick={() => {
                setSelectedTaskId(task.id);
                setActiveTab('task-detail');
              }}
              className="flex items-center justify-between gap-4 p-4 sm:px-5 cursor-pointer transition-colors hover:bg-[var(--echo-surface-2)] group"
            >
              <div className="flex items-start gap-4 min-w-0">
                <span className="echo-icon-tile shrink-0 font-mono text-[11px] tabular-nums">
                  {task.taskNumber}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-medium text-[var(--echo-ink)] leading-snug truncate">
                    {task.taskTitle}
                  </h3>
                  <p className="ed-mono mt-1.5 truncate">
                    {task.clientName} · {task.scheduledDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <StatusChip status={task.status} />
                <span className="text-[var(--echo-ink-3)] group-hover:text-[var(--echo-accent)] transition-colors">
                  <ArrowRight className="w-4 h-4" />
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