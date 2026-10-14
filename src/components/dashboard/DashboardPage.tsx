import React from 'react';
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  ListChecks,
  Activity as ActivityIcon,
  CalendarCheck,
  Timer,
  LogIn,
  LogOut,
  Receipt,
  ArrowRight,
  AlertTriangle,
  Target,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { StatusChip } from '../common/StatusChip';

interface BarValue {
  label: string;
  value: number;
  note?: string;
}

/** Slim vertical bar — refined interactive chart primitive. */
const Bars: React.FC<{ data: BarValue[]; tone?: 'accent' | 'neutral' }> = ({
  data,
  tone = 'neutral',
}) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-3 sm:gap-5">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center justify-end min-w-0">
          <span className="font-mono text-[11px] font-medium text-[var(--echo-ink)] tabular-nums mb-2">
            {d.note ? d.note : Math.round(d.value)}
          </span>
          <div className="w-full max-w-[42px] h-28 sm:h-32 flex items-end rounded-t-[4px] bg-[var(--echo-surface-3)] overflow-hidden">
            <div
              className={`echo-bar w-full ${tone === 'accent' ? 'bg-[var(--echo-accent)]' : 'bg-[var(--echo-ink-2)]'}`}
              style={{ height: `${Math.max(3, (d.value / max) * 100)}%` }}
            />
          </div>
          <span className="ed-mono mt-2.5 whitespace-nowrap truncate max-w-full">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

/** Section heading used above every content block. */
const SectionHead: React.FC<{
  label: string;
  meta?: string;
  action?: React.ReactNode;
}> = ({ label, meta, action }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
    <div className="echo-section-head !mb-0">
      <span className="ed-label">{label}</span>
      {meta && (
        <>
          <span className="echo-rule" />
          <span className="ed-mono">{meta}</span>
        </>
      )}
    </div>
    {action}
  </div>
);

/** One metric tile inside a KPI card. */
const MetricTile: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div className="echo-tile">
    <div className="echo-kpi-label">{k}</div>
    <div className="mt-1 font-mono text-[15px] font-medium text-[var(--echo-ink)] tabular-nums">
      {v}
    </div>
  </div>
);

const parseHours = (s: string | null): number => {
  if (!s) return 0;
  const m = s.match(/(\d+)h\s*(\d*)m?/);
  if (!m) return 0;
  return parseInt(m[1], 10) + (m[2] ? parseInt(m[2], 10) / 60 : 0);
};

