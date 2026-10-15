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
        grad.addColorStop(0, '#1a1714');
        grad.addColorStop(0.5, '#262220');
        grad.addColorStop(1, '#0d0b0a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);

        ctx.strokeStyle = 'rgba(242, 236, 225, 0.08)';
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

        // Focal reticle in the crimson accent
        ctx.strokeStyle = '#c9465a';
        ctx.lineWidth = 2;
        ctx.strokeRect(320, 220, 160, 160);
        ctx.beginPath();
        ctx.moveTo(400, 200);
        ctx.lineTo(400, 400);
        ctx.moveTo(300, 300);
        ctx.lineTo(500, 300);
        ctx.stroke();

        ctx.fillStyle = '#f2ece1';
        ctx.font = 'bold 24px -apple-system, sans-serif';
        ctx.fillText(`ECHO FIELD AUDIT: ${label.toUpperCase()}`, 40, 60);

        ctx.fillStyle = '#b8ad9c';
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
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--echo-ink)]">
          {label}
        </span>
        <div className="ed-meta flex items-center gap-1.5">
          <MapPin className="w-3 h-3" />
          <span>{defaultLocation}</span>
        </div>
      </div>

      {capturedImage ? (
        <div
          className="relative aspect-4/3 sm:aspect-16/9 flex items-center justify-center overflow-hidden group"
          style={{ border: 'var(--echo-rule) solid var(--echo-border)' }}
        >
          <img
            src={capturedImage}
            alt={label}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent flex flex-col justify-between p-4">
            <div className="flex items-center justify-between">
              <span
                className="echo-chip"
                style={{
                  background: 'var(--echo-positive)',
                  color: 'var(--echo-accent-ink)',
                  borderColor: 'transparent',
                }}
              >
                <Check className="w-3 h-3" /> Captured
              </span>
              <button
                type="button"
                onClick={handleRetake}
                className="echo-chip cursor-pointer hover:bg-white hover:text-[var(--echo-ink)] transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Retake
              </button>
            </div>

            <div className="text-[#f2ece1] text-[13px] space-y-0.5">
              <div className="font-semibold">{label}</div>
              <div className="text-[11px] text-white/70 font-mono">{defaultLocation}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="echo-empty relative aspect-4/3 sm:aspect-16/9 py-6">
          {isShutterActive && (
            <div className="absolute inset-0 bg-white z-20 animate-ping opacity-90 pointer-events-none" />
          )}

          {/* Viewfinder brackets */}
          {[
            'top-4 left-4 border-t-2 border-l-2 rounded-tl-sm',
            'top-4 right-4 border-t-2 border-r-2 rounded-tr-sm',
            'bottom-4 left-4 border-b-2 border-l-2 rounded-bl-sm',
            'bottom-4 right-4 border-b-2 border-r-2 rounded-br-sm',
          ].map((pos) => (
            <span
              key={pos}
              className={`absolute w-5 h-5 pointer-events-none border-[var(--echo-ink-3)] ${pos}`}
            />
          ))}

          <span className="echo-icon-tile mb-4" style={{ width: '3rem', height: '3rem' }}>
            <Camera className="w-5 h-5" />
          </span>

          <div className="text-[15px] font-bold tracking-[-0.01em] text-[var(--echo-ink)] mb-1.5">
            Camera Viewfinder
          </div>
          <p className="text-[13px] text-[var(--echo-ink-3)] max-w-xs mb-5">
            Capture live field evidence or upload high-resolution inspection media from device.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            <button type="button" onClick={handleMockSnap} className="ed-btn">
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
