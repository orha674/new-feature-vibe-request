import React, { useState } from 'react';
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
} from 'lucide-react';

type NavPage = 'home' | 'creations' | 'settings';

interface Props {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

interface NavItemDef {
  id: NavPage | string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  expandable?: boolean;
  active?: boolean;
  functional?: boolean; // only functional items navigate
}

const TOP_ITEMS: NavItemDef[] = [
  { id: 'setup', label: 'Setup', icon: Settings2 },
  { id: 'home', label: 'Home', icon: Home, functional: true },
  { id: 'ai-agents', label: 'AI Agents', icon: Bot, badge: 'NEW', expandable: true },
  { id: 'creations', label: 'My Custom Apps', icon: Sparkles, badge: 'NEW', functional: true },
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

const WixSidebar: React.FC<Props> = ({ currentPage, onNavigate }) => {
  const [collapsed, setCollapsed] = useState(false);

  const renderItem = (item: NavItemDef) => {
    const Icon = item.icon;
    const isActive = item.id === currentPage;
    const isClickable = item.functional || false;

    return (
      <button
        key={item.id}
        onClick={() => isClickable && onNavigate(item.id as NavPage)}
        title={collapsed ? item.label : undefined}
        className="flex items-center w-full px-2.5 py-2 rounded-lg transition-all text-left"
        style={{
          gap: collapsed ? 0 : 9,
          justifyContent: collapsed ? 'center' : 'flex-start',
          color: isActive ? '#ffffff' : '#9fa0b0',
          background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
          cursor: isClickable ? 'pointer' : 'default',
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
              {item.expandable && (
                <ChevronRightSm size={12} style={{ color: '#6b6c7e', flexShrink: 0 }} />
              )}
            </div>
          </>
        )}
      </button>
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
        {TOP_ITEMS.map(renderItem)}
      </nav>

      {/* Bottom items */}
      <div className="px-1.5 py-2 border-t flex flex-col gap-0.5" style={{ borderColor: '#2a2a36' }}>
        {BOTTOM_ITEMS.map(renderItem)}
      </div>
    </aside>
  );
};

export default WixSidebar;
