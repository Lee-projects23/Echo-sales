import React from 'react';
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  ListChecks,
  Activity as ActivityIcon,
  CalendarCheck,
  Palette,
  Layers,
  BarChart3,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';

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
          <span className="font-mono text-[11px] text-[var(--echo-ink)] tabular-nums mb-2">
            {d.note ? d.note : Math.round(d.value)}
          </span>
          <div className="w-full max-w-[44px] h-32 sm:h-36 flex items-end rounded-t-[6px] bg-[var(--echo-surface-3)] overflow-hidden">
            <div
              className={`echo-bar w-full ${tone === 'accent' ? 'bg-[var(--echo-accent)]' : 'bg-[var(--echo-ink)]'}`}
              style={{ height: `${Math.max(3, (d.value / max) * 100)}%` }}
            />
          </div>
          <span className="ed-mono mt-2.5 whitespace-nowrap truncate max-w-full">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

/** Section heading used above every chart block. */
const ChartHeading: React.FC<{ label: string; meta: string }> = ({ label, meta }) => (
  <div className="echo-section-head">
    <span className="ed-label">{label}</span>
    <span className="echo-rule" />
    <span className="ed-mono">{meta}</span>
  </div>
);

/** One metric tile inside a KPI card. */
const MetricTile: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div className="rounded-[10px] bg-[var(--echo-surface-2)] px-3 py-2.5">
    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--echo-ink-3)]">
      {k}
    </div>
    <div className="mt-1 font-mono text-[15px] font-medium text-[var(--echo-ink)] tabular-nums">
      {v}
    </div>
  </div>
);

