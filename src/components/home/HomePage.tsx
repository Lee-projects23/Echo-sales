import React from 'react';
import {
  Clock,
  CheckCircle2,
  PlayCircle,
  ArrowRight,
  ShieldAlert,
  Lock,
  ArrowDown,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { StatusChip } from '../common/StatusChip';

export const HomePage: React.FC = () => {
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

  const scheduledTodayTasks = regularTasks.filter((task) => {
    if (task.frequency === 'daily') return true;
    if (task.frequency === 'weekly' && task.scheduledDays?.includes(3)) return true;
    if (task.frequency === 'monthly' && task.scheduledDates?.includes(23)) return true;
    return false;
  });

  const pendingAssignedTasks = assignedTasks.filter(
    (x) => x.status === 'Pending' || x.status === 'In Progress' || x.status === 'Re-upload Requested'
  );

  const attendanceStatusLabel = () => {
    if (todayAttendance.status === 'Checked In' && todayAttendance.checkIn) {
      return <>Checked in at <span className="font-mono">{todayAttendance.checkIn}</span></>;
    }
    if (todayAttendance.status === 'Present' && todayAttendance.checkOut) {
      return <>Checked out at <span className="font-mono">{todayAttendance.checkOut}</span></>;
    }
    if (todayAttendance.status === 'Late' && todayAttendance.checkIn) {
      return <>Late check-in at <span className="font-mono">{todayAttendance.checkIn}</span></>;
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
    <div className="animate-echo-fade">
      {/* ================= Editorial masthead ================= */}
      <section className="em-section pt-14 sm:pt-20 pb-12">
        <p className="ed-label mb-7">Wednesday · 23 September 2026</p>

        <div className="em-split items-end">
          <div className="em-split-lead">
            <h1 className="ed-h1">
              {greeting},
              <br />
              <span style={{ color: 'var(--echo-accent)' }}>
                {currentEmployee.name.split(' ')[0]}.
              </span>
            </h1>
          </div>
          <div className="em-split-side">
            <p className="ed-sub max-w-sm text-[14px]">
              {t('hereIsToday')} A single record of what is scheduled, what is outstanding, and
              what has been submitted for review.
            </p>
            <div className="mt-7 flex items-center gap-4">
              <span className="ed-meta">{currentEmployee.employeeCode}</span>
              <span className="w-8 h-px" style={{ background: 'var(--echo-border-strong)' }} />
              <span className="ed-meta">{currentEmployee.department}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Today's attendance — hero band ================= */}
      <section
        className="em-invert em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="em-split items-end">
          <div className="em-split-lead">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="ed-label">{t('todayAttendance')}</span>
              <span className="w-10 h-px" style={{ background: 'var(--echo-invert-rule-strong)' }} />
              <span className="ed-meta">23 Sep 2026</span>
            </div>

            <h2 className="font-serif text-[clamp(2.25rem,6vw,4.25rem)] leading-[0.95] tracking-[-0.025em]">
              {attendanceStatusLabel()}
            </h2>

            <p
              className="mt-8 max-w-lg text-[14px] leading-relaxed"
              style={{ color: 'var(--echo-invert-ink-2)' }}
            >
              {attendanceDetailText()}
            </p>
          </div>

          <div className="em-split-side">
            {/* Primary attendance control */}
            {todayAttendance.status === 'Not Checked In' ? (
              <button onClick={handleCheckIn} className="ed-btn w-full sm:w-auto !py-4">
                <Clock className="w-4 h-4" />
                <span>{t('checkIn')}</span>
              </button>
            ) : todayAttendance.status === 'Checked In' || todayAttendance.status === 'Late' ? (
              canCheckOut ? (
                <div className="space-y-5">
                  <button onClick={() => handleCheckOut()} className="ed-btn w-full sm:w-auto !py-4">
                    <Clock className="w-4 h-4" />
                    <span>{t('checkOut')}</span>
                  </button>
                  <p className="ed-meta">
                    {regularTasksCompletedToday} / {regularTasksTotalToday} Regular Tasks · Available
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <button
                    onClick={() => handleCheckOut()}
                    disabled
                    className="ed-btn w-full sm:w-auto !py-4"
                    title="Complete all required tasks before checking out."
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>{t('checkOut')} — Locked</span>
                  </button>
                  <p className="ed-meta inline-flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    {regularTasksCompletedToday} / {regularTasksTotalToday} Regular Tasks · Complete all
                    required tasks
                  </p>
                </div>
              )
            ) : (
              <div className="echo-chip echo-chip--positive !py-2 !px-4">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Shift Complete · 8h 52m</span>
              </div>
            )}

            {/* Live status readout */}
            <dl
              className="mt-10 grid grid-cols-3 gap-6 pt-8"
              style={{ borderTop: 'var(--echo-rule) solid var(--echo-invert-rule)' }}
            >
              {[
                { k: 'Status', v: todayAttendance.status },
                { k: 'Check In', v: todayAttendance.checkIn || '—' },
                { k: 'Check Out', v: todayAttendance.checkOut || '—' },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="ed-meta">{item.k}</dt>
                  <dd
                    className="mt-2.5 text-[15px] font-bold tracking-[-0.01em]"
                    style={{ color: 'var(--echo-invert-ink)' }}
                  >
                    {item.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ================= Today's regular tasks ================= */}
      <section className="em-section py-14 sm:py-20" style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <span className="ed-label">Recurring Checklist</span>
            <h2 className="ed-h2 mt-4">{t('todayRegularTasks')}</h2>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-[clamp(2.5rem,6vw,4rem)] leading-none tracking-[-0.03em] tabular-nums text-[var(--echo-ink)]">
              {regularTasksCompletedToday}
              <span className="text-[var(--echo-ink-3)]">/{regularTasksTotalToday}</span>
            </span>
            <span className="ed-meta">Completed</span>
          </div>
        </div>

        {/* Thin progress rule instead of a boxed progress card */}
        <div className="echo-progress mb-10">
          <div
            className="echo-progress-bar"
            style={{
              width: `${(regularTasksCompletedToday / Math.max(1, regularTasksTotalToday)) * 100}%`,
            }}
          />
        </div>

        {/* Spacious task rows separated by hairlines */}
        <ul>
          {scheduledTodayTasks.map((task, index) => {
            const isCompleted = task.status === 'Completed';
            const isInProgress = task.status === 'In Progress';

            return (
              <li
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 py-7"
                style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
              >
                <div className="flex items-start gap-6 min-w-0">
                  <span
                    className="font-mono text-[11px] tabular-nums shrink-0 pt-2"
                    style={{ color: isCompleted ? 'var(--echo-positive)' : 'var(--echo-ink-3)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h3
                      className={`text-[17px] sm:text-[19px] leading-snug tracking-[-0.015em] ${
                        isCompleted ? 'line-through text-[var(--echo-ink-3)]' : 'text-[var(--echo-ink)]'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <div className="ed-meta mt-3 flex flex-wrap items-center gap-3">
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
                    <span className="echo-chip echo-chip--positive">
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
              </li>
            );
          })}
        </ul>
      </section>

      {/* ================= Assigned work ================= */}
      <section
        className="em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)', background: 'var(--echo-bg-2)' }}
      >
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <span className="ed-label">Client Field Work</span>
            <h2 className="ed-h2 mt-4">Assigned Work</h2>
            <p className="ed-sub mt-4 max-w-md">
              New client field tasks requiring evidence submission &amp; verification.
            </p>
          </div>
          <button onClick={() => setActiveTab('new-task')} className="ed-link">
            <span>View All ({assignedTasks.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <ul>
          {pendingAssignedTasks.slice(0, 4).map((task) => (
            <li key={task.id}>
              <div
                onClick={() => {
                  setSelectedTaskId(task.id);
                  setActiveTab('task-detail');
                }}
                className="group flex items-center justify-between gap-6 py-7 cursor-pointer transition-colors"
                style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
              >
                <div className="flex items-start gap-6 min-w-0">
                  <span
                    className="font-mono text-[11px] tabular-nums shrink-0 pt-2"
                    style={{ color: 'var(--echo-accent)' }}
                  >
                    {String(task.taskNumber).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[17px] sm:text-[19px] leading-snug tracking-[-0.015em] text-[var(--echo-ink)] truncate">
                      {task.taskTitle}
                    </h3>
                    <p className="ed-meta mt-3 truncate">
                      {task.clientName} · {task.scheduledDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 shrink-0">
                  <StatusChip status={task.status} />
                  <span className="text-[var(--echo-ink-3)] group-hover:text-[var(--echo-accent)] transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ================= Cross-links ================= */}
      <section
        className="em-section py-14"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: 'var(--echo-border)' }}>
          {[
            { label: 'Dashboard', desc: 'Metrics & charts', tab: 'dashboard' as const },
            { label: 'Attendance', desc: 'Clock-in & history', tab: 'attendance' as const },
            { label: 'Vouchers', desc: 'Formal requests', tab: 'voucher-creation' as const },
          ].map((link) => (
            <button
              key={link.tab}
              onClick={() => setActiveTab(link.tab)}
              className="group flex items-center justify-between gap-4 px-1 py-7 text-left cursor-pointer transition-colors hover:bg-[var(--echo-surface-2)]"
              style={{ background: 'var(--echo-bg)' }}
            >
              <span>
                <span className="ed-meta block">{link.desc}</span>
                <span className="mt-2.5 block text-[15px] font-bold tracking-[-0.01em] text-[var(--echo-ink)]">
                  {link.label}
                </span>
              </span>
              <ArrowDown className="w-4 h-4 -rotate-90 text-[var(--echo-ink-3)] group-hover:text-[var(--echo-accent)] transition-colors" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
