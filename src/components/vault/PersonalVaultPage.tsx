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
  FolderOpen,
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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-echo-fade">
      {/* Header */}
      <div className="mb-6">
        <GlobalBackButton />
        <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="ed-label mb-4">Private Locker</p>
            <h1 className="ed-h1">{t('personalVault')}</h1>
            <p className="ed-sub mt-3 max-w-xl">
              Private encrypted employee document store and certifications locker.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button onClick={() => setShowNewFolderModal(true)} className="ed-btn-ghost">
              <FolderPlus className="w-4 h-4" />
              <span>New Folder</span>
            </button>
            <button onClick={() => handleMockUpload('document')} className="ed-btn">
              <Upload className="w-4 h-4" />
              <span>Upload File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="echo-card echo-card--pad mb-6 flex flex-wrap items-center gap-2 !py-3">
        {breadcrumbList.map((crumb, idx) => (
          <React.Fragment key={crumb.id || 'root'}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />}
            <button
              onClick={() => setCurrentFolderId(crumb.id)}
              className={`rounded-full px-3 py-1 text-[12px] font-semibold transition-colors cursor-pointer ${
                crumb.id === currentFolderId
                  ? 'bg-[var(--echo-accent-soft)] text-[var(--echo-accent)]'
                  : 'text-[var(--echo-ink-3)] hover:bg-[var(--echo-surface-2)] hover:text-[var(--echo-ink)]'
              }`}
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {/* Finder Grid */}
      {currentItems.length === 0 ? (
        <div className="echo-empty">
          <span className="echo-icon-tile mb-5">
            <FolderOpen className="w-5 h-5" />
          </span>
          <p className="ed-h2">This folder is empty</p>
          <p className="ed-sub mt-2 max-w-md">
            Upload personal certifications, safety badges, or create new organization folders.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="echo-card echo-card-hover group cursor-pointer flex flex-col justify-between p-4 relative"
              onClick={() => {
                if (item.type === 'folder') {
                  setCurrentFolderId(item.id);
                } else {
                  setSelectedFileForPreview(item);
                }
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="echo-icon-tile">
                  {item.type === 'folder' ? (
                    <Folder className="w-5 h-5" />
                  ) : item.type === 'photo' ? (
                    <ImageIcon className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteVaultItem(item.id);
                  }}
                  aria-label={`Delete ${item.name}`}
                  className="rounded-full p-1.5 text-[var(--echo-ink-3)] opacity-0 group-hover:opacity-100 hover:bg-[var(--echo-danger-soft)] hover:text-[var(--echo-danger)] transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-5">
                <div className="text-[14px] font-medium text-[var(--echo-ink)] truncate">
                  {item.name}
                </div>
                <div className="ed-mono mt-1.5 flex items-center justify-between gap-2">
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
        <div className="echo-modal-scrim">
          <div className="echo-modal max-w-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="ed-h3">Create New Folder</h3>
              <button onClick={() => setShowNewFolderModal(false)} aria-label="Close" className="echo-icon-tile hover:text-[var(--echo-ink)] transition-colors cursor-pointer" style={{ width: '1.875rem', height: '1.875rem' }}>
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
        <div className="echo-modal-scrim">
          <div className="echo-modal max-w-lg space-y-5">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--echo-border)] pb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="echo-icon-tile">
                  <File className="w-4 h-4" />
                </span>
                <span className="ed-h3 truncate">{selectedFileForPreview.name}</span>
              </div>
              <button onClick={() => setSelectedFileForPreview(null)} aria-label="Close" className="echo-icon-tile hover:text-[var(--echo-ink)] transition-colors cursor-pointer" style={{ width: '1.875rem', height: '1.875rem' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <span className="echo-icon-tile" style={{ width: '3.5rem', height: '3.5rem' }}>
                {selectedFileForPreview.type === 'photo' ? (
                  <ImageIcon className="w-6 h-6" />
                ) : (
                  <FileText className="w-6 h-6" />
                )}
              </span>
              <div className="text-[14px] font-medium text-[var(--echo-ink)]">Encrypted Vault Asset</div>
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
