import React, { useState } from 'react';
import { X, Users, Globe, Share2 } from 'lucide-react';
import { CreatedApp, ShareScope } from '../types';

interface Props {
  app: CreatedApp;
  onClose: () => void;
  onShare: (scope: ShareScope, targetSite?: string) => void;
}

const SHARE_OPTIONS: {
  scope: ShareScope;
  icon: React.ElementType;
  title: string;
  description: string;
}[] = [
  {
    scope: 'account',
    icon: Users,
    title: 'Within my account',
    description: 'Available across all sites you manage in this Wix account.',
  },
  {
    scope: 'site',
    icon: Share2,
    title: 'To another site',
    description: 'Share with a specific site outside your account.',
  },
  {
    scope: 'community',
    icon: Globe,
    title: 'Community',
    description: 'Publish to the Wix community so anyone can discover and use it.',
  },
];

const ShareModal: React.FC<Props> = ({ app, onClose, onShare }) => {
  const [selectedScope, setSelectedScope] = useState<ShareScope>('account');
  const [targetSite, setTargetSite] = useState('');

  const handleShare = () => {
    onShare(selectedScope, selectedScope === 'site' ? targetSite : undefined);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(22,22,29,0.5)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: '#ffffff', border: '1px solid #e5e8ef' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: '#e5e8ef' }}
        >
          <div>
            <h2 className="text-base font-bold" style={{ color: '#16161d' }}>
              Share "{app.name}"
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
              Choose how to share this app
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#9098a9' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#f0f0f5';
              (e.currentTarget as HTMLButtonElement).style.color = '#16161d';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = '#9098a9';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Options */}
        <div className="p-5 flex flex-col gap-2.5">
          {SHARE_OPTIONS.map(opt => {
            const Icon = opt.icon;
            const isSelected = selectedScope === opt.scope;
            return (
              <button
                key={opt.scope}
                onClick={() => setSelectedScope(opt.scope)}
                className="flex items-start gap-3 p-4 rounded-xl text-left transition-all"
                style={{
                  background: isSelected ? '#f5f9ff' : '#fafbfc',
                  border: `1px solid ${isSelected ? '#116dff' : '#e5e8ef'}`,
                  boxShadow: isSelected ? '0 0 0 2px rgba(17,109,255,0.08)' : 'none',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isSelected ? '#e8f1fe' : '#f0f0f5',
                  }}
                >
                  <Icon size={16} style={{ color: isSelected ? '#116dff' : '#9098a9' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: '#16161d' }}>
                      {opt.title}
                    </span>
                    {isSelected && (
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: '#116dff' }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                    {opt.description}
                  </p>
                  {opt.scope === 'site' && isSelected && (
                    <input
                      type="text"
                      placeholder="e.g. mysite.wixsite.com or site ID"
                      value={targetSite}
                      onChange={e => setTargetSite(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className="mt-2.5 w-full px-3 py-2 rounded-lg text-xs outline-none transition-all"
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e5e8ef',
                        color: '#16161d',
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = '#116dff';
                        e.target.style.boxShadow = '0 0 0 3px rgba(17,109,255,0.1)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = '#e5e8ef';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-6 py-4 border-t"
          style={{ borderColor: '#e5e8ef', background: '#fafbfc' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ color: '#32325d', background: '#f0f0f5' }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLButtonElement).style.background = '#e5e8ef')
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLButtonElement).style.background = '#f0f0f5')
            }
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={selectedScope === 'site' && !targetSite.trim()}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#116dff' }}
            onMouseEnter={e => {
              if (!(selectedScope === 'site' && !targetSite.trim()))
                (e.currentTarget as HTMLButtonElement).style.background = '#0d5fdb';
            }}
            onMouseLeave={e =>
              ((e.currentTarget as HTMLButtonElement).style.background = '#116dff')
            }
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
