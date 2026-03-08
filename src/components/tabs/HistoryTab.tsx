import React, { useState } from 'react';
import { Extension, HistoryEntry } from '../../types';
import { ChevronDown, ChevronRight, GitCommit } from 'lucide-react';
import { formatDateTime } from '../../utils/dateUtils';

export default function HistoryTab({ extension }: { extension: Extension }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-5">
        <GitCommit size={16} style={{ color: '#9098a9' }} />
        <h3 className="text-sm font-bold" style={{ color: '#16161d' }}>Change History</h3>
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: '#f0f0f5', color: '#6b7280' }}>
          {extension.history.length} commits
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-4 bottom-0 w-px" style={{ background: '#e5e8ef' }} />
        <div className="flex flex-col gap-0">
          {extension.history.map((entry, idx) => (
            <HistoryItem
              key={entry.id}
              entry={entry}
              isLast={idx === extension.history.length - 1}
              isExpanded={expandedId === entry.id}
              onToggle={() => setExpandedId(prev => prev === entry.id ? null : entry.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HistoryItem({ entry, isExpanded, onToggle }: { entry: HistoryEntry; isLast: boolean; isExpanded: boolean; onToggle: () => void }) {
  const initial = entry.author.charAt(0).toUpperCase();
  const hue = entry.author.charCodeAt(0) * 17 % 360;

  return (
    <div className="pl-10 pb-4 relative">
      <div
        className="absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm z-10"
        style={{ background: `hsl(${hue}, 60%, 50%)` }}
      >
        {initial}
      </div>

      <button
        onClick={onToggle}
        className="w-full text-left rounded-xl border p-3 transition-all"
        style={{
          background: '#ffffff',
          borderColor: isExpanded ? '#116dff' : '#e5e8ef',
          boxShadow: isExpanded ? '0 0 0 2px rgba(17,109,255,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 mb-1">
              {isExpanded
                ? <ChevronDown size={13} style={{ color: '#9098a9', flexShrink: 0 }} />
                : <ChevronRight size={13} style={{ color: '#9098a9', flexShrink: 0 }} />}
              <p className="text-sm font-semibold truncate" style={{ color: '#16161d' }}>{entry.message}</p>
            </div>
            <div className="flex items-center gap-2 pl-5">
              <span className="text-xs" style={{ color: '#6b7280' }}>{entry.author}</span>
              <span style={{ color: '#e5e8ef' }}>·</span>
              <span className="text-xs" style={{ color: '#6b7280' }}>{formatDateTime(entry.timestamp)}</span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded font-mono shrink-0" style={{ background: '#f0f0f5', color: '#6b7280' }}>
            {entry.id.slice(0, 7)}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-2 rounded-xl border overflow-auto" style={{ borderColor: '#e5e8ef', maxHeight: 400 }}>
          <DiffViewer diff={entry.diff} />
        </div>
      )}
    </div>
  );
}

function DiffViewer({ diff }: { diff: string }) {
  const lines = diff.split('\n');
  return (
    <div style={{ background: '#1e1e1e' }}>
      <div className="px-3 py-1.5 border-b flex items-center gap-2" style={{ borderColor: '#3e3e42', background: '#252526' }}>
        <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#858585' }}>Diff</span>
      </div>
      <div className="text-xs font-mono overflow-x-auto">
        <table style={{ borderCollapse: 'collapse', minWidth: '100%' }}>
          <tbody>
            {lines.map((line, i) => {
              const isAdd = line.startsWith('+') && !line.startsWith('+++');
              const isRemove = line.startsWith('-') && !line.startsWith('---');
              const isHunk = line.startsWith('@@');
              const isFileHeader = line.startsWith('---') || line.startsWith('+++');
              let bg = 'transparent', color = '#8b8b8b';
              if (isAdd) { bg = 'rgba(70,149,74,0.2)'; color = '#98c379'; }
              else if (isRemove) { bg = 'rgba(180,63,63,0.2)'; color = '#e06c75'; }
              else if (isHunk) { bg = 'rgba(86,128,155,0.15)'; color = '#61afef'; }
              else if (isFileHeader) { color = '#cccccc'; }
              return (
                <tr key={i} style={{ background: bg }}>
                  <td style={{ width: 32, textAlign: 'right', padding: '1px 12px', color: '#404040', userSelect: 'none', lineHeight: '1.6', borderRight: '1px solid #3e3e42' }}>
                    {!isHunk && !isFileHeader ? i + 1 : ''}
                  </td>
                  <td style={{ padding: '1px 16px 1px 12px', whiteSpace: 'pre', color, lineHeight: '1.6' }}>
                    {line || ' '}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
