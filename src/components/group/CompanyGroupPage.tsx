import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Mic,
  FileText,
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

  return (
    <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      <GlobalBackButton />

      {/* Header */}
      <div className="mt-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="ed-label mb-4">Communications</p>
            <h1 className="ed-h1">{t('companyGroup')}</h1>
            <p className="ed-sub mt-3 max-w-xl">
              Tripartite channel: Operations Command · Client Representative · Assigned Field Specialists.
            </p>
          </div>

          <span className="hidden sm:inline-flex items-center gap-2 ed-tag text-neutral-500 dark:text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 dark:bg-white" />
            Live
          </span>
        </div>
      </div>

      {/* Chat Box */}
      <div className="border border-neutral-900/10 dark:border-white/10 flex flex-col h-[560px]">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-neutral-900/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-neutral-900/20 dark:border-white/20 flex items-center justify-center font-serif text-xs text-neutral-950 dark:text-neutral-50">
              E
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-950 dark:text-neutral-50">
                Official Operations Desk #01
              </div>
              <div className="ed-mono">Synchronized with Admin Command Console</div>
            </div>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {groupMessages.map((msg) => {
            const isMe = msg.senderId === currentEmployee.id;

            return (
              <div key={msg.id} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                <img
                  src={msg.avatarUrl}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 grayscale"
                  referrerPolicy="no-referrer"
                />

                <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end' : ''}`}>
                  <div className={`flex items-center gap-2 ${isMe ? 'justify-end' : ''}`}>
                    <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                      {msg.senderName}
                    </span>
                    <span className="ed-tag text-neutral-400 dark:text-neutral-500">
                      {msg.senderRole}
                    </span>
                    <span className="ed-mono">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`px-4 py-3 text-xs leading-relaxed border ${
                      isMe
                        ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 border-neutral-950 dark:border-white'
                        : 'border-neutral-900/10 dark:border-white/10 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {msg.text}

                    {msg.attachmentType && (
                      <span className="mt-2 pt-2 block border-t border-white/15 dark:border-black/15 flex items-center gap-1.5 text-[11px] opacity-80">
                        {msg.attachmentType === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                        {msg.attachmentType === 'voice' && <Mic className="w-3.5 h-3.5" />}
                        {msg.attachmentType === 'document' && <FileText className="w-3.5 h-3.5" />}
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
        <div className="px-4 py-3 border-t border-neutral-900/10 dark:border-white/10">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleAttachMock('image')}
                title="Attach photo"
                className="p-2 text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleAttachMock('voice')}
                title="Attach voice note"
                className="p-2 text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleAttachMock('document')}
                title="Attach document"
                className="p-2 text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send message to Admin and Client..."
              className="flex-1 px-4 py-2 text-xs bg-transparent border border-neutral-900/20 dark:border-white/20 focus:outline-none focus:border-neutral-950 dark:focus:border-white text-neutral-900 dark:text-white placeholder-neutral-400 transition-colors"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:opacity-80 disabled:opacity-30 transition-opacity shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};