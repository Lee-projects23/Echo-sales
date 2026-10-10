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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 animate-echo-fade">
      <GlobalBackButton />

      {/* Header */}
      <div className="mt-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="ed-label mb-4">Communications</p>
            <h1 className="ed-h1">{t('companyGroup')}</h1>
            <p className="ed-sub mt-3 max-w-xl">
              Tripartite channel: Operations Command · Client Representative · Assigned Field Specialists.
            </p>
          </div>

          <span className="echo-chip echo-chip--positive">
            <span className="echo-dot animate-echo-ping" />
            Live
          </span>
        </div>
      </div>

      {/* Chat Box */}
      <div className="echo-card flex flex-col h-[560px] overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-[var(--echo-border)] flex items-center justify-between gap-3 bg-[var(--echo-surface-2)]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="echo-icon-tile echo-icon-tile--accent font-serif text-[13px]">
              E
            </span>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-[var(--echo-ink)] truncate">
                Official Operations Desk #01
              </div>
              <div className="ed-mono mt-0.5">Synchronized with Admin Command Console</div>
            </div>
          </div>
          <span className="echo-chip shrink-0">
            <Users className="w-3.5 h-3.5" />
            {groupMessages.length}
          </span>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto echo-scroll px-5 py-6 space-y-5">
          {groupMessages.map((msg) => {
            const isMe = msg.senderId === currentEmployee.id;

            return (
              <div key={msg.id} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                <img
                  src={msg.avatarUrl}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-[var(--echo-border)]"
                  referrerPolicy="no-referrer"
                />

                <div className={`max-w-[78%] sm:max-w-[75%] space-y-1.5 ${isMe ? 'items-end text-right' : ''}`}>
                  <div className={`flex flex-wrap items-center gap-2 ${isMe ? 'justify-end' : ''}`}>
                    <span className="text-[12px] font-semibold text-[var(--echo-ink)]">
                      {msg.senderName}
                    </span>
                    <span className="ed-tag">{msg.senderRole}</span>
                    <span className="ed-mono">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`rounded-[var(--echo-radius)] px-4 py-3 text-[13px] leading-relaxed text-left ${
                      isMe
                        ? 'bg-[var(--echo-accent)] text-[var(--echo-accent-ink)] shadow-[var(--echo-shadow-accent)]'
                        : 'bg-[var(--echo-surface-2)] border border-[var(--echo-border)] text-[var(--echo-ink)]'
                    }`}
                  >
                    {msg.text}

                    {msg.attachmentType && (
                      <span className={`mt-2.5 pt-2.5 flex items-center gap-1.5 text-[11px] font-medium ${isMe ? 'border-t border-black/10' : 'border-t border-[var(--echo-border)] text-[var(--echo-ink-3)]'}`}>
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

        {/* Input Bar */}
        <div className="px-4 py-3 border-t border-[var(--echo-border)] bg-[var(--echo-surface-2)]">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleAttachMock('image')}
                title="Attach photo"
                aria-label="Attach photo"
                className="echo-icon-tile !border-transparent !bg-transparent hover:!bg-[var(--echo-surface-3)] hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleAttachMock('voice')}
                title="Attach voice note"
                aria-label="Attach voice note"
                className="echo-icon-tile !border-transparent !bg-transparent hover:!bg-[var(--echo-surface-3)] hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleAttachMock('document')}
                title="Attach document"
                aria-label="Attach document"
                className="echo-icon-tile !border-transparent !bg-transparent hover:!bg-[var(--echo-surface-3)] hover:text-[var(--echo-ink)] transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send message to Admin and Client..."
              className="ed-input !rounded-full"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              aria-label="Send message"
              className="echo-icon-tile echo-icon-tile--accent disabled:opacity-40 disabled:pointer-events-none transition-transform hover:-translate-y-px cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
