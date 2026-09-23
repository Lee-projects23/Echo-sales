import React, { useState } from 'react';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  FolderPlus,
  Upload,
  ChevronRight,
  Trash2,
  Lock,
  Eye,
  File,
  X,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { AccessDenied } from '../common/AccessDenied';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { VaultItem } from '../../types';

export const PersonalVaultPage: React.FC = () => {
  const {
    currentEmployee,
    vaultItems,
    createVaultFolder,
    uploadVaultFile,
    deleteVaultItem,
    t,
  } = usePortal();

  // Permission Check
  if (!currentEmployee.permissions.personalVault) {
    return <AccessDenied moduleName="Personal Vault" />;
  }

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<VaultItem | null>(null);

  // Filter items in current directory
  const currentItems = vaultItems.filter((item) => item.parentId === currentFolderId);

  // Breadcrumbs computation
  const breadcrumbList: { id: string | null; name: string }[] = [{ id: null, name: 'Vault Root' }];
  if (currentFolderId) {
    const parentFolder = vaultItems.find((i) => i.id === currentFolderId);
    if (parentFolder) {
      breadcrumbList.push({ id: parentFolder.id, name: parentFolder.name });
    }
  }

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createVaultFolder(newFolderName.trim(), currentFolderId);
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  const handleMockUpload = (type: 'document' | 'photo') => {
    const defaultName =
      type === 'document'
        ? `Field_Verification_Doc_${Math.floor(100 + Math.random() * 900)}.pdf`
        : `Site_Inspection_Shot_${Math.floor(100 + Math.random() * 900)}.jpg`;
    uploadVaultFile(defaultName, type, '1.4 MB', currentFolderId);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150">
      <GlobalBackButton />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {t('personalVault')}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Private encrypted employee document store and certifications locker
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewFolderModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Folder</span>
          </button>

          <button
            onClick={() => handleMockUpload('document')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb Navigation Bar */}
      <div className="flex items-center gap-2 text-xs py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 font-medium text-neutral-600 dark:text-neutral-400">
        {breadcrumbList.map((crumb, idx) => (
          <React.Fragment key={crumb.id || 'root'}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
            <button
              onClick={() => setCurrentFolderId(crumb.id)}
              className={`hover:underline cursor-pointer ${
                crumb.id === currentFolderId
                  ? 'text-neutral-900 dark:text-white font-semibold'
                  : 'hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Finder Grid View */}
      {currentItems.length === 0 ? (
        <div className="apple-card rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mb-3">
            <Folder className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            This folder is empty
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Upload personal certifications, safety badges, or create new organization folders.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="apple-card rounded-2xl p-4 flex flex-col justify-between group hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer relative"
              onClick={() => {
                if (item.type === 'folder') {
                  setCurrentFolderId(item.id);
                } else {
                  setSelectedFileForPreview(item);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                  {item.type === 'folder' ? (
                    <Folder className="w-5 h-5 text-sky-500 fill-sky-500/20" />
                  ) : item.type === 'photo' ? (
                    <ImageIcon className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <FileText className="w-5 h-5 text-purple-500" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteVaultItem(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-4">
                <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                  {item.name}
                </div>
                <div className="text-[11px] text-neutral-500 flex items-center justify-between mt-1">
                  <span>{item.type === 'folder' ? 'Folder' : item.size}</span>
                  <span className="font-mono text-[10px]">{item.updatedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Create New Folder
              </h3>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                autoFocus
                required
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name (e.g. Safety Badges)"
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {selectedFileForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  {selectedFileForPreview.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedFileForPreview(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-700 shadow-sm flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                {selectedFileForPreview.type === 'photo' ? (
                  <ImageIcon className="w-8 h-8" />
                ) : (
                  <FileText className="w-8 h-8" />
                )}
              </div>
              <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                Encrypted Vault Asset
              </div>
              <p className="text-[11px] text-neutral-500 font-mono">
                Size: {selectedFileForPreview.size || '1.4 MB'} · Verified SHA-256 Checksum
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedFileForPreview(null)}
                className="px-5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
