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
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-900 dark:text-white leading-tight">
              {title}
            </div>
            {recordedDate && (
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {recordedDate}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
          <span>{formatTime(currentSeconds)}</span>
          <span>/</span>
          <span>{durationString}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <div className="flex-1 relative flex items-center">
          <input
            type="range"
            min={0}
            max={durationSeconds}
            value={currentSeconds}
            onChange={handleSeek}
            className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-white"
          />
        </div>

        <Volume2 className="w-4 h-4 text-neutral-400 shrink-0" />
      </div>
    </div>
  );
};
