import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Radio } from 'lucide-react';

interface AudioPlayerProps {
  title: string;
  durationString: string;
  durationSeconds: number;
  recordedDate?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  title,
  durationString,
  durationSeconds,
  recordedDate,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSeconds((prev) => {
          if (prev >= durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, durationSeconds]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSeconds(Number(e.target.value));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const percent = (currentSeconds / Math.max(1, durationSeconds)) * 100;

  return (
    <div className="echo-card echo-card--pad space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="echo-icon-tile echo-icon-tile--accent">
            <Radio className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <div className="text-[13px] font-bold tracking-[-0.01em] text-[var(--echo-ink)] truncate">
              {title}
            </div>
            {recordedDate && <div className="ed-meta mt-1.5">{recordedDate}</div>}
          </div>
        </div>

        <div className="ed-meta flex items-center gap-1.5 tabular-nums">
          <span>{formatTime(currentSeconds)}</span>
          <span aria-hidden>/</span>
          <span>{durationString}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          className="echo-icon-tile echo-icon-tile--accent shrink-0 transition-transform hover:-translate-y-px cursor-pointer"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <div className="flex-1 relative flex items-center">
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px]"
            style={{ width: `${percent}%`, background: 'var(--echo-accent)' }}
          />
          <input
            type="range"
            min={0}
            max={durationSeconds}
            value={currentSeconds}
            onChange={handleSeek}
            aria-label="Audio progress"
            className="relative w-full h-[3px] appearance-none cursor-pointer"
            style={{ accentColor: 'var(--echo-accent)' }}
          />
        </div>

        <Volume2 className="w-4 h-4 text-[var(--echo-ink-3)] shrink-0" />
      </div>
    </div>
  );
};
