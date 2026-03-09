import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Clock,
  MoreHorizontal,
  Plus,
  AudioLines,
  Send,
  X,
  Bot,
  LayoutGrid,
  Sparkles,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { BuildingModeState } from '../App';

interface RadioOption {
  id: string;
  label: string;
}

interface Widget {
  question: string;
  options: RadioOption[];
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  widget?: Widget;
}

const SUGGESTIONS = [
  'Get more visitors',
  'Set up analytics',
  'Plan my first offer',
];

const BUILDING_STEPS = [
  'Adding aggregated requests field to Out Of Stock dashboard...',
  'Generating CMS collection for the aggregation...',
  'Defining data schema...',
];

interface ChatAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
  generateAppMode?: boolean;
  onExitGenerateApp?: () => void;
  buildingMode?: BuildingModeState | null;
  onStartBuilding?: (optionLabel: string) => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen = true, onClose, generateAppMode, onExitGenerateApp, buildingMode, onStartBuilding }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [visibleSteps, setVisibleSteps] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasConversation = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Building steps animation
  useEffect(() => {
    if (!buildingMode?.active) {
      setVisibleSteps(0);
      return;
    }

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setVisibleSteps(step);
      if (step >= BUILDING_STEPS.length) {
        clearInterval(interval);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [buildingMode?.active]);

  // Scroll to bottom when building steps update
  useEffect(() => {
    if (visibleSteps > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleSteps]);

  // Activate Generate App mode
  useEffect(() => {
    if (generateAppMode) {
      setMessages([{
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: 'What new tool would you like me to create for your site today?',
      }]);
      setSelectedOptions({});
    }
  }, [generateAppMode]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(36).slice(2),
      role: 'user',
      content: text.trim(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate assistant response
    setTimeout(() => {
      const reply = getReply(text.trim());
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 1200);
  };

  const getReply = (text: string): Message => {
    const lower = text.toLowerCase();

    // Analytics + out-of-stock scenario
    if (lower.includes('analytics') && (lower.includes('out-of-stock') || lower.includes('out of stock') || lower.includes('stock request'))) {
      return {
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: 'Great idea! I can help you build analytics for out-of-stock requests.',
        widget: {
          question: 'Where would you like me to add those analytics?',
          options: [
            {
              id: 'existing-dashboard',
              label: 'Add the analytics to the Back In Stock Request dashboard page',
            },
            {
              id: 'new-dashboard',
              label: 'Build a new dashboard page to show aggregated requests per product, along with last month\'s sales per product',
            },
          ],
        },
      };
    }

    if (lower.includes('visitor') || lower.includes('traffic'))
      return {
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: "To get more visitors, I'd recommend starting with SEO basics — make sure your site title, descriptions, and content include keywords your audience searches for. You can also connect Google Search Console from your Marketing tools.",
      };
    if (lower.includes('analytics'))
      return {
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: "You can set up analytics by going to Analytics in the left sidebar. I recommend connecting Google Analytics for deeper insights. Want me to walk you through it?",
      };
    if (lower.includes('offer') || lower.includes('promotion'))
      return {
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: "A great first offer could be a limited-time discount or free shipping. Head to Marketing > Coupons to create one. Would you like help crafting the perfect offer?",
      };
    return {
      id: Math.random().toString(36).slice(2),
      role: 'assistant',
      content: "I can help you with that! Could you tell me a bit more about what you're looking for? I'm here to assist with your site design, marketing, and business growth.",
    };
  };

  const handleOptionSelect = (messageId: string, optionId: string) => {
    setSelectedOptions(prev => ({ ...prev, [messageId]: optionId }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!isOpen) {
    return null;
  }

  const renderWidget = (msg: Message) => {
    if (!msg.widget) return null;
    const selected = selectedOptions[msg.id];

    return (
      <div
        className="mt-3 rounded-lg overflow-hidden"
        style={{ border: '1px solid #e5e8ef' }}
      >
        <div
          className="px-3.5 py-2.5 text-[13px] font-medium"
          style={{ background: '#f7f8fa', color: '#1a1a2e', borderBottom: '1px solid #e5e8ef' }}
        >
          {msg.widget.question}
        </div>
        <div className="flex flex-col">
          {msg.widget.options.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <label
                key={opt.id}
                className="flex items-start gap-2.5 px-3.5 py-3 cursor-pointer transition-colors"
                style={{
                  background: isSelected ? '#f0f4ff' : '#ffffff',
                  borderBottom: '1px solid #f0f0f5',
                }}
                onMouseEnter={e => {
                  if (!isSelected) (e.currentTarget as HTMLLabelElement).style.background = '#fafbfc';
                }}
                onMouseLeave={e => {
                  if (!isSelected) (e.currentTarget as HTMLLabelElement).style.background = '#ffffff';
                }}
              >
                <div
                  className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{
                    border: isSelected ? '2px solid #116dff' : '2px solid #c8cdd8',
                  }}
                >
                  {isSelected && (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#116dff' }}
                    />
                  )}
                </div>
                <input
                  type="radio"
                  name={`widget-${msg.id}`}
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => handleOptionSelect(msg.id, opt.id)}
                  className="sr-only"
                />
                <span className="text-[12px] leading-relaxed" style={{ color: '#1a1a2e' }}>
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
        {selected && (
          <div className="px-3.5 py-2.5" style={{ borderTop: '1px solid #e5e8ef' }}>
            <button
              onClick={() => {
                const option = msg.widget!.options.find(o => o.id === selected);
                if (option) {
                  onStartBuilding?.(option.label);
                }
              }}
              className="w-full py-2 rounded-lg text-xs font-semibold text-white transition-colors"
              style={{ background: '#116dff' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#0d5fdb')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#116dff')}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Sparkles size={13} />
                Approve & Build
              </span>
            </button>
            <p
              className="text-center mt-2 text-[10px]"
              style={{ color: '#9098a9' }}
            >
              Note: this action will deduct AI credits from your account
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="flex flex-col flex-shrink-0 border-l"
      style={{
        width: 320,
        background: '#ffffff',
        borderColor: '#e5e8ef',
        height: '100%',
      }}
    >
      {/* ── Header ────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 flex-shrink-0"
        style={{ height: 52, borderBottom: '1px solid #e5e8ef' }}
      >
        <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
          Aria
        </span>
        <div className="flex items-center gap-1">
          {[MessageCircle, Clock, MoreHorizontal].map((Icon, i) => (
            <button
              key={i}
              className="p-1.5 rounded-md transition-colors"
              style={{ color: '#6b7280' }}
              onMouseEnter={e =>
                ((e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa')
              }
              onMouseLeave={e =>
                ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
              }
            >
              <Icon size={16} />
            </button>
          ))}
          <button
            onClick={onClose}
            className="p-1.5 rounded-md transition-colors ml-1"
            style={{ color: '#6b7280' }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa')
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')
            }
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-none">
        {!hasConversation ? (
          /* ── Welcome state ── */
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
              style={{ background: '#1a1a2e' }}
            >
              <Bot size={28} color="#fff" />
            </div>

            {/* Greeting */}
            <h2
              className="text-lg font-bold leading-snug mb-1"
              style={{ color: '#1a1a2e' }}
            >
              Hi, I'm Aria, your business
              <br />
              and web design expert.
            </h2>

            {/* Suggestions label */}
            <p
              className="text-xs mt-4 mb-3"
              style={{ color: '#9098a9' }}
            >
              Suggestions for today:
            </p>

            {/* Suggestion cards */}
            <div className="flex flex-col gap-2 w-full">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="flex items-center gap-2.5 w-full px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors"
                  style={{
                    color: '#1a1a2e',
                    background: '#ffffff',
                    border: '1px solid #e5e8ef',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#d0d5dd';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#ffffff';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e8ef';
                  }}
                >
                  <Plus
                    size={16}
                    style={{ color: '#116dff', flexShrink: 0 }}
                  />
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Conversation ── */
          <div className="flex flex-col gap-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                    style={{ background: '#1a1a2e' }}
                  >
                    <Bot size={14} color="#fff" />
                  </div>
                )}
                <div className="max-w-[85%]">
                  <div
                    className="rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed"
                    style={
                      msg.role === 'user'
                        ? {
                            background: '#116dff',
                            color: '#ffffff',
                            borderBottomRightRadius: 4,
                          }
                        : {
                            background: '#f7f8fa',
                            color: '#1a1a2e',
                            borderBottomLeftRadius: 4,
                          }
                    }
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'assistant' && renderWidget(msg)}
                </div>
              </div>
            ))}

            {isTyping && !buildingMode?.active && (
              <div className="flex items-start">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2"
                  style={{ background: '#1a1a2e' }}
                >
                  <Bot size={14} color="#fff" />
                </div>
                <div
                  className="rounded-xl px-3.5 py-2.5 text-[13px]"
                  style={{ background: '#f7f8fa', color: '#9098a9' }}
                >
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                  </span>
                </div>
              </div>
            )}

            {/* Building progress */}
            {buildingMode?.active && (
              <div className="flex justify-start fade-in-up">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                  style={{ background: '#1a1a2e' }}
                >
                  <Bot size={14} color="#fff" />
                </div>
                <div className="max-w-[85%]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px] font-semibold" style={{ color: '#1a1a2e' }}>Aria</span>
                  </div>
                  <p className="text-[13px] font-medium mb-3" style={{ color: '#1a1a2e' }}>
                    Starting the build process for your{' '}
                    <span style={{ color: '#116dff' }}>{buildingMode.appName}</span>...
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {BUILDING_STEPS.map((step, i) => {
                      if (i >= visibleSteps) return null;
                      const isLastVisible = i === visibleSteps - 1;
                      const allDone = visibleSteps >= BUILDING_STEPS.length;
                      const isComplete = !isLastVisible || allDone;

                      return (
                        <div
                          key={i}
                          className="flex items-start gap-2 fade-in-up"
                          style={{ animationDelay: '0ms' }}
                        >
                          {isComplete ? (
                            <CheckCircle2
                              size={15}
                              style={{ color: '#00b383', flexShrink: 0, marginTop: 1 }}
                            />
                          ) : (
                            <Loader2
                              size={15}
                              className="animate-spin"
                              style={{ color: '#116dff', flexShrink: 0, marginTop: 1 }}
                            />
                          )}
                          <span
                            className="text-[12px] leading-relaxed"
                            style={{ color: isComplete ? '#32325d' : '#116dff' }}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input area ────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 pb-3 pt-2">
        <div
          className="flex flex-col gap-2 rounded-xl px-3 py-2"
          style={{ border: '1px solid #e5e8ef', background: '#ffffff' }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={generateAppMode ? 'Describe your app...' : 'Ask me anything'}
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: '#1a1a2e' }}
          />
          <div className="flex items-center justify-between">
            {/* Mode chip */}
            <div className="flex items-center">
              {generateAppMode && (
                <button
                  onClick={onExitGenerateApp}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
                  style={{
                    background: '#f0e6ff',
                    color: '#6b2fa0',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#e4d4fc';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#f0e6ff';
                  }}
                >
                  <LayoutGrid size={12} />
                  New Creation
                  <X size={10} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-0.5">
              <button
                className="p-1.5 rounded-md transition-colors"
                style={{ color: '#6b7280' }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLButtonElement).style.color = '#1a1a2e')
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLButtonElement).style.color = '#6b7280')
                }
              >
                <Plus size={16} />
              </button>
              {input.trim() ? (
                <button
                  onClick={() => sendMessage(input)}
                  className="p-1.5 rounded-md transition-colors"
                  style={{ color: '#116dff' }}
                >
                  <Send size={16} />
                </button>
              ) : (
                <button
                  className="p-1.5 rounded-md transition-colors"
                  style={{ color: '#6b7280' }}
                  onMouseEnter={e =>
                    ((e.currentTarget as HTMLButtonElement).style.color = '#1a1a2e')
                  }
                  onMouseLeave={e =>
                    ((e.currentTarget as HTMLButtonElement).style.color = '#6b7280')
                  }
                >
                  <AudioLines size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p
          className="text-center mt-2 text-[10px]"
          style={{ color: '#9098a9' }}
        >
          AI can make mistakes. Double check the results.
        </p>
      </div>
    </div>
  );
};

export default ChatAssistant;
