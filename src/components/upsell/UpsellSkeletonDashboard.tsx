import { useMemo } from 'react';
import { Star } from 'lucide-react';

function Bone({
  width,
  height,
  borderRadius,
  style,
  className,
  delay,
}: {
  width: number | string;
  height: number | string;
  borderRadius?: number | string;
  style?: React.CSSProperties;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`skeleton-bone ${className ?? ''}`}
      style={{
        width,
        height,
        borderRadius: borderRadius ?? 6,
        flexShrink: 0,
        animationDelay: delay ? `${delay}s` : undefined,
        ...style,
      }}
    />
  );
}

function BoneCircle({ size, style, delay }: { size: number; style?: React.CSSProperties; delay?: number }) {
  return (
    <div
      className="skeleton-bone"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        animationDelay: delay ? `${delay}s` : undefined,
        ...style,
      }}
    />
  );
}

function Sparkle({ top, left, size, delay }: { top: string; left: string; size: number; delay: number }) {
  return (
    <div
      className="skeleton-sparkle"
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#6c8dfa',
        pointerEvents: 'none',
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function StatCard({ delayBase }: { delayBase: number }) {
  return (
    <div
      className="flex-1 flex flex-col gap-3"
      style={{ backgroundColor: '#ffffff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: 24 }}
    >
      <Bone width={80} height={12} delay={delayBase} />
      <Bone width={120} height={24} delay={delayBase + 0.08} />
      <div className="flex items-center gap-3 mt-1">
        <Bone width={60} height={10} delay={delayBase + 0.16} />
        <Bone width={48} height={10} delay={delayBase + 0.2} />
      </div>
    </div>
  );
}

function SidebarNav() {
  const items = [
    { highlighted: true, width: 100 },
    { highlighted: false, width: 88 },
    { highlighted: false, width: 96 },
    { highlighted: false, width: 72 },
    { highlighted: false, width: 80 },
    { highlighted: false, width: 92 },
    { highlighted: false, width: 68 },
  ];

  return (
    <div
      className="flex flex-col gap-1.5"
      style={{ width: 220, backgroundColor: '#ffffff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: 16, flexShrink: 0 }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5"
          style={{ padding: '8px 10px', borderRadius: 6, backgroundColor: item.highlighted ? '#edf1fe' : 'transparent' }}
        >
          <Bone width={20} height={20} borderRadius={4} delay={0.4 + i * 0.06} />
          <Bone width={item.width} height={12} delay={0.44 + i * 0.06} />
        </div>
      ))}
    </div>
  );
}

function ChartCard() {
  const barHeights = [55, 40, 70, 48, 85, 60, 95, 50, 75, 42, 68, 100];

  return (
    <div className="flex flex-col" style={{ backgroundColor: '#ffffff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: 24 }}>
      <div className="flex items-center justify-between mb-6">
        <Bone width={140} height={16} delay={0.5} />
        <div className="flex items-center gap-2">
          <Bone width={72} height={28} borderRadius={14} delay={0.55} />
          <Bone width={72} height={28} borderRadius={14} delay={0.6} />
        </div>
      </div>
      <div className="flex items-end gap-3" style={{ height: 120 }}>
        {barHeights.map((h, i) => (
          <div
            key={i}
            className="flex-1 skeleton-bar"
            style={{ height: h, backgroundColor: '#e3e8ed', borderRadius: '4px 4px 0 0', animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function TableCard() {
  const rows = 5;
  const colWidths = [120, 90, 80, 70];

  return (
    <div className="flex flex-col" style={{ backgroundColor: '#ffffff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: 24 }}>
      <div className="flex items-center justify-between mb-5">
        <Bone width={120} height={16} delay={0.6} />
        <Bone width={140} height={30} borderRadius={15} delay={0.65} />
      </div>
      <div className="flex items-center gap-4 pb-3 mb-1" style={{ borderBottom: '1px solid #e5e8ef' }}>
        <Bone width={16} height={16} borderRadius={3} delay={0.7} />
        <Bone width={32} height={10} delay={0.73} />
        {colWidths.map((w, i) => (
          <div key={i} className="flex-1">
            <Bone width={w} height={10} delay={0.76 + i * 0.04} />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-4 py-3"
          style={{ borderBottom: rowIdx < rows - 1 ? '1px solid #e5e8ef' : 'none' }}
        >
          <Bone width={16} height={16} borderRadius={3} delay={0.8 + rowIdx * 0.1} />
          <BoneCircle size={32} delay={0.84 + rowIdx * 0.1} />
          {colWidths.map((w, colIdx) => (
            <div key={colIdx} className="flex-1">
              <Bone width={w + ((rowIdx * 7 + colIdx * 13) % 30) - 10} height={12} delay={0.88 + rowIdx * 0.1 + colIdx * 0.03} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function UpsellSkeletonDashboard() {
  const sparkles = useMemo(
    () => [
      { top: '8%', left: '45%', size: 4, delay: 0 },
      { top: '12%', left: '70%', size: 3, delay: 0.6 },
      { top: '18%', left: '25%', size: 5, delay: 1.2 },
      { top: '32%', left: '88%', size: 4, delay: 0.3 },
      { top: '45%', left: '15%', size: 3, delay: 1.8 },
      { top: '52%', left: '55%', size: 6, delay: 0.9 },
      { top: '60%', left: '82%', size: 4, delay: 1.5 },
      { top: '70%', left: '35%', size: 5, delay: 0.4 },
      { top: '75%', left: '92%', size: 3, delay: 2.0 },
      { top: '85%', left: '18%', size: 4, delay: 1.1 },
      { top: '90%', left: '60%', size: 5, delay: 0.7 },
      { top: '25%', left: '50%', size: 3, delay: 1.6 },
      { top: '40%', left: '78%', size: 4, delay: 0.2 },
      { top: '65%', left: '42%', size: 3, delay: 1.3 },
    ],
    [],
  );

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden" style={{ backgroundColor: '#f0f4f7' }}>
      {sparkles.map((s, i) => (
        <Sparkle key={i} top={s.top} left={s.left} size={s.size} delay={s.delay} />
      ))}

      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 flex-shrink-0"
        style={{ height: 48, backgroundColor: '#ffffff', borderBottom: '1px solid #e3e8ed' }}
      >
        <div className="flex items-center gap-3">
          <Bone width={28} height={28} borderRadius={4} delay={0} />
          <Bone width={100} height={14} delay={0.05} />
        </div>
        <div className="flex items-center gap-3">
          <Bone width={80} height={12} delay={0.1} />
          <BoneCircle size={28} delay={0.12} />
        </div>
      </div>

      {/* AI Status Pill */}
      <div className="flex justify-center py-4 flex-shrink-0">
        <div
          className="skeleton-pill flex items-center gap-2 px-5 py-2"
          style={{ borderRadius: 20, background: 'linear-gradient(135deg, #3B6CF5, #7B5CF5)' }}
        >
          <span className="skeleton-star inline-flex">
            <Star className="w-4 h-4" style={{ color: '#ffffff', fill: '#ffffff' }} />
          </span>
          <span className="text-sm font-medium" style={{ color: '#ffffff' }}>
            AI is creating your page...
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex flex-col gap-2">
            <Bone width={260} height={24} delay={0.15} />
            <Bone width={180} height={14} delay={0.2} />
          </div>
          <Bone width={120} height={36} borderRadius={18} delay={0.22} />
        </div>

        <div className="flex gap-[18px] mb-5">
          <StatCard delayBase={0.25} />
          <StatCard delayBase={0.35} />
          <StatCard delayBase={0.45} />
        </div>

        <div className="flex gap-[18px]">
          <SidebarNav />
          <div className="flex-1 flex flex-col gap-[18px] min-w-0">
            <ChartCard />
            <TableCard />
          </div>
        </div>
      </div>
    </div>
  );
}
