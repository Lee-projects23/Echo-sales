import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  Video,
  FileCheck,
  Check,
  AlertCircle,
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

  const task = assignedTasks.find((x) => x.id === selectedTaskId) || assignedTasks[0];

  const isSubmittedOrApproved =
    task.status === 'Submitted' || task.status === 'Approved' || task.status === 'Rejected';
  const isReupload = task.status === 'Re-upload Requested';

  const { submissions, requiredChecklist } = task;

  const [photoCountWarning, setPhotoCountWarning] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [narrativeInput, setNarrativeInput] = useState(submissions.narrativeNote || '');

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
    <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      <GlobalBackButton onBack={() => setActiveTab('new-task')} label="Back to Tasks" />

      {/* Re-upload banner */}
      {isReupload && (
        <div className="mt-6 mb-10 flex items-start gap-3 border border-neutral-900/20 dark:border-white/20 p-5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-neutral-500" />
          <div className="space-y-1 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
            <div className="font-semibold uppercase tracking-[0.14em]">Admin Requested Re-upload</div>
            <p>{task.adminFeedback}</p>
            <div className="ed-mono">Reviewed by Operations Lead at {task.adminReviewedAt}</div>
          </div>
        </div>
      )}

      {/* Submitted banner */}
      {task.status === 'Submitted' && (
        <div className="mt-6 mb-10 flex items-start gap-3 border border-neutral-900/20 dark:border-white/20 p-5">
          <Clock className="w-4 h-4 shrink-0 mt-0.5 text-neutral-500" />
          <div className="space-y-1 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
            <div className="font-semibold uppercase tracking-[0.14em]">Submitted — Awaiting Admin Review</div>
            <p>
              Your evidence checklist has been compiled and dispatched to the Admin Employee Monitor.
              This task is currently locked from further edits while pending Operations Director sign-off.
            </p>
            <div className="ed-mono">Submitted at: {task.submittedAt}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-10 border-b border-neutral-900/10 dark:border-white/10 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="ed-label">Task #{task.taskNumber}</span>
              <span className="h-px w-6 bg-neutral-900/20 dark:bg-white/20" />
              <span className="ed-mono">{task.clientName}</span>
            </div>
            <h1 className="ed-h1">{task.taskTitle}</h1>
            <p className="ed-sub">{task.companyName}</p>
          </div>

          <span className="ed-tag text-neutral-700 dark:text-neutral-300 self-start">
            {task.status}
          </span>
        </div>

        {/* Description */}
        <div className="mt-8">
          <div className="ed-label mb-2">Task Description</div>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
            {task.description}
          </p>
        </div>
      </header>

      {/* Schedule & Windows */}
      <section className="mb-12 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
        <div className="border-t border-neutral-900/10 dark:border-white/10 pt-3">
          <div className="ed-label mb-1.5">Date</div>
          <div className="font-mono text-sm text-neutral-950 dark:text-neutral-50">{task.scheduledDate}</div>
        </div>
        <div className="border-t border-neutral-900/10 dark:border-white/10 pt-3">
          <div className="ed-label mb-1.5">Scheduled Time</div>
          <div className="font-mono text-sm text-neutral-950 dark:text-neutral-50">{task.scheduledTime}</div>
        </div>
        <div className="border-t border-neutral-900/10 dark:border-white/10 pt-3">
          <div className="ed-label mb-1.5">Check-In Window</div>
          <div className="font-mono text-sm text-neutral-950 dark:text-neutral-50">{task.checkInWindow}</div>
        </div>
        <div className="border-t border-neutral-900/10 dark:border-white/10 pt-3">
          <div className="ed-label mb-1.5">Check-Out Window</div>
          <div className="font-mono text-sm text-neutral-950 dark:text-neutral-50">{task.checkOutWindow}</div>
        </div>
      </section>

      {/* Admin Voice Message */}
      {task.adminVoiceNote && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="ed-h2">{t('adminVoiceMessage')}</h2>
            <span className="ed-mono">Audio Briefing</span>
          </div>
          <AudioPlayer
            title={task.adminVoiceNote.audioTitle}
            durationString={task.adminVoiceNote.duration}
            durationSeconds={task.adminVoiceNote.durationSeconds}
            recordedDate={task.adminVoiceNote.recordedDate}
          />
        </section>
      )}

      {/* Required Checklist */}
      <section className="space-y-12">
        <div className="mb-2">
          <h2 className="ed-h2">{t('requiredChecklist')}</h2>
          <p className="ed-sub mt-2">
            Admin has configured the following mandatory evidence requirements for this work order.
          </p>
        </div>

        {/* 1. Before & After Photos */}
        {requiredChecklist.beforeAfterPhotos && (
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">01</span>
                <h3 className="ed-h3">Upload Before &amp; After Photos</h3>
                <span className="ed-tag text-neutral-400 dark:text-neutral-500">Required</span>
              </div>
              {submissions.beforePhoto && submissions.afterPhoto && (
                <span className="ed-tag text-neutral-600 dark:text-neutral-300">
                  <FileCheck className="w-3.5 h-3.5" /> Completed
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MockCamera
                label="Before Photo"
                defaultLocation="ECR Site · Chennai, Tamil Nadu"
                existingImage={submissions.beforePhoto}
                onCapture={handleBeforePhotoCapture}
              />

              {submissions.beforePhoto ? (
                <MockCamera
                  label="After Photo"
                  defaultLocation="ECR Site · Chennai, Tamil Nadu"
                  existingImage={submissions.afterPhoto}
                  onCapture={handleAfterPhotoCapture}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-neutral-900/20 dark:border-white/20 min-h-full">
                  <AlertCircle className="w-5 h-5 mb-2 opacity-40" />
                  <p className="text-xs text-neutral-500">
                    Upload Before Photo first to unlock After Photo capture.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Voice Upload */}
        {requiredChecklist.voiceReply && (
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">02</span>
                <h3 className="ed-h3">Upload Voice Response</h3>
                <span className="ed-tag text-neutral-400 dark:text-neutral-500">Required</span>
              </div>
              {submissions.voiceNoteUrl && (
                <span className="ed-tag text-neutral-600 dark:text-neutral-300">
                  <FileCheck className="w-3.5 h-3.5" /> Recorded
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
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">03</span>
                <h3 className="ed-h3">Upload 4 Photos + 1 Video</h3>
                <span className="ed-tag text-neutral-400 dark:text-neutral-500">Required</span>
              </div>
              <span className="ed-mono">
                Photos: {submissions.photos.length}/4 · Video: {submissions.video ? 1 : 0}/1
              </span>
            </div>

            <div className="space-y-4">
              <div className="ed-label">Inspection Photos (Strictly 4 Required)</div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {submissions.photos.map((p, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square overflow-hidden border border-neutral-900/10 dark:border-white/10 bg-neutral-950 group"
                  >
                    <img
                      src={p.url}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover grayscale"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/50 p-2 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-white font-mono">Photo #{idx + 1}</span>
                      {!isSubmittedOrApproved && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBatchPhoto(idx)}
                          className="self-end px-2 py-0.5 border border-white/40 text-white text-[10px] font-semibold"
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
            <div className="pt-5 mt-6 border-t border-neutral-900/10 dark:border-white/10 space-y-3">
              <div className="ed-label">Audit Video Walkthrough (1 Required)</div>

              {submissions.video ? (
                <div className="flex items-center justify-between text-xs border border-neutral-900/10 dark:border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <Video className="w-4 h-4 text-neutral-500" />
                    <div>
                      <div className="font-medium text-neutral-950 dark:text-neutral-50">
                        {submissions.video.title}
                      </div>
                      <div className="ed-mono">Duration: {submissions.video.duration} · High-Def Walkthrough</div>
                    </div>
                  </div>
                  {!isSubmittedOrApproved && (
                    <button type="button" onClick={handleRemoveVideo} className="ed-textbtn text-neutral-500">
                      Delete
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddVideo}
                  disabled={isSubmittedOrApproved}
                  className="w-full py-5 border border-dashed border-neutral-900/20 dark:border-white/20 text-xs font-medium text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-2 hover:border-neutral-900 dark:hover:border-white transition-colors cursor-pointer"
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
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-6">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">04</span>
              <h3 className="ed-h3">Signature Confirmation</h3>
              <span className="ed-tag text-neutral-400 dark:text-neutral-500">Required</span>
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
          <div className="border-t border-neutral-900/10 dark:border-white/10 pt-6">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">05</span>
              <h3 className="ed-h3">Employee Self-Assessment Mark</h3>
              <span className="ed-tag text-neutral-400 dark:text-neutral-500">Required</span>
            </div>
            <RatingPicker value={submissions.markRating || 0} onChange={handleRatingChange} disabled={isSubmittedOrApproved} />
          </div>
        )}

        {/* Additional Note */}
        <div className="border-t border-neutral-900/10 dark:border-white/10 pt-6">
          <div className="ed-label mb-3">{t('additionalNote')}</div>
          <textarea
            rows={4}
            value={narrativeInput}
            onChange={handleNarrativeChange}
            disabled={isSubmittedOrApproved}
            placeholder="Document work completed, site anomalies encountered, parts required, or instructions given to client representative..."
            className="ed-input disabled:opacity-60"
          />
        </div>

        {/* Validation Summary */}
        <div className="border-t border-neutral-900/10 dark:border-white/10 pt-6 space-y-3">
          <div className="ed-label">Submission Checklist Validation</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-y-2 text-xs">
            {requiredChecklist.beforeAfterPhotos && (
              <span className={`flex items-center gap-1.5 ${isBeforeAfterComplete ? 'text-neutral-950 dark:text-neutral-50' : 'text-neutral-400'}`}>
                {isBeforeAfterComplete ? '✓' : '○'} Before &amp; After
              </span>
            )}
            {requiredChecklist.voiceReply && (
              <span className={`flex items-center gap-1.5 ${isVoiceComplete ? 'text-neutral-950 dark:text-neutral-50' : 'text-neutral-400'}`}>
                {isVoiceComplete ? '✓' : '○'} Voice Note
              </span>
            )}
            {requiredChecklist.fourPhotosOneVideo && (
              <span className={`flex items-center gap-1.5 ${isFourPhotosOneVideoComplete ? 'text-neutral-950 dark:text-neutral-50' : 'text-neutral-400'}`}>
                {isFourPhotosOneVideoComplete ? '✓' : '○'} 4 Photos + 1 Video
              </span>
            )}
            {requiredChecklist.signature && (
              <span className={`flex items-center gap-1.5 ${isSignatureComplete ? 'text-neutral-950 dark:text-neutral-50' : 'text-neutral-400'}`}>
                {isSignatureComplete ? '✓' : '○'} Signature
              </span>
            )}
            {requiredChecklist.markRating && (
              <span className={`flex items-center gap-1.5 ${isMarkComplete ? 'text-neutral-950 dark:text-neutral-50' : 'text-neutral-400'}`}>
                {isMarkComplete ? '✓' : '○'} Mark / Rating
              </span>
            )}
          </div>
        </div>

        {validationError && (
          <div className="p-4 border border-neutral-900/20 dark:border-white/20 text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Actions */}
        {!isSubmittedOrApproved && (
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-neutral-900/10 dark:border-white/10">
            <button type="button" onClick={handleSaveDraft} className="ed-btn-ghost">
              {t('saveDraft')}
            </button>
            <button type="button" onClick={handleSubmit} disabled={!allMandatoryMet} className="ed-btn">
              <Check className="w-3.5 h-3.5" />
              <span>{t('submitTask')}</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};