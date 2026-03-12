import React from 'react';
import { User, Sparkles } from 'lucide-react';

interface UpsellChatMessageProps {
  role: 'user' | 'assistant';
  content: React.ReactNode;
}

export function UpsellChatMessage({ role, content }: UpsellChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className="flex gap-3 items-start">
      {isUser ? (
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{ width: 32, height: 32, backgroundColor: '#e8f1fe', color: '#32325d' }}
        >
          <User className="w-4 h-4" />
        </div>
      ) : (
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{ width: 32, height: 32, backgroundColor: '#116dff' }}
        >
          <Sparkles className="w-4 h-4" style={{ color: '#ffffff' }} />
        </div>
      )}

      <div className="flex-1 space-y-1 pt-1" style={{ maxWidth: 301 }}>
        <p className="text-xs" style={{ color: '#6b7280' }}>
          {isUser ? 'You' : 'AI Assistant'}
        </p>
        <div className="text-sm" style={{ color: '#16161d' }}>
          {content}
        </div>
      </div>
    </div>
  );
}
