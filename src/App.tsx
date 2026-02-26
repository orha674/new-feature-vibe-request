import React, { useState, useCallback } from 'react';
import { Extension, ExtensionType, Toast, TabId } from './types';
import { MOCK_EXTENSIONS } from './mock-data';
import Sidebar from './components/Sidebar';
import ExtensionList from './components/ExtensionList';
import DetailPanel from './components/DetailPanel';
import CreateExtensionModal from './components/CreateExtensionModal';
import ToastContainer from './components/Toast';

function App() {
  const [extensions, setExtensions] = useState<Extension[]>(MOCK_EXTENSIONS);
  const [selectedType, setSelectedType] = useState<ExtensionType | null>('component');
  const [selectedExtension, setSelectedExtension] = useState<Extension | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const handleSelectType = useCallback((type: ExtensionType) => {
    setSelectedType(type);
    setSelectedExtension(null);
    setActiveTab('overview');
  }, []);

  const handleSelectExtension = useCallback((ext: Extension) => {
    setSelectedExtension(ext);
    setActiveTab('overview');
  }, []);

  const handleBack = useCallback(() => {
    setSelectedExtension(null);
  }, []);

  const handleCreateExtension = useCallback((newExt: Extension) => {
    setExtensions(prev => [newExt, ...prev]);
    setSelectedType(newExt.type);
    setSelectedExtension(newExt);
    setIsCreateModalOpen(false);
    addToast(`"${newExt.name}" created successfully!`, 'success');
  }, [addToast]);

  const filteredExtensions = searchQuery.trim()
    ? extensions.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.type.includes(searchQuery.toLowerCase())
      )
    : selectedType
    ? extensions.filter(e => e.type === selectedType)
    : [];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#1e1e1e' }}>
      {/* Sidebar */}
      <Sidebar
        extensions={extensions}
        selectedType={selectedType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectType={handleSelectType}
        onNewExtension={() => setIsCreateModalOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(v => !v)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedExtension ? (
          <DetailPanel
            extension={selectedExtension}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onBack={handleBack}
            onStatusToggle={(ext) => {
              const updated = { ...ext, status: ext.status === 'active' ? 'inactive' as const : 'active' as const };
              setExtensions(prev => prev.map(e => e.id === updated.id ? updated : e));
              setSelectedExtension(updated);
              addToast(`"${updated.name}" ${updated.status === 'active' ? 'enabled' : 'disabled'}`, 'info');
            }}
          />
        ) : (
          <ExtensionList
            extensions={filteredExtensions}
            selectedType={selectedType}
            searchQuery={searchQuery}
            onSelect={handleSelectExtension}
          />
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateExtensionModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateExtension}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  );
}

export default App;
