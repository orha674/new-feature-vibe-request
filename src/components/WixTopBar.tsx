import React from 'react';
import {
  Search,
  MessageSquare,
  Bell,
  LayoutGrid,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface WixTopBarProps {
  onAIClick?: () => void;
  isAIPanelOpen?: boolean;
}

const WixTopBar: React.FC<WixTopBarProps> = ({ onAIClick, isAIPanelOpen }) => (
  <div
    className="flex items-center gap-3 px-4 flex-shrink-0 border-b"
    style={{ background: '#ffffff', borderColor: '#e5e8ef', height: 48, zIndex: 50 }}
  >
    {/* Logo */}
    <span className="font-black text-xl select-none" style={{ color: '#000', letterSpacing: '-1px' }}>
      WIX
    </span>

    {/* Site name */}
    <button
      className="flex items-center gap-1 px-2 py-1 rounded text-sm font-medium transition-colors"
      style={{ color: '#32325d' }}
      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa')}
      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
    >
      My Wix Site
      <ChevronDown size={13} style={{ color: '#9098a9' }} />
    </button>

    <div className="w-px h-5 flex-shrink-0" style={{ background: '#e5e8ef' }} />

    {/* Nav links */}
    {['Explore', 'Hire a Professional', 'Help'].map(item => (
      <button
        key={item}
        className="hidden md:flex items-center gap-0.5 px-2 py-1 rounded text-sm transition-colors flex-shrink-0"
        style={{ color: '#32325d' }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa')}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
      >
        {item}
        {item !== 'Hire a Professional' && (
          <ChevronDown size={12} style={{ color: '#9098a9' }} />
        )}
      </button>
    ))}

    <div className="w-px h-5 flex-shrink-0 hidden md:block" style={{ background: '#e5e8ef' }} />

    {/* Upgrade */}
    <button
      className="hidden md:block px-3 py-1 rounded-full text-xs font-bold text-white flex-shrink-0 transition-colors"
      style={{ background: '#7b42f6' }}
      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#6b32e6')}
      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#7b42f6')}
    >
      Upgrade
    </button>

    {/* Search */}
    <div className="flex-1 max-w-lg mx-2">
      <div className="relative">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: '#9098a9' }}
        />
        <input
          type="text"
          placeholder="Search for tools, apps, help & more..."
          className="w-full pl-8 pr-3 py-1.5 rounded-full text-xs outline-none"
          style={{ background: '#f7f8fa', border: '1px solid #e5e8ef', color: '#32325d' }}
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
    </div>

    {/* Right icons */}
    <div className="flex items-center gap-1 ml-auto flex-shrink-0">
      {[MessageSquare, LayoutGrid].map((Icon, i) => (
        <button
          key={i}
          className="p-2 rounded-lg transition-colors"
          style={{ color: '#6b7280' }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
        >
          <Icon size={17} />
        </button>
      ))}

      {/* Bell with badge */}
      <button
        className="relative p-2 rounded-lg transition-colors"
        style={{ color: '#6b7280' }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa')}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
      >
        <Bell size={17} />
        <span
          className="absolute top-1 right-1 text-[9px] font-bold text-white w-3.5 h-3.5 rounded-full flex items-center justify-center"
          style={{ background: '#e53e3e' }}
        >
          13
        </span>
      </button>

      {/* Avatar */}
      <button
        className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg transition-colors"
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa')}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: '#116dff' }}
        >
          A
        </div>
        <ChevronDown size={11} style={{ color: '#9098a9' }} />
      </button>

      {/* AI button */}
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors"
        style={{ background: isAIPanelOpen ? '#0d5fdb' : '#116dff' }}
        onClick={onAIClick}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#0d5fdb')}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = isAIPanelOpen ? '#0d5fdb' : '#116dff')}
      >
        <Sparkles size={12} />
        AI
      </button>
    </div>
  </div>
);

export default WixTopBar;
