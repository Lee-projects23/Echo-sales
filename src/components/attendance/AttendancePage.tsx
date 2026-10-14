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

const MetricTile: React.FC<{
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="echo-tile !px-4 !py-3.5">
    <div className="flex items-center gap-2">
      <span className="text-[var(--echo-ink-3)]">{icon}</span>
      <div className="echo-kpi-label">{label}</div>
    </div>
    <div className="mt-2 font-mono text-[15px] font-medium text-[var(--echo-ink)] tabular-nums">
      {value}
    </div>
  </div>
);

const SummaryStat: React.FC<{
  label: string;
  value: number;
  total: number;
  tone: string;
}> = ({ label, value, total, tone }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="echo-tile !px-4 !py-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <div className="echo-kpi-label">{label}</div>
        <div className="font-mono text-[13px] font-semibold text-[var(--echo-ink)] tabular-nums">
          {value}
        </div>
      </div>
      <div className="echo-progress mt-3">
        <div className={`echo-progress-bar ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="ed-mono mt-2">{pct}% of {total} logged days</div>
    </div>
  );
};

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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-echo-fade">
      {/* Heading */}
      <div className="mb-10">
        <GlobalBackButton />
        <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="ed-label mb-4">Daily Record</p>
            <h1 className="ed-h1">{t('attendance')}</h1>
            <p className="ed-sub mt-3 max-w-xl">
              Daily clock-in verification, working hours, and operational shift records.
            </p>
          </div>

          <div className="echo-segment self-start sm:self-auto">
            <MonthNavButton direction="prev" onClick={() => setCurrentMonth('August 2026')} />
            <span className="inline-flex items-center px-3 text-[12px] font-semibold text-[var(--echo-ink)] whitespace-nowrap">
              {currentMonth}
            </span>
            <MonthNavButton direction="next" onClick={() => setCurrentMonth('September 2026')} />
          </div>
        </div>
      </div>

      {/* Today's Attendance */}
      <section className="mb-8">
        <div className="echo-card echo-card--pad lg:p-8">
          <div className="echo-section-head">
            <span className="ed-label">Today's Attendance</span>
            <span className="echo-rule" />
            <span className="ed-mono">Wednesday, 23 September 2026</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-7">
            <StatusChip status={todayAttendance.status} dot />
            <span className="ed-mono">
              Punctuality {punctualityRate}% · {presentDays}/{totalDays} on time
            </span>
          </div>

          {/* Current status + clock metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricTile
              label="Current Status"
              value={todayAttendance.status}
              icon={<Activity className="w-3.5 h-3.5" />}
            />
            <MetricTile
              label="Check In"
              value={todayAttendance.checkIn || '—'}
              icon={<LogIn className="w-3.5 h-3.5" />}
            />
            <MetricTile
              label="Check Out"
              value={todayAttendance.checkOut || '—'}
              icon={<LogOut className="w-3.5 h-3.5" />}
            />
            <MetricTile
              label="Working Hours"
              value={todayAttendance.hours || (todayAttendance.checkIn ? 'In Progress' : '—')}
              icon={<Timer className="w-3.5 h-3.5" />}
            />
          </div>

          {/* Attendance summary */}
          <div className="mt-8 pt-7 border-t border-[var(--echo-border)]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="echo-icon-tile" style={{ width: '1.75rem', height: '1.75rem' }}>
                  <CalendarDays className="w-3.5 h-3.5" />
                </span>
                <h2 className="ed-h2">Attendance Summary</h2>
              </div>
              <span className="echo-chip echo-chip--accent">{attendanceRate}% present or late</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <SummaryStat
                label="Present"
                value={presentDays}
                total={totalDays}
                tone="echo-progress-bar--positive"
              />
              <SummaryStat label="Late" value={lateDays} total={totalDays} tone="echo-progress-bar--warning" />
              <SummaryStat
                label="Absent"
                value={absentDays}
                total={totalDays}
                tone="echo-progress-bar--danger"
              />
            </div>
          </div>

          {/* Check in / check out control */}
          <div className="mt-8 flex flex-col items-start lg:items-end gap-4">
            {todayAttendance.status === 'Not Checked In' ? (
              <button onClick={handleCheckIn} className="ed-btn">
                <Clock className="w-4 h-4" />
                <span>Record Check In (8:58 AM)</span>
              </button>
            ) : todayAttendance.status === 'Checked In' || todayAttendance.status === 'Late' ? (
              canCheckOut ? (
                <>
                  <div className="ed-mono inline-flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[var(--echo-positive)]" />
                    <span className="text-[var(--echo-positive)]">
                      Regular Tasks: {regularTasksCompletedToday} / {regularTasksTotalToday} completed
                    </span>
                  </div>
                  <button onClick={() => handleCheckOut()} className="ed-btn">
                    <Clock className="w-4 h-4" />
                    <span>Check Out — Available (6:04 PM)</span>
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[12px] text-[var(--echo-ink-3)] max-w-md lg:text-right leading-relaxed">
                    Complete all required tasks before checking out.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="echo-chip echo-chip--warning">
                      <Lock className="w-3 h-3" />
                      {regularTasksCompletedToday} / {regularTasksTotalToday} tasks complete
                    </span>
                    <button
                      onClick={() => handleCheckOut()}
                      disabled
                      className="ed-btn"
                      title="Check Out — Locked"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Check Out — Locked</span>
                    </button>
                  </div>
                </>
              )
            ) : (
              <div className="echo-chip echo-chip--positive">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Logged and verified with Admin Operations Monitor</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Attendance History */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
          <h2 className="ed-h2">Attendance History</h2>
          <div className="ed-mono flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              Present: <strong className="text-[var(--echo-ink)] font-semibold">{presentDays}</strong>
            </span>
            <span>
              Late: <strong className="text-[var(--echo-ink)] font-semibold">{lateDays}</strong>
            </span>
            <span>
              Absent: <strong className="text-[var(--echo-ink)] font-semibold">{absentDays}</strong>
            </span>
            <span aria-hidden>·</span>
            <span>
              Punctuality: <strong className="text-[var(--echo-ink)] font-semibold">{punctualityRate}%</strong>
            </span>
          </div>
        </div>

        <div className="echo-card overflow-hidden">
          <div className="overflow-x-auto echo-scroll">
            <table className="w-full text-left min-w-[560px]">
              <thead>
                <tr className="border-b border-[var(--echo-border)] bg-[var(--echo-surface-2)]">
                  <th className="ed-th">Date</th>
                  <th className="ed-th">Status</th>
                  <th className="ed-th">Check In</th>
                  <th className="ed-th">Check Out</th>
                  <th className="ed-th text-right">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--echo-border)]">
                {attendance.map((rec) => (
                  <tr key={rec.id} className="transition-colors hover:bg-[var(--echo-surface-2)]">
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
