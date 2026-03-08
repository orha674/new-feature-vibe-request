import React from 'react';
import {
  Package,
  Sparkles,
  Code2,
  Share2,
  Trash2,
  Monitor,
  LayoutDashboard,
  Terminal,
} from 'lucide-react';
import { CreatedApp, Extension, TYPE_META } from '../types';
import { formatDate } from '../utils/dateUtils';

interface Props {
  app: CreatedApp;
  extensions: Extension[];
  onSelect: () => void;
  onShare: () => void;
  onDelete: () => void;
}

const STATUS_STYLES = {
  active: { label: 'Active', color: '#00b383', bg: '#e6f9f4' },
  draft: { label: 'Draft', color: '#f59e0b', bg: '#fef3c7' },
  archived: { label: 'Archived', color: '#9098a9', bg: '#f0f0f5' },
};

function getAccentColor(app: CreatedApp, extensions: Extension[]) {
  const appExts = extensions.filter(e => app.extensionIds.includes(e.id));
  const counts = { site: 0, dashboard: 0, backend: 0 };
  for (const e of appExts) {
    if (e.category === 'site') counts.site++;
    else if (e.category === 'dashboard') counts.dashboard++;
    else counts.backend++;
  }
  const max = Math.max(counts.site, counts.dashboard, counts.backend);
  if (max === 0) return { color: '#7c6af5', bg: '#f0eeff' };
  if (max === counts.site) return { color: '#116dff', bg: '#e8f1fe' };
  if (max === counts.dashboard) return { color: '#f59e0b', bg: '#fef3c7' };
  return { color: '#f97316', bg: '#fff4ed' };
}

const LayerDots: React.FC<{ app: CreatedApp; extensions: Extension[] }> = ({
  app,
  extensions,
}) => {
  const appExts = extensions.filter(e => app.extensionIds.includes(e.id));
  const layers = [
    {
      icon: Monitor,
      label: 'Live Site',
      exts: appExts.filter(e => e.category === 'site'),
    },
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      exts: appExts.filter(e => e.category === 'dashboard'),
    },
    {
      icon: Terminal,
      label: 'Code',
      exts: appExts.filter(e => e.category === 'backend'),
    },
  ].filter(l => l.exts.length > 0);

  if (layers.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop: '1px solid #f0f0f5' }}>
      {layers.map(layer => {
        const Icon = layer.icon;
        return (
          <div key={layer.label} className="flex items-center gap-1.5">
            <Icon size={11} style={{ color: '#9098a9' }} />
            <span className="text-[11px]" style={{ color: '#9098a9' }}>
              {layer.label}
            </span>
            <div className="flex gap-0.5 ml-0.5">
              {layer.exts.map(ext => (
                <div
                  key={ext.id}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: TYPE_META[ext.type].color }}
                  title={ext.name}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AppCard: React.FC<Props> = ({ app, extensions, onSelect, onShare, onDelete }) => {
  const accent = getAccentColor(app, extensions);
  const status = STATUS_STYLES[app.status] ?? STATUS_STYLES.draft;

  const stopAndRun = (e: React.MouseEvent, fn: () => void) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div
      onClick={onSelect}
      className="rounded-xl overflow-hidden cursor-pointer transition-all duration-150"
      style={{
        background: '#ffffff',
        border: '1px solid #e5e8ef',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = accent.color;
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 16px rgba(0,0,0,0.1)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e8ef';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: accent.bg }}
          >
            <Package size={18} style={{ color: accent.color }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold truncate" style={{ color: '#16161d' }}>
                {app.name}
              </h3>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ color: status.color, background: status.bg }}
                >
                  {status.label}
                </span>
                <span
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md"
                  style={{ color: '#6b7280', background: '#f7f8fa', border: '1px solid #e5e8ef' }}
                >
                  v{app.currentVersion}
                </span>
              </div>
            </div>
            <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: '#6b7280' }}>
              {app.description}
            </p>
          </div>
        </div>

        {/* Layer dots */}
        <LayerDots app={app} extensions={extensions} />
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderTop: '1px solid #f0f0f5', background: '#fafbfc' }}
      >
        <span className="text-[11px]" style={{ color: '#9098a9' }}>
          {app.extensionIds.length} asset{app.extensionIds.length !== 1 ? 's' : ''} &middot;{' '}
          {formatDate(app.modifiedAt)}
        </span>

        <div className="flex items-center gap-0.5">
          {[
            { icon: Sparkles, label: 'Edit with AI', color: '#7c6af5' },
            { icon: Code2, label: 'Edit in Code', color: '#116dff', onClick: () => {} },
            { icon: Share2, label: 'Share', onClick: () => onShare() },
          ].map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                title={action.label}
                onClick={e => stopAndRun(e, action.onClick ?? (() => {}))}
                className="p-1.5 rounded-lg transition-all"
                style={{ color: '#9098a9' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = action.color ?? '#116dff';
                  (e.currentTarget as HTMLButtonElement).style.background = '#f0f0f5';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = '#9098a9';
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                <Icon size={14} />
              </button>
            );
          })}
          <button
            title="Delete"
            onClick={e => stopAndRun(e, onDelete)}
            className="p-1.5 rounded-lg transition-all ml-0.5"
            style={{ color: '#9098a9' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#ef4444';
              (e.currentTarget as HTMLButtonElement).style.background = '#fef2f2';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#9098a9';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
