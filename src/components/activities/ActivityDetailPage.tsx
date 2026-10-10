import React, { useState } from 'react';
import { Check, CheckCircle2, Building, MapPin, Radio, CalendarClock, StickyNote } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { MockCamera } from '../common/MockCamera';
import { StatusChip } from '../common/StatusChip';

export const ActivityDetailPage: React.FC = () => {
  const { selectedActivityId, activities, submitActivityEvidence, setActiveTab, t } = usePortal();

  const activity = activities.find((a) => a.id === selectedActivityId) || activities[0];

  const [beforeImg, setBeforeImg] = useState<string>(activity.beforePhoto || '');
  const [afterImg, setAfterImg] = useState<string>(activity.afterPhoto || '');
  const [note, setNote] = useState<string>(activity.additionalNote || '');
  const [isSubmitted, setIsSubmitted] = useState(
    activity.status === 'Work Completed' || activity.status === 'Awaiting Admin Verification'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitActivityEvidence(activity.id, beforeImg, afterImg, note);
    setIsSubmitted(true);
  };

  const MetaTile: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="rounded-[var(--echo-radius-sm)] border border-[var(--echo-border)] bg-[var(--echo-surface-2)] p-4">
      <div className="echo-kpi-label">{label}</div>
      <div className="mt-2 text-[14px] font-medium text-[var(--echo-ink)]">{value}</div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-echo-fade">
      <GlobalBackButton onBack={() => setActiveTab('new-activity')} label="Back to Activities" />

      {/* Header */}
      <header className="echo-card echo-card--pad lg:p-8 mt-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="ed-label">Activity #{activity.activityNumber}</span>
              <span className="echo-rule" />
              <span className="ed-mono">{activity.clientName}</span>
            </div>
            <h1 className="ed-h1">{activity.problem}</h1>
          </div>

          <StatusChip status={activity.status} className="self-start" />
        </div>

        {/* Site Details */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MetaTile
            label="Facility / Site"
            value={
              <span className="inline-flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
                {activity.siteName}
              </span>
            }
          />
          <MetaTile
            label="Reported Timestamp"
            value={
              <span className="inline-flex items-center gap-1.5 font-mono">
                <CalendarClock className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
                {activity.date} · {activity.time}
              </span>
            }
          />
          <MetaTile
            label="Admin Dispatch"
            value={
              <span className="inline-flex items-center gap-1.5 font-mono">
                <Radio className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
                Operations Center
              </span>
            }
          />
        </div>

        {/* Admin Instructions */}
        {activity.adminInstructions && (
          <div className="mt-5 rounded-[var(--echo-radius-sm)] border border-[var(--echo-border)] bg-[var(--echo-surface-2)] p-4 sm:p-5">
            <div className="ed-label mb-2">Admin Remediation Guidance</div>
            <p className="text-[14px] leading-relaxed text-[var(--echo-ink-2)]">
              {activity.adminInstructions}
            </p>
          </div>
        )}
      </header>

      {/* Evidence Form */}
      <form onSubmit={handleSubmit} className="echo-card echo-card--pad lg:p-8 space-y-10">
        <div className="pt-0">
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="w-4 h-4 text-[var(--echo-accent)]" />
            <h2 className="ed-h2">Remediation Photo Proof (Before &amp; After)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <MockCamera
              label="Before Photo (Incident Condition)"
              defaultLocation={`${activity.siteName} · Chennai`}
              existingImage={beforeImg}
              onCapture={(url) => setBeforeImg(url)}
            />
            <MockCamera
              label="After Photo (Resolved Condition)"
              defaultLocation={`${activity.siteName} · Chennai`}
              existingImage={afterImg}
              onCapture={(url) => setAfterImg(url)}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--echo-border)]">
          <div className="flex items-center gap-2 mb-3">
            <StickyNote className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
            <label className="ed-label">{t('additionalNote')}</label>
          </div>
          <textarea
            rows={4}
            value={note}
            disabled={isSubmitted}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Explain repair steps taken, parts replaced, or ongoing monitoring needed..."
            className="ed-input resize-y"
          />
        </div>

        {!isSubmitted ? (
          <div className="flex justify-end pt-6 border-t border-[var(--echo-border)]">
            <button type="submit" className="ed-btn">
              <Check className="w-4 h-4" />
              <span>Submit Resolution Evidence</span>
            </button>
          </div>
        ) : (
          <div className="rounded-[var(--echo-radius-sm)] border border-[color-mix(in_srgb,var(--echo-positive)_25%,transparent)] bg-[var(--echo-positive-soft)] p-5 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-[13px] font-semibold text-[var(--echo-positive)]">
              <CheckCircle2 className="w-4 h-4" />
              Evidence submitted and synced to Admin Raised Activity stream.
            </span>
            <span className="ed-mono">Status: {activity.status}</span>
          </div>
        )}
      </form>
    </div>
  );
};
