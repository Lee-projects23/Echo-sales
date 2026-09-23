import React, { useState } from 'react';
import { Plus, Trash2, MapPin, Eye, X, Upload } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { AccessDenied } from '../common/AccessDenied';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { GalleryPhoto } from '../../types';

export const PhotoGalleryPage: React.FC = () => {
  const { currentEmployee, galleryPhotos, uploadGalleryPhoto, deleteGalleryPhoto, t } = usePortal();

  // Permission Check
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
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150">
      <GlobalBackButton />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {t('photoGallery')}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Visual inspection archives, fieldwork documentation, and geocoded captures
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Field Photo</span>
        </button>
      </div>

      {/* Grid of photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {galleryPhotos.map((photo) => (
          <div
            key={photo.id}
            className="apple-card rounded-2xl overflow-hidden group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
          >
            <div
              className="relative aspect-4/3 bg-neutral-900 cursor-pointer overflow-hidden"
              onClick={() => setActivePhoto(photo)}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGalleryPhoto(photo.id);
                    }}
                    className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-white text-xs flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Click to expand</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-1">
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                {photo.title}
              </h3>
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-500" />
                  <span className="truncate max-w-[160px]">{photo.location}</span>
                </span>
                <span className="font-mono text-[10px]">{photo.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-16/10 bg-black flex items-center justify-center">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-5 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-white text-xs">
              <div>
                <h4 className="font-bold text-sm">{activePhoto.title}</h4>
                <div className="flex items-center gap-1.5 text-neutral-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>{activePhoto.location}</span>
                </div>
              </div>
              <span className="font-mono text-neutral-400">{activePhoto.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Upload Field Photo
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="e.g. Compressor Flange Tightening"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Site Location
                </label>
                <input
                  type="text"
                  required
                  value={photoLocation}
                  onChange={(e) => setPhotoLocation(e.target.value)}
                  placeholder="e.g. ECR Site · Chennai"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
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
