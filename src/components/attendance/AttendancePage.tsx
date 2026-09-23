import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';

export const AttendancePage: React.FC = () => {
  const {
    todayAttendance,
    attendance,
    handleCheckIn,
    handleCheckOut,
    t,
  } = usePortal();

  const [currentMonth, setCurrentMonth] = useState('September 2026');

  // Calculate statistics from attendance history
  const totalDays = attendance.length;
  const presentDays = attendance.filter((a) => a.status === 'Present' || a.status === 'Checked In').length;
  const lateDays = attendance.filter((a) => a.status === 'Late').length;
  const absentDays = attendance.filter((a) => a.status === 'Absent').length;
  const punctualityRate = Math.round(((presentDays) / Math.max(1, totalDays)) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in duration-150">
      <GlobalBackButton />

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {t('attendance')}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Daily clock-in verification, working hours, and operational shift records
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setCurrentMonth('August 2026')}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold px-2 text-neutral-800 dark:text-neutral-200">
            {currentMonth}
          </span>
          <button
            onClick={() => setCurrentMonth('September 2026')}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Today's Attendance Overview Card */}
      <div className="apple-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Today's Attendance
              </div>
              <div className="text-lg font-bold text-neutral-900 dark:text-white">
                Wednesday, 23 September 2026
              </div>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              todayAttendance.status === 'Checked In'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : todayAttendance.status === 'Present'
                ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                : todayAttendance.status === 'Late'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {todayAttendance.status}
          </span>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <div className="text-[11px] text-neutral-500 mb-1">Current Status</div>
            <div className="text-sm font-bold text-neutral-900 dark:text-white">
              {todayAttendance.status}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <div className="text-[11px] text-neutral-500 mb-1">Check In</div>
            <div className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
              {todayAttendance.checkIn || '—'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <div className="text-[11px] text-neutral-500 mb-1">Check Out</div>
            <div className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
              {todayAttendance.checkOut || '—'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <div className="text-[11px] text-neutral-500 mb-1">Total Working Hours</div>
            <div className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
              {todayAttendance.hours || (todayAttendance.checkIn ? 'In Progress' : '—')}
            </div>
          </div>
        </div>

        {/* Check in / Check out Action button */}
        <div className="pt-2 flex items-center justify-end">
          {todayAttendance.status === 'Not Checked In' ? (
            <button
              onClick={handleCheckIn}
              className="px-6 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Record Check In (8:58 AM)</span>
            </button>
          ) : todayAttendance.status === 'Checked In' || todayAttendance.status === 'Late' ? (
            <button
              onClick={handleCheckOut}
              className="px-6 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Record Check Out (6:04 PM)</span>
            </button>
          ) : (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Logged and Verified with Admin Operations Monitor</span>
            </div>
          )}
        </div>
      </div>

      {/* Attendance History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            Attendance History
          </h2>
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
            <span>Present: <strong className="text-neutral-900 dark:text-white">{presentDays}</strong></span>
            <span>Late: <strong className="text-amber-500">{lateDays}</strong></span>
            <span>Absent: <strong className="text-red-500">{absentDays}</strong></span>
          </div>
        </div>

        {/* Table */}
        <div className="apple-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 text-neutral-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Check In</th>
                  <th className="py-3.5 px-5">Check Out</th>
                  <th className="py-3.5 px-5 text-right">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {attendance.map((rec) => {
                  return (
                    <tr
                      key={rec.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-semibold text-neutral-900 dark:text-white">
                        {rec.dateFormatted}
                      </td>

                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            rec.status === 'Present' || rec.status === 'Checked In'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : rec.status === 'Late'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : rec.status === 'Absent'
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {rec.status === 'Present' || rec.status === 'Checked In' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : rec.status === 'Late' ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : rec.status === 'Absent' ? (
                            <XCircle className="w-3 h-3" />
                          ) : null}
                          {rec.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 font-mono tabular-nums text-neutral-600 dark:text-neutral-300">
                        {rec.checkIn || '—'}
                      </td>

                      <td className="py-3.5 px-5 font-mono tabular-nums text-neutral-600 dark:text-neutral-300">
                        {rec.checkOut || '—'}
                      </td>

                      <td className="py-3.5 px-5 font-mono tabular-nums text-right font-semibold text-neutral-900 dark:text-white">
                        {rec.hours || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
