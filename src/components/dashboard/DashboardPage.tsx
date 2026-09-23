import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';

interface BarValue {
  label: string;
  value: number;
  note?: string;
}

const Bars: React.FC<{ data: BarValue[]; primaryLabel?: string }> = ({ data }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-4">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center justify-end">
          <span className="font-mono text-xs text-neutral-950 dark:text-neutral-50 tabular-nums mb-2">
            {d.note ? d.note : Math.round(d.value)}
          </span>
          <div className="w-full max-w-[46px] h-36 flex items-end border-b border-neutral-900/15 dark:border-white/15">
            <div
              className="w-full bg-neutral-950 dark:bg-white"
              style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }}
            />
          </div>
          <span className="ed-mono mt-2 whitespace-nowrap">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const {
    currentEmployee,
    regularTasks,
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
    <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      {/* Heading */}
      <div className="mb-12">
        <GlobalBackButton />
        <div className="mt-4">
          <p className="ed-label mb-4">Personal Record</p>
          <h1 className="ed-h1">{t('dashboard')}</h1>
          <p className="ed-sub mt-3 max-w-xl">
            {currentEmployee.name} ({currentEmployee.employeeCode}) — Personal operational overview
          </p>
        </div>
      </div>

      {/* KPI Section — executive blocks */}
      <section className="mb-16">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="ed-label">Key Performance Indicators</span>
          <span className="hidden sm:inline-block h-px w-8 bg-neutral-900/20 dark:bg-white/20" />
          <span className="ed-mono">Live · Synced with Admin Monitor</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-neutral-900/10 dark:border-white/10">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="border-r border-b border-neutral-900/10 dark:border-white/10 p-6"
            >
              <div className="ed-label mb-5">{kpi.label}</div>
              <div className="space-y-3">
                {kpi.cols.map((c) => (
                  <div
                    key={c.k}
                    className="flex items-baseline justify-between gap-3 border-t border-neutral-900/5 dark:border-white/5 pt-2"
                  >
                    <span className="text-[11px] uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                      {c.k}
                    </span>
                    <span className="font-mono text-sm text-neutral-950 dark:text-neutral-50 tabular-nums">
                      {c.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Charts */}
      <section className="mb-16 space-y-16">
        {/* Chart 1 — Task Completion */}
        <div>
          <div className="flex items-baseline gap-4 mb-8">
            <span className="ed-label">Chart 1 — Task Completion</span>
            <span className="ed-mono">This week · scheduled vs completed vs missed</span>
          </div>
          <div className="flex items-end gap-4">
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
                <div key={d.day} className="flex-1 flex flex-col items-center">
                  <span className="font-mono text-[11px] text-neutral-950 dark:text-neutral-50 tabular-nums mb-2">
                    {d.comp}/{d.miss > 0 ? d.miss : total}
                  </span>
                  <div className="relative w-full max-w-[42px] h-36 border border-neutral-900/15 dark:border-white/15">
                    <div
                      className="absolute left-0 right-0 bottom-0 bg-neutral-950 dark:bg-white"
                      style={{ height: `${(d.comp / total) * 100}%` }}
                    />
                    {d.miss > 0 && (
                      <div
                        className="absolute left-0 right-0 bg-neutral-300 dark:bg-neutral-600"
                        style={{
                          height: `${(d.miss / total) * 100}%`,
                          bottom: `${(d.comp / total) * 100}%`,
                        }}
                      />
                    )}
                  </div>
                  <span className="ed-mono mt-3">{d.day}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex items-center gap-6 ed-mono">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-neutral-950 dark:bg-white" /> Completed
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-neutral-300 dark:bg-neutral-600" /> Missed
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border border-neutral-900/15 dark:border-white/15" /> Scheduled
            </span>
          </div>
        </div>

        {/* Chart 2 — Attendance */}
        <div>
          <div className="flex items-baseline gap-4 mb-8">
            <span className="ed-label">Chart 2 — Attendance</span>
            <span className="ed-mono">September 2026 · Present / Absent / Late</span>
          </div>
          <Bars
            data={[
              { label: 'Present', value: presentDays },
              { label: 'Absent', value: absentDays },
              { label: 'Late', value: lateDays },
            ]}
          />
        </div>

        {/* Chart 3 — Work Activity */}
        <div>
          <div className="flex items-baseline gap-4 mb-8">
            <span className="ed-label">Chart 3 — Work Activity</span>
            <span className="ed-mono">September 2026 · cumulative submissions</span>
          </div>
          <Bars
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
          <p className="ed-mono mt-4 max-w-2xl">
            Task evidence, activity resolutions, and vouchers submitted across the current monthly cycle.
          </p>
        </div>

        {/* Chart 4 — Working Hours */}
        <div>
          <div className="flex items-baseline gap-4 mb-8">
            <span className="ed-label">Chart 4 — Working Hours</span>
            <span className="ed-mono">Recent recorded days · hours on site</span>
          </div>
          <Bars data={hoursSeries} />
        </div>

        {/* Chart 5 — Regular Task Performance */}
        <div>
          <div className="flex items-baseline gap-4 mb-8">
            <span className="ed-label">Chart 5 — Regular Task Performance</span>
            <span className="ed-mono">Historical weekly completion trend</span>
          </div>
          <Bars data={weeklyTrend} />
          <p className="ed-mono mt-4 max-w-2xl">
            Weekly completion percentage of daily recurring regular tasks over the past four operational weeks.
          </p>
        </div>
      </section>

      {/* Operational Summary + Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        <div>
          <div className="mb-2">
            <h2 className="ed-h2">Operational Summary</h2>
          </div>
          <div>
            {summaryRows.map((row, idx) => (
              <div
                key={row.label}
                className={`flex items-baseline justify-between gap-4 py-4 ${
                  idx === 0 ? '' : ''
                } border-t border-neutral-900/10 dark:border-white/10`}
              >
                <span className="text-sm text-neutral-500 dark:text-neutral-400">{row.label}</span>
                <span className="font-mono text-sm text-neutral-950 dark:text-neutral-50 tabular-nums">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2">
            <h2 className="ed-h2">Recent Activity Log</h2>
          </div>
          <div>
            {activityLog.map((act, i) => (
              <div
                key={i}
                className={`${i === 0 ? 'border-t' : ''} border-t border-neutral-900/10 dark:border-white/10 py-4`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-sm text-neutral-950 dark:text-neutral-50">{act.title}</span>
                  <span className="ed-mono shrink-0">{act.time}</span>
                </div>
                <p className="ed-sub mt-1 text-xs">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};