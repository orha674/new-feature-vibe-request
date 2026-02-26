import React from 'react';
import { Extension, ExtensionType, TYPE_META } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';
import { Code, Settings, Eye, Activity } from 'lucide-react';

const PREVIEWABLE: ExtensionType[] = ['component', 'api', 'dashboard-page'];

interface ExtensionListProps {
  extensions: Extension[];
  selectedType: ExtensionType | null;
  searchQuery: string;
  onSelect: (ext: Extension) => void;
}

export default function ExtensionList({ extensions, selectedType, searchQuery, onSelect }: ExtensionListProps) {
  const title = searchQuery
    ? `Search results for "${searchQuery}"`
    : selectedType
    ? `${TYPE_META[selectedType].label}s`
    : 'All Extensions';

  if (extensions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center" style={{ color: '#858585' }}>
        <Activity size={40} className="mb-4 opacity-40" />
        <p className="text-sm font-medium mb-1">No extensions found</p>
        <p className="text-xs opacity-60">
          {searchQuery ? 'Try a different search term' : 'Create your first extension to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 border-b"
        style={{ background: '#1e1e1e', borderColor: '#3e3e42' }}
      >
        <div>
          <h1 className="text-sm font-semibold" style={{ color: '#cccccc' }}>
            {title}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#858585' }}>
            {extensions.length} {extensions.length === 1 ? 'extension' : 'extensions'}
          </p>
        </div>
        {selectedType && (
          <span
            className="px-2 py-0.5 rounded text-xs font-medium"
            style={{
              background: TYPE_META[selectedType].bgColor,
              color: TYPE_META[selectedType].color,
            }}
          >
            {TYPE_META[selectedType].label}
          </span>
        )}
      </div>

      {/* Cards grid */}
      <div className="p-6 grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
        {extensions.map(ext => (
          <ExtensionCard key={ext.id} ext={ext} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function ExtensionCard({ ext, onSelect }: { ext: Extension; onSelect: (e: Extension) => void }) {
  const meta = TYPE_META[ext.type];
  const canPreview = PREVIEWABLE.includes(ext.type);

  return (
    <div
      className="rounded-lg border cursor-pointer transition-all group"
      style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
      onClick={() => onSelect(ext)}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = meta.color;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${meta.color}22`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = '#3e3e42';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="px-2 py-0.5 rounded text-[11px] font-semibold shrink-0"
              style={{ background: meta.bgColor, color: meta.color }}
            >
              {meta.label}
            </span>
            <h3 className="text-sm font-semibold truncate" style={{ color: '#cccccc' }}>
              {ext.name}
            </h3>
          </div>
          <span
            className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium shrink-0"
            style={{
              background: ext.status === 'active' ? 'rgba(74,222,128,0.15)' : 'rgba(133,133,133,0.15)',
              color: ext.status === 'active' ? '#4ade80' : '#858585',
            }}
          >
            {ext.status === 'active' ? '● Active' : '○ Inactive'}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs mb-3 line-clamp-2" style={{ color: '#858585', lineHeight: '1.5' }}>
          {ext.description}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <span className="text-[11px]" style={{ color: '#606060' }}>
            Modified {formatDistanceToNow(ext.modifiedAt)}
          </span>
          <span className="text-[11px]" style={{ color: '#606060' }}>
            by {ext.author}
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div
        className="flex border-t px-4 py-2 gap-1"
        style={{ borderColor: '#3e3e42' }}
        onClick={e => e.stopPropagation()}
      >
        <QuickAction
          icon={<Settings size={12} />}
          label="Configure"
          onClick={() => onSelect(ext)}
          color="#858585"
        />
        {canPreview && (
          <QuickAction
            icon={<Eye size={12} />}
            label="Preview"
            onClick={() => onSelect(ext)}
            color="#858585"
          />
        )}
        <QuickAction
          icon={<Code size={12} />}
          label="Code"
          onClick={() => onSelect(ext)}
          color="#858585"
        />
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors hover:bg-white/10"
      style={{ color }}
    >
      {icon}
      {label}
    </button>
  );
}
