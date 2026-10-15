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

/** Editorial column chart — thin rules, large figures, no chrome. */
const Columns: React.FC<{ data: BarValue[]; tone?: 'accent' | 'ink' }> = ({
  data,
  tone = 'accent',
}) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-4 sm:gap-8">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center justify-end min-w-0">
          <span className="font-mono text-[12px] font-medium text-[var(--echo-ink)] tabular-nums mb-3">
            {d.note ? d.note : Math.round(d.value)}
          </span>
          <div
            className="w-full max-w-[52px] h-32 sm:h-40 flex items-end"
            style={{ borderBottom: 'var(--echo-rule) solid var(--echo-border-strong)' }}
          >
            <div
              className={`echo-bar w-full ${tone === 'accent' ? 'bg-[var(--echo-accent)]' : 'bg-[var(--echo-ink)]'}`}
              style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }}
            />
          </div>
          <span className="ed-meta mt-3.5 whitespace-nowrap truncate max-w-full">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

/** Eyebrow + hairline + meta heading used above every editorial block. */
const SectionHead: React.FC<{ label: string; meta?: string }> = ({ label, meta }) => (
  <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 mb-9">
    <span className="ed-label">{label}</span>
    {meta && (
      <>
        <span className="hidden sm:inline-block h-px w-10 shrink-0 self-center" style={{ background: 'var(--echo-border-strong)' }} />
        <span className="ed-meta">{meta}</span>
      </>
    )}
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
    { on: req.fourPhotosOneVideo, done: sub.photos.length === 4 && !!sub.video },
    { on: req.signature, done: !!sub.signatureName && !!sub.confirmedSignature },
    { on: req.markRating, done: !!sub.markRating && sub.markRating > 0 },
  ];
  return {
    met: items.filter((i) => i.on && i.done).length,
    required: items.filter((i) => i.on).length,
  };
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
  const regMissed = Math.max(0, regularTasksTotalToday - regularTasksCompletedToday);
  const regPct = Math.round((regularTasksCompletedToday / Math.max(1, regularTasksTotalToday)) * 100);

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

  // ---- Attendance history ----
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
  const avgDaily = hoursDays.length ? `${(totalHoursFloat / hoursDays.length).toFixed(1)}h` : '—';

  const hoursSeries: BarValue[] = [...attendance]
    .reverse()
    .slice(-6)
    .map((a) => ({ label: a.dateFormatted, value: parseHours(a.hours) }));

  // ---- Vouchers ----
  const vouchersTotal = vouchers.length;
  const vouchersPending = vouchers.filter((v) => v.status === 'Submitted for Admin Review').length;
  const vouchersApproved = vouchers.filter((v) => v.status === 'Approved').length;
  const vouchersRejected = vouchers.filter((v) => v.status === 'Rejected').length;

  // ---- Headline figures — one per line, no card grid ----
  const figures: { key: string; label: string; value: string; meta: string }[] = [
    {
      key: 'attendance',
      label: "Today's Attendance",
      value: todayAttendance.status,
      meta: todayAttendance.checkIn
        ? `In ${todayAttendance.checkIn}${todayAttendance.checkOut ? ` · Out ${todayAttendance.checkOut}` : ''}`
        : 'Awaiting first check-in',
    },
    { key: 'assigned', label: 'Tasks Assigned', value: String(tasksAssigned), meta: `${actAssigned} activities assigned` },
    { key: 'submitted', label: 'Tasks Submitted', value: String(tasksApproved + tasksSubmitted), meta: `${tasksSubmitted} awaiting review` },
    { key: 'pending', label: 'Pending Tasks', value: String(tasksPending), meta: `${tasksReupload} re-upload requested` },
    { key: 'rate', label: 'Completion Rate', value: `${completionRate}%`, meta: `${tasksApproved} of ${tasksAssigned} approved` },
    { key: 'vouchers', label: 'Available Vouchers', value: String(vouchersTotal), meta: `${vouchersPending} pending · ${vouchersApproved} approved` },
  ];

  // ---- Charts (real data only) ----
  const taskStatusSeries: BarValue[] = [
    { label: 'Approved', value: tasksApproved },
    { label: 'Submitted', value: tasksSubmitted },
    { label: 'In Progress', value: assignedTasks.filter((x) => x.status === 'In Progress').length },
    { label: 'Pending', value: assignedTasks.filter((x) => x.status === 'Pending').length },
    { label: 'Re-upload', value: tasksReupload },
    { label: 'Rejected', value: tasksRejected },
  ].filter((d) => d.value > 0);

  const attendanceSeries: BarValue[] = [
    { label: 'Present', value: presentDays },
    { label: 'Late', value: lateDays },
    { label: 'Absent', value: absentDays },
  ].filter((d) => d.value > 0);

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

  const recentActivity = notifications.slice(0, 6);

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
          <div className="em-split-side">
            <p className="ed-sub max-w-sm text-[14px]">
              {currentEmployee.name} ({currentEmployee.employeeCode}) — operational performance
              overview across attendance, tasks, activities, and vouchers.
            </p>
            <div className="mt-7">
              <span className="echo-chip echo-chip--accent">
                <TrendingUp className="w-3 h-3" />
                Synced with Admin Monitor
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Headline figures — ruled table of numbers ================= */}
      <section
        className="em-section py-14"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <SectionHead label="Key Performance Indicators" meta="Current cycle" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--echo-border)' }}>
          {figures.map((f) => (
            <div key={f.key} className="px-1 py-8 pr-6" style={{ background: 'var(--echo-bg)' }}>
              <div className="echo-kpi-label">{f.label}</div>
              <div
                className={`mt-6 text-[var(--echo-ink)] ${
                  f.value.length > 6
                    ? 'text-[clamp(1.25rem,2.4vw,1.75rem)] font-bold tracking-[-0.02em]'
                    : 'font-serif text-[clamp(2.5rem,5.4vw,4rem)] leading-[0.88] tracking-[-0.03em] tabular-nums'
                }`}
              >
                {f.value}
              </div>
              <div className="ed-meta mt-5">{f.meta}</div>
            </div>
          ))}
        </div>

        {/* Integrated progress rules rather than separate progress cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            { label: 'Regular task completion', value: regPct, tone: '' },
            { label: 'Submission filed', value: submittedRate, tone: '' },
            { label: 'Attendance', value: attPct, tone: 'echo-progress-bar--positive' },
          ].map((p) => (
            <div key={p.label}>
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <span className="echo-kpi-label">{p.label}</span>
                <span className="font-mono text-[13px] font-bold tabular-nums text-[var(--echo-ink)]">
                  {p.value}%
                </span>
              </div>
              <div className="echo-progress">
                <div className={`echo-progress-bar ${p.tone}`} style={{ width: `${Math.min(100, p.value)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Charts ================= */}
      <section
        className="em-invert em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="em-split">
          <div className="em-split-lead">
            <SectionHead label="Task Status Distribution" meta={`${tasksAssigned} assigned tasks`} />
            {taskStatusSeries.length === 0 ? (
              <p className="ed-sub py-12">No assigned tasks recorded yet.</p>
            ) : (
              <Columns data={taskStatusSeries} />
            )}
          </div>
          <div className="em-split-side">
            <SectionHead label="Attendance Summary" meta={`September 2026 · ${attPct}% attendance`} />
            {attendanceSeries.length === 0 ? (
              <p className="ed-sub py-12">No attendance records yet.</p>
            ) : (
              <>
                <Columns data={attendanceSeries} />
                <dl
                  className="mt-10 grid grid-cols-3 gap-6 pt-8"
                  style={{ borderTop: 'var(--echo-rule) solid var(--echo-invert-rule)' }}
                >
                  {[
                    { k: 'Punctuality', v: `${Math.round((presentDays / Math.max(1, attDays)) * 100)}%` },
                    { k: 'Days logged', v: String(attDays) },
                    { k: 'Avg daily', v: avgDaily },
                  ].map((item) => (
                    <div key={item.k}>
                      <dt className="ed-meta">{item.k}</dt>
                      <dd
                        className="mt-2.5 font-serif text-[1.75rem] leading-none tracking-[-0.02em] tabular-nums"
                        style={{ color: 'var(--echo-invert-ink)' }}
                      >
                        {item.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ================= Working hours ================= */}
      <section
        className="em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <SectionHead
          label="Working Hours"
          meta={`${totalHoursH}h ${totalHoursM}m total · average ${avgDaily} per day`}
        />
        {hoursSeries.length === 0 ? (
          <p className="ed-sub py-12">No working hours recorded yet.</p>
        ) : (
          <Columns data={hoursSeries} />
        )}
      </section>

      {/* ================= Today's tasks + submission progress ================= */}
      <section
        className="em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)', background: 'var(--echo-bg-2)' }}
      >
        <div className="em-split">
          <div className="em-split-lead">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
              <SectionHead label="Today's Tasks" meta={`${regularTasksTotalToday} scheduled`} />
              <span className="echo-chip">
                {regularTasksCompletedToday} / {regularTasksTotalToday} completed
              </span>
            </div>

            {todayRegularTasks.length === 0 ? (
              <p className="ed-sub py-10">No regular tasks scheduled for today.</p>
            ) : (
              <ul>
                {todayRegularTasks.map((task, index) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between gap-5 py-5"
                    style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
                  >
                    <div className="flex items-center gap-5 min-w-0">
                      <span className="font-mono text-[11px] shrink-0 text-[var(--echo-ink-3)]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <div
                          className={`text-[14px] truncate ${
                            task.status === 'Completed'
                              ? 'line-through text-[var(--echo-ink-3)]'
                              : 'font-medium text-[var(--echo-ink)]'
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="ed-meta mt-2">
                          {task.scheduledTime} · <span className="capitalize">{task.frequency}</span>
                        </div>
                      </div>
                    </div>
                    <StatusChip status={task.status} className="shrink-0" />
                  </li>
                ))}
              </ul>
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
                    <div
                      onClick={() => {
                        setSelectedTaskId(row.id);
                        setActiveTab('task-detail');
                      }}
                      className="flex items-center justify-between gap-5 py-5 cursor-pointer transition-colors hover:bg-[var(--echo-surface)]"
                      style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="ed-meta shrink-0">#{row.taskNumber}</span>
                          <span className="text-[14px] font-medium text-[var(--echo-ink)] truncate">
                            {row.title}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
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
                        </div>
                        <div className="ed-meta mt-3 truncate">{row.clientName}</div>
                      </div>
                    </div>
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
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
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
                    <div
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        setActiveTab('task-detail');
                      }}
                      className="flex items-center justify-between gap-5 py-6 cursor-pointer transition-colors"
                      style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
                    >
                      <div className="flex items-start gap-5 min-w-0">
                        <span className="font-mono text-[11px] shrink-0 pt-1.5 text-[var(--echo-accent)]">
                          {String(task.taskNumber).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <div className="text-[15px] font-medium text-[var(--echo-ink)] truncate">
                            {task.taskTitle}
                          </div>
                          <div className="ed-meta mt-2.5 truncate">
                            {task.clientName} · Due {task.scheduledDate}, {task.scheduledTime}
                          </div>
                        </div>
                      </div>
                      <StatusChip status={task.status} className="shrink-0" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="em-split-side">
            <SectionHead label="Recent Activity" meta={`${notifications.length} events`} />
            {recentActivity.length === 0 ? (
              <p className="ed-sub py-10">No activity recorded yet.</p>
            ) : (
              <ul>
                {recentActivity.map((act) => (
                  <li
                    key={act.id}
                    className="flex items-start gap-4 py-5"
                    style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                      style={{
                        background: act.read ? 'var(--echo-border-strong)' : 'var(--echo-accent)',
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span
                          className={`text-[13px] truncate ${
                            act.read ? 'font-medium text-[var(--echo-ink-2)]' : 'font-bold text-[var(--echo-ink)]'
                          }`}
                        >
                          {act.title}
                        </span>
                        <span className="ed-meta shrink-0">{act.timestamp}</span>
                      </div>
                      <p className="ed-sub mt-2 text-[12px] line-clamp-2">{act.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ================= Detailed metrics — ruled ledger ================= */}
      <section
        className="em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)', background: 'var(--echo-bg-2)' }}
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
                ['Missed', String(regMissed)],
                ['Completion', `${regPct}%`],
              ],
            },
            {
              title: 'Assigned Tasks',
              icon: <CheckCircle2 className="w-3.5 h-3.5" />,
              rows: [
                ['Assigned', String(tasksAssigned)],
                ['Approved', String(tasksApproved)],
                ['Awaiting review', String(tasksSubmitted)],
                ['Pending', String(tasksPending)],
              ],
            },
            {
              title: 'Activities',
              icon: <ActivityIcon className="w-3.5 h-3.5" />,
              rows: [
                ['Assigned', String(actAssigned)],
                ['Resolved', String(actCompleted)],
                ['Pending', String(actPending)],
                ['Completion', `${Math.round((actCompleted / Math.max(1, actAssigned)) * 100)}%`],
              ],
            },
            {
              title: 'Attendance',
              icon: <CalendarCheck className="w-3.5 h-3.5" />,
              rows: [
                ['Present days', String(presentDays)],
                ['Late days', String(lateDays)],
                ['Absent days', String(absentDays)],
                ['Attendance', `${attPct}%`],
              ],
            },
            {
              title: 'Working Hours',
              icon: <Timer className="w-3.5 h-3.5" />,
              rows: [
                ['Total hours', `${totalHoursH}h ${totalHoursM}m`],
                ['Average daily', avgDaily],
                ['Days logged', String(hoursDays.length)],
                ['Check in', todayAttendance.checkIn || '—'],
              ],
            },
            {
              title: 'Vouchers',
              icon: <Receipt className="w-3.5 h-3.5" />,
              rows: [
                ['Filed', String(vouchersTotal)],
                ['Pending', String(vouchersPending)],
                ['Approved', String(vouchersApproved)],
                ['Rejected', String(vouchersRejected)],
              ],
            },
          ].map((group) => (
            <div key={group.title}>
              <div className="flex items-center gap-2.5 pb-5 mb-1" style={{ borderBottom: 'var(--echo-rule) solid var(--echo-ink)' }}>
                <span className="text-[var(--echo-ink-3)]">{group.icon}</span>
                <h3 className="ed-h3">{group.title}</h3>
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
            </div>
          ))}
        </div>
      </section>

      {/* ================= Operational summary ================= */}
      <section
        className="em-invert em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="em-split items-end">
          <div className="em-split-lead">
            <span className="ed-label">Operational Summary</span>
            <h2 className="ed-h2 mt-5">Current cycle</h2>
          </div>
          <div className="em-split-side">
            <dl>
              {[
                ['Regular Tasks Today', String(regularTasksTotalToday)],
                ['Completed Today', String(regularTasksCompletedToday)],
                ['Assigned New Tasks', String(tasksAssigned)],
                ['Active Activities', String(actPending)],
                ['Vouchers Submitted', String(vouchersTotal)],
                ['Current Department', currentEmployee.department],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-6 py-4"
                  style={{ borderTop: 'var(--echo-rule) solid var(--echo-invert-rule)' }}
                >
                  <dt className="ed-meta">{k}</dt>
                  <dd
                    className="font-mono text-[13px] font-medium tabular-nums text-right truncate max-w-[60%]"
                    style={{ color: 'var(--echo-invert-ink)' }}
                  >
                    {v}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <button onClick={() => setActiveTab('new-task')} className="ed-link">
                <span>Go to Assigned Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="ed-meta inline-flex items-center gap-2">
                <LogIn className="w-3 h-3" />
                {todayAttendance.checkIn ? `Checked in ${todayAttendance.checkIn}` : 'Not checked in'}
              </span>
              {todayAttendance.checkOut && (
                <span className="ed-meta inline-flex items-center gap-2">
                  <LogOut className="w-3 h-3" />
                  Checked out {todayAttendance.checkOut}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
