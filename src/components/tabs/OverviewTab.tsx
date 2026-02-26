import React from 'react';
import { Extension, TYPE_META } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { User, Calendar, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

interface OverviewTabProps {
  extension: Extension;
  onStatusToggle: (ext: Extension) => void;
}

export default function OverviewTab({ extension, onStatusToggle }: OverviewTabProps) {
  const meta = TYPE_META[extension.type];

  return (
    <div className="p-6 max-w-3xl">
      {/* Title & Status */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-1" style={{ color: '#cccccc' }}>
            {extension.name}
          </h2>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
            style={{ background: meta.bgColor, color: meta.color }}
          >
            {meta.label}
          </span>
        </div>

        {/* Status toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: '#858585' }}>
            {extension.status === 'active' ? 'Enabled' : 'Disabled'}
          </span>
          <button
            onClick={() => onStatusToggle(extension)}
            className="transition-colors"
            style={{ color: extension.status === 'active' ? '#4ade80' : '#858585' }}
            title={extension.status === 'active' ? 'Disable extension' : 'Enable extension'}
          >
            {extension.status === 'active' ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          </button>
        </div>
      </div>

      {/* Description */}
      <div
        className="rounded-lg p-4 mb-6 text-sm leading-relaxed"
        style={{ background: '#2d2d30', color: '#cccccc', border: '1px solid #3e3e42' }}
      >
        {extension.description}
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <MetaCard
          icon={<User size={14} />}
          label="Author"
          value={extension.author}
        />
        <MetaCard
          icon={<Calendar size={14} />}
          label="Created"
          value={formatDate(extension.createdAt)}
        />
        <MetaCard
          icon={<Clock size={14} />}
          label="Last Modified"
          value={formatDate(extension.modifiedAt)}
        />
        <MetaCard
          icon={<span className="text-xs font-mono">#</span>}
          label="Extension ID"
          value={extension.id}
          mono
        />
      </div>

      {/* Type description */}
      <div
        className="rounded-lg p-4 border-l-4 text-xs"
        style={{
          background: meta.bgColor,
          borderLeftColor: meta.color,
          color: meta.color,
        }}
      >
        <p className="font-semibold mb-1">About {meta.label}s</p>
        <p style={{ opacity: 0.85 }}>{meta.description}</p>
      </div>
    </div>
  );
}

function MetaCard({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div
      className="rounded-lg p-3 border"
      style={{ background: '#2d2d30', borderColor: '#3e3e42' }}
    >
      <div className="flex items-center gap-1.5 mb-1.5" style={{ color: '#858585' }}>
        {icon}
        <span className="text-[11px] uppercase tracking-wider">{label}</span>
      </div>
      <p
        className={`text-sm font-medium ${mono ? 'font-mono text-xs' : ''}`}
        style={{ color: '#cccccc' }}
      >
        {value}
      </p>
    </div>
  );
}
