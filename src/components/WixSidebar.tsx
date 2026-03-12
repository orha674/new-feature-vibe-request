import React, { useState, useEffect } from 'react';
import {
  Settings2,
  Home,
  Sparkles,
  TrendingUp,
  LayoutGrid,
  Monitor,
  Megaphone,
  CreditCard,
  Inbox,
  Users,
  BarChart2,
  Zap,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as ChevronRightSm,
  Package,
  Calendar,
  Globe,
  Pencil,
  Star,
  ShoppingBag,
  Layers,
  Tag,
  Bell as BellIcon,
  Search as SearchIcon,
  Gift,
  Percent,
  Share2,
  BookOpen,
} from 'lucide-react';

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface SubItem {
  id: string;
  label: string;
  functional?: boolean;
  expandable?: boolean;
}

interface NavItemDef {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  expandable?: boolean;
  functional?: boolean;
  dividerAfter?: boolean;
  subItems?: SubItem[];
}

const CATALOG_SUB_ITEMS: SubItem[] = [
  { id: 'products', label: 'Products' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'categories', label: 'Categories' },
  { id: 'back-in-stock', label: 'Back in Stock Requests' },
  { id: 'find-products', label: 'Find Products to Sell' },
];

const CATALOG_EXTRA: SubItem[] = [
  { id: 'booking-services', label: 'Booking Services' },
  { id: 'gift-cards', label: 'Gift Cards' },
  { id: 'discounts', label: 'Discounts', expandable: true },
  { id: 'sales-channels', label: 'Sales Channels', expandable: true },
  { id: 'booking-channels', label: 'Booking Channels', expandable: true },
  { id: 'upsell-rules', label: 'Product Suggestions', functional: true },
];

const TOP_ITEMS: NavItemDef[] = [
  { id: 'setup', label: 'Setup', icon: Settings2 },
  { id: 'home', label: 'Home', icon: Home, functional: true },
  { id: 'ai-agents', label: 'AI Agents', icon: Sparkles, badge: 'NEW', badgeColor: '#f5a623', expandable: true },
  { id: 'creations', label: 'Custom Creations', icon: Package, badge: 'NEW', badgeColor: '#116dff', functional: true },
  { id: 'booking-cal', label: 'Booking Calendar', icon: Calendar, expandable: true },
  { id: 'sales', label: 'Sales', icon: TrendingUp, expandable: true },
  { id: 'catalog', label: 'Catalog', icon: Globe, expandable: true },
  { id: 'apps', label: 'Apps', icon: LayoutGrid, expandable: true },
];

const MIDDLE_ITEMS: NavItemDef[] = [
  { id: 'site', label: 'Site & Mobile App', icon: Monitor, expandable: true },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, expandable: true },
  { id: 'getting-paid', label: 'Getting Paid', icon: CreditCard, expandable: true },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'customers', label: 'Customers & Leads', icon: Users, expandable: true },
  { id: 'analytics', label: 'Analytics', icon: BarChart2, expandable: true },
  { id: 'automations', label: 'Automations', icon: Zap, expandable: true },
];

const BOTTOM_ITEMS: NavItemDef[] = [
  { id: 'settings', label: 'Settings', icon: Settings, functional: true },
];

