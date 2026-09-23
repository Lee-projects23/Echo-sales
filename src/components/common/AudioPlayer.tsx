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
    <div className="border border-neutral-900/10 dark:border-white/10 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-neutral-900/20 dark:border-white/20 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-950 dark:text-neutral-50">{title}</div>
            {recordedDate && <div className="ed-mono">{recordedDate}</div>}
          </div>
        </div>

        <div className="ed-mono flex items-center gap-1.5 tabular-nums">
          <span>{formatTime(currentSeconds)}</span>
          <span>/</span>
          <span>{durationString}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          className="w-10 h-10 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
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
            className="w-full h-1 bg-neutral-900/10 dark:bg-white/10 appearance-none cursor-pointer accent-neutral-950 dark:accent-white"
          />
        </div>

        <Volume2 className="w-4 h-4 text-neutral-400 shrink-0" />
      </div>
    </div>
  );
};