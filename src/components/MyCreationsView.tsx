import React, { useState } from 'react';
import { Search, Plus, Package } from 'lucide-react';
import { CreatedApp, Extension, AppStatus } from '../types';
import AppCard from './AppCard';

interface Props {
  apps: CreatedApp[];
  extensions: Extension[];
  onSelectApp: (app: CreatedApp) => void;
  onShareApp: (app: CreatedApp) => void;
  onDeleteApp: (app: CreatedApp) => void;
}

const STATUS_FILTERS: { value: AppStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

const MyCreationsView: React.FC<Props> = ({
  apps,
  extensions,
  onSelectApp,
  onShareApp,
  onDeleteApp,
}) => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppStatus | 'all'>('all');

  const filtered = apps.filter(app => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q || app.name.toLowerCase().includes(q) || app.description.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#f7f8fa' }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-8 pt-7 pb-5 border-b"
        style={{ background: '#ffffff', borderColor: '#e5e8ef' }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#16161d' }}>
              My Custom Apps
            </h1>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              Apps and bundles you've built for your site
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ background: '#116dff' }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLButtonElement).style.background = '#0d5fdb')
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLButtonElement).style.background = '#116dff')
            }
          >
            <Plus size={15} />
            New App
          </button>
        </div>

        {/* Search + filters */}
        <div className="flex items-center gap-3">
          <div className="relative" style={{ width: 280 }}>
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#9098a9' }}
            />
            <input
              type="text"
              placeholder="Search apps…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: '#f7f8fa',
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
          </div>

          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #e5e8ef' }}>
            {STATUS_FILTERS.map((f, i) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className="px-3 py-2 text-xs font-medium transition-colors"
                style={{
                  color: statusFilter === f.value ? '#116dff' : '#6b7280',
                  background: statusFilter === f.value ? '#e8f1fe' : '#ffffff',
                  borderRight: i < STATUS_FILTERS.length - 1 ? '1px solid #e5e8ef' : undefined,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: '#f0f0f5' }}
            >
              <Package size={28} style={{ color: '#c8cdd8' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: '#16161d' }}>
              {query || statusFilter !== 'all' ? 'No apps match your filters' : 'No apps yet'}
            </p>
            <p className="text-xs mt-1" style={{ color: '#9098a9' }}>
              {query || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first app to get started'}
            </p>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}
          >
            {filtered.map(app => (
              <AppCard
                key={app.id}
                app={app}
                extensions={extensions}
                onSelect={() => onSelectApp(app)}
                onShare={() => onShareApp(app)}
                onDelete={() => onDeleteApp(app)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCreationsView;
