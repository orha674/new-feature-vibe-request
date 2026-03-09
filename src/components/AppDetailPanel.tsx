import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Package,
  Monitor,
  LayoutDashboard,
  Terminal,
  Clock,
  User,
  Calendar,
  Hash,
  MoreHorizontal,
  RotateCcw,
  X,
  Eye,
} from 'lucide-react';
import { CreatedApp, Extension, AppVersion, TYPE_META, AppStatus } from '../types';
import { formatDate, formatDistanceToNow } from '../utils/dateUtils';
import AssetGrid from './AssetGrid';

interface Props {
  app: CreatedApp;
  extensions: Extension[];
  onBack: () => void;
  onRollback: (app: CreatedApp, version: AppVersion) => void;
  onViewExtension: (ext: Extension) => void;
}

const STATUS_STYLES: Record<AppStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#00b383', bg: '#e6f9f4' },
  draft: { label: 'Draft', color: '#f59e0b', bg: '#fef3c7' },
  archived: { label: 'Archived', color: '#9098a9', bg: '#f0f0f5' },
};

// ─── Version History Panel ─────────────────────────────────────────────────

const VersionPanel: React.FC<{
  app: CreatedApp;
  onClose: () => void;
  onRollback: (version: AppVersion) => void;
}> = ({ app, onClose, onRollback }) => {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [rollingBack, setRollingBack] = useState<string | null>(null);

  const handleRollback = (version: AppVersion) => {
    setRollingBack(version.id);
    setMenuOpenId(null);
    setTimeout(() => {
      onRollback(version);
      setRollingBack(null);
    }, 600);
  };

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden"
      style={{ background: '#f7f8fa' }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
        style={{ background: '#ffffff', borderColor: '#e5e8ef' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: '#9098a9' }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#116dff')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#9098a9')}
          >
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-lg font-bold" style={{ color: '#16161d' }}>
            Version History
          </h2>
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

      {/* Version list */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
        {app.versions.map(version => {
          const isCurrent = version.version === app.currentVersion;
          const isRollingBack = rollingBack === version.id;
          const menuOpen = menuOpenId === version.id;

          return (
            <div
              key={version.id}
              className="relative rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-all"
              style={{
                background: '#ffffff',
                border: `1px solid ${isCurrent ? '#116dff' : '#e5e8ef'}`,
                boxShadow: isCurrent
                  ? '0 0 0 3px rgba(17,109,255,0.08)'
                  : '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {/* Left blue stripe for current */}
              {isCurrent && (
                <div
                  className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
                  style={{ background: '#116dff' }}
                />
              )}

              <div className="flex-1 min-w-0 pl-1">
                <p className="text-sm font-bold" style={{ color: '#16161d' }}>
                  {version.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#9098a9' }}>
                  {formatDistanceToNow(version.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {isCurrent && (
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ color: '#116dff', background: '#e8f1fe' }}
                  >
                    Current
                  </span>
                )}
                {isRollingBack && (
                  <RotateCcw size={14} className="animate-spin" style={{ color: '#116dff' }} />
                )}

                {/* ⋮ menu */}
                <div className="relative">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpen ? null : version.id);
                    }}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: '#9098a9' }}
                    onMouseEnter={e =>
                      ((e.currentTarget as HTMLButtonElement).style.background = '#f0f0f5')
                    }
                    onMouseLeave={e =>
                      ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
                    }
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {menuOpen && (
                    <div
                      className="absolute right-0 top-8 w-44 rounded-xl overflow-hidden z-30"
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e5e8ef',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      }}
                    >
                      <button
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors text-left"
                        style={{ color: '#32325d' }}
                        onMouseEnter={e =>
                          ((e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa')
                        }
                        onMouseLeave={e =>
                          ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
                        }
                      >
                        <Eye size={14} style={{ color: '#9098a9' }} />
                        Preview
                      </button>
                      {!isCurrent && (
                        <button
                          onClick={() => handleRollback(version)}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors text-left border-t"
                          style={{ color: '#116dff', borderColor: '#f0f0f5' }}
                          onMouseEnter={e =>
                            ((e.currentTarget as HTMLButtonElement).style.background = '#f5f9ff')
                          }
                          onMouseLeave={e =>
                            ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
                          }
                        >
                          <RotateCcw size={14} />
                          Rollback to this version
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AppDetailPanel: React.FC<Props> = ({
  app,
  extensions,
  onBack,
  onRollback,
  onViewExtension,
}) => {
  const [showVersions, setShowVersions] = useState(false);
  const status = STATUS_STYLES[app.status];
  const appExtensions = extensions.filter(e => app.extensionIds.includes(e.id));

  const site = appExtensions.filter(e => e.category === 'site').length;
  const dashboard = appExtensions.filter(e => e.category === 'dashboard').length;
  const code = appExtensions.filter(e => e.category === 'backend').length;

  const meta = [
    { icon: User, label: 'Author', value: app.author },
    { icon: Calendar, label: 'Created', value: formatDate(app.createdAt) },
    { icon: Clock, label: 'Last modified', value: formatDistanceToNow(app.modifiedAt) },
    { icon: Hash, label: 'Version', value: `v${app.currentVersion}` },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden relative" style={{ background: '#f7f8fa' }}>
      {/* Header */}
      <div
        className="flex-shrink-0 px-6 py-4 border-b flex items-center justify-between"
        style={{ background: '#ffffff', borderColor: '#e5e8ef' }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors flex-shrink-0"
            style={{ color: '#9098a9' }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#116dff')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#9098a9')}
          >
            <ArrowLeft size={13} />
            My Creations
          </button>

          <div className="w-px h-4 flex-shrink-0" style={{ background: '#e5e8ef' }} />

          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#e8f1fe' }}
          >
            <Package size={18} style={{ color: '#116dff' }} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold" style={{ color: '#16161d' }}>
                {app.name}
              </h1>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ color: status.color, background: status.bg }}
              >
                {status.label}
              </span>
              <span
                className="text-[11px] font-mono px-2 py-0.5 rounded-md flex-shrink-0"
                style={{ color: '#6b7280', background: '#f7f8fa', border: '1px solid #e5e8ef' }}
              >
                v{app.currentVersion}
              </span>
            </div>
            <p className="text-xs line-clamp-1 mt-0.5" style={{ color: '#6b7280' }}>
              {app.description}
            </p>
          </div>
        </div>

        {/* Version history button */}
        <button
          onClick={() => setShowVersions(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0 ml-4"
          style={{
            color: '#32325d',
            background: '#f7f8fa',
            border: '1px solid #e5e8ef',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#116dff';
            (e.currentTarget as HTMLButtonElement).style.color = '#116dff';
            (e.currentTarget as HTMLButtonElement).style.background = '#f0f5ff';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e8ef';
            (e.currentTarget as HTMLButtonElement).style.color = '#32325d';
            (e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa';
          }}
        >
          <Clock size={14} />
          Version History
          <span
            className="text-[10px] font-bold px-1.5 py-px rounded-full"
            style={{ background: '#e8f1fe', color: '#116dff' }}
          >
            {app.versions.length}
          </span>
        </button>
      </div>

      {/* Single scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-8">

        {/* ── Overview section ── */}
        <section>
          <h2 className="text-base font-bold mb-4" style={{ color: '#16161d' }}>
            Overview
          </h2>

          <p className="text-sm leading-relaxed mb-5" style={{ color: '#32325d' }}>
            {app.description}
          </p>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {meta.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl p-3"
                style={{ background: '#ffffff', border: '1px solid #e5e8ef' }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={11} style={{ color: '#9098a9' }} />
                  <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#9098a9' }}>
                    {label}
                  </span>
                </div>
                <span className="text-xs font-bold" style={{ color: '#16161d' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Asset breakdown */}
          <div className="flex gap-3">
            {[
              { label: 'Live Site', count: site, color: '#116dff', bg: '#e8f1fe', icon: Monitor },
              { label: 'Dashboard', count: dashboard, color: '#f59e0b', bg: '#fef3c7', icon: LayoutDashboard },
              { label: 'Code', count: code, color: '#f97316', bg: '#fff4ed', icon: Terminal },
            ].map(({ label, count, color, bg, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl flex-1"
                style={{ background: bg, border: `1px solid ${color}22` }}
              >
                <Icon size={16} style={{ color }} />
                <div>
                  <div className="text-lg font-bold leading-none" style={{ color }}>
                    {count}
                  </div>
                  <div className="text-[11px] font-medium mt-0.5" style={{ color }}>
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e5e8ef' }} />

        {/* ── Assets section ── */}
        <section className="pb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold" style={{ color: '#16161d' }}>
              Assets
            </h2>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ color: '#116dff', background: '#e8f1fe' }}
            >
              {app.extensionIds.length} total
            </span>
          </div>

          {[
            {
              label: 'Site',
              exts: appExtensions.filter(e => e.category === 'site'),
              color: '#116dff',
              bg: '#e8f1fe',
            },
            {
              label: 'Dashboard',
              exts: appExtensions.filter(e => e.category === 'dashboard'),
              color: '#f59e0b',
              bg: '#fef3c7',
            },
            {
              label: 'Advanced',
              exts: appExtensions.filter(e => e.category === 'backend'),
              color: '#f97316',
              bg: '#fff4ed',
            },
          ]
            .filter(group => group.exts.length > 0)
            .map(group => (
              <div key={group.label} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold" style={{ color: '#16161d' }}>
                    {group.label}
                  </span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-px rounded-full"
                    style={{ color: group.color, background: group.bg }}
                  >
                    {group.exts.length}
                  </span>
                </div>
                <AssetGrid extensions={group.exts} onSelect={onViewExtension} />
              </div>
            ))}
        </section>
      </div>

      {/* Version history overlay */}
      {showVersions && (
        <VersionPanel
          app={app}
          onClose={() => setShowVersions(false)}
          onRollback={version => onRollback(app, version)}
        />
      )}
    </div>
  );
};

export default AppDetailPanel;
