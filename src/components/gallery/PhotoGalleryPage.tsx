import React, { useState } from 'react';
import { Plus, Trash2, MapPin, X, ImageOff } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { AccessDenied } from '../common/AccessDenied';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { GalleryPhoto } from '../../types';

export const PhotoGalleryPage: React.FC = () => {
  const { currentEmployee, galleryPhotos, uploadGalleryPhoto, deleteGalleryPhoto, t } = usePortal();

  if (!currentEmployee.permissions.photoGallery) {
    return <AccessDenied moduleName="Photo Gallery" />;
  }

  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoLocation, setPhotoLocation] = useState('ECR Site · Chennai, Tamil Nadu');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) return;
    uploadGalleryPhoto(photoTitle.trim(), photoLocation);
    setPhotoTitle('');
    setShowUploadModal(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-echo-fade">
      {/* Header */}
      <div className="mb-10">
        <GlobalBackButton />
        <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="ed-label mb-4">Field Archive</p>
            <h1 className="ed-h1">{t('photoGallery')}</h1>
            <p className="ed-sub mt-3 max-w-xl">
              Visual inspection archives, fieldwork documentation, and geocoded captures.
            </p>
          </div>

          <button onClick={() => setShowUploadModal(true)} className="ed-btn shrink-0">
            <Plus className="w-4 h-4" />
            <span>Upload Field Photo</span>
          </button>
        </div>
      </div>

      {/* Grid of photos */}
      {galleryPhotos.length === 0 ? (
        <div className="echo-empty">
          <span className="echo-icon-tile mb-5">
            <ImageOff className="w-5 h-5" />
          </span>
          <p className="ed-h2">No field captures yet</p>
          <p className="ed-sub mt-2 max-w-md">
            Upload your first geocoded inspection capture to build the field archive.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {galleryPhotos.map((photo) => (
            <div key={photo.id} className="echo-card echo-card-hover group overflow-hidden">
              <div
                className="relative aspect-4/3 bg-[var(--echo-surface-inset)] cursor-pointer overflow-hidden"
                onClick={() => setActivePhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end p-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGalleryPhoto(photo.id);
                    }}
                    aria-label={`Delete ${photo.title}`}
                    className="rounded-full border border-white/30 p-2 text-white/90 hover:bg-white hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 border-t border-[var(--echo-border)]">
                <h3 className="text-[14px] font-medium text-[var(--echo-ink)] truncate">
                  {photo.title}
                </h3>
                <div className="ed-mono mt-2 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1 min-w-0">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{photo.location}</span>
                  </span>
                  <span className="shrink-0">{photo.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {activePhoto && (
        <div className="echo-modal-scrim !bg-black/85">
          <div className="relative w-full max-w-4xl echo-modal !bg-[var(--echo-surface-inset)] overflow-hidden">
            <button
              onClick={() => setActivePhoto(null)}
              aria-label="Close preview"
              className="absolute top-4 right-4 z-10 echo-icon-tile !bg-[var(--echo-overlay)] text-[var(--echo-ink)] hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center bg-black">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="max-h-[75vh] max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-5 border-t border-[var(--echo-border)] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="ed-h2 !text-lg">{activePhoto.title}</h4>
                <div className="ed-mono mt-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  <span>{activePhoto.location}</span>
                </div>
              </div>
              <span className="ed-mono">{activePhoto.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="echo-modal-scrim">
          <div className="echo-modal max-w-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="ed-h3">Upload Field Photo</h3>
              <button onClick={() => setShowUploadModal(false)} aria-label="Close" className="echo-icon-tile hover:text-[var(--echo-ink)] transition-colors cursor-pointer" style={{ width: '1.875rem', height: '1.875rem' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="ed-label block mb-2">Photo Title</label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="e.g. Compressor Flange Tightening"
                  className="ed-input"
                />
              </div>

              <div>
                <label className="ed-label block mb-2">Site Location</label>
                <input
                  type="text"
                  required
                  value={photoLocation}
                  onChange={(e) => setPhotoLocation(e.target.value)}
                  placeholder="e.g. ECR Site · Chennai"
                  className="ed-input"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowUploadModal(false)} className="ed-btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="ed-btn">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
