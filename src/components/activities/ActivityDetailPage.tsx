import React, { useState } from 'react';
import { Check, CheckCircle2, Building } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { MockCamera } from '../common/MockCamera';

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

  return (
    <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      <GlobalBackButton onBack={() => setActiveTab('new-activity')} label="Back to Activities" />

      {/* Header */}
      <header className="mt-6 mb-10 border-b border-neutral-900/10 dark:border-white/10 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="ed-label">Activity #{activity.activityNumber}</span>
              <span className="h-px w-6 bg-neutral-900/20 dark:bg-white/20" />
              <span className="ed-mono">{activity.clientName}</span>
            </div>
            <h1 className="ed-h1">{activity.problem}</h1>
          </div>

          <span className="ed-tag text-neutral-700 dark:text-neutral-300 self-start">
            {activity.status}
          </span>
        </div>

        {/* Site Details */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6">
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-3">
            <div className="ed-label mb-1.5">Facility / Site</div>
            <div className="flex items-center gap-1.5 text-sm text-neutral-950 dark:text-neutral-50">
              <Building className="w-3.5 h-3.5 text-neutral-400" />
              {activity.siteName}
            </div>
          </div>
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-3">
            <div className="ed-label mb-1.5">Reported Timestamp</div>
            <div className="font-mono text-sm text-neutral-950 dark:text-neutral-50">
              {activity.date} · {activity.time}
            </div>
          </div>
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-3">
            <div className="ed-label mb-1.5">Admin Dispatch</div>
            <div className="font-mono text-sm text-neutral-950 dark:text-neutral-50">Operations Center</div>
          </div>
        </div>

        {/* Admin Instructions */}
        {activity.adminInstructions && (
          <div className="mt-8">
            <div className="ed-label mb-2">Admin Remediation Guidance</div>
            <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {activity.adminInstructions}
            </p>
          </div>
        )}
      </header>

      {/* Evidence Form */}
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="border-t border-neutral-900/10 dark:border-white/10 pt-6">
          <h2 className="ed-h2 mb-5">Remediation Photo Proof (Before &amp; After)</h2>
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

        <div className="border-t border-neutral-900/10 dark:border-white/10 pt-6">
          <label className="ed-label block mb-3">{t('additionalNote')}</label>
          <textarea
            rows={4}
            value={note}
            disabled={isSubmitted}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Explain repair steps taken, parts replaced, or ongoing monitoring needed..."
            className="ed-input disabled:opacity-60"
          />
        </div>

        {!isSubmitted ? (
          <div className="flex justify-end border-t border-neutral-900/10 dark:border-white/10 pt-6">
            <button type="submit" className="ed-btn">
              <Check className="w-3.5 h-3.5" />
              <span>Submit Resolution Evidence</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between border border-neutral-900/20 dark:border-white/20 p-5 text-xs text-neutral-700 dark:text-neutral-300">
            <span className="flex items-center gap-2 font-semibold">
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