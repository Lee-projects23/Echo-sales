import React, { useState } from 'react';
import { Plus, Trash2, MapPin, X } from 'lucide-react';
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
    <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-10">
        <GlobalBackButton />
        <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="ed-label mb-4">Field Archive</p>
            <h1 className="ed-h1">{t('photoGallery')}</h1>
            <p className="ed-sub mt-3 max-w-xl">
              Visual inspection archives, fieldwork documentation, and geocoded captures.
            </p>
          </div>

          <button onClick={() => setShowUploadModal(true)} className="ed-btn shrink-0">
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Field Photo</span>
          </button>
        </div>
      </div>

      {/* Grid of photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {galleryPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group flex flex-col justify-between"
          >
            <div
              className="relative aspect-4/3 bg-neutral-950 cursor-pointer overflow-hidden border border-neutral-900/10 dark:border-white/10"
              onClick={() => setActivePhoto(photo)}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end p-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGalleryPhoto(photo.id);
                  }}
                  className="p-1.5 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pt-3 border-b border-neutral-900/10 dark:border-white/10 pb-3">
              <h3 className="font-serif text-base text-neutral-950 dark:text-neutral-50 truncate">
                {photo.title}
              </h3>
              <div className="ed-mono mt-1 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{photo.location}</span>
                </span>
                <span>{photo.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full bg-[#0a0a09] border border-white/10">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
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

            <div className="p-5 border-t border-white/10 flex items-center justify-between text-neutral-200">
              <div>
                <h4 className="font-serif text-lg">{activePhoto.title}</h4>
                <div className="ed-mono mt-1 flex items-center gap-1.5 text-neutral-400">
                  <MapPin className="w-3 h-3" />
                  <span>{activePhoto.location}</span>
                </div>
              </div>
              <span className="ed-mono text-neutral-400">{activePhoto.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm bg-[#f7f5f0] dark:bg-[#0a0a09] border border-neutral-900/10 dark:border-white/10 p-7 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="ed-h3">Upload Field Photo</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
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