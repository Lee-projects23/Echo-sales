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
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-neutral-900 dark:text-neutral-100">{label}</span>
        <div className="ed-mono flex items-center gap-1.5">
          <MapPin className="w-3 h-3" />
          <span>{defaultLocation}</span>
        </div>
      </div>

      {capturedImage ? (
        <div className="relative border border-neutral-900/10 dark:border-white/10 bg-neutral-950 group aspect-4/3 sm:aspect-16/9 flex items-center justify-center overflow-hidden">
          <img
            src={capturedImage}
            alt={label}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-between p-4">
            <div className="flex items-center justify-between">
              <span className="ed-tag text-white/90">
                <Check className="w-3 h-3" /> Captured
              </span>
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/30 text-white text-[11px] font-medium hover:bg-white hover:text-neutral-950 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Retake
              </button>
            </div>

            <div className="text-white text-xs space-y-0.5">
              <div className="font-medium">{label}</div>
              <div className="text-neutral-300 text-[11px]">{defaultLocation}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative border border-dashed border-neutral-900/20 dark:border-white/20 p-6 flex flex-col items-center justify-center text-center overflow-hidden aspect-4/3 sm:aspect-16/9 transition-all">
          {isShutterActive && (
            <div className="absolute inset-0 bg-white z-20 animate-ping opacity-90 pointer-events-none" />
          )}

          <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-neutral-400 dark:border-neutral-600 pointer-events-none" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-neutral-400 dark:border-neutral-600 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-neutral-400 dark:border-neutral-600 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-neutral-400 dark:border-neutral-600 pointer-events-none" />

          <div className="w-12 h-12 border border-neutral-900/15 dark:border-white/15 flex items-center justify-center text-neutral-400 mb-3">
            <Camera className="w-6 h-6" />
          </div>

          <div className="font-serif text-lg text-neutral-950 dark:text-neutral-50 mb-1">
            Camera Viewfinder
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mb-5">
            Capture live field evidence or upload high-resolution inspection media from device.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <button
              type="button"
              onClick={handleMockSnap}
              className="ed-btn"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Take Photo</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="ed-btn-ghost"
            >
              <Upload className="w-3.5 h-3.5" />
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