import React, { useState } from 'react';
import { Search, Plus, Package, Sparkles, ArrowRight, BarChart3, ShoppingBag, Boxes } from 'lucide-react';
import { CreatedApp, Extension, AppStatus } from '../types';
import AppCard from './AppCard';

const SUGGESTION_CARDS = [
  {
    title: 'Back-in-Stock Request Manager',
    description: 'Let customers request notifications when out-of-stock products become available again.',
    prompt: 'Create a system for my Wix Store that lets customers request notifications when an out-of-stock product becomes available again. Save the requests in a collection and build a dashboard page that shows which products have the most requests, including email addresses and request counts.',
    icon: ShoppingBag,
    color: '#116dff',
    bg: '#e8f1fe',
  },
  {
    title: 'Store Sales Analytics Dashboard',
    description: 'Monitor top-selling products, revenue by category, and daily sales trends.',
    prompt: 'Create a dashboard page for my Wix Store that shows sales analytics such as top-selling products, revenue by product category, and daily sales trends. Include charts and a table so I can easily monitor store performance.',
    icon: BarChart3,
    color: '#00b383',
    bg: '#e6f9f3',
  },
  {
    title: 'Smart Product Bundle Creator',
    description: 'Automatically suggest product bundles based on frequently purchased items together.',
    prompt: 'Create a feature for my Wix Store that automatically suggests product bundles based on frequently purchased items together. Show these bundle suggestions on product pages and allow customers to add the entire bundle to the cart with one click.',
    icon: Boxes,
    color: '#7c6af5',
    bg: '#f0ecfe',
  },
];

interface Props {
  apps: CreatedApp[];
  extensions: Extension[];
  onSelectApp: (app: CreatedApp) => void;
  onShareApp: (app: CreatedApp) => void;
  onDeleteApp: (app: CreatedApp) => void;
  onNewApp?: () => void;
  onEditWithAI?: (app: CreatedApp) => void;
  showEmptyState?: boolean;
  onSuggestionClick?: (prompt: string) => void;
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
  onNewApp,
  onEditWithAI,
  showEmptyState,
  onSuggestionClick,
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
      {/* Header — hidden in empty state */}
      {!showEmptyState && (
        <div
          className="flex-shrink-0 px-8 pt-7 pb-5 border-b"
          style={{ background: '#ffffff', borderColor: '#e5e8ef' }}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#16161d' }}>
                Custom Creations
              </h1>
              <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
                Capabilities and bundles you've built for your site
              </p>
            </div>
            <button
              onClick={onNewApp}
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
              New Capability
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
                placeholder="Search creations…"
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
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {showEmptyState ? (
          <div className="flex flex-col items-center pt-12 pb-8">
            {/* Sparkles icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'linear-gradient(135deg, #e8f1fe, #f0ecfe)' }}
            >
              <Sparkles size={24} style={{ color: '#116dff' }} />
            </div>

            {/* Title */}
            <h2
              className="text-[20px] font-bold text-center mb-2 max-w-md"
              style={{ color: '#1a1a2e' }}
            >
              Create custom tools for your exact needs with AI
            </h2>
            <p className="text-[13px] text-center mb-8" style={{ color: '#6b7280' }}>
              Choose a suggestion below or describe your own idea in the chat
            </p>

            {/* Suggestion Cards */}
            <div className="w-full max-w-2xl flex flex-col gap-3">
              {SUGGESTION_CARDS.map((card, i) => {
                const Icon = card.icon;
                return (
                  <div
                    key={i}
                    className="rounded-xl cursor-pointer transition-all group"
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e8ef',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                    onClick={() => onSuggestionClick?.(card.prompt)}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = card.color;
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 12px ${card.color}20`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e8ef';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                    }}
                  >
                    <div className="px-5 py-4 flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: card.bg }}
                      >
                        <Icon size={20} style={{ color: card.color }} />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[14px] font-semibold mb-1" style={{ color: '#1a1a2e' }}>
                          {card.title}
                        </h3>
                        <p className="text-[12px] leading-relaxed" style={{ color: '#6b7280' }}>
                          {card.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center justify-center flex-shrink-0 mt-2">
                        <ArrowRight size={16} style={{ color: '#9098a9' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* New Creation button */}
            <button
              onClick={onNewApp}
              className="flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ background: '#116dff' }}
              onMouseEnter={e =>
                ((e.currentTarget as HTMLButtonElement).style.background = '#0d5fdb')
              }
              onMouseLeave={e =>
                ((e.currentTarget as HTMLButtonElement).style.background = '#116dff')
              }
            >
              <Plus size={15} />
              New Capability
            </button>
          </div>
        ) : filtered.length === 0 ? (
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
                : 'Create your first custom capability to get started'}
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
                onEditWithAI={() => onEditWithAI?.(app)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCreationsView;
