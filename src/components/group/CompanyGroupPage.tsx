import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Mic,
  FileText,
  Users,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { AccessDenied } from '../common/AccessDenied';
import { GlobalBackButton } from '../common/GlobalBackButton';

export const CompanyGroupPage: React.FC = () => {
  const { currentEmployee, groupMessages, sendGroupMessage, t } = usePortal();

  if (!currentEmployee.permissions.companyGroup) {
    return <AccessDenied moduleName="Company Official Group" />;
  }

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendGroupMessage(inputText.trim());
    setInputText('');
  };

  const handleAttachMock = (type: 'image' | 'voice' | 'document') => {
    const textMap = {
      image: 'Attached field snapshot: ECR_Motor_Inspection.jpg',
      voice: 'Attached operational voice brief (0:18)',
      document: 'Attached task compliance report: Task_Compliance.pdf',
    };
    sendGroupMessage(textMap[type], type);
  };

  const attachmentIcon = (type: 'image' | 'voice' | 'document') => {
    if (type === 'image') return <ImageIcon className="w-3.5 h-3.5" />;
    if (type === 'voice') return <Mic className="w-3.5 h-3.5" />;
    return <FileText className="w-3.5 h-3.5" />;
  };

  return (
    <div className="animate-echo-fade">
      {/* ================= Masthead ================= */}
      <section className="em-section pt-14 sm:pt-20 pb-12">
        <GlobalBackButton />
        <div className="mt-7 em-split items-end">
          <div className="em-split-lead">
            <div className="flex flex-wrap items-center gap-4 mb-7">
              <p className="ed-label">Communications</p>
              <span className="w-10 h-px" style={{ background: 'var(--echo-border-strong)' }} />
              <span className="echo-chip echo-chip--positive">
                <span className="echo-dot animate-echo-ping" />
                Live
              </span>
            </div>
            <h1 className="ed-h1">{t('companyGroup')}</h1>
          </div>
          <div className="em-split-side">
            <p className="ed-sub max-w-sm text-[14px]">
              Tripartite channel: Operations Command · Client Representative · Assigned Field
              Specialists.
            </p>
          </div>
        </div>
      </section>

      {/* ================= Conversation ================= */}
      <section
        className="em-section pb-16"
        style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
      >
        <div
          className="mt-10 flex flex-col"
          style={{
            height: 'min(620px, 70vh)',
            border: 'var(--echo-rule) solid var(--echo-border)',
            background: 'var(--echo-surface)',
          }}
        >
          {/* Channel header */}
          <div
            className="flex items-center justify-between gap-3 px-5 py-4"
            style={{ borderBottom: 'var(--echo-rule) solid var(--echo-border)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="echo-icon-tile echo-icon-tile--accent" style={{ width: '1.75rem', height: '1.75rem' }}>
                <span className="text-[11px] font-bold leading-none">E</span>
              </span>
              <div className="min-w-0">
                <div className="text-[13px] font-bold tracking-[-0.01em] text-[var(--echo-ink)] truncate">
                  Official Operations Desk #01
                </div>
                <div className="ed-meta mt-1">Synchronized with Admin Command Console</div>
              </div>
            </div>
            <span className="echo-chip shrink-0">
              <Users className="w-3 h-3" />
              {groupMessages.length}
            </span>
          </div>

          {/* Message feed */}
          <div className="flex-1 overflow-y-auto echo-scroll px-5 py-7 space-y-7">
            {groupMessages.map((msg) => {
              const isMe = msg.senderId === currentEmployee.id;

              return (
                <div key={msg.id} className={`flex items-start gap-3.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <img
                    src={msg.avatarUrl}
                    alt={msg.senderName}
                    className="w-8 h-8 object-cover shrink-0 mt-0.5 grayscale-[0.2]"
                    style={{ border: 'var(--echo-rule) solid var(--echo-border)' }}
                    referrerPolicy="no-referrer"
                  />

                  <div className={`max-w-[76%] sm:max-w-[70%] space-y-1.5 ${isMe ? 'items-end text-right' : ''}`}>
                    <div className={`flex flex-wrap items-center gap-2.5 ${isMe ? 'justify-end' : ''}`}>
                      <span className="text-[12px] font-bold tracking-[-0.01em] text-[var(--echo-ink)]">
                        {msg.senderName}
                      </span>
                      <span className="echo-chip">{msg.senderRole}</span>
                      <span className="ed-meta">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`px-4 py-3.5 text-[13px] leading-relaxed text-left ${
                        isMe
                          ? 'text-[var(--echo-accent-ink)]'
                          : 'text-[var(--echo-ink)]'
                      }`}
                      style={
                        isMe
                          ? { background: 'var(--echo-accent)' }
                          : {
                              background: 'var(--echo-surface-2)',
                              border: 'var(--echo-rule) solid var(--echo-border)',
                            }
                      }
                    >
                      {msg.text}

                      {msg.attachmentType && (
                        <span
                          className={`mt-3 pt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                            isMe ? '' : 'text-[var(--echo-ink-3)]'
                          }`}
                          style={
                            isMe
                              ? { borderTop: 'var(--echo-rule) solid color-mix(in srgb, var(--echo-accent-ink) 30%, transparent)' }
                              : { borderTop: 'var(--echo-rule) solid var(--echo-border)' }
                          }
                        >
                          {attachmentIcon(msg.attachmentType)}
                          <span className="capitalize">{msg.attachmentType} Verified Attachment</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <div
            className="px-4 py-3.5"
            style={{ borderTop: 'var(--echo-rule) solid var(--echo-border)' }}
          >
            <form onSubmit={handleSend} className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 shrink-0">
                {(
                  [
                    ['image', 'Attach photo', ImageIcon],
                    ['voice', 'Attach voice note', Mic],
                    ['document', 'Attach document', FileText],
                  ] as const
                ).map(([type, label, Icon]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleAttachMock(type)}
                    title={label}
                    aria-label={label}
                    className="w-9 h-9 flex items-center justify-center text-[var(--echo-ink-3)] hover:text-[var(--echo-ink)] hover:bg-[var(--echo-surface-2)] transition-colors cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Send message to Admin and Client..."
                aria-label="Message"
                className="ed-input flex-1"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                aria-label="Send message"
                className="echo-icon-tile echo-icon-tile--accent disabled:opacity-40 disabled:pointer-events-none transition-transform hover:-translate-y-px cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
