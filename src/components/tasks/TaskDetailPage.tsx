import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  Video,
  FileCheck,
  Check,
  AlertCircle,
  Calendar,
  Mic,
  PenLine,
  Star,
  StickyNote,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { AudioPlayer } from '../common/AudioPlayer';
import { MockCamera } from '../common/MockCamera';
import { MockVoiceRecorder } from '../common/MockVoiceRecorder';
import { SignaturePad } from '../common/SignaturePad';
import { RatingPicker } from '../common/RatingPicker';
import { StatusChip } from '../common/StatusChip';
import { TaskPhoto, TaskVideo } from '../../types';

/** Bordered callout used for banners and validation messages. */
const Callout: React.FC<{
  icon: React.ReactNode;
  tone: string;
  title: string;
  children: React.ReactNode;
  meta?: React.ReactNode;
}> = ({ icon, tone, title, children, meta }) => (
  <div
    className="flex items-start gap-4 p-5 sm:p-6"
    style={{
      background: 'var(--echo-surface)',
      border: 'var(--echo-rule) solid var(--echo-border)',
      borderLeft: '2px solid var(--echo-accent)',
    }}
  >
    <span className={`echo-icon-tile shrink-0 ${tone}`}>{icon}</span>
    <div className="space-y-1.5 min-w-0">
      <div className="ed-h3">{title}</div>
      <p className="text-[13px] leading-relaxed text-[var(--echo-ink-2)]">{children}</p>
      {meta && <div className="ed-meta mt-2">{meta}</div>}
    </div>
  </div>
);

/** Upper hairline section with index badge, title and trailing status. */
const ChecklistSection: React.FC<{
  index: string;
  title: string;
  complete?: boolean;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}> = ({ index, title, complete, trailing, children }) => (
  <div className="pt-8" style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}>
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[11px] tabular-nums text-[var(--echo-accent)]">{index}</span>
        <h3 className="ed-h3">{title}</h3>
        <span
          className="echo-chip"
          style={
            complete
              ? {
                  background: 'var(--echo-positive-soft)',
                  color: 'var(--echo-positive)',
                  borderColor: 'color-mix(in srgb, var(--echo-positive) 34%, transparent)',
                }
              : undefined
          }
        >
          {complete ? 'Complete' : 'Required'}
        </span>
      </div>
      {trailing}
    </div>
    {children}
  </div>
);

