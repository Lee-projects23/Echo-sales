import React from 'react';

/**
 * Visual tone for a status chip. Purely presentational — it never changes
 * which statuses exist or how they are produced.
 */
export type ChipTone =
  | 'neutral'
  | 'accent'
  | 'positive'
  | 'warning'
  | 'danger'
  | 'info';

const STATUS_TONES: Record<string, ChipTone> = {
  // Attendance
  'Not Checked In': 'neutral',
  'Checked In': 'info',
  'Checked Out': 'neutral',
  'Present': 'positive',
  'Late': 'warning',
  'Absent': 'danger',

  // Regular tasks
  'Pending': 'neutral',
  'In Progress': 'accent',
  'Completed': 'positive',

  // Assigned tasks
  'Submitted': 'info',
  'Approved': 'positive',
  'Rejected': 'danger',
  'Re-upload Requested': 'warning',

  // Activities
  'Raised': 'danger',
  'Acknowledged': 'neutral',
  'Assigned': 'info',
  'Work Completed': 'positive',
  'Awaiting Admin Verification': 'warning',
  'Resolved': 'positive',
  'Closed': 'neutral',
  'Reopened': 'danger',

  // Vouchers
  'Submitted for Admin Review': 'warning',
};

/** Resolve the visual tone for a known ECHO status string. */
export const statusTone = (status: string): ChipTone => STATUS_TONES[status] ?? 'neutral';

interface StatusChipProps {
  /** Existing status string — rendered verbatim. */
  status: string;
  /** Optional override when a caller needs a specific tone. */
  tone?: ChipTone;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Optional trailing dot for "live" indicators. */
  dot?: boolean;
  className?: string;
}

/**
 * Status chip used across the Employee Portal. Renders the exact same status
 * strings as before; only the visual treatment is upgraded. Long statuses
 * (e.g. "Submitted for Admin Review") shorten their tracking slightly so they
 * never wrap inside dense rows.
 */
export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  tone,
  icon,
  dot = false,
  className = '',
}) => (
  <span
    className={`echo-chip echo-chip--${tone ?? statusTone(status)} ${className}`.trim()}
    style={status.length > 14 ? { letterSpacing: '0.1em' } : undefined}
  >
    {dot && <span className="echo-dot" />}
    {icon}
    <span>{status}</span>
  </span>
);

export default StatusChip;
