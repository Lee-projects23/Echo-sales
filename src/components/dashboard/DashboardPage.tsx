import React from 'react';
import {
  ArrowRight,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';

export const DashboardPage: React.FC = () => {
  const {
    currentEmployee,
    regularTasks,
    assignedTasks,
    activities,
    attendance,
    vouchers,
    t,
  } = usePortal();

  const regScheduled = regularTasks.length;
  const regCompleted = regularTasks.filter((x) => x.status === 'Completed').length;
  const regCompletionPct = Math.round((regCompleted / Math.max(1, regScheduled)) * 100);

  const newAssigned = assignedTasks.length;
  const newApproved = assignedTasks.filter((x) => x.status === 'Approved').length;
  const newSubmitted = assignedTasks.filter((x) => x.status === 'Submitted').length;
  const newPending = assignedTasks.filter((x) => x.status === 'Pending' || x.status === 'In Progress').length;

  const actTotal = activities.length;
  const actCompleted = activities.filter(
    (a) => a.status === 'Work Completed' || a.status === 'Resolved' || a.status === 'Closed'
  ).length;
  const actPending = activities.filter(
    (a) => a.status === 'Raised' || a.status === 'In Progress' || a.status === 'Awaiting Admin Verification'
  ).length;

  const attTotal = attendance.length;
  const attPresent = attendance.filter((a) => a.status === 'Present' || a.status === 'Checked In').length;
  const attLate = attendance.filter((a) => a.status === 'Late').length;
  const attAbsent = attendance.filter((a) => a.status === 'Absent').length;
  const attPercentage = Math.round(((attPresent + attLate * 0.8) / Math.max(1, attTotal)) * 100);

  const recentActivities = [
    {
      title: 'Regular Task Checked',
      desc: 'Morning Site Inspection completed at 9:00 AM',
      time: '9:00 AM',
    },
    {
      title: 'Shift Clock-In',
      desc: 'Attendance registered at 8:58 AM (Present)',
      time: '8:58 AM',
    },
    {
      title: 'Voucher VCH-9042 Submitted',
      desc: 'Emergency multimeter tool probe reimbursement submitted',
      time: '8:45 AM',
    },
    {
      title: 'Task Evidence Update',
      desc: 'ABC Landscaping: Valve Calibration underway',
      time: 'Yesterday',
    },
    {
      title: 'Activity Resolution',
      desc: 'Booster Pump #3 Acoustic Vibration Bushing installed',
      time: '22 Sep',
    },
  ];

  const metrics: { label: string; value: string; note: string }[] = [
    {
      label: 'Regular Tasks',
      value: `${regCompleted} / ${regScheduled}`,
      note: `Completion rate ${regCompletionPct}%`,
    },
    {
      label: 'New Tasks',
      value: `${newApproved} approved`,
      note: `${newSubmitted} awaiting review · ${newPending} active`,
    },
    {
      label: 'Activities',
      value: `${actCompleted} / ${actTotal}`,
      note: `${actPending} pending resolution`,
    },
    {
      label: 'Leave Balance',
      value: `${currentEmployee.leaveBalance.taken} days taken`,
      note: `${currentEmployee.leaveBalance.remaining} remaining of ${currentEmployee.leaveBalance.total} annual`,
    },
    {
      label: 'Days Absent',
      value: `${attAbsent} days`,
      note: `${attLate} late arrivals this month`,
    },
    {
      label: 'Attendance',
      value: `${attPercentage}%`,
      note: `Across ${attTotal} scheduled shifts`,
    },
  ];

  const summaryRows: { label: string; value: string }[] = [
    { label: 'Assigned Regular Tasks Today', value: String(regScheduled) },
    { label: 'Assigned New Field Tasks', value: String(newAssigned) },
    { label: 'Active Activities (Issues)', value: String(actTotal) },
    { label: 'Submitted Vouchers', value: String(vouchers.length) },
    { label: 'Current Department', value: currentEmployee.department },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      <div className="mb-12">
        <GlobalBackButton />
        <div className="mt-4">
          <p className="ed-label mb-4">Personal Record</p>
          <h1 className="ed-h1">{t('dashboard')}</h1>
          <p className="ed-sub mt-3 max-w-xl">
            {currentEmployee.name} ({currentEmployee.employeeCode}) — operational performance metrics.
          </p>
        </div>
      </div>

      {/* Metrics Ledger */}
      <section className="mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`py-8 pr-6 ${
                i % 3 !== 0
                  ? 'border-t border-neutral-900/10 dark:border-white/10 lg:border-t-0 lg:border-l'
                  : 'border-t border-neutral-900/10 dark:border-white/10'
              }`}
            >
              <div className="ed-label mb-4">{m.label}</div>
              <div className="ed-stat max-w-[14ch] leading-tight">{m.value}</div>
              <div className="ed-mono mt-3">{m.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Operational Summary + Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="ed-h2">Operational Summary</h2>
            <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600" />
          </div>
          <div>
            {summaryRows.map((row, idx) => (
              <div
                key={row.label}
                className={`flex items-baseline justify-between gap-4 py-4 ${
                  idx === 0 ? 'border-t' : ''
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="ed-h2">Recent Activity Log</h2>
            <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600" />
          </div>
          <div>
            {recentActivities.map((act, i) => (
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