const ScheduleTile: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="echo-kpi-label">{label}</div>
    <div className="mt-3 font-mono text-[14px] font-medium text-[var(--echo-ink)]">{value}</div>
  </div>
);

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

  // Live checklist state for the progress readout (presentation only).
  const checklistItems: { on: boolean; done: boolean }[] = [
    { on: requiredChecklist.beforeAfterPhotos, done: isBeforeAfterComplete },
    { on: requiredChecklist.voiceReply, done: isVoiceComplete },
    { on: requiredChecklist.fourPhotosOneVideo, done: isFourPhotosOneVideoComplete },
    { on: requiredChecklist.signature, done: isSignatureComplete },
    { on: requiredChecklist.markRating, done: isMarkComplete },
  ];
  const totalRequired = checklistItems.filter((i) => i.on).length;
  const completedRequired = checklistItems.filter((i) => i.on && i.done).length;

  const allMandatoryMet =
    isBeforeAfterComplete &&
    isVoiceComplete &&
    isFourPhotosOneVideoComplete &&
    isSignatureComplete &&
    isMarkComplete;

  return (
    <div className="animate-echo-fade">
      {/* ================= Masthead ================= */}
      <section className="em-section pt-14 sm:pt-20 pb-12">
        <GlobalBackButton onBack={() => setActiveTab('new-task')} label="Back to Tasks" />

        <div className="mt-7 em-split items-end">
          <div className="em-split-lead">
            <div className="flex flex-wrap items-center gap-4 mb-7">
              <span className="ed-label">Task #{task.taskNumber}</span>
              <span className="w-10 h-px" style={{ background: 'var(--echo-border-strong)' }} />
              <span className="ed-meta">{task.clientName}</span>
            </div>
            <h1 className="ed-h1">{task.taskTitle}</h1>
            <p className="ed-sub mt-6 max-w-xl text-[14px]">{task.companyName}</p>
          </div>

          <div className="em-split-side">
            <div className="flex flex-wrap items-center gap-4 mb-7">
              <StatusChip status={task.status} dot />
              {task.submittedAt && <span className="ed-meta">Submitted {task.submittedAt}</span>}
            </div>

            {/* Description */}
            <div className="pt-6" style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}>
              <div className="echo-kpi-label mb-3">Task Description</div>
              <p className="text-[14px] leading-relaxed text-[var(--echo-ink-2)]">{task.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Banners ================= */}
      {(isReupload || task.status === 'Submitted') && (
        <section className="em-section pb-10" style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}>
          <div className="pt-10 space-y-4">
            {isReupload && (
              <Callout
                icon={<AlertTriangle className="w-4 h-4" />}
                tone="echo-icon-tile--warning"
                title="Admin Requested Re-upload"
                meta={`Reviewed by Operations Lead at ${task.adminReviewedAt}`}
              >
                {task.adminFeedback}
              </Callout>
            )}

            {task.status === 'Submitted' && (
              <Callout
                icon={<Clock className="w-4 h-4" />}
                tone="echo-icon-tile--info"
                title="Submitted — Awaiting Admin Review"
                meta={`Submitted at: ${task.submittedAt}`}
              >
                Your evidence checklist has been compiled and dispatched to the Admin Employee
                Monitor. This task is currently locked from further edits while pending Operations
                Director sign-off.
              </Callout>
            )}
          </div>
        </section>
      )}

      {/* ================= Schedule & windows ================= */}
      <section
        className="em-invert em-section py-14"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-9">
          <ScheduleTile label="Date" value={task.scheduledDate} />
          <ScheduleTile label="Scheduled Time" value={task.scheduledTime} />
          <ScheduleTile label="Check-In Window" value={task.checkInWindow} />
          <ScheduleTile label="Check-Out Window" value={task.checkOutWindow} />
        </div>
      </section>

      {/* ================= Admin voice message ================= */}
      {task.adminVoiceNote && (
        <section className="em-section py-14" style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 mb-8">
            <h2 className="ed-h2">{t('adminVoiceMessage')}</h2>
            <span className="hidden sm:inline-block h-px w-10 self-center" style={{ background: 'var(--echo-border-strong)' }} />
            <span className="ed-meta">Audio Briefing</span>
          </div>
          <AudioPlayer
            title={task.adminVoiceNote.audioTitle}
            durationString={task.adminVoiceNote.duration}
            durationSeconds={task.adminVoiceNote.durationSeconds}
            recordedDate={task.adminVoiceNote.recordedDate}
          />
        </section>
      )}

      {/* ================= Required checklist ================= */}
      <section
        className="em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <span className="ed-label">Evidence Requirements</span>
            <h2 className="ed-h2 mt-5">{t('requiredChecklist')}</h2>
            <p className="ed-sub mt-4 max-w-lg">
              Admin has configured the following mandatory evidence requirements for this work order.
            </p>
          </div>

          {/* Live submission progress */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="flex items-baseline justify-between gap-3 mb-4">
              <span className="echo-kpi-label">Submission Progress</span>
              <span className="font-mono text-[15px] font-bold tabular-nums text-[var(--echo-ink)]">
                {completedRequired}/{totalRequired}
              </span>
            </div>
            <div className="echo-progress">
              <div
                className={`echo-progress-bar ${
                  completedRequired === totalRequired ? 'echo-progress-bar--positive' : ''
                }`}
                style={{ width: `${(completedRequired / Math.max(1, totalRequired)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* 1. Before & After Photos */}
          {requiredChecklist.beforeAfterPhotos && (
            <ChecklistSection
              index="01"
              title="Upload Before & After Photos"
              complete={!!submissions.beforePhoto && !!submissions.afterPhoto}
              trailing={
                submissions.beforePhoto && submissions.afterPhoto ? (
                  <span className="ed-meta" style={{ color: 'var(--echo-positive)' }}>
                    <FileCheck className="w-3.5 h-3.5 inline mr-1.5" />
                    Both Photos Completed
                  </span>
                ) : undefined
              }
            >
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
                  <div className="echo-empty !border-dashed">
                    <span className="echo-icon-tile mb-4">
                      <AlertCircle className="w-5 h-5" />
                    </span>
                    <p className="text-[13px] text-[var(--echo-ink-3)] max-w-xs">
                      Upload Before Photo first to unlock After Photo capture.
                    </p>
                  </div>
                )}
              </div>
            </ChecklistSection>
          )}

          {/* 2. Voice Upload */}
          {requiredChecklist.voiceReply && (
            <ChecklistSection
              index="02"
              title="Upload Voice Response"
              complete={!!submissions.voiceNoteUrl}
              trailing={
                submissions.voiceNoteUrl ? (
                  <span className="ed-meta" style={{ color: 'var(--echo-positive)' }}>
                    <FileCheck className="w-3.5 h-3.5 inline mr-1.5" />
                    Voice Recorded
                  </span>
                ) : undefined
              }
            >
              <MockVoiceRecorder
                existingVoiceUrl={submissions.voiceNoteUrl}
                existingDuration={submissions.voiceNoteDuration}
                onVoiceSubmitted={handleVoiceSubmit}
              />
            </ChecklistSection>
          )}

          {/* 3. 4 Photos + 1 Video */}
          {requiredChecklist.fourPhotosOneVideo && (
            <ChecklistSection
              index="03"
              title="Upload 4 Photos + 1 Video"
              complete={submissions.photos.length === 4 && !!submissions.video}
              trailing={
                <span className="ed-meta">
                  Photos: {submissions.photos.length}/4 · Video: {submissions.video ? 1 : 0}/1
                </span>
              }
            >
              <div className="space-y-5">
                <div className="ed-label">Inspection Photos (Strictly 4 Required)</div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {submissions.photos.map((p, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square overflow-hidden group"
                      style={{ border: 'var(--echo-rule) solid var(--echo-border)' }}
                    >
                      <img
                        src={p.url}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent p-2.5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-white font-mono">Photo #{idx + 1}</span>
                        {!isSubmittedOrApproved && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBatchPhoto(idx)}
                            className="self-end px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white cursor-pointer"
                            style={{ background: 'var(--echo-danger)' }}
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

              {/* Video sub-section */}
              <div className="pt-6 mt-7" style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}>
                <div className="ed-label mb-4">Audit Video Walkthrough (1 Required)</div>

                {submissions.video ? (
                  <div className="echo-inset flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="echo-icon-tile echo-icon-tile--accent">
                        <Video className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-medium text-[var(--echo-ink)]">
                          {submissions.video.title}
                        </div>
                        <div className="ed-meta mt-1.5">
                          Duration: {submissions.video.duration} · High-Def Walkthrough
                        </div>
                      </div>
                    </div>

                    {!isSubmittedOrApproved && (
                      <button type="button" onClick={handleRemoveVideo} className="ed-textbtn">
                        Delete
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddVideo}
                    disabled={isSubmittedOrApproved}
                    className="echo-empty w-full py-8 hover:border-[var(--echo-ink-3)] transition-colors cursor-pointer"
                  >
                    <Video className="w-5 h-5 mb-3 text-[var(--echo-ink-3)]" />
                    <span className="text-[13px] font-medium text-[var(--echo-ink-2)]">
                      Attach Video Walkthrough (Mock Capture / Upload)
                    </span>
                  </button>
                )}
              </div>
            </ChecklistSection>
          )}

          {/* 4. Signature */}
          {requiredChecklist.signature && (
            <ChecklistSection
              index="04"
              title="Signature Confirmation"
              complete={!!submissions.signatureName && !!submissions.confirmedSignature}
            >
              <SignaturePad
                initialName={submissions.signatureName}
                isConfirmed={submissions.confirmedSignature}
                onSignatureConfirmed={handleSignatureConfirmed}
              />
            </ChecklistSection>
          )}

          {/* 5. Mark / Rating */}
          {requiredChecklist.markRating && (
            <ChecklistSection
              index="05"
              title="Employee Self-Assessment Mark"
              complete={!!submissions.markRating && submissions.markRating > 0}
            >
              <RatingPicker
                value={submissions.markRating || 0}
                onChange={handleRatingChange}
                disabled={isSubmittedOrApproved}
              />
            </ChecklistSection>
          )}

          {/* Additional Note */}
          <div className="pt-8" style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <StickyNote className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
              <div className="ed-label">{t('additionalNote')}</div>
            </div>
            <textarea
              rows={4}
              value={narrativeInput}
              onChange={handleNarrativeChange}
              disabled={isSubmittedOrApproved}
              placeholder="Document work completed, site anomalies encountered, parts required, or instructions given to client representative..."
              className="ed-input resize-y"
            />
          </div>

          {/* Validation Summary */}
          <div className="pt-8" style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}>
            <div className="flex items-center gap-2.5 mb-5">
              <Calendar className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />
              <div className="ed-label">Submission Checklist Validation</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                { on: requiredChecklist.beforeAfterPhotos, done: isBeforeAfterComplete, label: 'Before & After', icon: <FileCheck className="w-3.5 h-3.5" /> },
                { on: requiredChecklist.voiceReply, done: isVoiceComplete, label: 'Voice Note', icon: <Mic className="w-3.5 h-3.5" /> },
                { on: requiredChecklist.fourPhotosOneVideo, done: isFourPhotosOneVideoComplete, label: '4 Photos + 1 Video', icon: <Video className="w-3.5 h-3.5" /> },
                { on: requiredChecklist.signature, done: isSignatureComplete, label: 'Signature', icon: <PenLine className="w-3.5 h-3.5" /> },
                { on: requiredChecklist.markRating, done: isMarkComplete, label: 'Mark / Rating', icon: <Star className="w-3.5 h-3.5" /> },
              ]
                .filter((item) => item.on)
                .map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium transition-colors"
                    style={
                      item.done
                        ? {
                            background: 'var(--echo-positive-soft)',
                            border: 'var(--echo-rule) solid color-mix(in srgb, var(--echo-positive) 34%, transparent)',
                            color: 'var(--echo-positive)',
                          }
                        : {
                            background: 'var(--echo-surface-2)',
                            border: 'var(--echo-rule) solid var(--echo-border)',
                            color: 'var(--echo-ink-3)',
                          }
                    }
                  >
                    {item.done ? <Check className="w-3.5 h-3.5" /> : item.icon}
                    <span>{item.label}</span>
                  </div>
                ))}
            </div>
          </div>

          {validationError && (
            <div
              className="p-4 flex items-start gap-2.5 text-[13px]"
              style={{
                background: 'var(--echo-danger-soft)',
                border: 'var(--echo-rule) solid color-mix(in srgb, var(--echo-danger) 34%, transparent)',
                color: 'var(--echo-danger)',
              }}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Actions */}
          {!isSubmittedOrApproved && (
            <div
              className="flex flex-wrap items-center justify-end gap-3 pt-8"
              style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
            >
              <button type="button" onClick={handleSaveDraft} className="ed-btn-ghost">
                {t('saveDraft')}
              </button>
              <button type="button" onClick={handleSubmit} disabled={!allMandatoryMet} className="ed-btn">
                <Check className="w-4 h-4" />
                <span>{t('submitTask')}</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
