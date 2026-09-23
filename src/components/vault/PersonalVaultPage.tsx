import React, { useState } from 'react';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  FolderPlus,
  Upload,
  ChevronRight,
  Trash2,
  File,
  X,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { AccessDenied } from '../common/AccessDenied';
import { GlobalBackButton } from '../common/GlobalBackButton';
import { VaultItem } from '../../types';

export const PersonalVaultPage: React.FC = () => {
  const { currentEmployee, vaultItems, createVaultFolder, uploadVaultFile, deleteVaultItem, t } =
    usePortal();

  if (!currentEmployee.permissions.personalVault) {
    return <AccessDenied moduleName="Personal Vault" />;
  }

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<VaultItem | null>(null);

  const currentItems = vaultItems.filter((item) => item.parentId === currentFolderId);

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
    <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-6">
        <GlobalBackButton />
        <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="ed-label mb-4">Private Locker</p>
            <h1 className="ed-h1">{t('personalVault')}</h1>
            <p className="ed-sub mt-3 max-w-xl">
              Private encrypted employee document store and certifications locker.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setShowNewFolderModal(true)} className="ed-btn-ghost">
              <FolderPlus className="w-3.5 h-3.5" />
              <span>New Folder</span>
            </button>
            <button onClick={() => handleMockUpload('document')} className="ed-btn">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-xs border-b border-neutral-900/10 dark:border-white/10 pb-4">
        {breadcrumbList.map((crumb, idx) => (
          <React.Fragment key={crumb.id || 'root'}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
            <button
              onClick={() => setCurrentFolderId(crumb.id)}
              className={`hover:underline cursor-pointer uppercase tracking-[0.14em] text-[11px] font-semibold ${
                crumb.id === currentFolderId
                  ? 'text-neutral-950 dark:text-white'
                  : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Finder Grid */}
      {currentItems.length === 0 ? (
        <div className="py-20 border-t border-b border-neutral-900/10 dark:border-white/10 text-center">
          <Folder className="w-6 h-6 mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
          <p className="font-serif text-xl text-neutral-950 dark:text-neutral-50">This folder is empty</p>
          <p className="ed-sub mt-2 max-w-md mx-auto">
            Upload personal certifications, safety badges, or create new organization folders.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer flex flex-col justify-between border border-neutral-900/10 dark:border-white/10 p-4 hover:border-neutral-950 dark:hover:border-white transition-colors relative"
              onClick={() => {
                if (item.type === 'folder') {
                  setCurrentFolderId(item.id);
                } else {
                  setSelectedFileForPreview(item);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="text-neutral-700 dark:text-neutral-300 opacity-80">
                  {item.type === 'folder' ? (
                    <Folder className="w-6 h-6" />
                  ) : item.type === 'photo' ? (
                    <ImageIcon className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteVaultItem(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-6">
                <div className="text-sm text-neutral-950 dark:text-neutral-50 truncate">
                  {item.name}
                </div>
                <div className="ed-mono mt-1 flex items-center justify-between">
                  <span>{item.type === 'folder' ? 'Folder' : item.size}</span>
                  <span>{item.updatedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm bg-[#f7f5f0] dark:bg-[#0a0a09] border border-neutral-900/10 dark:border-white/10 p-7 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="ed-h3">Create New Folder</h3>
              <button onClick={() => setShowNewFolderModal(false)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-5">
              <input
                type="text"
                autoFocus
                required
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name (e.g. Safety Badges)"
                className="ed-input"
              />

              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowNewFolderModal(false)} className="ed-btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="ed-btn">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {selectedFileForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg bg-[#f7f5f0] dark:bg-[#0a0a09] border border-neutral-900/10 dark:border-white/10 p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-900/10 dark:border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4 text-neutral-500" />
                <span className="ed-h3">{selectedFileForPreview.name}</span>
              </div>
              <button onClick={() => setSelectedFileForPreview(null)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <div className="text-neutral-700 dark:text-neutral-300">
                {selectedFileForPreview.type === 'photo' ? (
                  <ImageIcon className="w-10 h-10" />
                ) : (
                  <FileText className="w-10 h-10" />
                )}
              </div>
              <div className="text-sm font-medium text-neutral-950 dark:text-neutral-50">Encrypted Vault Asset</div>
              <p className="ed-mono">
                Size: {selectedFileForPreview.size || '1.4 MB'} · Verified SHA-256 Checksum
              </p>
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={() => setSelectedFileForPreview(null)} className="ed-btn">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};