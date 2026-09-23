import React from 'react';
import {
  CheckSquare,
  AlertCircle,
  CalendarCheck,
  Award,
  Clock,
  FileCheck,
  TrendingUp,
  Receipt,
  UserCheck,
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
    notifications,
    t,
  } = usePortal();

  // Regular Tasks metrics
  const regScheduled = regularTasks.length;
  const regCompleted = regularTasks.filter((t) => t.status === 'Completed').length;
  const regCompletionPct = Math.round((regCompleted / Math.max(1, regScheduled)) * 100);

  // New Tasks metrics
  const newAssigned = assignedTasks.length;
  const newApproved = assignedTasks.filter((t) => t.status === 'Approved').length;
  const newSubmitted = assignedTasks.filter((t) => t.status === 'Submitted').length;
  const newPending = assignedTasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;

  // Activities metrics
  const actTotal = activities.length;
  const actCompleted = activities.filter((a) => a.status === 'Work Completed' || a.status === 'Resolved' || a.status === 'Closed').length;
  const actPending = activities.filter((a) => a.status === 'Raised' || a.status === 'In Progress' || a.status === 'Awaiting Admin Verification').length;

  // Attendance metrics
  const attTotal = attendance.length;
  const attPresent = attendance.filter((a) => a.status === 'Present' || a.status === 'Checked In').length;
  const attLate = attendance.filter((a) => a.status === 'Late').length;
  const attAbsent = attendance.filter((a) => a.status === 'Absent').length;
  const attPercentage = Math.round(((attPresent + attLate * 0.8) / Math.max(1, attTotal)) * 100);

  // Recent Activity Feed
  const recentActivities = [
    {
      title: 'Regular Task Checked',
      desc: 'Morning Site Inspection completed at 9:00 AM',
      time: '9:00 AM',
      type: 'regular',
    },
    {
      title: 'Shift Clock-In',
      desc: 'Attendance registered at 8:58 AM (Present)',
      time: '8:58 AM',
      type: 'attendance',
    },
    {
      title: 'Voucher VCH-9042 Submitted',
      desc: 'Emergency multimeter tool probe reimbursement submitted',
      time: '8:45 AM',
      type: 'voucher',
    },
    {
      title: 'Task Evidence Update',
      desc: 'ABC Landscaping: Valve Calibration underway',
      time: 'Yesterday',
      type: 'task',
    },
    {
      title: 'Activity Resolution',
      desc: 'Booster Pump #3 Acoustic Vibration Bushing installed',
      time: '22 Sep',
      type: 'activity',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in duration-150">
      <GlobalBackButton />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {t('dashboard')}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Personal operational performance metrics for {currentEmployee.name} ({currentEmployee.employeeCode})
        </p>
      </div>

      {/* 6 Core Personal Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Regular Tasks */}
        <div className="apple-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Regular Tasks</span>
            <CheckSquare className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
            {regCompleted} <span className="text-sm font-normal text-neutral-400">/ {regScheduled}</span>
          </div>
          <div className="text-[11px] text-neutral-500">
            Completion Rate: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{regCompletionPct}%</strong>
          </div>
        </div>

        {/* New Tasks */}
        <div className="apple-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">New Tasks</span>
            <FileCheck className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
            {newApproved} <span className="text-sm font-normal text-neutral-400">approved</span>
          </div>
          <div className="text-[11px] text-neutral-500 font-mono">
            {newSubmitted} awaiting review · {newPending} active
          </div>
        </div>

        {/* Activities */}
        <div className="apple-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Activities Completed</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
            {actCompleted} <span className="text-sm font-normal text-neutral-400">/ {actTotal}</span>
          </div>
          <div className="text-[11px] text-neutral-500 font-mono">
            {actPending} pending resolution
          </div>
        </div>

        {/* Leave Taken */}
        <div className="apple-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Leave Balance</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
            {currentEmployee.leaveBalance.taken}{' '}
            <span className="text-sm font-normal text-neutral-400">days taken</span>
          </div>
          <div className="text-[11px] text-neutral-500 font-mono">
            {currentEmployee.leaveBalance.remaining} days remaining ({currentEmployee.leaveBalance.total} annual)
          </div>
        </div>

        {/* Days Absent */}
        <div className="apple-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Days Absent</span>
            <CalendarCheck className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
            {attAbsent} <span className="text-sm font-normal text-neutral-400">days</span>
          </div>
          <div className="text-[11px] text-neutral-500 font-mono">
            {attLate} late arrivals logged this month
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="apple-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Attendance Pct</span>
            <TrendingUp className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
            {attPercentage}%
          </div>
          <div className="text-[11px] text-neutral-500">
            Calculated across {attTotal} scheduled shifts
          </div>
        </div>
      </div>

      {/* Detailed Operational Breakdown Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Work Breakdown */}
        <div className="apple-card rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            Operational Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-500">Assigned Regular Tasks Today</span>
              <span className="font-mono font-semibold text-neutral-900 dark:text-white">{regScheduled}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-500">Assigned New Field Tasks</span>
              <span className="font-mono font-semibold text-neutral-900 dark:text-white">{newAssigned}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-500">Active Activities (Issues)</span>
              <span className="font-mono font-semibold text-neutral-900 dark:text-white">{actTotal}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-500">Submitted Vouchers</span>
              <span className="font-mono font-semibold text-neutral-900 dark:text-white">{vouchers.length}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-neutral-500">Current Department</span>
              <span className="font-semibold text-neutral-900 dark:text-white">{currentEmployee.department}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="apple-card rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            Recent Activity Log
          </h2>

          <div className="space-y-3">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 dark:text-white truncate">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono shrink-0 ml-2">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-[11px] truncate mt-0.5">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