const WixSidebar: React.FC<Props> = ({ currentPage, onNavigate }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [storeProductsOpen, setStoreProductsOpen] = useState(false);

  // Auto-expand catalog tree when on upsell-rules page
  useEffect(() => {
    if (currentPage === 'upsell-rules') {
      setCatalogOpen(true);
      setStoreProductsOpen(true);
    }
  }, [currentPage]);

  const renderItem = (item: NavItemDef) => {
    const Icon = item.icon;
    const isCatalog = item.id === 'catalog';
    const isActive = item.id === currentPage || (isCatalog && currentPage === 'upsell-rules');
    const isClickable = item.functional || isCatalog;

    return (
      <React.Fragment key={item.id}>
        <button
          onClick={() => {
            if (isCatalog) {
              setCatalogOpen(v => !v);
            } else if (item.functional) {
              onNavigate(item.id);
            }
          }}
          title={collapsed ? item.label : undefined}
          className="flex items-center w-full px-2.5 py-2 rounded-lg transition-all text-left"
          style={{
            gap: collapsed ? 0 : 9,
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: isActive ? '#ffffff' : '#9fa0b0',
            background: isActive && !isCatalog ? 'rgba(255,255,255,0.12)' : 'transparent',
            cursor: isClickable ? 'pointer' : 'default',
          }}
          onMouseEnter={e => {
            if (!isActive || isCatalog)
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
          }}
          onMouseLeave={e => {
            if (!isActive || isCatalog)
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          <Icon size={15} style={{ flexShrink: 0 }} />
          {!collapsed && (
            <>
              <span className="text-sm flex-1 truncate">{item.label}</span>
              <div className="flex items-center gap-1 flex-shrink-0">
                {item.badge && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-px rounded-full"
                    style={{ background: item.badgeColor || '#116dff', color: '#fff' }}
                  >
                    {item.badge}
                  </span>
                )}
                {item.expandable && !isCatalog && (
                  <ChevronRightSm size={12} style={{ color: '#6b6c7e', flexShrink: 0 }} />
                )}
                {isCatalog && (
                  <ChevronDown
                    size={12}
                    style={{
                      color: '#6b6c7e',
                      flexShrink: 0,
                      transform: catalogOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                      transition: 'transform 0.15s ease',
                    }}
                  />
                )}
              </div>
            </>
          )}
        </button>

        {/* Catalog sub-tree */}
        {isCatalog && catalogOpen && !collapsed && (
          <div className="ml-3 pl-3 border-l" style={{ borderColor: '#2a2a36' }}>
            {/* Store Products group */}
            <button
              onClick={() => setStoreProductsOpen(v => !v)}
              className="flex items-center w-full px-2 py-1.5 rounded text-left transition-colors"
              style={{ color: '#9fa0b0' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span className="text-[13px] flex-1 truncate">Store Products</span>
              <ChevronDown
                size={11}
                style={{
                  color: '#6b6c7e',
                  transform: storeProductsOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 0.15s ease',
                }}
              />
            </button>
            {storeProductsOpen && (
              <div className="ml-2.5 pl-2.5 border-l" style={{ borderColor: '#2a2a36' }}>
                {CATALOG_SUB_ITEMS.map(sub => (
                  <button
                    key={sub.id}
                    className="flex items-center w-full px-2 py-1.5 rounded text-left transition-colors text-[13px]"
                    style={{
                      color: currentPage === sub.id ? '#ffffff' : '#9fa0b0',
                      background: currentPage === sub.id ? 'rgba(255,255,255,0.12)' : 'transparent',
                    }}
                    onMouseEnter={e => {
                      if (currentPage !== sub.id) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    }}
                    onMouseLeave={e => {
                      if (currentPage !== sub.id) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}

            {/* Extra catalog items */}
            {CATALOG_EXTRA.map(sub => (
              <button
                key={sub.id}
                onClick={() => sub.functional && onNavigate(sub.id)}
                className="flex items-center w-full px-2 py-1.5 rounded text-left transition-colors text-[13px]"
                style={{
                  color: currentPage === sub.id ? '#ffffff' : '#9fa0b0',
                  background: currentPage === sub.id ? 'rgba(255,255,255,0.12)' : 'transparent',
                  cursor: sub.functional ? 'pointer' : 'default',
                }}
                onMouseEnter={e => {
                  if (currentPage !== sub.id) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                }}
                onMouseLeave={e => {
                  if (currentPage !== sub.id) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className="flex-1 truncate">{sub.label}</span>
                {sub.expandable && (
                  <ChevronRightSm size={10} style={{ color: '#6b6c7e', flexShrink: 0 }} />
                )}
              </button>
            ))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <aside
      className="flex flex-col flex-shrink-0 transition-all duration-200 overflow-hidden"
      style={{
        width: collapsed ? 52 : 228,
        background: '#1a1a24',
        borderRight: '1px solid #12121a',
      }}
    >
      {/* Quick Actions + collapse */}
      <div
        className="flex items-center gap-2 px-2.5 py-3 flex-shrink-0 border-b"
        style={{ borderColor: '#2a2a36' }}
      >
        {!collapsed && (
          <>
            <button
              className="p-2 rounded-lg transition-colors flex-shrink-0"
              style={{ color: '#9fa0b0' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Star size={14} />
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors truncate"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            >
              <span className="truncate">Quick Actions</span>
              <ChevronDown size={12} style={{ color: '#9098a9', flexShrink: 0 }} />
            </button>
          </>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="p-1.5 rounded-lg transition-colors flex-shrink-0"
          style={{ color: '#6b6c7e' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Setup progress */}
      {!collapsed && (
        <div
          className="mx-2.5 my-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-white">Let's set up your business</span>
            <ChevronRightSm size={12} style={{ color: '#6b6c7e' }} />
          </div>
          <p className="text-[11px] mb-2" style={{ color: '#6b6c7e' }}>
            1/5 completed
          </p>
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: '#2a2a36' }}>
            <div className="h-full rounded-full" style={{ width: '20%', background: '#116dff' }} />
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-1.5 py-1 flex flex-col gap-0.5">
        {TOP_ITEMS.map(renderItem)}

        {/* Divider */}
        <div className="my-1.5 mx-2" style={{ borderTop: '1px solid #2a2a36' }} />

        {MIDDLE_ITEMS.map(renderItem)}
      </nav>

      {/* Bottom: Settings */}
      <div className="px-1.5 py-1.5 border-t flex flex-col gap-0.5" style={{ borderColor: '#2a2a36' }}>
        {BOTTOM_ITEMS.map(renderItem)}
      </div>

      {/* Edit Site */}
      <div className="px-1.5 pb-3 pt-1 border-t" style={{ borderColor: '#2a2a36' }}>
        <button
          className="flex items-center justify-center w-full gap-2 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ color: '#ffffff' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Pencil size={13} />
          {!collapsed && <span>Edit Site</span>}
        </button>
      </div>
    </aside>
  );
};

export default WixSidebar;
