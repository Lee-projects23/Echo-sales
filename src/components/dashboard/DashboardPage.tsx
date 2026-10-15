import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ListChecks,
  Receipt,
  Timer,
  CalendarCheck,
  Activity as ActivityIcon,
  CalendarDays,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { StatusChip, statusTone } from '../common/StatusChip';
import type { ChipTone } from '../common/StatusChip';
import { AssignedTask, AttendanceRecord } from '../../types';

/* ------------------------------------------------------------------ */
/* Helpers — every figure below derives from real portal records.      */
/* ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, '0');

const parseHours = (s: string | null): number => {
  if (!s) return 0;
  const m = s.match(/(\d+)h\s*(\d*)m?/);
  if (!m) return 0;
  return parseInt(m[1], 10) + (m[2] ? parseInt(m[2], 10) / 60 : 0);
};

const formatHoursFloat = (v: number): string => {
  const h = Math.floor(v);
  const mins = Math.round((v - h) * 60);
  return `${h}h ${pad(mins)}m`;
};

const dateKeyOf = (d: Date) =>
  `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

/** Parse a YYYY-MM-DD key as a UTC instant so weekday/date labels never
    drift with the viewer's timezone offset. */
const utcDate = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

const shiftDay = (key: string, delta: number) => {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return dateKeyOf(dt);
};

const MONTHS_PER_YEAR = 12;
const monthIndex = (key: string) => {
  const [y, m] = key.split('-').map(Number);
  return y * MONTHS_PER_YEAR + m;
};
const shiftMonth = (key: string, delta: number) => {
  const [y, m] = key.split('-').map(Number);
  const total = y * MONTHS_PER_YEAR + (m - 1) + delta;
  const ny = Math.floor(total / MONTHS_PER_YEAR);
  const nm = (total % MONTHS_PER_YEAR) + 1;
  return `${ny}-${pad(nm)}`;
};
const monthLabel = (key: string) => {
  const [y, m] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
};
const shortDay = (key: string) =>
  utcDate(key).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
const longDay = (key: string) =>
  utcDate(key).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

const isPresentStatus = (s: AttendanceRecord['status']) =>
  s === 'Present' || s === 'Checked In' || s === 'Checked Out';

/** Count how many mandatory checklist items a task has satisfied. */
const submissionProgress = (task: AssignedTask) => {
  const { requiredChecklist: req, submissions: sub } = task;
  const items: { on: boolean; done: boolean }[] = [
    { on: req.beforeAfterPhotos, done: !!sub.beforePhoto && !!sub.afterPhoto },
    { on: req.voiceReply, done: !!sub.voiceNoteUrl },
    { on: req.fourPhotosOneVideo, done: sub.photos.length === 4 && !!sub.video },
    { on: req.signature, done: !!sub.signatureName && !!sub.confirmedSignature },
    { on: req.markRating, done: !!sub.markRating && sub.markRating > 0 },
  ];
  return {
    met: items.filter((i) => i.on && i.done).length,
    required: items.filter((i) => i.on).length,
  };
};

