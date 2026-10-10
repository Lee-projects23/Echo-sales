import React, { useState, useRef } from 'react';
import { Camera, Upload, RotateCcw, Check, MapPin } from 'lucide-react';

interface MockCameraProps {
  label: string;
  defaultLocation?: string;
  onCapture: (dataUrl: string, location: string) => void;
  existingImage?: string;
  className?: string;
}

export const MockCamera: React.FC<MockCameraProps> = ({
  label,
  defaultLocation = 'ECR Site · Chennai, Tamil Nadu',
  onCapture,
  existingImage,
  className = '',
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(existingImage || null);
  const [isShutterActive, setIsShutterActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMockSnap = () => {
    setIsShutterActive(true);
    setTimeout(() => {
      setIsShutterActive(false);
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 800, 600);
        grad.addColorStop(0, '#1c1c1a');
        grad.addColorStop(0.5, '#2a2825');
        grad.addColorStop(1, '#0c0b0a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < 800; x += 80) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 600);
          ctx.stroke();
        }
        for (let y = 0; y < 600; y += 60) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(800, y);
          ctx.stroke();
        }

        ctx.strokeStyle = '#c8c5bd';
        ctx.lineWidth = 2;
        ctx.strokeRect(320, 220, 160, 160);
        ctx.beginPath();
        ctx.moveTo(400, 200);
        ctx.lineTo(400, 400);
        ctx.moveTo(300, 300);
        ctx.lineTo(500, 300);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px -apple-system, sans-serif';
        ctx.fillText(`ECHO FIELD AUDIT: ${label.toUpperCase()}`, 40, 60);

        ctx.fillStyle = '#b8b4ac';
        ctx.font = '16px -apple-system, sans-serif';
        const now = new Date();
        ctx.fillText(`LOCATION: ${defaultLocation}`, 40, 95);
        ctx.fillText(`TIMESTAMP: ${now.toLocaleDateString()} · ${now.toLocaleTimeString()}`, 40, 125);
        ctx.fillText(`STATUS: VERIFIED FIELD SNAPSHOT`, 40, 550);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        onCapture(dataUrl, defaultLocation);
      }
    }, 280);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCapturedImage(result);
        onCapture(result, defaultLocation);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-[var(--echo-ink)]">{label}</span>
        <div className="ed-mono flex items-center gap-1.5">
          <MapPin className="w-3 h-3" />
          <span>{defaultLocation}</span>
        </div>
      </div>

      {capturedImage ? (
        <div className="relative rounded-[var(--echo-radius-sm)] border border-[var(--echo-border)] bg-[var(--echo-surface-inset)] group aspect-4/3 sm:aspect-16/9 flex items-center justify-center overflow-hidden">
          <img
            src={capturedImage}
            alt={label}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent flex flex-col justify-between p-4">
            <div className="flex items-center justify-between">
              <span className="ed-tag !bg-black/45 !text-white !border-white/25">
                <Check className="w-3 h-3" /> Captured
              </span>
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-black/35 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-white hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Retake
              </button>
            </div>

            <div className="text-white text-[13px] space-y-0.5">
              <div className="font-semibold">{label}</div>
              <div className="text-[11px] text-white/70">{defaultLocation}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="echo-empty relative aspect-4/3 sm:aspect-16/9 py-6">
          {isShutterActive && (
            <div className="absolute inset-0 bg-white z-20 animate-ping opacity-90 pointer-events-none rounded-[var(--echo-radius)]" />
          )}

          <span className="echo-icon-tile mb-4" style={{ width: '3rem', height: '3rem' }}>
            <Camera className="w-5 h-5" />
          </span>

          <div className="text-[15px] font-semibold text-[var(--echo-ink)] mb-1.5">
            Camera Viewfinder
          </div>
          <p className="text-[13px] text-[var(--echo-ink-3)] max-w-xs mb-5">
            Capture live field evidence or upload high-resolution inspection media from device.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <button
              type="button"
              onClick={handleMockSnap}
              className="ed-btn"
            >
              <Camera className="w-4 h-4" />
              <span>Take Photo</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="ed-btn-ghost"
            >
              <Upload className="w-4 h-4" />
              <span>Upload from Device</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};
