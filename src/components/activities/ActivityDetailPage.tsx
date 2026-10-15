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
    <div>
      <div className="echo-kpi-label">{label}</div>
      <div className="mt-3 text-[14px] font-medium text-[var(--echo-ink)]">{value}</div>
    </div>
  );

  return (
    <div className="animate-echo-fade">
      {/* ================= Masthead ================= */}
      <section className="em-section pt-14 sm:pt-20 pb-12">
        <GlobalBackButton onBack={() => setActiveTab('new-activity')} label="Back to Activities" />

        <div className="mt-7 em-split items-end">
          <div className="em-split-lead">
            <div className="flex flex-wrap items-center gap-4 mb-7">
              <span className="ed-label">Activity #{activity.activityNumber}</span>
              <span className="w-10 h-px" style={{ background: 'var(--echo-border-strong)' }} />
              <span className="ed-meta">{activity.clientName}</span>
            </div>
            <h1 className="ed-h1">{activity.problem}</h1>
          </div>

          <div className="em-split-side">
            <StatusChip status={activity.status} dot />

            <div
              className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6 pt-7"
              style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
            >
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
                label="Reported"
                value={
                  <span className="inline-flex items-center gap-1.5 font-mono text-[13px]">
                    <CalendarClock className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
                    {activity.date} · {activity.time}
                  </span>
                }
              />
              <MetaTile
                label="Admin Dispatch"
                value={
                  <span className="inline-flex items-center gap-1.5 font-mono text-[13px]">
                    <Radio className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
                    Operations Center
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= Admin instructions ================= */}
      {activity.adminInstructions && (
        <section
          className="em-invert em-section py-14"
          style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
        >
          <div className="em-split items-start">
            <div className="em-split-lead">
              <span className="ed-label">Admin Remediation Guidance</span>
            </div>
            <div className="em-split-side">
              <p className="text-[15px] leading-relaxed" style={{ color: 'var(--echo-invert-ink)' }}>
                {activity.adminInstructions}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ================= Evidence form ================= */}
      <section
        className="em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-7">
              <MapPin className="w-4 h-4 text-[var(--echo-accent)]" />
              <h2 className="ed-h2">Remediation Photo Proof (Before &amp; After)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="pt-10" style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}>
            <div className="flex items-center gap-2.5 mb-4">
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
            <div
              className="flex justify-end pt-10"
              style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
            >
              <button type="submit" className="ed-btn">
                <Check className="w-4 h-4" />
                <span>Submit Resolution Evidence</span>
              </button>
            </div>
          ) : (
            <div
              className="p-5 flex flex-wrap items-center justify-between gap-3"
              style={{
                background: 'var(--echo-positive-soft)',
                border: 'var(--echo-rule) solid color-mix(in srgb, var(--echo-positive) 34%, transparent)',
              }}
            >
              <span
                className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.12em]"
                style={{ color: 'var(--echo-positive)' }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Evidence submitted and synced to Admin Raised Activity stream.
              </span>
              <span className="ed-meta">Status: {activity.status}</span>
            </div>
          )}
        </form>
      </section>
    </div>
  );
};
