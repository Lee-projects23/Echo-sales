import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  Upload,
  Camera,
  Video,
  FileCheck,
  Check,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { AudioPlayer } from '../common/AudioPlayer';
import { MockCamera } from '../common/MockCamera';
import { MockVoiceRecorder } from '../common/MockVoiceRecorder';
import { SignaturePad } from '../common/SignaturePad';
import { RatingPicker } from '../common/RatingPicker';
import { TaskPhoto, TaskVideo } from '../../types';

export const TaskDetailPage: React.FC = () => {
  const {
    selectedTaskId,
    assignedTasks,
    updateTaskSubmissions,
    saveTaskDraft,
    submitAssignedTask,
    setActiveTab,
    t,
  } = usePortal();

  const task = assignedTasks.find((t) => t.id === selectedTaskId) || assignedTasks[0];

  const isSubmittedOrApproved =
    task.status === 'Submitted' || task.status === 'Approved' || task.status === 'Rejected';
  const isReupload = task.status === 'Re-upload Requested';

  // Submissions state shorthand
  const { submissions, requiredChecklist } = task;

  // Local state for interactive upload of 4 photos + 1 video
  const [photoCountWarning, setPhotoCountWarning] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [narrativeInput, setNarrativeInput] = useState(submissions.narrativeNote || '');

  // Handlers
  const handleBeforePhotoCapture = (dataUrl: string, location: string) => {
    updateTaskSubmissions(task.id, { beforePhoto: dataUrl });
  };

  const handleAfterPhotoCapture = (dataUrl: string, location: string) => {
    updateTaskSubmissions(task.id, { afterPhoto: dataUrl });
  };

  const handleVoiceSubmit = (audioUrl: string, duration: number) => {
    updateTaskSubmissions(task.id, { voiceNoteUrl: audioUrl, voiceNoteDuration: duration });
  };

  const handleAddBatchPhoto = (dataUrl: string, location: string) => {
    if (submissions.photos.length >= 4) return;
    const newPhoto: TaskPhoto = {
      url: dataUrl,
      location: location || 'ECR Site · Chennai, Tamil Nadu',
      timestamp: new Date().toLocaleTimeString(),
    };
    updateTaskSubmissions(task.id, { photos: [...submissions.photos, newPhoto] });
  };

  const handleRemoveBatchPhoto = (index: number) => {
    const updated = submissions.photos.filter((_, i) => i !== index);
    updateTaskSubmissions(task.id, { photos: updated });
  };

  const handleAddVideo = () => {
    const newVideo: TaskVideo = {
      url: 'mock-video-stream.mp4',
      title: 'Field Video Audit Walkthrough #1',
      duration: '0:35',
    };
    updateTaskSubmissions(task.id, { video: newVideo });
  };

  const handleRemoveVideo = () => {
    updateTaskSubmissions(task.id, { video: undefined });
  };

  const handleSignatureConfirmed = (name: string) => {
    updateTaskSubmissions(task.id, {
      signatureName: name,
      confirmedSignature: true,
    });
  };

  const handleRatingChange = (score: number) => {
    updateTaskSubmissions(task.id, { markRating: score });
  };

  const handleNarrativeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNarrativeInput(e.target.value);
    updateTaskSubmissions(task.id, { narrativeNote: e.target.value });
  };

  const handleSaveDraft = () => {
    saveTaskDraft(task.id);
    alert('Task draft saved successfully. You can resume evidence capture at any time.');
  };

  const handleSubmit = () => {
    setValidationError('');
    const success = submitAssignedTask(task.id);
    if (!success) {
      setValidationError('Please complete all mandatory items in the Admin Checklist before submitting.');
    }
  };

  // Checklist completion flags
  const isBeforeAfterComplete = !requiredChecklist.beforeAfterPhotos || (!!submissions.beforePhoto && !!submissions.afterPhoto);
  const isVoiceComplete = !requiredChecklist.voiceReply || !!submissions.voiceNoteUrl;
  const isFourPhotosOneVideoComplete = !requiredChecklist.fourPhotosOneVideo || (submissions.photos.length === 4 && !!submissions.video);
  const isSignatureComplete = !requiredChecklist.signature || (!!submissions.signatureName && !!submissions.confirmedSignature);
  const isMarkComplete = !requiredChecklist.markRating || (!!submissions.markRating && submissions.markRating > 0);

  const allMandatoryMet =
    isBeforeAfterComplete &&
    isVoiceComplete &&
    isFourPhotosOneVideoComplete &&
    isSignatureComplete &&
    isMarkComplete;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in duration-150">
      <GlobalBackButton onBack={() => setActiveTab('new-task')} label="Back to Tasks" />

      {/* Admin Review Banner if Re-upload Requested */}
      {isReupload && (
        <div className="rounded-2xl p-5 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
          <div className="space-y-1 text-xs leading-relaxed">
            <div className="font-bold">Admin Requested Re-upload</div>
            <p>{task.adminFeedback}</p>
            <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80">
              Reviewed by Operations Lead at {task.adminReviewedAt}
            </div>
          </div>
        </div>
      )}

      {/* Submission Status Banner if Already Submitted */}
      {task.status === 'Submitted' && (
        <div className="rounded-2xl p-5 bg-sky-500/10 border border-sky-500/20 text-sky-800 dark:text-sky-300 flex items-start gap-3">
          <Clock className="w-5 h-5 shrink-0 mt-0.5 text-sky-500" />
          <div className="space-y-1 text-xs leading-relaxed">
            <div className="font-bold text-sm">Submitted — Awaiting Admin Review</div>
            <p>
              Your evidence checklist has been compiled and dispatched to the Admin Employee Monitor.
              This task is currently locked from further edits while pending Operations Director sign-off.
            </p>
            <div className="text-[11px] text-sky-600/80 dark:text-sky-400/80 font-mono">
              Submitted at: {task.submittedAt}
            </div>
          </div>
        </div>
      )}

      {/* Top Header Card */}
      <div className="apple-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Task #{task.taskNumber}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs text-neutral-500 font-mono">{task.clientName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {task.taskTitle}
            </h1>
            <p className="text-xs text-neutral-500">{task.companyName}</p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${
              task.status === 'Approved'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : task.status === 'Submitted'
                ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                : task.status === 'Re-upload Requested'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {task.status}
          </span>
        </div>

        {/* Task Description */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
            Task Description
          </div>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Schedule & Check-in Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
            <span className="text-[11px] text-neutral-500 block mb-0.5">Date</span>
            <span className="font-semibold text-neutral-900 dark:text-white font-mono">
              {task.scheduledDate}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
            <span className="text-[11px] text-neutral-500 block mb-0.5">Scheduled Time</span>
            <span className="font-semibold text-neutral-900 dark:text-white font-mono">
              {task.scheduledTime}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
            <span className="text-[11px] text-neutral-500 block mb-0.5">Check-In Window</span>
            <span className="font-semibold text-neutral-900 dark:text-white font-mono text-[11px]">
              {task.checkInWindow}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
            <span className="text-[11px] text-neutral-500 block mb-0.5">Check-Out Window</span>
            <span className="font-semibold text-neutral-900 dark:text-white font-mono text-[11px]">
              {task.checkOutWindow}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Voice Message (If available) */}
      {task.adminVoiceNote && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{t('adminVoiceMessage')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            </h2>
            <span className="text-[11px] text-neutral-500">Audio Briefing</span>
          </div>

          <AudioPlayer
            title={task.adminVoiceNote.audioTitle}
            durationString={task.adminVoiceNote.duration}
            durationSeconds={task.adminVoiceNote.durationSeconds}
            recordedDate={task.adminVoiceNote.recordedDate}
          />
        </section>
      )}

      {/* REQUIRED TASK CHECKLIST SECTION */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            {t('requiredChecklist')}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Admin has configured the following mandatory evidence requirements for this work order:
          </p>
        </div>

        {/* 1. Before & After Photos */}
        {requiredChecklist.beforeAfterPhotos && (
          <div className="apple-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">
                  Upload Before & After Photos
                </span>
                <span className="text-[10px] text-red-500 font-semibold">*Required</span>
              </div>

              {submissions.beforePhoto && submissions.afterPhoto && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Both Photos Completed
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MockCamera
                label="1. Upload Before Photo"
                defaultLocation="ECR Site · Chennai, Tamil Nadu"
                existingImage={submissions.beforePhoto}
                onCapture={handleBeforePhotoCapture}
              />

              {submissions.beforePhoto ? (
                <MockCamera
                  label="2. Upload After Photo"
                  defaultLocation="ECR Site · Chennai, Tamil Nadu"
                  existingImage={submissions.afterPhoto}
                  onCapture={handleAfterPhotoCapture}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 p-6 flex flex-col items-center justify-center text-center aspect-4/3 sm:aspect-16/9 text-neutral-400">
                  <Info className="w-6 h-6 mb-2 opacity-50" />
                  <p className="text-xs font-medium">
                    Upload Before Photo first to unlock After Photo capture.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Voice Upload */}
        {requiredChecklist.voiceReply && (
          <div className="apple-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">
                  Upload Voice Response
                </span>
                <span className="text-[10px] text-red-500 font-semibold">*Required</span>
              </div>

              {submissions.voiceNoteUrl && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Voice Recorded
                </span>
              )}
            </div>

            <MockVoiceRecorder
              existingVoiceUrl={submissions.voiceNoteUrl}
              existingDuration={submissions.voiceNoteDuration}
              onVoiceSubmitted={handleVoiceSubmit}
            />
          </div>
        )}

        {/* 3. 4 Photos + 1 Video */}
        {requiredChecklist.fourPhotosOneVideo && (
          <div className="apple-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">
                  Upload 4 Photos + 1 Video
                </span>
                <span className="text-[10px] text-red-500 font-semibold">*Required</span>
              </div>

              <span className="text-xs font-mono text-neutral-500">
                Photos: <strong>{submissions.photos.length}/4</strong> · Video:{' '}
                <strong>{submissions.video ? '1/1' : '0/1'}</strong>
              </span>
            </div>

            {/* Photos Sub-grid */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Inspection Photos (Strictly 4 Required)
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {submissions.photos.map((p, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-xl overflow-hidden aspect-square border border-neutral-200 dark:border-neutral-800 bg-neutral-900 group"
                  >
                    <img
                      src={p.url}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/50 p-2 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-white font-mono">Photo #{idx + 1}</span>
                      {!isSubmittedOrApproved && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBatchPhoto(idx)}
                          className="self-end px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {submissions.photos.length < 4 && !isSubmittedOrApproved && (
                  <div className="col-span-2 sm:col-span-2">
                    <MockCamera
                      label={`Photo #${submissions.photos.length + 1} Capture`}
                      defaultLocation="ECR Site · Chennai, Tamil Nadu"
                      onCapture={handleAddBatchPhoto}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Video Sub-section */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Audit Video Walkthrough (1 Required)
              </div>

              {submissions.video ? (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {submissions.video.title}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        Duration: {submissions.video.duration} · High-Def Walkthrough Attached
                      </div>
                    </div>
                  </div>

                  {!isSubmittedOrApproved && (
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddVideo}
                  disabled={isSubmittedOrApproved}
                  className="w-full py-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 hover:bg-neutral-100 dark:hover:bg-neutral-800/40 text-xs font-medium text-neutral-600 dark:text-neutral-400 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Attach Video Walkthrough (Mock Capture / Upload)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4. Signature */}
        {requiredChecklist.signature && (
          <div className="apple-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">
                  Signature Confirmation
                </span>
                <span className="text-[10px] text-red-500 font-semibold">*Required</span>
              </div>
            </div>

            <SignaturePad
              initialName={submissions.signatureName}
              isConfirmed={submissions.confirmedSignature}
              onSignatureConfirmed={handleSignatureConfirmed}
            />
          </div>
        )}

        {/* 5. Mark / Rating */}
        {requiredChecklist.markRating && (
          <div className="apple-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold">
                  5
                </span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white">
                  Employee Self-Assessment Mark
                </span>
                <span className="text-[10px] text-red-500 font-semibold">*Required</span>
              </div>
            </div>

            <RatingPicker
              value={submissions.markRating || 0}
              onChange={handleRatingChange}
              disabled={isSubmittedOrApproved}
            />
          </div>
        )}

        {/* Additional Note / Narrative */}
        <div className="apple-card rounded-2xl p-6 space-y-3">
          <div className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            {t('additionalNote')}
          </div>
          <textarea
            rows={4}
            value={narrativeInput}
            onChange={handleNarrativeChange}
            disabled={isSubmittedOrApproved}
            placeholder="Document work completed, site anomalies encountered, parts required, or instructions given to client representative..."
            className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all disabled:opacity-70"
          />
        </div>

        {/* Validation Summary List */}
        <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 space-y-2">
          <div className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
            Submission Checklist Validation
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {requiredChecklist.beforeAfterPhotos && (
              <span className={`flex items-center gap-1.5 ${isBeforeAfterComplete ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-neutral-400'}`}>
                {isBeforeAfterComplete ? '✓' : '○'} Before & After
              </span>
            )}
            {requiredChecklist.voiceReply && (
              <span className={`flex items-center gap-1.5 ${isVoiceComplete ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-neutral-400'}`}>
                {isVoiceComplete ? '✓' : '○'} Voice Note
              </span>
            )}
            {requiredChecklist.fourPhotosOneVideo && (
              <span className={`flex items-center gap-1.5 ${isFourPhotosOneVideoComplete ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-neutral-400'}`}>
                {isFourPhotosOneVideoComplete ? '✓' : '○'} 4 Photos + 1 Video
              </span>
            )}
            {requiredChecklist.signature && (
              <span className={`flex items-center gap-1.5 ${isSignatureComplete ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-neutral-400'}`}>
                {isSignatureComplete ? '✓' : '○'} Signature
              </span>
            )}
            {requiredChecklist.markRating && (
              <span className={`flex items-center gap-1.5 ${isMarkComplete ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-neutral-400'}`}>
                {isMarkComplete ? '✓' : '○'} Mark / Rating
              </span>
            )}
          </div>
        </div>

        {validationError && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Action Buttons: Save Draft & Submit Task */}
        {!isSubmittedOrApproved && (
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {t('saveDraft')}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allMandatoryMet}
              className="px-6 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-40 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{t('submitTask')}</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