/** Count how many mandatory checklist items a task has satisfied. */
const submissionProgress = (task: {
  requiredChecklist: {
    beforeAfterPhotos: boolean;
    voiceReply: boolean;
    fourPhotosOneVideo: boolean;
    signature: boolean;
    markRating: boolean;
  };
  submissions: {
    beforePhoto?: string;
    afterPhoto?: string;
    voiceNoteUrl?: string;
    photos: unknown[];
    video?: unknown;
    signatureName?: string;
    confirmedSignature?: boolean;
    markRating?: number;
  };
}) => {
  const { requiredChecklist: req, submissions: sub } = task;
  const items: { on: boolean; done: boolean }[] = [
    { on: req.beforeAfterPhotos, done: !!sub.beforePhoto && !!sub.afterPhoto },
    { on: req.voiceReply, done: !!sub.voiceNoteUrl },
    {
      on: req.fourPhotosOneVideo,
      done: sub.photos.length === 4 && !!sub.video,
    },
    { on: req.signature, done: !!sub.signatureName && !!sub.confirmedSignature },
    { on: req.markRating, done: !!sub.markRating && sub.markRating > 0 },
  ];
  const required = items.filter((i) => i.on).length;
  const met = items.filter((i) => i.on && i.done).length;
  return { met, required };
};

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
    t,
  } = usePortal();

  // ---- Attendance (today) ----
  const attendanceLabel =
    todayAttendance.status === 'Not Checked In'
      ? 'Not Checked In'
      : todayAttendance.status;
  const attendanceDetail =
    todayAttendance.checkIn
      ? `In ${todayAttendance.checkIn}${todayAttendance.checkOut ? ` · Out ${todayAttendance.checkOut}` : ''}`
      : 'Awaiting first check-in';

  // ---- Tasks ----
  const tasksAssigned = assignedTasks.length;
  const tasksApproved = assignedTasks.filter((x) => x.status === 'Approved').length;
  const tasksSubmitted = assignedTasks.filter((x) => x.status === 'Submitted').length;
  const tasksPending = assignedTasks.filter(
    (x) => x.status === 'Pending' || x.status === 'In Progress' || x.status === 'Re-upload Requested'
  ).length;
  const tasksRejected = assignedTasks.filter((x) => x.status === 'Rejected').length;
  const tasksReupload = assignedTasks.filter((x) => x.status === 'Re-upload Requested').length;
  const completionRate = Math.round((tasksApproved / Math.max(1, tasksAssigned)) * 100);
  const submittedRate = Math.round(
    ((tasksApproved + tasksSubmitted) / Math.max(1, tasksAssigned)) * 100
  );

  // ---- Regular tasks ----
  const regCompletedToday = regularTasksCompletedToday;
  const regScheduledToday = regularTasksTotalToday;
  const regMissed = Math.max(0, regScheduledToday - regCompletedToday);
  const regPct = Math.round((regCompletedToday / Math.max(1, regScheduledToday)) * 100);

  // ---- Activities ----
  const actAssigned = activities.length;
  const actCompleted = activities.filter(
    (a) => a.status === 'Work Completed' || a.status === 'Resolved' || a.status === 'Closed'
  ).length;
  const actPending = activities.filter(
    (a) =>
      a.status === 'Raised' ||
      a.status === 'In Progress' ||
      a.status === 'Awaiting Admin Verification'
  ).length;

  // ---- Attendance (history) ----
  const attDays = attendance.length;
  const presentDays = attendance.filter((a) => a.status === 'Present' || a.status === 'Checked In').length;
  const lateDays = attendance.filter((a) => a.status === 'Late').length;
  const absentDays = attendance.filter((a) => a.status === 'Absent').length;
  const attPct = Math.round(((presentDays + lateDays * 0.8) / Math.max(1, attDays)) * 100);

  // ---- Working hours ----
  const hoursDays = attendance.filter((a) => a.hours);
  const totalHoursFloat = hoursDays.reduce((sum, a) => sum + parseHours(a.hours), 0);
  const totalHoursH = Math.floor(totalHoursFloat);
  const totalHoursM = Math.round((totalHoursFloat - totalHoursH) * 60);
  const avgDaily = hoursDays.length
    ? `${(totalHoursFloat / hoursDays.length).toFixed(1)}h`
    : '—';

  // Hours series — most recent recorded days, in record order
  const hoursSeries: BarValue[] = [...attendance]
    .reverse()
    .slice(-6)
    .map((a) => ({ label: a.dateFormatted, value: parseHours(a.hours) }));

  // ---- Vouchers ----
  const vouchersTotal = vouchers.length;
  const vouchersPending = vouchers.filter((v) => v.status === 'Submitted for Admin Review').length;
  const vouchersApproved = vouchers.filter((v) => v.status === 'Approved').length;
  const vouchersRejected = vouchers.filter((v) => v.status === 'Rejected').length;

  // ---- Compact KPI strip (real metrics only) ----
  const kpis: {
    key: string;
    label: string;
    value: string;
    detail: string;
    icon: React.ReactNode;
    tone: string;
    /** Long textual values render at a smaller size than numeric metrics. */
    textValue?: boolean;
    progress?: number;
    barTone?: string;
  }[] = [
    {
      key: 'attendance',
      label: "Today's Attendance",
      value: attendanceLabel,
      detail: attendanceDetail,
      icon: <CalendarCheck className="w-4 h-4" />,
      tone: todayAttendance.status === 'Not Checked In' ? '' : 'echo-icon-tile--positive',
      textValue: true,
    },
    {
      key: 'assigned',
      label: 'Tasks Assigned',
      value: String(tasksAssigned),
      detail: `${actAssigned} activities assigned`,
      icon: <ListChecks className="w-4 h-4" />,
      tone: 'echo-icon-tile--accent',
    },
    {
      key: 'submitted',
      label: 'Tasks Submitted',
      value: String(tasksApproved + tasksSubmitted),
      detail: `${tasksSubmitted} awaiting review`,
      icon: <CheckCircle2 className="w-4 h-4" />,
      tone: 'echo-icon-tile--accent',
      progress: submittedRate,
    },
    {
      key: 'pending',
      label: 'Pending Tasks',
      value: String(tasksPending),
      detail: `${tasksReupload} re-upload requested`,
      icon: <Clock className="w-4 h-4" />,
      tone: 'echo-icon-tile--warning',
    },
    {
      key: 'completion',
      label: 'Completion Rate',
      value: `${completionRate}%`,
      detail: `${tasksApproved} of ${tasksAssigned} approved`,
      icon: <Target className="w-4 h-4" />,
      tone: 'echo-icon-tile--positive',
      progress: completionRate,
      barTone: 'echo-progress-bar--positive',
    },
    {
      key: 'vouchers',
      label: 'Available Vouchers',
      value: String(vouchersTotal),
      detail: `${vouchersPending} pending · ${vouchersApproved} approved`,
      icon: <Receipt className="w-4 h-4" />,
      tone: '',
    },
  ];

  // ---- Chart 1: task status distribution (real data) ----
  const taskStatusSeries: BarValue[] = [
    { label: 'Approved', value: tasksApproved },
    { label: 'Submitted', value: tasksSubmitted },
    { label: 'In Progress', value: assignedTasks.filter((x) => x.status === 'In Progress').length },
    { label: 'Pending', value: assignedTasks.filter((x) => x.status === 'Pending').length },
    { label: 'Re-upload', value: tasksReupload },
    { label: 'Rejected', value: tasksRejected },
  ].filter((d) => d.value > 0);

  // ---- Chart 2: attendance summary (real data) ----
  const attendanceSeries: BarValue[] = [
    { label: 'Present', value: presentDays },
    { label: 'Late', value: lateDays },
    { label: 'Absent', value: absentDays },
  ].filter((d) => d.value > 0);

  // ---- Today's tasks ----
  const todayTaskRows = todayRegularTasks.map((task, index) => ({
    id: task.id,
    index: index + 1,
    title: task.title,
    scheduledTime: task.scheduledTime,
    frequency: task.frequency,
    status: task.status,
  }));

  // ---- Task submission progress (real checklist state) ----
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

  // ---- Upcoming deadlines: pending/in-progress work, soonest first ----
  const deadlineRows = [...assignedTasks]
    .filter((x) => x.status !== 'Approved' && x.status !== 'Rejected')
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
    .slice(0, 5);

  // ---- Recent activity: derived from the real notification stream ----
  const recentActivity = notifications.slice(0, 6).map((n) => ({
    id: n.id,
    title: n.title,
    desc: n.message,
    time: n.timestamp,
    type: n.type,
    read: n.read,
  }));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-echo-fade">
      {/* Heading */}
      <div className="mb-8">
        <GlobalBackButton />
        <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="ed-label mb-4">Personal Record</p>
            <h1 className="ed-h1">{t('dashboard')}</h1>
            <p className="ed-sub mt-3 max-w-xl">
              {currentEmployee.name} ({currentEmployee.employeeCode}) — operational performance overview
            </p>
          </div>
          <span className="echo-chip echo-chip--accent self-start sm:self-auto">
            <TrendingUp className="w-3.5 h-3.5" />
            Synced with Admin Monitor
          </span>
        </div>
      </div>

      {/* KPI strip — compact metrics */}
      <section className="mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((kpi) => (
            <div key={kpi.key} className="echo-kpi">
              <div className="flex items-start justify-between gap-2">
                <div className="echo-kpi-label">{kpi.label}</div>
                <span className={`echo-icon-tile ${kpi.tone}`} style={{ width: '1.75rem', height: '1.75rem' }}>
                  {kpi.icon}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5 min-h-[1.75rem]">
                <span
                  className={
                    kpi.textValue
                      ? 'text-[17px] font-bold tracking-[-0.02em] text-[var(--echo-ink)] leading-none'
                      : 'echo-kpi-value'
                  }
                >
                  {kpi.value}
                </span>
              </div>
              <p className="ed-mono mt-2 leading-relaxed">{kpi.detail}</p>
              {kpi.progress !== undefined && (
                <div className="mt-3">
                  <div className="echo-progress">
                    <div
                      className={`echo-progress-bar ${kpi.barTone ?? ''}`}
                      style={{ width: `${Math.min(100, Math.max(0, kpi.progress))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Charts */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="echo-card echo-card--pad">
          <SectionHead label="Task Status Distribution" meta={`${tasksAssigned} assigned tasks`} />
          {taskStatusSeries.length === 0 ? (
            <p className="ed-sub py-10 text-center">No assigned tasks recorded yet.</p>
          ) : (
            <Bars data={taskStatusSeries} tone="accent" />
          )}
        </div>

        <div className="echo-card echo-card--pad">
          <SectionHead label="Attendance Summary" meta={`September 2026 · ${attPct}% attendance`} />
          {attendanceSeries.length === 0 ? (
            <p className="ed-sub py-10 text-center">No attendance records yet.</p>
          ) : (
            <Bars data={attendanceSeries} tone="accent" />
          )}
          <div className="mt-5 grid grid-cols-3 gap-2">
            <MetricTile k="Punctuality" v={`${Math.round((presentDays / Math.max(1, attDays)) * 100)}%`} />
            <MetricTile k="Days logged" v={String(attDays)} />
            <MetricTile k="Avg daily" v={avgDaily} />
          </div>
        </div>

        <div className="echo-card echo-card--pad lg:col-span-2">
          <SectionHead
            label="Working Hours"
            meta={`${totalHoursH}h ${totalHoursM}m total · average ${avgDaily} per day`}
          />
          {hoursSeries.length === 0 ? (
            <p className="ed-sub py-10 text-center">No working hours recorded yet.</p>
          ) : (
            <Bars data={hoursSeries} tone="accent" />
          )}
        </div>
      </section>

      {/* Today's Tasks + Task Submission Progress */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Tasks */}
        <div className="echo-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--echo-border)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="echo-icon-tile echo-icon-tile--accent" style={{ width: '1.75rem', height: '1.75rem' }}>
                <ListChecks className="w-3.5 h-3.5" />
              </span>
              <h2 className="ed-h2">Today's Tasks</h2>
            </div>
            <span className="echo-chip">
              {regCompletedToday} / {regScheduledToday} completed
            </span>
          </div>

          {todayTaskRows.length === 0 ? (
            <div className="echo-empty !border-0 !rounded-none">
              <p className="ed-sub">No regular tasks scheduled for today.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--echo-border)]">
              {todayTaskRows.map((task) => (
                <div key={task.id} className="echo-list-row">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="echo-icon-tile shrink-0 font-mono text-[11px]" style={{ width: '1.75rem', height: '1.75rem' }}>
                      {String(task.index).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <div
                        className={`text-[13px] font-semibold truncate ${
                          task.status === 'Completed'
                            ? 'line-through text-[var(--echo-ink-3)]'
                            : 'text-[var(--echo-ink)]'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="ed-mono mt-1">
                        {task.scheduledTime} · <span className="capitalize">{task.frequency}</span>
                      </div>
                    </div>
                  </div>
                  <StatusChip status={task.status} className="shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Task Submission Progress */}
        <div className="echo-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--echo-border)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="echo-icon-tile echo-icon-tile--accent" style={{ width: '1.75rem', height: '1.75rem' }}>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
              <h2 className="ed-h2">Task Submission Progress</h2>
            </div>
            <span className="echo-chip echo-chip--accent">{submittedRate}% filed</span>
          </div>

          {submissionRows.length === 0 ? (
            <div className="echo-empty !border-0 !rounded-none">
              <p className="ed-sub">No assigned tasks awaiting evidence.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--echo-border)]">
              {submissionRows.map((row) => (
                <div
                  key={row.id}
                  className="echo-list-row cursor-pointer"
                  onClick={() => {
                    setSelectedTaskId(row.id);
                    setActiveTab('task-detail');
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="ed-mono shrink-0">#{row.taskNumber}</span>
                      <span className="text-[13px] font-semibold text-[var(--echo-ink)] truncate">
                        {row.title}
                      </span>
                    </div>
                    <div className="ed-mono mt-1 truncate">{row.clientName}</div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span className="hidden sm:block w-24">
                      <span className="echo-progress">
                        <span
                          className={`echo-progress-bar ${
                            row.pct === 100 ? 'echo-progress-bar--positive' : ''
                          }`}
                          style={{ width: `${row.pct}%` }}
                        />
                      </span>
                    </span>
                    <span className="ed-mono shrink-0 tabular-nums">
                      {row.met}/{row.required}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Deadlines + Recent Activity */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Deadlines */}
        <div className="echo-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--echo-border)] flex items-center gap-2.5">
            <span className="echo-icon-tile echo-icon-tile--warning" style={{ width: '1.75rem', height: '1.75rem' }}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
            <h2 className="ed-h2">Upcoming Deadlines</h2>
          </div>

          {deadlineRows.length === 0 ? (
            <div className="echo-empty !border-0 !rounded-none">
              <p className="ed-sub">Nothing outstanding — all assigned tasks are resolved.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--echo-border)]">
              {deadlineRows.map((task) => (
                <div
                  key={task.id}
                  className="echo-list-row cursor-pointer"
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    setActiveTab('task-detail');
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="echo-icon-tile shrink-0 font-mono text-[11px]" style={{ width: '1.75rem', height: '1.75rem' }}>
                      {task.taskNumber}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[var(--echo-ink)] truncate">
                        {task.taskTitle}
                      </div>
                      <div className="ed-mono mt-1 truncate">
                        {task.clientName} · Due {task.scheduledDate}, {task.scheduledTime}
                      </div>
                    </div>
                  </div>
                  <StatusChip status={task.status} className="shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="echo-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--echo-border)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="echo-icon-tile" style={{ width: '1.75rem', height: '1.75rem' }}>
                <ActivityIcon className="w-3.5 h-3.5" />
              </span>
              <h2 className="ed-h2">Recent Activity</h2>
            </div>
            <span className="echo-chip">{notifications.length} events</span>
          </div>

          {recentActivity.length === 0 ? (
            <div className="echo-empty !border-0 !rounded-none">
              <p className="ed-sub">No activity recorded yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--echo-border)]">
              {recentActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-3 px-5 py-3.5">
                  <span
                    className={`echo-dot mt-2 ${act.read ? 'bg-[var(--echo-border-strong)]' : 'bg-[var(--echo-accent)]'}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] font-semibold text-[var(--echo-ink)] truncate">
                        {act.title}
                      </span>
                      <span className="ed-mono shrink-0">{act.time}</span>
                    </div>
                    <p className="ed-sub mt-1 text-[12px] line-clamp-2">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detailed metric grid */}
      <section className="mb-8">
        <SectionHead label="Detailed Metrics" meta="Breakdown by module" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="echo-card echo-card--tight">
            <div className="flex items-center gap-2.5 mb-4">
              <ListChecks className="w-4 h-4 text-[var(--echo-ink-3)]" />
              <div className="ed-h3">Regular Tasks</div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <MetricTile k="Completed" v={String(regCompletedToday)} />
              <MetricTile k="Scheduled" v={String(regScheduledToday)} />
              <MetricTile k="Missed" v={String(regMissed)} />
              <MetricTile k="Completion" v={`${regPct}%`} />
            </div>
          </div>

          <div className="echo-card echo-card--tight">
            <div className="flex items-center gap-2.5 mb-4">
              <CheckCircle2 className="w-4 h-4 text-[var(--echo-ink-3)]" />
              <div className="ed-h3">Assigned Tasks</div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <MetricTile k="Assigned" v={String(tasksAssigned)} />
              <MetricTile k="Approved" v={String(tasksApproved)} />
              <MetricTile k="Awaiting review" v={String(tasksSubmitted)} />
              <MetricTile k="Pending" v={String(tasksPending)} />
            </div>
          </div>

          <div className="echo-card echo-card--tight">
            <div className="flex items-center gap-2.5 mb-4">
              <ActivityIcon className="w-4 h-4 text-[var(--echo-ink-3)]" />
              <div className="ed-h3">Activities</div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <MetricTile k="Assigned" v={String(actAssigned)} />
              <MetricTile k="Resolved" v={String(actCompleted)} />
              <MetricTile k="Pending" v={String(actPending)} />
              <MetricTile k="Completion" v={`${Math.round((actCompleted / Math.max(1, actAssigned)) * 100)}%`} />
            </div>
          </div>

          <div className="echo-card echo-card--tight">
            <div className="flex items-center gap-2.5 mb-4">
              <CalendarCheck className="w-4 h-4 text-[var(--echo-ink-3)]" />
              <div className="ed-h3">Attendance</div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <MetricTile k="Present days" v={String(presentDays)} />
              <MetricTile k="Late days" v={String(lateDays)} />
              <MetricTile k="Absent days" v={String(absentDays)} />
              <MetricTile k="Attendance" v={`${attPct}%`} />
            </div>
          </div>

          <div className="echo-card echo-card--tight">
            <div className="flex items-center gap-2.5 mb-4">
              <Timer className="w-4 h-4 text-[var(--echo-ink-3)]" />
              <div className="ed-h3">Working Hours</div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <MetricTile k="Total hours" v={`${totalHoursH}h ${totalHoursM}m`} />
              <MetricTile k="Average daily" v={avgDaily} />
              <MetricTile k="Days logged" v={String(hoursDays.length)} />
              <MetricTile
                k="Check in"
                v={todayAttendance.checkIn || '—'}
              />
            </div>
          </div>

          <div className="echo-card echo-card--tight">
            <div className="flex items-center gap-2.5 mb-4">
              <Receipt className="w-4 h-4 text-[var(--echo-ink-3)]" />
              <div className="ed-h3">Vouchers</div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <MetricTile k="Filed" v={String(vouchersTotal)} />
              <MetricTile k="Pending" v={String(vouchersPending)} />
              <MetricTile k="Approved" v={String(vouchersApproved)} />
              <MetricTile k="Rejected" v={String(vouchersRejected)} />
            </div>
          </div>
        </div>
      </section>

      {/* Operational Summary */}
      <section>
        <SectionHead label="Operational Summary" meta="Current cycle" />
        <div className="echo-card echo-card--pad">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-0">
            {[
              { label: 'Regular Tasks Today', value: String(regScheduledToday) },
              { label: 'Completed Today', value: String(regCompletedToday) },
              { label: 'Assigned New Tasks', value: String(tasksAssigned) },
              { label: 'Active Activities', value: String(actPending) },
              { label: 'Vouchers Submitted', value: String(vouchersTotal) },
              { label: 'Current Department', value: currentEmployee.department },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 py-3 border-b border-[var(--echo-border)] last:border-b-0"
              >
                <span className="text-[13px] text-[var(--echo-ink-3)]">{row.label}</span>
                <span className="font-mono text-[13px] font-medium text-[var(--echo-ink)] tabular-nums truncate max-w-[55%] text-right">
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button onClick={() => setActiveTab('new-task')} className="ed-link">
              <span>Go to Assigned Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="ed-mono inline-flex items-center gap-1.5">
              <LogIn className="w-3 h-3" />
              {todayAttendance.checkIn ? `Checked in ${todayAttendance.checkIn}` : 'Not checked in'}
            </span>
            {todayAttendance.checkOut && (
              <span className="ed-mono inline-flex items-center gap-1.5">
                <LogOut className="w-3 h-3" />
                Checked out {todayAttendance.checkOut}
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
