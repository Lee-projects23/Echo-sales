import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Mic,
  FileText,
  Shield,
  User,
  Building,
  CheckCheck,
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { AccessDenied } from '../common/AccessDenied';
import { GlobalBackButton } from '../common/GlobalBackButton';

export const CompanyGroupPage: React.FC = () => {
  const { currentEmployee, groupMessages, sendGroupMessage, t } = usePortal();

  // Permission Check
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
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6 animate-in fade-in duration-150">
      <GlobalBackButton />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {t('companyGroup')}
            </h1>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Tripartite communications channel: Operations Command · Client Representative · Assigned Field Specialists
          </p>
        </div>

        {/* Channel Badges */}
        <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500">
          <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
            Admin
          </span>
          <span>·</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Client
          </span>
          <span>·</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
            Field Specialist
          </span>
        </div>
      </div>

      {/* Chat Box Container */}
      <div className="apple-card rounded-3xl overflow-hidden flex flex-col h-[560px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs">
              E
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 dark:text-white">
                Official Operations Desk #01
              </div>
              <div className="text-[10px] text-neutral-500">
                Synchronized with Admin Command Console
              </div>
            </div>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {groupMessages.map((msg) => {
            const isMe = msg.senderId === currentEmployee.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                <img
                  src={msg.avatarUrl}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-xl object-cover shrink-0 mt-0.5 ring-1 ring-neutral-200 dark:ring-neutral-700"
                  referrerPolicy="no-referrer"
                />

                <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end' : ''}`}>
                  <div className={`flex items-center gap-2 text-[11px] ${isMe ? 'justify-end' : ''}`}>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {msg.senderName}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                        msg.senderRole === 'Admin'
                          ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                          : msg.senderRole === 'Client'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                      }`}
                    >
                      {msg.senderRole}
                    </span>
                    <span className="text-neutral-400 font-mono text-[10px]">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-tr-none'
                        : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}

                    {msg.attachmentType && (
                      <div className="mt-2 pt-2 border-t border-white/20 dark:border-neutral-700/60 flex items-center gap-1.5 text-[11px] opacity-90">
                        {msg.attachmentType === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                        {msg.attachmentType === 'voice' && <Mic className="w-3.5 h-3.5" />}
                        {msg.attachmentType === 'document' && <FileText className="w-3.5 h-3.5" />}
                        <span className="capitalize">{msg.attachmentType} Verified Attachment</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleAttachMock('image')}
                title="Attach photo"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleAttachMock('voice')}
                title="Attach voice note"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleAttachMock('document')}
                title="Attach document"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send message to Admin and Client..."
              className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-40 transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
