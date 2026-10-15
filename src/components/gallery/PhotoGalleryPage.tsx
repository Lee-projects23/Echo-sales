import React, { useMemo, useState } from 'react';
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
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Category controls are derived from the existing location field only.
  const categories = useMemo(() => {
    const unique = Array.from(new Set(galleryPhotos.map((p) => p.location)));
    return [{ key: 'all', label: `All (${galleryPhotos.length})` }].concat(
      unique.map((loc) => ({
        key: loc,
        label: `${loc.length > 26 ? `${loc.slice(0, 26)}…` : loc} (${galleryPhotos.filter((p) => p.location === loc).length})`,
      }))
    );
  }, [galleryPhotos]);

  const visiblePhotos =
    activeCategory === 'all'
      ? galleryPhotos
      : galleryPhotos.filter((p) => p.location === activeCategory);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) return;
    uploadGalleryPhoto(photoTitle.trim(), photoLocation);
    setPhotoTitle('');
    setShowUploadModal(false);
  };

  return (
    <div className="animate-echo-fade">
      {/* ================= Masthead ================= */}
      <section className="em-section pt-14 sm:pt-20 pb-12">
        <GlobalBackButton />
        <div className="mt-7 em-split items-end">
          <div className="em-split-lead">
            <p className="ed-label mb-7">Field Archive</p>
            <h1 className="ed-h1">{t('photoGallery')}</h1>
          </div>
          <div className="em-split-side">
            <p className="ed-sub max-w-sm text-[14px]">
              Visual inspection archives, fieldwork documentation, and geocoded captures.
            </p>
            <div className="mt-7">
              <button onClick={() => setShowUploadModal(true)} className="ed-btn">
                <Plus className="w-4 h-4" />
                <span>Upload Field Photo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Category controls ================= */}
      <section
        className="em-section py-7"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="echo-segment">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className="echo-segment-item"
              data-active={activeCategory === c.key}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* ================= Gallery ================= */}
      <section
        className="em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        {visiblePhotos.length === 0 ? (
          <div className="echo-empty">
            <span className="echo-icon-tile mb-5">
              <ImageOff className="w-5 h-5" />
            </span>
            <p className="ed-h2">No field captures yet</p>
            <p className="ed-sub mt-3 max-w-md">
              Upload your first geocoded inspection capture to build the field archive.
            </p>
          </div>
        ) : (
          <>
            <p className="ed-meta mb-7">
              Showing {visiblePhotos.length} of {galleryPhotos.length} captures
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {visiblePhotos.map((photo) => (
                <figure key={photo.id} className="group">
                  <div
                    className="em-figure relative aspect-4/3 cursor-pointer"
                    onClick={() => setActivePhoto(photo)}
                  >
                    <img src={photo.url} alt={photo.title} referrerPolicy="no-referrer" />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGalleryPhoto(photo.id);
                      }}
                      aria-label={`Delete ${photo.title}`}
                      className="absolute top-3 right-3 p-2 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      style={{ background: 'rgba(10, 9, 8, 0.72)' }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <figcaption className="pt-5">
                    <h3 className="text-[15px] font-medium tracking-[-0.01em] text-[var(--echo-ink)] truncate">
                      {photo.title}
                    </h3>
                    <div className="ed-meta mt-2.5 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{photo.location}</span>
                      </span>
                      <span className="shrink-0">{photo.date}</span>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ================= Lightbox ================= */}
      {activePhoto && (
        <div className="echo-modal-scrim" style={{ background: 'rgba(10, 9, 8, 0.9)' }}>
          <div className="relative w-full max-w-4xl echo-modal !bg-[var(--echo-surface-inset)] overflow-hidden">
            <button
              onClick={() => setActivePhoto(null)}
              aria-label="Close preview"
              className="absolute top-4 right-4 z-10 echo-icon-tile !bg-[var(--echo-overlay)] text-[var(--echo-ink)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center bg-black">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="max-h-[72vh] max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div
              className="p-6 flex flex-wrap items-center justify-between gap-3"
              style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
            >
              <div>
                <h4 className="ed-h2 !text-xl">{activePhoto.title}</h4>
                <div className="ed-meta mt-2 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  <span>{activePhoto.location}</span>
                </div>
              </div>
              <span className="ed-meta">{activePhoto.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= Upload modal ================= */}
      {showUploadModal && (
        <div className="echo-modal-scrim">
          <div className="echo-modal max-w-sm">
            <div
              className="flex items-center justify-between gap-3 pb-5 mb-6"
              style={{ borderBottom: 'var(--echo-rule) solid var(--echo-border)' }}
            >
              <h3 className="ed-h3">Upload Field Photo</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                aria-label="Close"
                className="echo-icon-tile hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
                style={{ width: '1.75rem', height: '1.75rem' }}
              >
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
