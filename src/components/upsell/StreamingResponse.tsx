import { useState, useEffect, useRef, useCallback } from 'react';

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="inline-block rounded-full"
          style={{
            width: 6,
            height: 6,
            backgroundColor: '#6b7280',
            animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

interface StreamingResponseProps {
  text: string;
  thinkingDelay?: number;
  wordInterval?: number;
  widgetDelay?: number;
  children?: React.ReactNode;
  instant?: boolean;
  onComplete?: () => void;
}

export function StreamingResponse({
  text,
  thinkingDelay = 1000,
  wordInterval = 70,
  widgetDelay = 350,
  children,
  instant = false,
  onComplete,
}: StreamingResponseProps) {
  const [phase, setPhase] = useState<'thinking' | 'streaming' | 'widgets' | 'done'>(
    instant ? 'done' : 'thinking',
  );
  const [visibleWordCount, setVisibleWordCount] = useState(instant ? text.split(/\s+/).length : 0);
  const [showWidgets, setShowWidgets] = useState(instant);

  const words = useRef(text.split(/\s+/));
  const totalWords = words.current.length;

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const addTimer = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    if (instant) {
      onComplete?.();
      return;
    }

    addTimer(() => {
      setPhase('streaming');

      for (let i = 1; i <= totalWords; i++) {
        addTimer(() => {
          setVisibleWordCount(i);

          if (i === totalWords) {
            addTimer(() => {
              setPhase('widgets');
              setShowWidgets(true);
              addTimer(() => {
                setPhase('done');
                onComplete?.();
              }, 500);
            }, widgetDelay);
          }
        }, i * wordInterval);
      }
    }, thinkingDelay);

    return () => {
      timers.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayedText = words.current.slice(0, visibleWordCount).join(' ');

  return (
    <div className="space-y-4 max-w-full">
      {phase === 'thinking' ? (
        <TypingIndicator />
      ) : (
        <p className="text-sm" style={{ color: '#16161d', lineHeight: 1.5 }}>
          {displayedText}
          {phase === 'streaming' && (
            <span
              className="inline-block ml-0.5 align-baseline"
              style={{
                width: 2,
                height: '1em',
                backgroundColor: '#116dff',
                animation: 'cursor-blink 0.8s step-end infinite',
              }}
            />
          )}
        </p>
      )}

      {showWidgets && (
        <div style={{ animation: 'widget-fade-in 0.45s ease-out forwards' }}>
          {children}
        </div>
      )}
    </div>
  );
}
