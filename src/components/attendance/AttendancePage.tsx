import React, { useState } from 'react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ShieldAlert,
  Lock,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';

export const AttendancePage: React.FC = () => {
  const {
    todayAttendance,
    attendance,
    handleCheckIn,
    handleCheckOut,
    regularTasksCompletedToday,
    regularTasksTotalToday,
    canCheckOut,
    t,
  } = usePortal();

  const [currentMonth, setCurrentMonth] = useState('September 2026');

  const totalDays = attendance.length;
  const presentDays = attendance.filter((a) => a.status === 'Present' || a.status === 'Checked In').length;
  const lateDays = attendance.filter((a) => a.status === 'Late').length;
  const absentDays = attendance.filter((a) => a.status === 'Absent').length;
  const punctualityRate = Math.round((presentDays / Math.max(1, totalDays)) * 100);

  return (
    <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      {/* Heading */}
      <div className="mb-10">
        <GlobalBackButton />
        <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="ed-label mb-4">Daily Record</p>
            <h1 className="ed-h1">{t('attendance')}</h1>
            <p className="ed-sub mt-3 max-w-xl">
              Daily clock-in verification, working hours, and operational shift records.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => setCurrentMonth('August 2026')}
              className="p-1 text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-800 dark:text-neutral-200">
              {currentMonth}
            </span>
            <button
              onClick={() => setCurrentMonth('September 2026')}
              className="p-1 text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Today's Attendance — editorial section */}
      <section className="mb-14 pb-12 border-b border-neutral-900/10 dark:border-white/10">
        <div className="flex items-center justify-between mb-8 pb-4">
          <div className="flex items-baseline gap-4">
            <span className="ed-label">Today's Attendance</span>
            <span className="hidden sm:inline-block h-px w-8 bg-neutral-900/20 dark:bg-white/20" />
            <span className="ed-mono">Wednesday, 23 September 2026</span>
          </div>
          <span className="ed-tag text-neutral-700 dark:text-neutral-300">
            {todayAttendance.status}
          </span>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-4">
            <div className="ed-label mb-2">Current Status</div>
            <div className="text-sm text-neutral-950 dark:text-neutral-50">{todayAttendance.status}</div>
          </div>
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-4">
            <div className="ed-label mb-2">Check In</div>
            <div className="font-mono text-sm text-neutral-950 dark:text-neutral-50">
              {todayAttendance.checkIn || '—'}
            </div>
          </div>
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-4">
            <div className="ed-label mb-2">Check Out</div>
            <div className="font-mono text-sm text-neutral-950 dark:text-neutral-50">
              {todayAttendance.checkOut || '—'}
            </div>
          </div>
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-4">
            <div className="ed-label mb-2">Working Hours</div>
            <div className="font-mono text-sm text-neutral-950 dark:text-neutral-50">
              {todayAttendance.hours || (todayAttendance.checkIn ? 'In Progress' : '—')}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-end gap-4">
          {todayAttendance.status === 'Not Checked In' ? (
            <button onClick={handleCheckIn} className="ed-btn">
              <Clock className="w-3.5 h-3.5" />
              <span>Record Check In (8:58 AM)</span>
            </button>
          ) : todayAttendance.status === 'Checked In' || todayAttendance.status === 'Late' ? (
            <>
              {canCheckOut ? (
                <>
                  <div className="flex items-center gap-2 ed-mono">
                    <CheckCircle className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      Regular Tasks: {regularTasksCompletedToday} / {regularTasksTotalToday} completed
                    </span>
                  </div>
                  <button
                    onClick={() => handleCheckOut()}
                    className="ed-btn"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Check Out — Available (6:04 PM)</span>
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md text-right leading-relaxed">
                    Complete all required tasks before checking out.
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="ed-tag text-neutral-500 dark:text-neutral-400">
                      <Lock className="w-3.5 h-3.5" />
                      Regular Tasks: {regularTasksCompletedToday} / {regularTasksTotalToday} completed
                    </span>
                    <button
                      onClick={() => handleCheckOut()}
                      disabled
                      className="ed-btn"
                      title="Check Out — Locked"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Check Out — Locked</span>
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="ed-tag text-neutral-500 dark:text-neutral-400">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Logged and verified with Admin Operations Monitor</span>
            </div>
          )}
        </div>
      </section>

      {/* Attendance History */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
          <h2 className="ed-h2">Attendance History</h2>
          <div className="ed-mono flex items-center gap-5">
            <span>Present: <strong className="text-neutral-950 dark:text-neutral-50 font-semibold">{presentDays}</strong></span>
            <span>Late: <strong className="font-semibold text-neutral-950 dark:text-neutral-50">{lateDays}</strong></span>
            <span>Absent: <strong className="font-semibold text-neutral-950 dark:text-neutral-50">{absentDays}</strong></span>
            <span>·</span>
            <span>Punctuality: <strong className="text-neutral-950 dark:text-neutral-50 font-semibold">{punctualityRate}%</strong></span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-t border-b border-neutral-900/10 dark:border-white/10">
                <th className="ed-th">Date</th>
                <th className="ed-th">Status</th>
                <th className="ed-th">Check In</th>
                <th className="ed-th">Check Out</th>
                <th className="ed-th text-right">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/10 dark:divide-white/10">
              {attendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-neutral-900/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="ed-td font-medium">{rec.dateFormatted}</td>
                  <td className="ed-td">
                    <span className="ed-tag text-neutral-700 dark:text-neutral-300">
                      {rec.status}
                    </span>
                  </td>
                  <td className="ed-td font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {rec.checkIn || '—'}
                  </td>
                  <td className="ed-td font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    {rec.checkOut || '—'}
                  </td>
                  <td className="ed-td font-mono text-xs text-right text-neutral-950 dark:text-neutral-50 tabular-nums">
                    {rec.hours || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};