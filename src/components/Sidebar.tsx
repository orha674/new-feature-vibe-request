import React, { useState } from 'react';
import {
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  Layers,
  Share2,
  Zap,
  Server,
  Globe,
  Bell,
  LayoutDashboard,
  PanelLeft,
} from 'lucide-react';
import { Extension, ExtensionType, ExtensionCategory, CATEGORY_TYPES, TYPE_META } from '../types';

const TYPE_ICONS: Record<ExtensionType, React.ReactNode> = {
  component: <Layers size={14} />,
  context: <Share2 size={14} />,
  function: <Zap size={14} />,
  'web-method': <Server size={14} />,
  api: <Globe size={14} />,
  'event-handler': <Bell size={14} />,
  'dashboard-page': <LayoutDashboard size={14} />,
};

const CATEGORY_LABELS: Record<ExtensionCategory, string> = {
  site: 'Site Extensions',
  backend: 'Backend Extensions',
  dashboard: 'Dashboard Extensions',
};

interface SidebarProps {
  extensions: Extension[];
  selectedType: ExtensionType | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectType: (type: ExtensionType) => void;
  onNewExtension: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  extensions,
  selectedType,
  searchQuery,
  onSearchChange,
  onSelectType,
  onNewExtension,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<ExtensionCategory>>(
    new Set(['site', 'backend', 'dashboard'])
  );

  const toggleCategory = (cat: ExtensionCategory) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const countByType = (type: ExtensionType) => extensions.filter(e => e.type === type).length;

  if (isCollapsed) {
    return (
      <div
        className="flex flex-col items-center py-3 gap-3 border-r"
        style={{ width: 48, background: '#252526', borderColor: '#3e3e42' }}
      >
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          title="Expand sidebar"
        >
          <PanelLeft size={16} />
        </button>
        <button
          onClick={onNewExtension}
          className="p-1.5 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          title="New Extension"
        >
          <Plus size={16} />
        </button>
        {(['site', 'backend', 'dashboard'] as ExtensionCategory[]).map(cat =>
          CATEGORY_TYPES[cat].map(type => (
            <button
              key={type}
              onClick={() => onSelectType(type)}
              className="p-1.5 rounded transition-colors"
              style={{
                color: selectedType === type ? TYPE_META[type].color : '#858585',
                background: selectedType === type ? TYPE_META[type].bgColor : 'transparent',
              }}
              title={TYPE_META[type].label}
            >
              {TYPE_ICONS[type]}
            </button>
          ))
        )}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col border-r overflow-hidden"
      style={{ width: 260, background: '#252526', borderColor: '#3e3e42' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: '#3e3e42' }}>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#cccccc' }}>
          Extensions
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onNewExtension}
            className="p-1 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            title="New Extension"
          >
            <Plus size={15} />
          </button>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            title="Collapse sidebar"
          >
            <PanelLeft size={15} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b" style={{ borderColor: '#3e3e42' }}>
        <div className="relative">
          <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search extensions…"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 rounded text-xs focus:outline-none focus:ring-1"
            style={{
              background: '#3c3c3c',
              color: '#cccccc',
              border: '1px solid #3e3e42',
              outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = '#0e70c0')}
            onBlur={e => (e.target.style.borderColor = '#3e3e42')}
          />
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {(['site', 'backend', 'dashboard'] as ExtensionCategory[]).map(cat => {
          const isExpanded = expandedCategories.has(cat);
          return (
            <div key={cat}>
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors"
                style={{ color: '#cccccc' }}
              >
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                {CATEGORY_LABELS[cat]}
              </button>

              {/* Type items */}
              {isExpanded && (
                <div className="mb-1">
                  {CATEGORY_TYPES[cat].map(type => {
                    const meta = TYPE_META[type];
                    const count = countByType(type);
                    const isSelected = selectedType === type && !searchQuery;
                    return (
                      <button
                        key={type}
                        onClick={() => onSelectType(type)}
                        className="w-full flex items-center gap-2 pl-7 pr-3 py-1.5 text-xs transition-colors group"
                        style={{
                          background: isSelected ? '#094771' : 'transparent',
                          color: isSelected ? '#fff' : '#cccccc',
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#2a2d2e';
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}
                      >
                        <span style={{ color: isSelected ? '#fff' : meta.color }}>
                          {TYPE_ICONS[type]}
                        </span>
                        <span className="flex-1 text-left">{meta.label}</span>
                        <span
                          className="px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                          style={{
                            background: isSelected ? 'rgba(255,255,255,0.2)' : '#3c3c3c',
                            color: isSelected ? '#fff' : '#858585',
                          }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t text-[10px]" style={{ borderColor: '#3e3e42', color: '#858585' }}>
        {extensions.length} extensions total
      </div>
    </div>
  );
}
