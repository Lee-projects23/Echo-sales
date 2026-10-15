import React, { useState, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Check } from 'lucide-react';

interface MockVoiceRecorderProps {
  onVoiceSubmitted: (audioUrl: string, duration: number) => void;
  existingVoiceUrl?: string;
  existingDuration?: number;
}

export const MockVoiceRecorder: React.FC<MockVoiceRecorderProps> = ({
  onVoiceSubmitted,
  existingVoiceUrl,
  existingDuration = 0,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState(existingDuration);
  const [hasRecording, setHasRecording] = useState(!!existingVoiceUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(!!existingVoiceUrl);

  // Recording timer
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordedDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Playback timer
  useEffect(() => {
    let playInterval: any = null;
    if (isPlaying) {
      playInterval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 5;
        });
      }, 200);
    }
    return () => clearInterval(playInterval);
  }, [isPlaying]);

  const handleStartRecording = () => {
    setRecordedDuration(0);
    setIsRecording(true);
    setHasRecording(false);
    setIsSubmitted(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
  };

  const handleRerecord = () => {
    setIsRecording(false);
    setHasRecording(false);
    setRecordedDuration(0);
    setIsPlaying(false);
    setPlaybackProgress(0);
    setIsSubmitted(false);
  };

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    onVoiceSubmitted('mock-audio-response.mp3', recordedDuration || 15);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="echo-card echo-card--pad space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="echo-dot"
            style={{
              background: isRecording
                ? 'var(--echo-danger)'
                : hasRecording
                ? 'var(--echo-positive)'
                : 'var(--echo-ink-3)',
            }}
          />
          <span className="ed-label">
            {isRecording
              ? 'Recording Live Audio...'
              : hasRecording
              ? 'Audio Note Ready'
              : 'Field Voice Response'}
          </span>
        </div>
        <span className="font-mono text-[13px] tabular-nums text-[var(--echo-ink)]">
          {formatTime(recordedDuration)}
        </span>
      </div>

      {/* Waveform visualization */}
      <div
        className="h-14 px-4 flex items-center justify-center gap-1 overflow-hidden"
        style={{ background: 'var(--echo-surface-2)', border: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        {Array.from({ length: 40 }).map((_, i) => {
          const activeHeight = isRecording
            ? Math.max(15, Math.sin(i * 0.4 + Date.now() / 200) * 85 + 20)
            : hasRecording
            ? Math.max(12, ((i * 17) % 70) + 15)
            : 10;
          const isPassed = (i / 40) * 100 <= playbackProgress;

          return (
            <div
              key={i}
              className="w-px rounded-full transition-all duration-150"
              style={{
                height: `${activeHeight}%`,
                background:
                  isRecording || (isPlaying && isPassed)
                    ? 'var(--echo-accent)'
                    : 'var(--echo-border-strong)',
              }}
            />
          );
        })}
      </div>

      {/* Control buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {!hasRecording && !isRecording && (
            <button type="button" onClick={handleStartRecording} className="ed-btn">
              <Mic className="w-4 h-4" />
              <span>Start Recording</span>
            </button>
          )}

          {isRecording && (
            <button
              type="button"
              onClick={handleStopRecording}
              className="ed-btn"
              style={{ background: 'var(--echo-danger)' }}
            >
              <Square className="w-4 h-4" />
              <span>Stop</span>
            </button>
          )}

          {hasRecording && (
            <>
              <button type="button" onClick={handlePlayToggle} className="ed-btn">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Play Recording'}</span>
              </button>

              <button type="button" onClick={handleRerecord} className="ed-btn-ghost">
                <RotateCcw className="w-4 h-4" />
                <span>Re-record</span>
              </button>
            </>
          )}
        </div>

        {hasRecording && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitted}
            className="ed-btn"
            style={
              isSubmitted
                ? {
                    background: 'var(--echo-positive-soft)',
                    color: 'var(--echo-positive)',
                    borderColor: 'color-mix(in srgb, var(--echo-positive) 34%, transparent)',
                    opacity: 1,
                  }
                : undefined
            }
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitted ? 'Voice Confirmed' : 'Attach Voice Note'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
