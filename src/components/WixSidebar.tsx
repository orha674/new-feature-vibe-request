import React, { useState, useEffect } from 'react';
import {
  Settings2,
  Home,
  Bot,
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
  Star,
} from 'lucide-react';
import { BuildingModeState } from '../App';

type NavPage = 'home' | 'creations' | 'settings';

interface NavSubItem {
  id: string;
  label: string;
  active?: boolean;
  children?: NavSubItem[];
}

interface Props {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  buildingMode?: BuildingModeState | null;
}

interface NavItemDef {
  id: NavPage | string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  expandable?: boolean;
  active?: boolean;
  functional?: boolean;
  subItems?: NavSubItem[];
}

const TOP_ITEMS: NavItemDef[] = [
  { id: 'setup', label: 'Setup', icon: Settings2 },
  { id: 'home', label: 'Home', icon: Home, functional: true },
  { id: 'ai-agents', label: 'AI Agents', icon: Bot, badge: 'NEW', expandable: true },
  { id: 'creations', label: 'My Creations', icon: Sparkles, badge: 'NEW', functional: true },
  { id: 'sales', label: 'Sales', icon: TrendingUp, expandable: true },
  { id: 'apps', label: 'Apps', icon: LayoutGrid, expandable: true },
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

const CATALOG_SUB_ITEMS: NavSubItem[] = [
  {
    id: 'store-products',
    label: 'Store Products',
    children: [
      { id: 'products', label: 'Products' },
      { id: 'inventory', label: 'Inventory' },
      { id: 'categories', label: 'Categories' },
      { id: 'back-in-stock', label: 'Back in Stock Requests', active: true },
    ],
  },
  { id: 'find-products', label: 'Find Products to Sell' },
  { id: 'booking-services', label: 'Booking Services' },
  { id: 'pricing-plans', label: 'Pricing Plans' },
  { id: 'gift-cards', label: 'Gift Cards' },
  { id: 'discounts', label: 'Discounts' },
  { id: 'sales-channels', label: 'Sales Channels' },
];

const WixSidebar: React.FC<Props> = ({ currentPage, onNavigate, buildingMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Auto-expand catalog items when building mode activates
  useEffect(() => {
    if (buildingMode?.active) {
      setExpandedItems(new Set(['catalog', 'store-products']));
    } else {
      setExpandedItems(new Set());
    }
  }, [buildingMode?.active]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Build the navigation items, injecting Catalog when in building mode
  const getNavigationItems = (): NavItemDef[] => {
    if (!buildingMode?.active) return TOP_ITEMS;

    const items: NavItemDef[] = [];
    for (const item of TOP_ITEMS) {
      items.push(item);
      // Insert Catalog right after Sales
      if (item.id === 'sales') {
        items.push({
          id: 'catalog',
          label: 'Catalog',
          icon: Package,
          expandable: true,
          subItems: CATALOG_SUB_ITEMS,
        });
      }
    }
    return items;
  };

  const renderSubItems = (subItems: NavSubItem[], depth: number = 0) => {
    return subItems.map(sub => {
      const hasChildren = sub.children && sub.children.length > 0;
      const isExpanded = expandedItems.has(sub.id);
      const paddingLeft = 16 + depth * 16;

      return (
        <React.Fragment key={sub.id}>
          <button
            onClick={() => hasChildren && toggleExpanded(sub.id)}
            className="flex items-center w-full py-1.5 rounded-md transition-all text-left"
            style={{
              paddingLeft,
              paddingRight: 10,
              gap: 8,
              color: sub.active ? '#ffffff' : '#9fa0b0',
              background: sub.active ? 'rgba(17, 109, 255, 0.15)' : 'transparent',
              cursor: hasChildren ? 'pointer' : 'default',
              borderLeft: sub.active ? '2px solid #116dff' : '2px solid transparent',
            }}
            onMouseEnter={e => {
              if (!sub.active)
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
            }}
            onMouseLeave={e => {
              if (!sub.active)
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <span
              className="text-[12px] flex-1 truncate"
              style={{
                color: sub.active ? '#ffffff' : '#9fa0b0',
                fontWeight: sub.active ? 500 : 400,
              }}
            >
              {sub.label}
            </span>
            {sub.active && (
              <Star size={11} style={{ color: '#6b6c7e', flexShrink: 0 }} />
            )}
            {hasChildren && (
              isExpanded
                ? <ChevronDown size={11} style={{ color: '#6b6c7e', flexShrink: 0 }} />
                : <ChevronRightSm size={11} style={{ color: '#6b6c7e', flexShrink: 0 }} />
            )}
          </button>
          {hasChildren && isExpanded && renderSubItems(sub.children!, depth + 1)}
        </React.Fragment>
      );
    });
  };

  const renderItem = (item: NavItemDef) => {
    const Icon = item.icon;
    const isActive = item.id === currentPage;
    const isClickable = item.functional || false;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.has(item.id as string);
    const isCatalogInBuildMode = buildingMode?.active && item.id === 'catalog';

    return (
      <React.Fragment key={item.id}>
        <button
          onClick={() => {
            if (hasSubItems) {
              toggleExpanded(item.id as string);
            } else if (isClickable) {
              onNavigate(item.id as NavPage);
            }
          }}
          title={collapsed ? item.label : undefined}
          className="flex items-center w-full px-2.5 py-2 rounded-lg transition-all text-left"
          style={{
            gap: collapsed ? 0 : 9,
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: isActive || isCatalogInBuildMode ? '#ffffff' : '#9fa0b0',
            background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
            cursor: isClickable || hasSubItems ? 'pointer' : 'default',
          }}
          onMouseEnter={e => {
            if (!isActive)
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
          }}
          onMouseLeave={e => {
            if (!isActive)
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
                    style={{ background: '#116dff', color: '#fff' }}
                  >
                    {item.badge}
                  </span>
                )}
                {item.expandable && !hasSubItems && (
                  <ChevronRightSm size={12} style={{ color: '#6b6c7e', flexShrink: 0 }} />
                )}
                {hasSubItems && (
                  isExpanded
                    ? <ChevronDown size={12} style={{ color: '#6b6c7e', flexShrink: 0 }} />
                    : <ChevronRightSm size={12} style={{ color: '#6b6c7e', flexShrink: 0 }} />
                )}
              </div>
            </>
          )}
        </button>
        {/* Render sub-items if expanded and not collapsed */}
        {!collapsed && hasSubItems && isExpanded && (
          <div className="flex flex-col gap-0.5 ml-1">
            {renderSubItems(item.subItems!)}
          </div>
        )}
      </React.Fragment>
    );
  };

  const navItems = getNavigationItems();

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
          <button
            className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors truncate"
            style={{ background: 'rgba(255,255,255,0.08)' }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)')
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)')
            }
          >
            <Package size={13} />
            <span className="truncate">Quick Actions</span>
            <ChevronDown size={12} style={{ color: '#9098a9', flexShrink: 0 }} />
          </button>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="p-1.5 rounded-lg transition-colors flex-shrink-0"
          style={{ color: '#6b6c7e' }}
          onMouseEnter={e =>
            ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)')
          }
          onMouseLeave={e =>
            ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
          }
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Setup progress */}
      {!collapsed && (
        <div
          className="mx-2.5 my-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          onMouseEnter={e =>
            ((e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.09)')
          }
          onMouseLeave={e =>
            ((e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)')
          }
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
        {navItems.map(item => renderItem(item))}
      </nav>

      {/* Bottom items */}
      <div className="px-1.5 py-2 border-t flex flex-col gap-0.5" style={{ borderColor: '#2a2a36' }}>
        {BOTTOM_ITEMS.map(renderItem)}
      </div>
    </aside>
  );
};

export default WixSidebar;
