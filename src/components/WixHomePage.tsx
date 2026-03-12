import React from 'react';
import {
  MoreHorizontal,
  Pencil,
  ExternalLink,
  Settings2,
  ChevronDown,
  Plus,
  Sparkles,
  RefreshCw,
  X,
  Smartphone,
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

const STATS = [
  { label: 'Site sessions', value: '0' },
  { label: 'Total sales', value: '\u20AA0.00' },
  { label: 'Total orders', value: '0' },
  { label: 'Bookings', value: '0' },
];

const WixHomePage: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#f7f8fa' }}>
      {/* Main content */}
      <div className="max-w-[1100px] w-full mx-auto px-8 py-6 flex flex-col gap-5">

        {/* Welcome header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: '#16161d' }}>
            Welcome back, Adam Wix
          </h1>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg transition-colors"
              style={{ color: '#6b7280' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f5')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <MoreHorizontal size={18} />
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: '#116dff', border: '1px solid #116dff' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f5ff')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Pencil size={13} />
              Edit Site
            </button>
          </div>
        </div>

        {/* Info bar */}
        <div
          className="flex items-center gap-0 rounded-lg overflow-hidden text-sm"
          style={{ background: '#ffffff', border: '1px solid #e5e8ef' }}
        >
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderRight: '1px solid #e5e8ef' }}>
            <span style={{ color: '#32325d' }}>Free plan</span>
            <span className="font-medium cursor-pointer" style={{ color: '#116dff' }}>Compare Plans</span>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderRight: '1px solid #e5e8ef' }}>
            <span className="truncate" style={{ color: '#32325d', maxWidth: 160 }}>https://adamtest3.wixsi...</span>
            <ExternalLink size={12} style={{ color: '#6b7280', flexShrink: 0 }} />
          </div>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderRight: '1px solid #e5e8ef' }}>
            <span style={{ color: '#32325d' }}>No business email</span>
            <span className="font-medium cursor-pointer" style={{ color: '#116dff' }}>Connect</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 cursor-pointer">
            <Settings2 size={14} style={{ color: '#6b7280' }} />
            <span style={{ color: '#32325d' }}>Edit Business Info</span>
          </div>
        </div>

        {/* Analytics section */}
        <div className="rounded-lg p-5" style={{ background: '#ffffff', border: '1px solid #e5e8ef' }}>
          {/* Analytics header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold" style={{ color: '#16161d' }}>Analytics</h2>
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={{ color: '#6b7280', background: '#f0f0f5' }}
              >
                No visitors at the moment
              </span>
            </div>
            <span className="text-sm font-medium cursor-pointer" style={{ color: '#116dff' }}>
              View Your Site Analytics
            </span>
          </div>

          {/* Key stats header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <span className="text-sm" style={{ color: '#32325d' }}>Your key stats for the</span>
              <button className="flex items-center gap-1 text-sm font-medium" style={{ color: '#116dff' }}>
                last 30 days
                <ChevronDown size={12} />
              </button>
            </div>
            <button className="flex items-center gap-1 text-sm font-medium" style={{ color: '#116dff' }}>
              <Plus size={13} />
              Add Stats
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {STATS.map(stat => (
              <div
                key={stat.label}
                className="rounded-lg px-4 py-3"
                style={{ border: '1px solid #e5e8ef' }}
              >
                <p className="text-xs mb-1" style={{ color: '#6b7280' }}>{stat.label}</p>
                <p className="text-xl font-bold" style={{ color: '#16161d' }}>{stat.value}</p>
                <div className="mt-3 h-0.5 rounded-full" style={{ background: '#1a1a24', width: '60%' }} />
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-1.5 text-sm font-medium" style={{ color: '#116dff' }}>
              <Sparkles size={13} />
              Help me grow my site traffic
            </button>
            <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
              <span>Updated now</span>
              <button className="font-medium" style={{ color: '#116dff' }}>Refresh</button>
            </div>
          </div>
        </div>

        {/* Get the App banner */}
        <div
          className="flex items-center justify-between rounded-lg px-5 py-3"
          style={{ background: '#e8f1fe', border: '1px solid #c5d9f8' }}
        >
          <span className="text-sm" style={{ color: '#32325d' }}>
            Get analytics and reports on the go with the Wix app.
          </span>
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{ color: '#32325d', background: '#ffffff', border: '1px solid #e5e8ef' }}
          >
            <Smartphone size={13} />
            Get the App
          </button>
        </div>

        {/* Activity feed + Suggested for you */}
        <div className="flex gap-5">
          {/* Activity feed */}
          <div
            className="flex-1 rounded-lg p-5"
            style={{ background: '#ffffff', border: '1px solid #e5e8ef' }}
          >
            <h3 className="text-lg font-bold mb-1" style={{ color: '#16161d' }}>Activity feed</h3>
            <p className="text-sm mb-8" style={{ color: '#6b7280' }}>Your most recent updates.</p>

            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-base font-bold mb-2" style={{ color: '#16161d' }}>
                No recent activity to show
              </p>
              <p className="text-sm mb-5" style={{ color: '#6b7280' }}>
                Finish setting up your site to see the latest updates.
              </p>
              <button
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ background: '#116dff' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#0d5fdb')}
                onMouseLeave={e => (e.currentTarget.style.background = '#116dff')}
              >
                Continue Setup
              </button>
            </div>
          </div>

          {/* Suggested for you */}
          <div
            className="rounded-lg p-5 flex-shrink-0"
            style={{ background: '#ffffff', border: '1px solid #e5e8ef', width: 300 }}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold" style={{ color: '#16161d' }}>Suggested for you</h3>
              <span className="text-sm font-medium cursor-pointer" style={{ color: '#116dff' }}>
                View All
              </span>
            </div>
            <p className="text-sm mb-5" style={{ color: '#6b7280' }}>Personalized for what you need.</p>

            {/* Mobile app suggestion card */}
            <div
              className="rounded-lg p-4"
              style={{ background: '#fef7ec', border: '1px solid #fde8c4' }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm font-bold mb-2" style={{ color: '#16161d' }}>
                    You've got a mobile app for your customers
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>
                    Check out your members app where people can chat, shop online, read blog posts, book services and more on the go.
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: '#fde8c4' }}
                >
                  <Smartphone size={20} style={{ color: '#f59e0b' }} />
                </div>
              </div>
              <button
                className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: '#116dff', background: '#ffffff', border: '1px solid #e5e8ef' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f0f5ff')}
                onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
              >
                Check It Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom upgrade banner */}
      <div
        className="mt-auto flex items-center justify-center gap-3 px-6 py-3 flex-shrink-0"
        style={{ background: '#2d2d42' }}
      >
        <span className="text-sm">
          <span className="font-semibold" style={{ color: '#8b7cf6' }}>nimbuskicks.com</span>
          <span style={{ color: '#ffffff' }}> is available. Upgrade now to claim it.</span>
        </span>
        <button
          className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
          style={{ color: '#ffffff', background: '#7c3aed' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#6d28d9')}
          onMouseLeave={e => (e.currentTarget.style.background = '#7c3aed')}
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
};

export default WixHomePage;
