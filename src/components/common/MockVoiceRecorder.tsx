import React, { useState, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Check, Volume2 } from 'lucide-react';

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
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/60 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-neutral-400 dark:bg-neutral-600'}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {isRecording ? 'Recording Live Audio...' : hasRecording ? 'Audio Note Ready' : 'Field Voice Response'}
          </span>
        </div>
        <span className="font-mono text-xs tabular-nums font-medium text-neutral-700 dark:text-neutral-300">
          {formatTime(recordedDuration)}
        </span>
      </div>

      {/* Waveform graphic visualization */}
      <div className="h-14 rounded-xl bg-neutral-200 dark:bg-neutral-800/80 px-4 flex items-center justify-center gap-1 overflow-hidden">
        {Array.from({ length: 36 }).map((_, i) => {
          const activeHeight = isRecording
            ? Math.max(15, Math.sin(i * 0.4 + Date.now() / 200) * 85 + 20)
            : hasRecording
            ? Math.max(12, ((i * 17) % 70) + 15)
            : 10;
          const isPassed = (i / 36) * 100 <= playbackProgress;

          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isRecording
                  ? 'bg-red-500'
                  : isPlaying && isPassed
                  ? 'bg-sky-500'
                  : 'bg-neutral-400 dark:bg-neutral-600'
              }`}
              style={{ height: `${activeHeight}%` }}
            />
          );
        })}
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {!hasRecording && !isRecording && (
            <button
              type="button"
              onClick={handleStartRecording}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Start Recording</span>
            </button>
          )}

          {isRecording && (
            <button
              type="button"
              onClick={handleStopRecording}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          )}

          {hasRecording && (
            <>
              <button
                type="button"
                onClick={handlePlayToggle}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play Recording'}</span>
              </button>

              <button
                type="button"
                onClick={handleRerecord}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
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
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              isSubmitted
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-sm'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isSubmitted ? 'Voice Confirmed' : 'Attach Voice Note'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
