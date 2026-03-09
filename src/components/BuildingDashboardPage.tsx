import React from 'react';
import { Star } from 'lucide-react';

interface BuildingDashboardPageProps {
  appName: string;
}

const BuildingDashboardPage: React.FC<BuildingDashboardPageProps> = ({ appName }) => {
  return (
    <div className="relative flex flex-col h-full overflow-hidden" style={{ background: '#f7f8fa' }}>
      {/* Floating purple pill banner */}
      <div className="flex justify-center flex-shrink-0" style={{ paddingTop: 24, paddingBottom: 8 }}>
        <div
          className="flex items-center gap-2.5"
          style={{
            background: 'linear-gradient(135deg, #7c6af5, #9b59b6)',
            padding: '12px 28px',
            borderRadius: 999,
            boxShadow: '0 4px 20px rgba(124, 106, 245, 0.35)',
          }}
        >
          <Star size={15} color="#fff" fill="#fff" />
          <span style={{ color: '#ffffff', fontSize: 14, fontWeight: 600 }}>
            AI is creating your page...
          </span>
        </div>
      </div>

      {/* Skeleton content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Top bar placeholders */}
        <div className="flex items-center gap-4 mb-6">
          <div className="shimmer-light rounded-lg" style={{ width: 40, height: 40 }} />
          <div className="shimmer-light rounded" style={{ width: 200, height: 16 }} />
          <div className="flex-1" />
          <div className="shimmer-light rounded" style={{ width: 100, height: 32 }} />
          <div className="shimmer-light rounded" style={{ width: 100, height: 32 }} />
        </div>

        {/* Header section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="shimmer-light rounded" style={{ width: 280, height: 20 }} />
          <div className="flex-1" />
          <div className="shimmer-light rounded" style={{ width: 160, height: 20 }} />
        </div>

        {/* KPI Cards row */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="rounded-xl p-5"
              style={{ background: '#ffffff', border: '1px solid #e5e8ef' }}
            >
              <div className="shimmer-light rounded mb-3" style={{ width: '60%', height: 12 }} />
              <div className="shimmer-light rounded mb-2" style={{ width: '40%', height: 24 }} />
              <div className="shimmer-light rounded" style={{ width: '80%', height: 10 }} />
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ background: '#ffffff', border: '1px solid #e5e8ef' }}
        >
          <div className="shimmer-light rounded mb-4" style={{ width: 180, height: 14 }} />
          <div className="flex items-end gap-3" style={{ height: 180 }}>
            {[65, 80, 45, 90, 55, 70, 85, 40, 75, 60, 50, 88].map((h, i) => (
              <div
                key={i}
                className="shimmer-light rounded-t flex-1"
                style={{ height: `${h}%`, minWidth: 20 }}
              />
            ))}
          </div>
        </div>

        {/* Table area */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: '#ffffff', border: '1px solid #e5e8ef' }}
        >
          {/* Table header */}
          <div
            className="flex items-center gap-4 px-6 py-3"
            style={{ borderBottom: '1px solid #e5e8ef', background: '#fafbfc' }}
          >
            <div className="shimmer-light rounded" style={{ width: 140, height: 10 }} />
            <div className="shimmer-light rounded" style={{ width: 100, height: 10 }} />
            <div className="shimmer-light rounded" style={{ width: 80, height: 10 }} />
            <div className="flex-1" />
            <div className="shimmer-light rounded" style={{ width: 60, height: 10 }} />
          </div>
          {/* Table rows */}
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-4"
              style={{ borderBottom: i < 6 ? '1px solid #f0f0f5' : undefined }}
            >
              <div className="shimmer-light rounded" style={{ width: 140, height: 12 }} />
              <div className="shimmer-light rounded" style={{ width: 100, height: 12 }} />
              <div className="shimmer-light rounded" style={{ width: 80, height: 12 }} />
              <div className="flex-1" />
              <div className="shimmer-light rounded-full" style={{ width: 60, height: 20 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildingDashboardPage;