export const DashboardPage: React.FC = () => {
  const {
    currentEmployee,
    todayRegularTasks,
    regularTasksCompletedToday,
    regularTasksTotalToday,
    assignedTasks,
    activities,
    attendance,
    vouchers,
    t,
  } = usePortal();

  // ---- Regular Tasks ----
  const regCompletedToday = regularTasksCompletedToday;
  const regScheduledToday = regularTasksTotalToday;
  const regMissed = Math.max(0, regScheduledToday - regCompletedToday);
  const regPct = Math.round((regCompletedToday / Math.max(1, regScheduledToday)) * 100);

  // ---- New Tasks ----
  const newAssigned = assignedTasks.length;
  const newCompleted = assignedTasks.filter((x) => x.status === 'Approved').length;
  const newAwaiting = assignedTasks.filter((x) => x.status === 'Submitted').length;

  // ---- Activities ----
  const actAssigned = activities.length;
  const actCompleted = activities.filter(
    (a) => a.status === 'Work Completed' || a.status === 'Resolved' || a.status === 'Closed'
  ).length;
  const actPending = activities.filter(
    (a) => a.status === 'Raised' || a.status === 'In Progress' || a.status === 'Awaiting Admin Verification'
  ).length;

  // ---- Attendance ----
  const attDays = attendance.length;
  const presentDays = attendance.filter((a) => a.status === 'Present' || a.status === 'Checked In').length;
  const lateDays = attendance.filter((a) => a.status === 'Late').length;
  const absentDays = attendance.filter((a) => a.status === 'Absent').length;
  const attPct = Math.round(((presentDays + lateDays * 0.8) / Math.max(1, attDays)) * 100);

  // ---- Working Hours ----
  const parseHours = (s: string | null): number => {
    if (!s) return 0;
    const m = s.match(/(\d+)h\s*(\d*)m?/);
    if (!m) return 0;
    return parseInt(m[1], 10) + (m[2] ? parseInt(m[2], 10) / 60 : 0);
  };
  const hoursDays = attendance.filter((a) => a.hours);
  const totalHoursFloat = hoursDays.reduce((sum, a) => sum + parseHours(a.hours), 0);
  const totalHoursH = Math.floor(totalHoursFloat);
  const totalHoursM = Math.round((totalHoursFloat - totalHoursH) * 60);
  const avgDaily = hoursDays.length
    ? (totalHoursFloat / hoursDays.length).toFixed(1) + 'h'
    : '—';

  // Chart 4 — Working hours for recent recorded days
  const recentDayOrder = ['18 Sep', '19 Sep', '20 Sep', '21 Sep', '22 Sep', '23 Sep'];
  const hoursByDate = new Map(attendance.map((a) => [a.dateFormatted, parseHours(a.hours)]));
  const hoursSeries: BarValue[] = recentDayOrder.map((day) => ({
    label: day,
    value: hoursByDate.get(day) || 0,
  }));

  // Chart 5 — Historical weekly regular-task completion trend
  const weeklyTrend: BarValue[] = [
    { label: 'Week 1', value: 91, note: '91%' },
    { label: 'Week 2', value: 83, note: '83%' },
    { label: 'Week 3', value: 95, note: '95%' },
    { label: 'Week 4', value: 89, note: '89%' },
  ];

  /** Headline KPI tiles — icon, headline metric, supporting detail. */
  const headlineKpis: {
    key: string;
    label: string;
    value: string;
    detail: string;
    icon: React.ReactNode;
    tone: string;
    progress?: { value: number; barTone?: string };
  }[] = [
    {
      key: 'tasks',
      label: 'Regular Tasks',
      value: `${regCompletedToday}/${regScheduledToday}`,
      detail: `${regMissed} remaining today`,
      icon: <ListChecks className="w-4 h-4" />,
      tone: 'echo-icon-tile--accent',
      progress: { value: regPct },
    },
    {
      key: 'new-tasks',
      label: 'Assigned Tasks',
      value: String(newAssigned),
      detail: `${newAwaiting} awaiting review`,
      icon: <CheckCircle2 className="w-4 h-4" />,
      tone: 'echo-icon-tile--info',
    },
    {
      key: 'activities',
      label: 'Activities',
      value: String(actPending),
      detail: `${actCompleted} of ${actAssigned} resolved`,
      icon: <ActivityIcon className="w-4 h-4" />,
      tone: 'echo-icon-tile--warning',
    },
    {
      key: 'attendance',
      label: 'Attendance',
      value: `${attPct}%`,
      detail: `${presentDays} present · ${lateDays} late · ${absentDays} absent`,
      icon: <CalendarCheck className="w-4 h-4" />,
      tone: 'echo-icon-tile--positive',
    },
    {
      key: 'leave',
      label: 'Leave Balance',
      value: `${currentEmployee.leaveBalance.remaining}`,
      detail: `${currentEmployee.leaveBalance.taken} of ${currentEmployee.leaveBalance.total} days used`,
      icon: <Palette className="w-4 h-4" />,
      tone: 'echo-icon-tile--accent',
    },
    {
      key: 'hours',
      label: 'Working Hours',
      value: `${totalHoursH}h ${totalHoursM}m`,
      detail: `Average ${avgDaily} per day`,
      icon: <Clock className="w-4 h-4" />,
      tone: 'echo-icon-tile--neutral',
    },
  ];

  const kpis: { label: string; cols: { k: string; v: string }[] }[] = [
    {
      label: 'Regular Tasks',
      cols: [
        { k: 'Completed', v: String(regCompletedToday) },
        { k: 'Scheduled', v: String(regScheduledToday) },
        { k: 'Missed', v: String(regMissed) },
        { k: 'Completion %', v: `${regPct}%` },
      ],
    },
    {
      label: 'New Tasks',
      cols: [
        { k: 'Assigned', v: String(newAssigned) },
        { k: 'Completed', v: String(newCompleted) },
        { k: 'Awaiting Review', v: String(newAwaiting) },
      ],
    },
    {
      label: 'Activities',
      cols: [
        { k: 'Assigned', v: String(actAssigned) },
        { k: 'Completed', v: String(actCompleted) },
        { k: 'Pending', v: String(actPending) },
      ],
    },
    {
      label: 'Attendance',
      cols: [
        { k: 'Present Days', v: String(presentDays) },
        { k: 'Absent Days', v: String(absentDays) },
        { k: 'Late Days', v: String(lateDays) },
        { k: 'Attendance %', v: `${attPct}%` },
      ],
    },
    {
      label: 'Leave',
      cols: [
        { k: 'Leave Taken', v: `${currentEmployee.leaveBalance.taken} days` },
        { k: 'Remaining Leave', v: `${currentEmployee.leaveBalance.remaining} days` },
      ],
    },
    {
      label: 'Working Hours',
      cols: [
        { k: 'Total Hours', v: `${totalHoursH}h ${totalHoursM}m` },
        { k: 'Average Daily', v: avgDaily },
      ],
    },
  ];

  const summaryRows: { label: string; value: string }[] = [
    { label: 'Regular Tasks Today', value: String(regScheduledToday) },
    { label: 'Completed Today', value: String(regCompletedToday) },
    { label: 'Assigned New Tasks', value: String(newAssigned) },
    { label: 'Active Activities', value: String(actPending) },
    { label: 'Vouchers Submitted', value: String(vouchers.length) },
    { label: 'Current Department', value: currentEmployee.department },
  ];

  const activityLog: { title: string; desc: string; time: string }[] = [
    { title: 'Shift Check-In', desc: 'Attendance registered at start of shift.', time: '8:58 AM' },
    { title: 'Regular Task Completed', desc: 'Morning Site Inspection completed at scheduled window.', time: '9:02 AM' },
    { title: 'New Task Assigned', desc: 'Admin assigned additional field task requirements.', time: '8:00 AM' },
    { title: 'Task Evidence Submitted', desc: 'Site Inspection & Valve Calibration awaiting review.', time: 'Yesterday' },
    { title: 'Activity Updated', desc: 'Irrigation Valve Pressure Drop — work in progress at ECR Villa Sector 4.', time: '22 Sep' },
    { title: 'Voucher Submitted', desc: 'VCH-9042 — Advance Request for test probe replacement.', time: '08:45 AM' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-echo-fade">
      {/* Heading */}
      <div className="mb-10">
        <GlobalBackButton />
        <div className="mt-5">
          <p className="ed-label mb-4">Personal Record</p>
          <h1 className="ed-h1">{t('dashboard')}</h1>
          <p className="ed-sub mt-3 max-w-xl">
            {currentEmployee.name} ({currentEmployee.employeeCode}) — Personal operational overview
          </p>
        </div>
      </div>

      {/* KPI Section — headline tiles */}
      <section className="mb-10">
        <div className="echo-section-head">
          <span className="ed-label">Key Performance Indicators</span>
          <span className="echo-rule" />
          <span className="ed-mono">Live · Synced with Admin Monitor</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {headlineKpis.map((kpi) => (
            <div key={kpi.key} className="echo-card echo-card--pad echo-card-hover">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="echo-kpi-label">{kpi.label}</div>
                  <div className="echo-kpi-value mt-3">{kpi.value}</div>
                </div>
                <span className={`echo-icon-tile ${kpi.tone}`}>{kpi.icon}</span>
              </div>

              <p className="ed-sub mt-3 text-[12px]">{kpi.detail}</p>

              {kpi.progress && (
                <div className="mt-4">
                  <div className="echo-progress">
                    <div
                      className="echo-progress-bar"
                      style={{ width: `${Math.min(100, kpi.progress.value)}%` }}
                    />
                  </div>
                  <div className="ed-mono mt-2">{kpi.progress.value}% complete</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Detailed metric grid */}
      <section className="mb-12">
        <div className="echo-section-head">
          <span className="ed-label">Detailed Metrics</span>
          <span className="echo-rule" />
          <span className="ed-mono">Breakdown by module</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="echo-card echo-card--pad">
              <div className="flex items-center gap-2.5 mb-4">
                <Layers className="w-4 h-4 text-[var(--echo-ink-3)]" />
                <div className="ed-h3">{kpi.label}</div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {kpi.cols.map((c) => (
                  <MetricTile key={c.k} k={c.k} v={c.v} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Charts */}
      <section className="mb-12 space-y-5">
        {/* Chart 1 — Task Completion */}
        <div className="echo-card echo-card--pad">
          <ChartHeading label="Chart 1 — Task Completion" meta="This week · scheduled vs completed vs missed" />
          <div className="flex items-end gap-3 sm:gap-5">
            {[
              { day: 'Mon', comp: 9, miss: 0 },
              { day: 'Tue', comp: 8, miss: 1 },
              { day: 'Wed', comp: regCompletedToday, miss: regMissed },
              { day: 'Thu', comp: 0, miss: 0 },
              { day: 'Fri', comp: 0, miss: 0 },
              { day: 'Sat', comp: 0, miss: 0 },
              { day: 'Sun', comp: 0, miss: 0 },
            ].map((d) => {
              const total = regScheduledToday || 9;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center min-w-0">
                  <span className="font-mono text-[11px] text-[var(--echo-ink)] tabular-nums mb-2">
                    {d.comp}/{d.miss > 0 ? d.miss : total}
                  </span>
                  <div className="relative w-full max-w-[44px] h-32 sm:h-36 rounded-t-[6px] bg-[var(--echo-surface-3)] overflow-hidden">
                    <div
                      className="absolute left-0 right-0 bottom-0 bg-[var(--echo-accent)] echo-bar"
                      style={{ height: `${(d.comp / total) * 100}%` }}
                    />
                    {d.miss > 0 && (
                      <div
                        className="absolute left-0 right-0 bg-[var(--echo-warning)]"
                        style={{
                          height: `${(d.miss / total) * 100}%`,
                          bottom: `${(d.comp / total) * 100}%`,
                        }}
                      />
                    )}
                  </div>
                  <span className="ed-mono mt-2.5">{d.day}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 ed-mono">
            <span className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--echo-accent)]" /> Completed
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--echo-warning)]" /> Missed
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--echo-surface-3)] border border-[var(--echo-border)]" /> Scheduled
            </span>
          </div>
        </div>

        {/* Chart 2 — Attendance */}
        <div className="echo-card echo-card--pad">
          <ChartHeading label="Chart 2 — Attendance" meta="September 2026 · Present / Absent / Late" />
          <Bars
            data={[
              { label: 'Present', value: presentDays },
              { label: 'Absent', value: absentDays },
              { label: 'Late', value: lateDays },
            ]}
          />
        </div>

        {/* Chart 3 — Work Activity */}
        <div className="echo-card echo-card--pad">
          <ChartHeading label="Chart 3 — Work Activity" meta="September 2026 · cumulative submissions" />
          <Bars
            tone="accent"
            data={[
              { label: 'New Tasks Completed', value: newCompleted, note: `${newCompleted}` },
              { label: 'Activities Completed', value: actCompleted, note: `${actCompleted}` },
              {
                label: 'Submissions Completed',
                value: newCompleted + actCompleted + vouchers.length,
                note: `${newCompleted + actCompleted + vouchers.length}`,
              },
            ]}
          />
          <p className="ed-mono mt-5 max-w-2xl leading-relaxed">
            Task evidence, activity resolutions, and vouchers submitted across the current monthly cycle.
          </p>
        </div>

        {/* Chart 4 — Working Hours */}
        <div className="echo-card echo-card--pad">
          <ChartHeading label="Chart 4 — Working Hours" meta="Recent recorded days · hours on site" />
          <Bars data={hoursSeries} />
        </div>

        {/* Chart 5 — Regular Task Performance */}
        <div className="echo-card echo-card--pad">
          <ChartHeading label="Chart 5 — Regular Task Performance" meta="Historical weekly completion trend" />
          <Bars tone="accent" data={weeklyTrend} />
          <p className="ed-mono mt-5 max-w-2xl leading-relaxed">
            Weekly completion percentage of daily recurring regular tasks over the past four operational weeks.
          </p>
        </div>
      </section>

      {/* Operational Summary + Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="echo-card echo-card--pad">
          <div className="flex items-center gap-2.5 mb-5">
            <TrendingUp className="w-4 h-4 text-[var(--echo-accent)]" />
            <h2 className="ed-h2">Operational Summary</h2>
          </div>
          <div className="divide-y divide-[var(--echo-border)]">
            {summaryRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 py-3">
                <span className="text-[13px] text-[var(--echo-ink-3)]">{row.label}</span>
                <span className="font-mono text-[13px] font-medium text-[var(--echo-ink)] tabular-nums">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="echo-card echo-card--pad">
          <div className="flex items-center gap-2.5 mb-5">
            <BarChart3 className="w-4 h-4 text-[var(--echo-accent)]" />
            <h2 className="ed-h2">Recent Activity Log</h2>
          </div>
          <div className="divide-y divide-[var(--echo-border)]">
            {activityLog.map((act, i) => (
              <div key={i} className="flex items-start gap-3.5 py-3.5">
                <span className="echo-icon-tile shrink-0" style={{ width: '1.75rem', height: '1.75rem' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[13px] font-medium text-[var(--echo-ink)]">{act.title}</span>
                    <span className="ed-mono shrink-0">{act.time}</span>
                  </div>
                  <p className="ed-sub mt-1 text-[12px]">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
