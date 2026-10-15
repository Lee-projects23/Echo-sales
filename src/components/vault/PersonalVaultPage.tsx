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
    <div className="animate-echo-fade">
      {/* ================= Masthead ================= */}
      <section className="em-section pt-14 sm:pt-20 pb-12">
        <GlobalBackButton />
        <div className="mt-7 em-split items-end">
          <div className="em-split-lead">
            <p className="ed-label mb-7">Private Locker</p>
            <h1 className="ed-h1">{t('personalVault')}</h1>
          </div>
          <div className="em-split-side">
            <p className="ed-sub max-w-sm text-[14px]">
              Private encrypted employee document store and certifications locker.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
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
      </section>

      {/* ================= Breadcrumb ================= */}
      <section
        className="em-section py-6"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <nav className="flex flex-wrap items-center gap-3">
          {breadcrumbList.map((crumb, idx) => (
            <React.Fragment key={crumb.id || 'root'}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[var(--echo-ink-3)]" />}
              <button
                onClick={() => setCurrentFolderId(crumb.id)}
                className={`text-[11px] font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                  crumb.id === currentFolderId
                    ? 'text-[var(--echo-accent)]'
                    : 'text-[var(--echo-ink-3)] hover:text-[var(--echo-ink)]'
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </section>

      {/* ================= Directory figures ================= */}
      <section
        className="em-invert em-section py-12"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-9">
          {[
            { label: 'Items', value: currentItems.length },
            { label: 'Folders', value: currentItems.filter((i) => i.type === 'folder').length },
            { label: 'Documents', value: currentItems.filter((i) => i.type === 'document').length },
            { label: 'Photos', value: currentItems.filter((i) => i.type === 'photo').length },
          ].map((s) => (
            <div key={s.label}>
              <div className="echo-kpi-label">{s.label}</div>
              <div
                className="mt-5 font-serif text-[clamp(2.5rem,5vw,3.5rem)] leading-[0.88] tracking-[-0.03em] tabular-nums"
                style={{ color: 'var(--echo-invert-ink)' }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Document library ================= */}
      <section
        className="em-section py-14 sm:py-20"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        {currentItems.length === 0 ? (
          <div className="echo-empty">
            <span className="echo-icon-tile mb-5">
              <FolderOpen className="w-5 h-5" />
            </span>
            <p className="ed-h2">This folder is empty</p>
            <p className="ed-sub mt-3 max-w-md">
              Upload personal certifications, safety badges, or create new organization folders.
            </p>
          </div>
        ) : (
          <ul style={{ borderTop: 'var(--echo-rule) solid var(--echo-ink)' }}>
            {currentItems.map((item) => (
              <li
                key={item.id}
                className="group flex items-center gap-5 py-6 cursor-pointer transition-colors hover:bg-[var(--echo-surface-2)]"
                style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
                onClick={() => {
                  if (item.type === 'folder') {
                    setCurrentFolderId(item.id);
                  } else {
                    setSelectedFileForPreview(item);
                  }
                }}
              >
                <span className="echo-icon-tile shrink-0">
                  {item.type === 'folder' ? (
                    <Folder className="w-4 h-4" style={{ color: 'var(--echo-accent)' }} />
                  ) : item.type === 'photo' ? (
                    <ImageIcon className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-medium tracking-[-0.01em] text-[var(--echo-ink)] truncate">
                    {item.name}
                  </div>
                  <div className="ed-meta mt-2">
                    {item.type === 'folder' ? 'Folder' : item.size || 'Document'} · Updated{' '}
                    {item.updatedAt}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteVaultItem(item.id);
                  }}
                  aria-label={`Delete ${item.name}`}
                  className="shrink-0 opacity-0 group-hover:opacity-100 p-2 text-[var(--echo-ink-3)] hover:text-[var(--echo-danger)] transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ================= New folder modal ================= */}
      {showNewFolderModal && (
        <div className="echo-modal-scrim">
          <div className="echo-modal max-w-sm">
            <div
              className="flex items-center justify-between gap-3 pb-5 mb-6"
              style={{ borderBottom: 'var(--echo-rule) solid var(--echo-border)' }}
            >
              <h3 className="ed-h3">Create New Folder</h3>
              <button
                onClick={() => setShowNewFolderModal(false)}
                aria-label="Close"
                className="echo-icon-tile hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
                style={{ width: '1.75rem', height: '1.75rem' }}
              >
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

      {/* ================= File preview modal ================= */}
      {selectedFileForPreview && (
        <div className="echo-modal-scrim">
          <div className="echo-modal max-w-lg">
            <div
              className="flex items-center justify-between gap-3 pb-5 mb-6"
              style={{ borderBottom: 'var(--echo-rule) solid var(--echo-border)' }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="echo-icon-tile" style={{ width: '1.75rem', height: '1.75rem' }}>
                  <File className="w-3.5 h-3.5" />
                </span>
                <span className="ed-h3 truncate">{selectedFileForPreview.name}</span>
              </div>
              <button
                onClick={() => setSelectedFileForPreview(null)}
                aria-label="Close"
                className="echo-icon-tile hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
                style={{ width: '1.75rem', height: '1.75rem' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-12 flex flex-col items-center justify-center text-center">
              <span className="echo-icon-tile mb-6" style={{ width: '3.5rem', height: '3.5rem' }}>
                {selectedFileForPreview.type === 'photo' ? (
                  <ImageIcon className="w-6 h-6" />
                ) : (
                  <FileText className="w-6 h-6" />
                )}
              </span>
              <div className="text-[15px] font-medium text-[var(--echo-ink)]">Encrypted Vault Asset</div>
              <p className="ed-meta mt-3">
                Size: {selectedFileForPreview.size || '1.4 MB'} · Verified SHA-256 Checksum
              </p>
            </div>

            <div className="flex justify-end pt-5" style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}>
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
