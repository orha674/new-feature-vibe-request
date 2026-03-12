import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

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

export interface RichSegment {
  text: string;
  bold?: boolean;
  paragraphBreak?: boolean;
}

interface TaggedWord {
  word: string;
  bold: boolean;
  startsNewParagraph: boolean;
  segmentIndex: number;
}

interface RichStreamingResponseProps {
  segments: RichSegment[];
  thinkingDelay?: number;
  wordInterval?: number;
  widgetDelay?: number;
  children?: React.ReactNode;
  instant?: boolean;
  onComplete?: () => void;
}

export function RichStreamingResponse({
  segments,
  thinkingDelay = 1000,
  wordInterval = 70,
  widgetDelay = 350,
  children,
  instant = false,
  onComplete,
}: RichStreamingResponseProps) {
  const taggedWords = useMemo<TaggedWord[]>(() => {
    const result: TaggedWord[] = [];
    segments.forEach((seg, segIdx) => {
      const words = seg.text.trim().split(/\s+/).filter(Boolean);
      words.forEach((w, wIdx) => {
        result.push({
          word: w,
          bold: !!seg.bold,
          startsNewParagraph: wIdx === 0 && !!seg.paragraphBreak,
          segmentIndex: segIdx,
        });
      });
    });
    return result;
  }, [segments]);

  const totalWords = taggedWords.length;

  const [phase, setPhase] = useState<'thinking' | 'streaming' | 'widgets' | 'done'>(
    instant ? 'done' : 'thinking',
  );
  const [visibleWordCount, setVisibleWordCount] = useState(instant ? totalWords : 0);
  const [showWidgets, setShowWidgets] = useState(instant);

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

  const renderedParagraphs = useMemo(() => {
    const visible = taggedWords.slice(0, visibleWordCount);
    if (visible.length === 0) return [];

    const paragraphs: { runs: { words: string[]; bold: boolean }[] }[] = [];
    let currentParagraph: { words: string[]; bold: boolean }[] = [];
    let currentRun: { words: string[]; bold: boolean } | null = null;

    visible.forEach(tw => {
      if (tw.startsNewParagraph && currentParagraph.length > 0) {
        paragraphs.push({ runs: currentParagraph });
        currentParagraph = [];
        currentRun = null;
      }

      if (currentRun && currentRun.bold === tw.bold) {
        currentRun.words.push(tw.word);
      } else {
        currentRun = { words: [tw.word], bold: tw.bold };
        currentParagraph.push(currentRun);
      }
    });

    if (currentParagraph.length > 0) {
      paragraphs.push({ runs: currentParagraph });
    }

    return paragraphs;
  }, [taggedWords, visibleWordCount]);

  return (
    <div className="space-y-4 max-w-full">
      {phase === 'thinking' ? (
        <TypingIndicator />
      ) : (
        <div className="space-y-3">
          {renderedParagraphs.map((para, pIdx) => (
            <p key={pIdx} className="text-sm" style={{ color: '#16161d', lineHeight: 1.5 }}>
              {para.runs.map((run, rIdx) => {
                const text = (rIdx > 0 ? ' ' : '') + run.words.join(' ');
                return run.bold ? (
                  <span key={rIdx} className="font-bold">{text}</span>
                ) : (
                  <span key={rIdx}>{text}</span>
                );
              })}
              {pIdx === renderedParagraphs.length - 1 && phase === 'streaming' && (
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
          ))}
        </div>
      )}

      {showWidgets && (
        <div style={{ animation: 'widget-fade-in 0.45s ease-out forwards' }}>
          {children}
        </div>
      )}
    </div>
  );
}
