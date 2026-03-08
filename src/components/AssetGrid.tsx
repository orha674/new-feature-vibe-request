import React from 'react';
import {
  Layers, Share2, Zap, Server, Globe, Bell, LayoutDashboard,
  ChevronRight,
} from 'lucide-react';
import { Extension, ExtensionType, TYPE_META } from '../types';

const TYPE_ICONS: Record<ExtensionType, React.ElementType> = {
  component: Layers,
  context: Share2,
  function: Zap,
  'web-method': Server,
  api: Globe,
  'event-handler': Bell,
  'dashboard-page': LayoutDashboard,
};

interface Props {
  extensions: Extension[];
  onSelect: (ext: Extension) => void;
}

const AssetGrid: React.FC<Props> = ({ extensions, onSelect }) => {
  if (extensions.length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-sm" style={{ color: '#9098a9' }}>No assets in this app</p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
    >
      {extensions.map(ext => {
        const meta = TYPE_META[ext.type];
        const Icon = TYPE_ICONS[ext.type];

        return (
          <button
            key={ext.id}
            onClick={() => onSelect(ext)}
            className="flex items-start gap-3 p-4 rounded-xl text-left transition-all group"
            style={{
              background: '#ffffff',
              border: '1px solid #e5e8ef',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = meta.color;
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e8ef';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: meta.bgColor }}
            >
              <Icon size={16} style={{ color: meta.color }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="text-sm font-semibold truncate" style={{ color: '#16161d' }}>
                  {ext.name}
                </span>
                <ChevronRight
                  size={13}
                  style={{ color: '#c8cdd8', flexShrink: 0 }}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className="text-[10px] font-semibold px-1.5 py-px rounded"
                  style={{ color: meta.color, background: meta.bgColor }}
                >
                  {meta.label}
                </span>
                <span
                  className="text-[10px] font-medium px-1.5 py-px rounded-full"
                  style={{
                    color: ext.status === 'active' ? '#00b383' : '#9098a9',
                    background: ext.status === 'active' ? '#e6f9f4' : '#f0f0f5',
                  }}
                >
                  {ext.status}
                </span>
              </div>
              <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: '#6b7280' }}>
                {ext.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AssetGrid;
