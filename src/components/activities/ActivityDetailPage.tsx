import React, { useState } from 'react';
import { Check, CheckCircle2, Clock, MapPin, Building, AlertCircle } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { MockCamera } from '../common/MockCamera';

export const ActivityDetailPage: React.FC = () => {
  const {
    selectedActivityId,
    activities,
    submitActivityEvidence,
    setActiveTab,
    t,
  } = usePortal();

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
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in duration-150">
      <GlobalBackButton onBack={() => setActiveTab('new-activity')} label="Back to Activities" />

      {/* Top Header Card */}
      <div className="apple-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Activity #{activity.activityNumber}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs text-neutral-500 font-mono">{activity.clientName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {activity.problem}
            </h1>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${
              isSubmitted || activity.status === 'Work Completed'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
            }`}
          >
            {activity.status}
          </span>
        </div>

        {/* Site Details & Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
            <span className="text-[11px] text-neutral-500 block mb-0.5">Facility / Site</span>
            <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-neutral-400" />
              {activity.siteName}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
            <span className="text-[11px] text-neutral-500 block mb-0.5">Reported Timestamp</span>
            <span className="font-semibold text-neutral-900 dark:text-white font-mono">
              {activity.date} · {activity.time}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
            <span className="text-[11px] text-neutral-500 block mb-0.5">Admin Dispatch</span>
            <span className="font-semibold text-neutral-900 dark:text-white font-mono">
              Operations Center
            </span>
          </div>
        </div>

        {/* Admin Instructions */}
        {activity.adminInstructions && (
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
              Admin Remediation Guidance
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {activity.adminInstructions}
            </p>
          </div>
        )}
      </div>

      {/* Evidence Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Before and After Evidence */}
        <div className="apple-card rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            Remediation Photo Proof (Before & After)
          </h2>

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

        {/* Additional Note */}
        <div className="apple-card rounded-2xl p-6 space-y-3">
          <label className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            {t('additionalNote')}
          </label>
          <textarea
            rows={4}
            value={note}
            disabled={isSubmitted}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Explain repair steps taken, parts replaced, or ongoing monitoring needed..."
            className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all disabled:opacity-70"
          />
        </div>

        {/* Submit Button */}
        {!isSubmitted ? (
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Submit Resolution Evidence</span>
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Evidence submitted and synced to Admin Raised Activity stream.
            </span>
            <span className="text-[11px] font-mono opacity-80">
              Status: {activity.status}
            </span>
          </div>
        )}
      </form>
    </div>
  );
};