type Period = 'today' | 'week' | 'month';
const PERIODS: { key: Period; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

/** Palette for console-scoped status text. */
const TONE_COLOR: Record<ChipTone, string> = {
  positive: 'var(--echo-console-positive)',
  warning: 'var(--echo-console-warning)',
  danger: 'var(--echo-console-danger)',
  accent: 'var(--echo-console-accent)',
  info: 'var(--echo-console-ink-2)',
  neutral: 'var(--echo-console-ink)',
};

type DayState = 'present' | 'late' | 'absent' | 'pending' | 'weekend' | 'none' | 'future';

const dayStateLabel: Record<DayState, string> = {
  present: 'Present',
  late: 'Late',
  absent: 'Absent',
  pending: 'Not checked in',
  weekend: 'No record (weekend)',
  none: 'No record',
  future: 'Upcoming date',
};

/* ------------------------------------------------------------------ */
/* Attendance calendar                                                 */
/* ------------------------------------------------------------------ */

interface CalendarProps {
  monthKey: string;
  minMonthKey: string;
  maxMonthKey: string;
  onMonthChange: (next: string) => void;
  records: Map<string, AttendanceRecord>;
  todayKey: string;
  selectedKey: string;
  onSelect: (key: string) => void;
}

const AttendanceCalendar: React.FC<CalendarProps> = ({
  monthKey,
  minMonthKey,
  maxMonthKey,
  onMonthChange,
  records,
  todayKey,
  selectedKey,
  onSelect,
}) => {
  const [y, m] = monthKey.split('-').map(Number);
  const firstDay = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(); // 0=Sun
  const offset = (firstDay + 6) % 7; // Monday-first grid
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const canPrev = monthIndex(monthKey) > monthIndex(minMonthKey);
  const canNext = monthIndex(monthKey) < monthIndex(maxMonthKey);

  const cells: { key: string; day: number; state: DayState }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${y}-${pad(m)}-${pad(d)}`;
    const rec = records.get(key);
    const dow = (offset + d - 1) % 7; // 5 = Sat, 6 = Sun (Monday-first)
    const weekend = dow >= 5;
    let state: DayState;
    if (rec) {
      state =
        rec.status === 'Late'
          ? 'late'
          : rec.status === 'Absent'
            ? 'absent'
            : rec.status === 'Not Checked In'
              ? 'pending'
              : 'present';
    } else if (key > todayKey) {
      state = 'future';
    } else {
      state = weekend ? 'weekend' : 'none';
    }
    cells.push({ key, day: d, state });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-3.5 h-3.5" style={{ color: 'var(--echo-console-ink-3)' }} />
          <h3 className="ed-h3">Attendance Calendar</h3>
          <span className="ed-meta">{monthLabel(monthKey)}</span>
        </div>
        <div className="echo-segment">
          <button
            type="button"
            onClick={() => canPrev && onMonthChange(shiftMonth(monthKey, -1))}
            disabled={!canPrev}
            aria-label="Previous month"
            className="echo-icon-tile"
            style={!canPrev ? { color: 'var(--echo-console-ink-3)', cursor: 'not-allowed', opacity: 1 } : undefined}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => canNext && onMonthChange(shiftMonth(monthKey, 1))}
            disabled={!canNext}
            aria-label="Next month"
            className="echo-icon-tile"
            style={!canNext ? { color: 'var(--echo-console-ink-3)', cursor: 'not-allowed', opacity: 1 } : undefined}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="echo-cal-grid mb-2" aria-hidden="true">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="echo-cal-dow">
            {d}
          </div>
        ))}
      </div>

      <div className="echo-cal-grid" role="grid" aria-label={`${monthLabel(monthKey)} attendance`}>
        {Array.from({ length: offset }).map((_, i) => (
          <span key={`blank-${i}`} aria-hidden="true" />
        ))}
        {cells.map((c) => (
          <button
            type="button"
            key={c.key}
            className="echo-cal-cell"
            data-status={c.state}
            data-today={c.key === todayKey ? 'true' : undefined}
            data-selected={c.key === selectedKey ? 'true' : undefined}
            data-static={c.state === 'future' ? 'true' : undefined}
            disabled={c.state === 'future'}
            onClick={() => c.state !== 'future' && onSelect(c.key)}
            aria-label={`${longDay(c.key)} — ${dayStateLabel[c.state]}`}
            aria-pressed={c.key === selectedKey}
            title={dayStateLabel[c.state]}
          >
            <span>{c.day}</span>
            <span className="echo-cal-mark" aria-hidden="true" />
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5">
        {[
          { label: 'Present', color: 'var(--echo-console-positive)' },
          { label: 'Late', color: 'var(--echo-console-warning)' },
          { label: 'Absent', color: 'var(--echo-console-danger)' },
          { label: 'Today', color: 'var(--echo-console-ink)' },
          { label: 'No record', color: 'var(--echo-console-ink-3)' },
          { label: 'Future', color: 'var(--echo-console-ink-3)', dim: true },
        ].map((l) => (
          <span key={l.label} className="ed-meta inline-flex items-center gap-2">
            <span
              className="inline-block w-[7px] h-[7px] rounded-full"
              style={{ background: l.color, opacity: l.dim ? 0.42 : 1 }}
            />
            {l.label}
          </span>
        ))}
        <span className="ed-meta inline-flex items-center gap-2">
          <span
            className="inline-block w-[7px] h-[7px]"
            style={{ boxShadow: 'inset 0 0 0 1px var(--echo-console-ink)' }}
          />
          Selected
        </span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Selected-date readout                                               */
/* ------------------------------------------------------------------ */

const SelectedDatePanel: React.FC<{
  dateKey: string;
  todayKey: string;
  record?: AttendanceRecord;
  onOpenRecord: () => void;
}> = ({ dateKey, todayKey, record, onOpenRecord }) => {
  const isFuture = dateKey > todayKey;
  return (
    <div
      className="echo-cal-readout mt-6 pt-6 flex flex-col md:flex-row md:items-start justify-between gap-6"
      style={{ borderTop: 'var(--echo-rule) solid var(--echo-console-rule)' }}
    >
      <div className="min-w-0">
        <div className="ed-meta">{longDay(dateKey)}</div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {record ? (
            <StatusChip status={record.status} dot />
          ) : (
            <span className="echo-chip">No Record</span>
          )}
        </div>
        <p className="ed-sub mt-3 max-w-md text-[12px]">
          {record
            ? record.checkIn || record.checkOut
              ? `Clocked ${record.checkIn || '—'} → ${record.checkOut || '—'}.`
              : 'Record exists without clock times.'
            : isFuture
              ? 'Upcoming date — no attendance record can exist yet.'
              : 'No attendance record exists for this date. Missing records are not counted as absences.'}
        </p>
      </div>

      <div className="flex items-start gap-8 shrink-0">
        {[
          { k: 'Check In', v: record?.checkIn || '—' },
          { k: 'Check Out', v: record?.checkOut || '—' },
          { k: 'Hours', v: record?.hours || '—' },
        ].map((f) => (
          <div key={f.k}>
            <div className="ed-meta">{f.k}</div>
            <div
              className="mt-2 font-mono text-[14px] font-medium tabular-nums"
              style={{ color: 'var(--echo-console-ink)' }}
            >
              {f.v}
            </div>
          </div>
        ))}
        <button type="button" onClick={onOpenRecord} className="ed-link self-end">
          <span>Full record</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page header helpers                                                 */
/* ------------------------------------------------------------------ */

const SectionHead: React.FC<{ label: string; meta?: string; action?: React.ReactNode }> = ({
  label,
  meta,
  action,
}) => (
  <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mb-7">
    <span className="ed-label">{label}</span>
    {meta && (
      <>
        <span
          className="hidden sm:inline-block h-px w-10 shrink-0 self-center"
          style={{ background: 'var(--echo-console-rule-strong)' }}
        />
        <span className="ed-meta">{meta}</span>
      </>
    )}
    {action && <span className="ml-auto">{action}</span>}
  </div>
);

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export const DashboardPage: React.FC = () => {
  const {
    currentEmployee,
    todayAttendance,
    todayRegularTasks,
    regularTasksCompletedToday,
    regularTasksTotalToday,
    assignedTasks,
    activities,
    attendance,
    vouchers,
    notifications,
    setActiveTab,
    setSelectedTaskId,
    setSelectedActivityId,
    setSelectedVoucherId,
    markNotificationAsRead,
    t,
  } = usePortal();

  const todayKey = todayAttendance.date;
  const todayMonthKey = todayKey.slice(0, 7);

  // ---- Period filter (drives every attendance-derived figure below) ----
  const [period, setPeriod] = useState<Period>('week');
  const periodStartKey =
    period === 'today'
      ? todayKey
      : period === 'week'
        ? shiftDay(todayKey, -6)
        : `${todayMonthKey}-01`;
  const periodLabel = PERIODS.find((p) => p.key === period)!.label;
  const rangeLabel =
    period === 'today'
      ? longDay(todayKey)
      : period === 'week'
        ? `${shortDay(periodStartKey)} – ${shortDay(todayKey)}`
        : monthLabel(todayMonthKey);

  const periodRecords = attendance
    .filter((a) => a.date >= periodStartKey && a.date <= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date));

  // "Not Checked In" is a pending record, never an absence and never a
  // denominator for attendance rates.
  const countedRecords = periodRecords.filter((a) => a.status !== 'Not Checked In');
  const presentDays = countedRecords.filter((a) => isPresentStatus(a.status)).length;
  const lateDays = countedRecords.filter((a) => a.status === 'Late').length;
  const absentDays = countedRecords.filter((a) => a.status === 'Absent').length;
  const attPct =
    countedRecords.length > 0
      ? Math.round(((presentDays + lateDays) / countedRecords.length) * 100)
      : null;

  const hoursRecords = periodRecords.filter((a) => a.hours && a.hours !== '—');
  const totalHoursFloat = hoursRecords.reduce((sum, a) => sum + parseHours(a.hours), 0);
  const avgDaily = hoursRecords.length ? formatHoursFloat(totalHoursFloat / hoursRecords.length) : null;

  // ---- Tasks ----
  const tasksAssigned = assignedTasks.length;
  const tasksApproved = assignedTasks.filter((x) => x.status === 'Approved').length;
  const tasksSubmitted = assignedTasks.filter((x) => x.status === 'Submitted').length;
  const tasksPendingOnly = assignedTasks.filter((x) => x.status === 'Pending').length;
  const tasksInProgress = assignedTasks.filter((x) => x.status === 'In Progress').length;
  const tasksRejected = assignedTasks.filter((x) => x.status === 'Rejected').length;
  const tasksReupload = assignedTasks.filter((x) => x.status === 'Re-upload Requested').length;
  const tasksOpen = tasksPendingOnly + tasksInProgress + tasksReupload;
  const completionRate = Math.round((tasksApproved / Math.max(1, tasksAssigned)) * 100);
  const submittedRate = Math.round(((tasksApproved + tasksSubmitted) / Math.max(1, tasksAssigned)) * 100);

  const regPct = Math.round((regularTasksCompletedToday / Math.max(1, regularTasksTotalToday)) * 100);

  // ---- Vouchers ----
  const vouchersPending = vouchers.filter((v) => v.status === 'Submitted for Admin Review').length;
  const vouchersApproved = vouchers.filter((v) => v.status === 'Approved').length;

  // ---- Calendar state ----
  const recordsByDate = new Map(attendance.map((a) => [a.date, a]));
  const [calMonth, setCalMonth] = useState(todayMonthKey);
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const MIN_MONTH_KEY = '2020-01'; // past months are explorable; empty ones stay honest

  // ---- Working-hours series for the selected period ----
  const hoursSeries = periodRecords.map((a) => ({
    date: a.date,
    dayNum: a.date.slice(8, 10).replace(/^0/, ''),
    value: parseHours(a.hours),
    hoursStr: a.hours && a.hours !== '—' ? a.hours : null,
  }));
  const hoursMax = Math.max(1, ...hoursSeries.map((s) => s.value));
  const showBarNotes = hoursSeries.length <= 10;

  // ---- Task status distribution (all real statuses, with counts) ----
  const taskStatusRows = [
    { label: 'Pending', count: tasksPendingOnly, color: 'var(--echo-console-ink-3)' },
    { label: 'In Progress', count: tasksInProgress, color: 'var(--echo-console-accent)' },
    { label: 'Submitted', count: tasksSubmitted, color: 'var(--echo-console-ink-2)' },
    { label: 'Approved', count: tasksApproved, color: 'var(--echo-console-positive)' },
    { label: 'Rejected', count: tasksRejected, color: 'var(--echo-console-danger)' },
    { label: 'Re-upload Requested', count: tasksReupload, color: 'var(--echo-console-warning)' },
  ];
  const taskStatusMax = Math.max(1, ...taskStatusRows.map((r) => r.count));

  // ---- Headline figures ----
  const todayTone = statusTone(todayAttendance.status);
  const figures: {
    key: string;
    label: string;
    value: string;
    meta: string;
    to: () => void;
    tone?: ChipTone;
  }[] = [
    {
      key: 'today',
      label: "Today's Attendance",
      value: todayAttendance.status,
      meta: todayAttendance.checkIn
        ? `In ${todayAttendance.checkIn}${todayAttendance.checkOut ? ` · Out ${todayAttendance.checkOut}` : ''}`
        : 'Awaiting first check-in',
      tone: todayTone,
      to: () => setActiveTab('attendance'),
    },
    {
      key: 'rate',
      label: `Attendance · ${periodLabel}`,
      value: attPct === null ? '—' : `${attPct}%`,
      meta: countedRecords.length
        ? `${presentDays + lateDays} of ${countedRecords.length} recorded days on time`
        : 'No recorded days in period',
      to: () => setActiveTab('attendance'),
    },
    {
      key: 'hours',
      label: `Working Hours · ${periodLabel}`,
      value: hoursRecords.length ? formatHoursFloat(totalHoursFloat) : '—',
      meta: avgDaily ? `average ${avgDaily} per day` : 'No hours recorded in period',
      to: () => setActiveTab('attendance'),
    },
    {
      key: 'approved',
      label: 'Tasks Approved',
      value: `${tasksApproved}/${tasksAssigned}`,
      meta: `${tasksSubmitted} awaiting review`,
      to: () => setActiveTab('new-task'),
    },
    {
      key: 'completion',
      label: 'Completion Rate',
      value: `${completionRate}%`,
      meta: `${tasksOpen} open · ${tasksReupload} re-upload`,
      to: () => setActiveTab('new-task'),
    },
    {
      key: 'vouchers',
      label: 'Vouchers',
      value: String(vouchers.length),
      meta: `${vouchersPending} pending · ${vouchersApproved} approved`,
      to: () => setActiveTab('voucher-creation'),
    },
  ];

  // ---- Rows ----
  const submissionRows = assignedTasks.map((task) => {
    const { met, required } = submissionProgress(task);
    return {
      id: task.id,
      taskNumber: task.taskNumber,
      title: task.taskTitle,
      clientName: task.clientName,
      status: task.status,
      met,
      required,
      pct: required > 0 ? Math.round((met / required) * 100) : 0,
    };
  });

  const deadlineRows = [...assignedTasks]
    .filter((x) => x.status !== 'Approved' && x.status !== 'Rejected')
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
    .slice(0, 5);

  const openTask = (id: string) => {
    setSelectedTaskId(id);
    setActiveTab('task-detail');
  };

  const openNotification = (n: (typeof notifications)[number]) => {
    markNotificationAsRead(n.id);
    if (n.targetPage) {
      if (n.targetPage === 'new-task' && n.targetId) {
        setSelectedTaskId(n.targetId);
        setActiveTab('task-detail');
      } else if (n.targetPage === 'new-activity' && n.targetId) {
        setSelectedActivityId(n.targetId);
        setActiveTab('activity-detail');
      } else if (n.targetPage === 'voucher-creation' && n.targetId) {
        setSelectedVoucherId(n.targetId);
        setActiveTab('voucher-detail');
      } else {
        setActiveTab(n.targetPage);
      }
    }
  };

  const selectDate = (key: string) => {
    setSelectedDate(key);
    setCalMonth(key.slice(0, 7));
  };

  const selectedRecord = recordsByDate.get(selectedDate);

  return (
    <div className="animate-echo-fade">
      {/* ================= Masthead ================= */}
      <section className="em-section pt-14 sm:pt-20 pb-12">
        <GlobalBackButton />
        <div className="mt-7 em-split items-end">
          <div className="em-split-lead">
            <p className="ed-label mb-7">Personal Record</p>
            <h1 className="ed-h1">{t('dashboard')}</h1>
          </div>
          <div className="em-split-side flex flex-col items-start lg:items-end gap-5">
            <div className="lg:text-right">
              <div className="text-[15px] font-bold tracking-[-0.01em] text-[var(--echo-ink)]">
                {currentEmployee.name}
              </div>
              <div className="ed-meta mt-2">
                {currentEmployee.employeeCode} · {currentEmployee.designation}
              </div>
              <div className="ed-meta mt-1.5">{currentEmployee.department}</div>
            </div>
            <button type="button" onClick={() => setActiveTab('new-task')} className="ed-link">
              <span>Go to Assigned Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= Analytics console ================= */}
      <section className="em-section pb-14">
        <div className="echo-console p-5 sm:p-8">
          {/* Console header + period filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-7 mb-7" style={{ borderBottom: 'var(--echo-rule) solid var(--echo-console-rule)' }}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="ed-label">Operations Console</span>
              <span className="w-10 h-px shrink-0" style={{ background: 'var(--echo-console-rule-strong)' }} />
              <span className="ed-meta">{rangeLabel}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="echo-chip echo-chip--accent">Synced with Admin Monitor</span>
              <div className="echo-segment" role="group" aria-label="Dashboard period">
                {PERIODS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    className="echo-segment-item"
                    data-active={period === p.key ? 'true' : 'false'}
                    aria-pressed={period === p.key}
                    onClick={() => setPeriod(p.key)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* KPI strip — large figures separated by hairlines */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px" style={{ background: 'var(--echo-console-rule)' }}>
            {figures.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={f.to}
                className="text-left px-4 sm:px-5 py-6 transition-colors cursor-pointer"
                style={{ background: 'var(--echo-console-bg)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--echo-console-surface)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--echo-console-bg)';
                }}
              >
                <div className="echo-kpi-label">{f.label}</div>
                <div
                  className={`mt-5 ${
                    f.value.length > 6
                      ? 'text-[clamp(1rem,1.7vw,1.3rem)] font-bold tracking-[-0.01em]'
                      : 'font-serif text-[clamp(2.25rem,4vw,3.25rem)] leading-[0.88] tracking-[-0.03em] tabular-nums'
                  }`}
                  style={{ color: f.tone ? TONE_COLOR[f.tone] : 'var(--echo-console-ink)' }}
                >
                  {f.value}
                </div>
                <div className="ed-meta mt-4 leading-relaxed">{f.meta}</div>
              </button>
            ))}
          </div>

          {/* Row 1 — calendar + task status */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12 pt-9 mt-9" style={{ borderTop: 'var(--echo-rule) solid var(--echo-console-rule)' }}>
            <div className="lg:col-span-8 min-w-0">
              <AttendanceCalendar
                monthKey={calMonth}
                minMonthKey={MIN_MONTH_KEY}
                maxMonthKey={todayMonthKey}
                onMonthChange={setCalMonth}
                records={recordsByDate}
                todayKey={todayKey}
                selectedKey={selectedDate}
                onSelect={setSelectedDate}
              />
              <SelectedDatePanel
                dateKey={selectedDate}
                todayKey={todayKey}
                record={selectedRecord}
                onOpenRecord={() => setActiveTab('attendance')}
              />
            </div>

            <div className="lg:col-span-4 min-w-0">
              <SectionHead label="Task Status" meta={`${tasksAssigned} assigned tasks`} />
              <button
                type="button"
                onClick={() => setActiveTab('new-task')}
                className="w-full text-left group"
                aria-label="Open assigned tasks"
              >
                <div className="space-y-5">
                  {taskStatusRows.map((r) => (
                    <div key={r.label} className="transition-colors">
                      <div className="flex items-baseline justify-between gap-4 mb-2">
                        <span className="text-[12px] font-medium" style={{ color: 'var(--echo-console-ink-2)' }}>
                          {r.label}
                        </span>
                        <span
                          className="font-mono text-[13px] font-bold tabular-nums"
                          style={{ color: r.count > 0 ? r.color : 'var(--echo-console-ink-3)' }}
                        >
                          {r.count}
                        </span>
                      </div>
                      <div className="h-[3px] w-full" style={{ background: 'var(--echo-console-surface-2)' }}>
                        <div
                          className="h-full transition-[width] duration-700"
                          style={{
                            width: `${(r.count / taskStatusMax) * 100}%`,
                            background: r.count > 0 ? r.color : 'transparent',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </button>
              <div className="mt-7 pt-5 flex items-center justify-between gap-4" style={{ borderTop: 'var(--echo-rule) solid var(--echo-console-rule)' }}>
                <span className="ed-meta">Submitted or approved</span>
                <span className="font-mono text-[13px] font-bold tabular-nums" style={{ color: 'var(--echo-console-positive)' }}>
                  {submittedRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Row 2 — working hours + attendance summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12 pt-9 mt-9" style={{ borderTop: 'var(--echo-rule) solid var(--echo-console-rule)' }}>
            <div className="lg:col-span-8 min-w-0">
              <SectionHead
                label="Working Hours"
                meta={`${periodLabel} · total ${hoursRecords.length ? formatHoursFloat(totalHoursFloat) : '—'}${avgDaily ? ` · average ${avgDaily} per day` : ''}`}
              />
              {hoursSeries.length === 0 ? (
                <p className="ed-sub py-10">No working hours recorded for this period.</p>
              ) : (
                <div>
                  <div className="flex items-end gap-3 sm:gap-5" style={{ borderBottom: 'var(--echo-rule) solid var(--echo-console-rule-strong)' }}>
                    {hoursSeries.map((s) => (
                      <div
                        key={s.date}
                        className="flex-1 min-w-0 flex flex-col items-center justify-end cursor-pointer group"
                        onClick={() => selectDate(s.date)}
                        title={`${longDay(s.date)} — ${s.hoursStr ? `${s.hoursStr} worked` : 'no hours recorded'}`}
                      >
                        <span className="font-mono text-[11px] tabular-nums mb-2.5 transition-colors" style={{ color: 'var(--echo-console-ink-2)' }}>
                          {showBarNotes ? (s.hoursStr || '—') : ''}
                        </span>
                        <div className="w-full h-28 sm:h-36 flex items-end">
                          <div
                            className="w-full transition-[height] duration-700 group-hover:opacity-80"
                            style={{
                              height: `${Math.max(s.value > 0 ? 6 : 2, (s.value / hoursMax) * 100)}%`,
                              background:
                                s.value > 0 ? 'var(--echo-console-accent)' : 'var(--echo-console-neutral)',
                            }}
                          />
                        </div>
                        <span className="ed-meta mt-3">{s.dayNum}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
                    <span className="ed-meta">Day of month</span>
                    <span className="ed-meta">Click a bar to inspect that date</span>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 min-w-0">
              <SectionHead label="Attendance Summary" meta={`${periodLabel} · ${rangeLabel}`} />
              {countedRecords.length === 0 ? (
                <p className="ed-sub py-6">
                  No counted attendance records for this period. Pending or missing records are
                  never counted as absences.
                </p>
              ) : (
                <dl>
                  {[
                    { k: 'Present days', v: String(presentDays) },
                    { k: 'Absent days', v: String(absentDays) },
                    { k: 'Late arrivals', v: String(lateDays) },
                    { k: 'Attendance', v: `${attPct}%` },
                    { k: 'Working hours', v: hoursRecords.length ? formatHoursFloat(totalHoursFloat) : '—' },
                    { k: 'Average daily hours', v: avgDaily || '—' },
                  ].map((row) => (
                    <div
                      key={row.k}
                      className="flex items-baseline justify-between gap-4 py-3.5"
                      style={{ borderBottom: 'var(--echo-rule) solid var(--echo-console-rule)' }}
                    >
                      <dt className="ed-meta">{row.k}</dt>
                      <dd className="font-mono text-[13px] font-bold tabular-nums" style={{ color: 'var(--echo-console-ink)' }}>
                        {row.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              <button type="button" onClick={() => setActiveTab('attendance')} className="ed-link mt-6">
                <span>Open attendance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Today's tasks + submission progress ================= */}
      <section
        className="em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="em-split">
          <div className="em-split-lead">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
              <SectionHead label="Today's Regular Tasks" meta={`${regularTasksTotalToday} scheduled`} />
              <span className="echo-chip">
                {regularTasksCompletedToday} / {regularTasksTotalToday} completed
              </span>
            </div>

            {todayRegularTasks.length === 0 ? (
              <p className="ed-sub py-10">No regular tasks scheduled for today.</p>
            ) : (
              <>
                <ul>
                  {todayRegularTasks.map((task, index) => (
                    <li key={task.id}>
                      <button
                        type="button"
                        onClick={() => setActiveTab('home')}
                        title="Open regular tasks on Home"
                        className="w-full text-left flex items-center justify-between gap-5 py-5 cursor-pointer transition-colors hover:bg-[var(--echo-surface-2)]"
                        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
                      >
                        <span className="flex items-center gap-5 min-w-0">
                          <span className="font-mono text-[11px] shrink-0 text-[var(--echo-ink-3)]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="min-w-0 block">
                            <span
                              className={`block text-[14px] truncate ${
                                task.status === 'Completed'
                                  ? 'line-through text-[var(--echo-ink-3)]'
                                  : 'font-medium text-[var(--echo-ink)]'
                              }`}
                            >
                              {task.title}
                            </span>
                            <span className="ed-meta mt-2 block">
                              {task.scheduledTime} · <span className="capitalize">{task.frequency}</span>
                            </span>
                          </span>
                        </span>
                        <StatusChip status={task.status} className="shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center gap-5">
                  <div className="echo-progress flex-1">
                    <div className="echo-progress-bar" style={{ width: `${regPct}%` }} />
                  </div>
                  <span className="font-mono text-[12px] font-bold tabular-nums">{regPct}%</span>
                </div>
              </>
            )}
          </div>

          <div className="em-split-side">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
              <SectionHead label="Task Submission Progress" meta="Live checklist state" />
              <span className="echo-chip echo-chip--accent">{submittedRate}% filed</span>
            </div>

            {submissionRows.length === 0 ? (
              <p className="ed-sub py-10">No assigned tasks awaiting evidence.</p>
            ) : (
              <ul>
                {submissionRows.map((row) => (
                  <li key={row.id}>
                    <button
                      type="button"
                      onClick={() => openTask(row.id)}
                      className="w-full text-left flex items-center justify-between gap-5 py-5 cursor-pointer transition-colors hover:bg-[var(--echo-surface-2)]"
                      style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
                    >
                      <span className="min-w-0 flex-1 block">
                        <span className="flex items-center gap-3">
                          <span className="ed-meta shrink-0">#{row.taskNumber}</span>
                          <span className="text-[14px] font-medium text-[var(--echo-ink)] truncate">
                            {row.title}
                          </span>
                        </span>
                        <span className="mt-4 flex items-center gap-4">
                          <span className="echo-progress flex-1">
                            <span
                              className={`echo-progress-bar ${
                                row.pct === 100 ? 'echo-progress-bar--positive' : ''
                              }`}
                              style={{ width: `${row.pct}%` }}
                            />
                          </span>
                          <span className="ed-meta shrink-0 tabular-nums">
                            {row.met}/{row.required}
                          </span>
                        </span>
                        <span className="ed-meta mt-3 block truncate">{row.clientName}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ================= Deadlines + recent activity ================= */}
      <section
        className="em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)', background: 'var(--echo-bg-2)' }}
      >
        <div className="em-split">
          <div className="em-split-lead">
            <SectionHead label="Upcoming Deadlines" meta="Outstanding work orders" />
            {deadlineRows.length === 0 ? (
              <p className="ed-sub py-10">Nothing outstanding — all assigned tasks are resolved.</p>
            ) : (
              <ul>
                {deadlineRows.map((task) => (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => openTask(task.id)}
                      className="w-full text-left flex items-center justify-between gap-5 py-6 cursor-pointer transition-colors hover:bg-[var(--echo-surface)]"
                      style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
                    >
                      <span className="flex items-start gap-5 min-w-0">
                        <span className="font-mono text-[11px] shrink-0 pt-1.5 text-[var(--echo-accent)]">
                          {String(task.taskNumber).padStart(2, '0')}
                        </span>
                        <span className="min-w-0 block">
                          <span className="block text-[15px] font-medium text-[var(--echo-ink)] truncate">
                            {task.taskTitle}
                          </span>
                          <span className="ed-meta mt-2.5 block truncate">
                            {task.clientName} · Due {task.scheduledDate}, {task.scheduledTime}
                          </span>
                        </span>
                      </span>
                      <StatusChip status={task.status} className="shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="em-split-side">
            <SectionHead label="Recent Activity" meta={`${notifications.length} events`} />
            {notifications.length === 0 ? (
              <p className="ed-sub py-10">No activity recorded yet.</p>
            ) : (
              <ul>
                {notifications.slice(0, 6).map((act) => (
                  <li key={act.id}>
                    <button
                      type="button"
                      onClick={() => openNotification(act)}
                      className="w-full text-left flex items-start gap-4 py-5 cursor-pointer transition-colors hover:bg-[var(--echo-surface)]"
                      style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                        style={{
                          background: act.read ? 'var(--echo-border-strong)' : 'var(--echo-accent)',
                        }}
                      />
                      <span className="min-w-0 flex-1 block">
                        <span className="flex items-baseline justify-between gap-3">
                          <span
                            className={`text-[13px] truncate ${
                              act.read ? 'font-medium text-[var(--echo-ink-2)]' : 'font-bold text-[var(--echo-ink)]'
                            }`}
                          >
                            {act.title}
                          </span>
                          <span className="ed-meta shrink-0">{act.timestamp}</span>
                        </span>
                        <span className="ed-sub mt-2 text-[12px] line-clamp-2 block">{act.message}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ================= Module breakdown — ruled ledger ================= */}
      <section
        className="em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <SectionHead label="Detailed Metrics" meta="Breakdown by module" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-14 gap-y-12">
          {[
            {
              title: 'Regular Tasks',
              icon: <ListChecks className="w-3.5 h-3.5" />,
              rows: [
                ['Completed', String(regularTasksCompletedToday)],
                ['Scheduled', String(regularTasksTotalToday)],
                ['Completion', `${regPct}%`],
              ],
              to: () => setActiveTab('home'),
            },
            {
              title: 'Assigned Tasks',
              icon: <CheckCircle2 className="w-3.5 h-3.5" />,
              rows: [
                ['Assigned', String(tasksAssigned)],
                ['Approved', String(tasksApproved)],
                ['Awaiting review', String(tasksSubmitted)],
              ],
              to: () => setActiveTab('new-task'),
            },
            {
              title: 'Activities',
              icon: <ActivityIcon className="w-3.5 h-3.5" />,
              rows: [
                ['Assigned', String(activities.length)],
                ['Resolved', String(activities.filter((a) => a.status === 'Work Completed' || a.status === 'Resolved' || a.status === 'Closed').length)],
                ['Open', String(activities.filter((a) => a.status === 'Raised' || a.status === 'In Progress' || a.status === 'Awaiting Admin Verification').length)],
              ],
              to: () => setActiveTab('home'),
            },
            {
              title: 'Attendance',
              icon: <CalendarCheck className="w-3.5 h-3.5" />,
              rows: [
                ['Present days', String(presentDays)],
                ['Late days', String(lateDays)],
                ['Absent days', String(absentDays)],
              ],
              to: () => setActiveTab('attendance'),
            },
            {
              title: 'Working Hours',
              icon: <Timer className="w-3.5 h-3.5" />,
              rows: [
                ['Total hours', hoursRecords.length ? formatHoursFloat(totalHoursFloat) : '—'],
                ['Average daily', avgDaily || '—'],
                ['Days logged', String(hoursRecords.length)],
              ],
              to: () => setActiveTab('attendance'),
            },
            {
              title: 'Vouchers',
              icon: <Receipt className="w-3.5 h-3.5" />,
              rows: [
                ['Filed', String(vouchers.length)],
                ['Pending', String(vouchersPending)],
                ['Approved', String(vouchersApproved)],
              ],
              to: () => setActiveTab('voucher-creation'),
            },
          ].map((group) => (
            <button key={group.title} type="button" onClick={group.to} className="text-left group cursor-pointer">
              <div
                className="flex items-center justify-between gap-3 pb-5 mb-1"
                style={{ borderBottom: 'var(--echo-rule) solid var(--echo-ink)' }}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-[var(--echo-ink-3)]">{group.icon}</span>
                  <span className="ed-h3">{group.title}</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--echo-ink-3)] opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <dl>
                {group.rows.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 py-3.5"
                    style={{ borderBottom: 'var(--echo-rule) solid var(--echo-border)' }}
                  >
                    <dt className="ed-meta">{k}</dt>
                    <dd className="font-mono text-[13px] font-medium tabular-nums text-[var(--echo-ink)]">{v}</dd>
                  </div>
                ))}
              </dl>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
