import React, { useState, useCallback } from 'react';
import { Extension, Toast, TabId, CreatedApp, AppVersion, ShareScope } from './types';
import { MOCK_EXTENSIONS, MOCK_APPS } from './mock-data';
import DetailPanel from './components/DetailPanel';
import CreateExtensionModal from './components/CreateExtensionModal';
import ToastContainer from './components/Toast';
import MyCreationsView from './components/MyCreationsView';
import AppDetailPanel from './components/AppDetailPanel';
import ShareModal from './components/ShareModal';
import WixTopBar from './components/WixTopBar';
import WixSidebar from './components/WixSidebar';

type NavPage = 'home' | 'creations' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('creations');

  // Extensions state
  const [extensions, setExtensions] = useState<Extension[]>(MOCK_EXTENSIONS);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Apps state
  const [apps, setApps] = useState<CreatedApp[]>(MOCK_APPS);
  const [selectedApp, setSelectedApp] = useState<CreatedApp | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Extension | null>(null);
  const [sharingApp, setSharingApp] = useState<CreatedApp | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const handleNav = (page: NavPage) => {
    setCurrentPage(page);
    setSelectedApp(null);
    setSelectedAsset(null);
  };

  // ── App handlers ─────────────────────────────────────────────────────────

  const handleRollback = useCallback(
    (app: CreatedApp, version: AppVersion) => {
      setApps(prev =>
        prev.map(a => (a.id === app.id ? { ...a, currentVersion: version.version } : a)),
      );
      setSelectedApp(prev =>
        prev?.id === app.id ? { ...prev, currentVersion: version.version } : prev,
      );
      addToast(`"${app.name}" rolled back to v${version.version}`, 'info');
    },
    [addToast],
  );

  const handleDeleteApp = useCallback(
    (app: CreatedApp) => {
      setApps(prev => prev.filter(a => a.id !== app.id));
      if (selectedApp?.id === app.id) setSelectedApp(null);
      addToast(`"${app.name}" deleted`, 'info');
    },
    [addToast, selectedApp],
  );

  const handleShare = useCallback(
    (scope: ShareScope, targetSite?: string) => {
      if (!sharingApp) return;
      const label =
        scope === 'account'
          ? 'shared within your account'
          : scope === 'site'
            ? `shared with ${targetSite}`
            : 'published to the community';
      addToast(`"${sharingApp.name}" ${label}`, 'success');
    },
    [addToast, sharingApp],
  );

  const handleViewAsset = useCallback((ext: Extension) => {
    setSelectedAsset(ext);
    setActiveTab('overview');
  }, []);

  // ── Content renderer ──────────────────────────────────────────────────────

  const renderContent = () => {
    if (currentPage === 'creations') {
      // Drill level 3: extension detail (from app asset)
      if (selectedApp && selectedAsset) {
        return (
          <DetailPanel
            extension={selectedAsset}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onBack={() => setSelectedAsset(null)}
            breadcrumb={selectedApp.name}
            onStatusToggle={ext => {
              const updated = {
                ...ext,
                status: ext.status === 'active' ? ('inactive' as const) : ('active' as const),
              };
              setExtensions(prev => prev.map(e => (e.id === updated.id ? updated : e)));
              setSelectedAsset(updated);
              addToast(
                `"${updated.name}" ${updated.status === 'active' ? 'enabled' : 'disabled'}`,
                'info',
              );
            }}
          />
        );
      }

      // Drill level 2: app detail
      if (selectedApp) {
        return (
          <AppDetailPanel
            app={selectedApp}
            extensions={extensions}
            onBack={() => setSelectedApp(null)}
            onRollback={handleRollback}
            onViewExtension={handleViewAsset}
          />
        );
      }

      // Drill level 1: apps grid
      return (
        <MyCreationsView
          apps={apps}
          extensions={extensions}
          onSelectApp={app => { setSelectedApp(app); setSelectedAsset(null); }}
          onShareApp={setSharingApp}
          onDeleteApp={handleDeleteApp}
        />
      );
    }

    // Placeholder pages
    return (
      <div
        className="flex flex-col items-center justify-center h-full gap-3"
        style={{ background: '#f7f8fa' }}
      >
        <p className="text-sm font-medium" style={{ color: '#32325d' }}>
          {currentPage === 'home' ? 'Home' : 'Settings'}
        </p>
        <p className="text-xs" style={{ color: '#9098a9' }}>Coming soon</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#f7f8fa' }}>
      {/* Top bar */}
      <WixTopBar />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <WixSidebar currentPage={currentPage} onNavigate={handleNav} />

        {/* Main */}
        <main className="flex-1 overflow-hidden">{renderContent()}</main>
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateExtensionModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={ext => {
            setExtensions(prev => [ext, ...prev]);
            setIsCreateModalOpen(false);
            addToast(`"${ext.name}" created!`, 'success');
          }}
        />
      )}
      {sharingApp && (
        <ShareModal app={sharingApp} onClose={() => setSharingApp(null)} onShare={handleShare} />
      )}

      <ToastContainer
        toasts={toasts}
        onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))}
      />
    </div>
  );
}

export default App;
