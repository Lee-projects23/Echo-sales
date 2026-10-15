import React, { useState } from 'react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ShieldAlert,
  Lock,
  LogIn,
  LogOut,
  Timer,
  Activity,
  CalendarDays,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { StatusChip } from '../common/StatusChip';

const MonthNavButton: React.FC<{ direction: 'prev' | 'next'; onClick: () => void }> = ({
  direction,
  onClick,
}) => (
  <button
    onClick={onClick}
    aria-label={direction === 'prev' ? 'Previous month' : 'Next month'}
    className="echo-icon-tile hover:text-[var(--echo-ink)] hover:border-[var(--echo-border-strong)] transition-colors cursor-pointer"
  >
    {direction === 'prev' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
  </button>
);

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
  const attendanceRate = Math.round(((presentDays + lateDays) / Math.max(1, totalDays)) * 100);

  const summaryStats: { label: string; value: number; total: number; tone: string }[] = [
    { label: 'Present', value: presentDays, total: totalDays, tone: 'echo-progress-bar--positive' },
    { label: 'Late', value: lateDays, total: totalDays, tone: 'echo-progress-bar--warning' },
    { label: 'Absent', value: absentDays, total: totalDays, tone: 'echo-progress-bar--danger' },
  ];

  return (
    <div className="animate-echo-fade">
      {/* ================= Masthead ================= */}
      <section className="em-section pt-14 sm:pt-20 pb-12">
        <GlobalBackButton />
        <div className="mt-7 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <p className="ed-label mb-7">Daily Record</p>
            <h1 className="ed-h1">{t('attendance')}</h1>
            <p className="ed-sub mt-6 max-w-xl text-[14px]">
              Daily clock-in verification, working hours, and operational shift records.
            </p>
          </div>

          <div className="echo-segment self-start lg:self-auto">
            <MonthNavButton direction="prev" onClick={() => setCurrentMonth('August 2026')} />
            <span className="inline-flex items-center px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--echo-ink)] whitespace-nowrap">
              {currentMonth}
            </span>
            <MonthNavButton direction="next" onClick={() => setCurrentMonth('September 2026')} />
          </div>
        </div>
      </section>

      {/* ================= Today's attendance — hero band ================= */}
      <section
        className="em-invert em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="em-split items-start">
          <div className="em-split-lead">
            <div className="flex flex-wrap items-center gap-4 mb-9">
              <span className="ed-label">Today's Attendance</span>
              <span className="w-10 h-px" style={{ background: 'var(--echo-invert-rule-strong)' }} />
              <span className="ed-meta">Wednesday, 23 September 2026</span>
            </div>

            <div className="flex flex-wrap items-center gap-5 mb-8">
              <StatusChip status={todayAttendance.status} dot />
              <span className="ed-meta">
                Punctuality {punctualityRate}% · {presentDays}/{totalDays} on time
              </span>
            </div>

            {/* Oversized clock typography */}
            <div className="flex flex-wrap items-end gap-x-14 gap-y-8">
              <div>
                <div className="ed-meta mb-4">Check In</div>
                <div
                  className="font-serif text-[clamp(3rem,8vw,5.5rem)] leading-[0.85] tracking-[-0.035em] tabular-nums"
                  style={{ color: 'var(--echo-invert-ink)' }}
                >
                  {todayAttendance.checkIn || '—'}
                </div>
              </div>
              <div>
                <div className="ed-meta mb-4">Check Out</div>
                <div
                  className="font-serif text-[clamp(3rem,8vw,5.5rem)] leading-[0.85] tracking-[-0.035em] tabular-nums"
                  style={{ color: 'var(--echo-invert-ink)' }}
                >
                  {todayAttendance.checkOut || '—'}
                </div>
              </div>
              <div>
                <div className="ed-meta mb-4">Working Hours</div>
                <div
                  className="font-serif text-[clamp(3rem,8vw,5.5rem)] leading-[0.85] tracking-[-0.035em] tabular-nums"
                  style={{ color: 'var(--echo-accent)' }}
                >
                  {todayAttendance.hours || (todayAttendance.checkIn ? 'In Progress' : '—')}
                </div>
              </div>
            </div>

            <dl
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 pt-9"
              style={{ borderTop: 'var(--echo-rule) solid var(--echo-invert-rule)' }}
            >
              {[
                { k: 'Status', v: todayAttendance.status, icon: <Activity className="w-3 h-3" /> },
                { k: 'Check In', v: todayAttendance.checkIn || '—', icon: <LogIn className="w-3 h-3" /> },
                { k: 'Check Out', v: todayAttendance.checkOut || '—', icon: <LogOut className="w-3 h-3" /> },
                { k: 'Hours', v: todayAttendance.hours || '—', icon: <Timer className="w-3 h-3" /> },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="ed-meta flex items-center gap-1.5">
                    {item.icon}
                    {item.k}
                  </dt>
                  <dd
                    className="mt-3 text-[15px] font-bold tracking-[-0.01em]"
                    style={{ color: 'var(--echo-invert-ink)' }}
                  >
                    {item.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="em-split-side w-full">
            {/* Primary control */}
            {todayAttendance.status === 'Not Checked In' ? (
              <button onClick={handleCheckIn} className="ed-btn w-full !py-4">
                <Clock className="w-4 h-4" />
                <span>Record Check In (8:58 AM)</span>
              </button>
            ) : todayAttendance.status === 'Checked In' || todayAttendance.status === 'Late' ? (
              canCheckOut ? (
                <div className="space-y-5">
                  <button onClick={() => handleCheckOut()} className="ed-btn w-full !py-4">
                    <Clock className="w-4 h-4" />
                    <span>Check Out — Available (6:04 PM)</span>
                  </button>
                  <p className="ed-meta inline-flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5" style={{ color: 'var(--echo-positive)' }} />
                    Regular Tasks: {regularTasksCompletedToday} / {regularTasksTotalToday} completed
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--echo-invert-ink-2)' }}>
                    Complete all required tasks before checking out.
                  </p>
                  <button
                    onClick={() => handleCheckOut()}
                    disabled
                    className="ed-btn w-full !py-4"
                    title="Check Out — Locked"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Check Out — Locked</span>
                  </button>
                  <p className="ed-meta inline-flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    {regularTasksCompletedToday} / {regularTasksTotalToday} tasks complete
                  </p>
                </div>
              )
            ) : (
              <div className="echo-chip echo-chip--positive !py-2.5 !px-4">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Logged and verified with Admin Operations Monitor</span>
              </div>
            )}

            {/* Attendance summary — integrated figures */}
            <div
              className="mt-12 pt-9"
              style={{ borderTop: 'var(--echo-rule) solid var(--echo-invert-rule)' }}
            >
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <h2 className="ed-h3">Attendance Summary</h2>
                </div>
                <span className="echo-chip echo-chip--accent">{attendanceRate}% present or late</span>
              </div>

              <div className="space-y-7">
                {summaryStats.map((s) => {
                  const pct = s.total > 0 ? Math.round((s.value / s.total) * 100) : 0;
                  return (
                    <div key={s.label}>
                      <div className="flex items-baseline justify-between gap-4 mb-3">
                        <span className="ed-meta">{s.label}</span>
                        <span
                          className="font-mono text-[15px] font-bold tabular-nums"
                          style={{ color: 'var(--echo-invert-ink)' }}
                        >
                          {s.value}
                        </span>
                      </div>
                      <div className="echo-progress">
                        <div className={`echo-progress-bar ${s.tone}`} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="ed-meta mt-2.5">
                        {pct}% of {s.total} logged days
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Attendance history ================= */}
      <section
        className="em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-9">
          <h2 className="ed-h2">Attendance History</h2>
          <div className="ed-meta flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>
              Present: <strong className="font-bold text-[var(--echo-ink)]">{presentDays}</strong>
            </span>
            <span>
              Late: <strong className="font-bold text-[var(--echo-ink)]">{lateDays}</strong>
            </span>
            <span>
              Absent: <strong className="font-bold text-[var(--echo-ink)]">{absentDays}</strong>
            </span>
            <span aria-hidden>·</span>
            <span>
              Punctuality: <strong className="font-bold text-[var(--echo-ink)]">{punctualityRate}%</strong>
            </span>
          </div>
        </div>

        <div style={{ borderTop: 'var(--echo-rule) solid var(--echo-ink)' }}>
          <div className="overflow-x-auto echo-scroll">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr>
                  <th className="ed-th">Date</th>
                  <th className="ed-th">Status</th>
                  <th className="ed-th">Check In</th>
                  <th className="ed-th">Check Out</th>
                  <th className="ed-th text-right">Hours</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((rec) => (
                  <tr
                    key={rec.id}
                    className="transition-colors hover:bg-[var(--echo-surface-2)]"
                    style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
                  >
                    <td className="ed-td font-medium">{rec.dateFormatted}</td>
                    <td className="ed-td">
                      <StatusChip status={rec.status} />
                    </td>
                    <td className="ed-td font-mono text-[12px] text-[var(--echo-ink-3)]">
                      {rec.checkIn || '—'}
                    </td>
                    <td className="ed-td font-mono text-[12px] text-[var(--echo-ink-3)]">
                      {rec.checkOut || '—'}
                    </td>
                    <td className="ed-td font-mono text-[12px] text-right text-[var(--echo-ink)] tabular-nums">
                      {rec.hours || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
