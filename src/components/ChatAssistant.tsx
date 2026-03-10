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
  Pencil,
  ShoppingCart,
  Star,
  Wand2,
  CheckCircle,
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

interface AppMarketCard {
  name: string;
  description: string;
  iconBg: string;
  rating: number;
  isFree: boolean;
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  widget?: Widget;
  appMarketCards?: AppMarketCard[];
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
  onEnterGenerateApp?: () => void;
  editAppMode?: string | null;
  onExitEditApp?: () => void;
  buildingMode?: BuildingModeState | null;
  onStartBuilding?: (optionLabel: string) => void;
  onBuildComplete?: () => void;
  onNavigateToDashboard?: () => void;
  onGoToCreations?: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen = true, onClose, generateAppMode, onExitGenerateApp, onEnterGenerateApp, editAppMode, onExitEditApp, buildingMode, onStartBuilding, onBuildComplete, onNavigateToDashboard, onGoToCreations }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [buildCompleted, setBuildCompleted] = useState(false);
  const [buildAppName, setBuildAppName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasConversation = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Building steps animation
  const buildCompleteTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!buildingMode?.active) {
      return;
    }

    setBuildAppName(buildingMode.appName);
    setBuildCompleted(false);
    setVisibleSteps(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setVisibleSteps(step);
      if (step >= BUILDING_STEPS.length) {
        clearInterval(interval);
        buildCompleteTimeoutRef.current = window.setTimeout(() => {
          setBuildCompleted(true);
          onBuildComplete?.();
        }, 1200);
      }
    }, 1800);

    return () => {
      clearInterval(interval);
      if (buildCompleteTimeoutRef.current) {
        clearTimeout(buildCompleteTimeoutRef.current);
      }
    };
  }, [buildingMode?.active, onBuildComplete]);

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

  // Activate Edit App mode
  useEffect(() => {
    if (editAppMode) {
      setMessages([{
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: `What changes would you like to make to ${editAppMode}?`,
      }]);
      setSelectedOptions({});
    }
  }, [editAppMode]);

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

    // Fee / charge / checkout scenario — suggest App Market + Build Custom
    if (lower.includes('fee') || (lower.includes('charge') && lower.includes('order')) || lower.includes('checkout fee')) {
      return {
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: 'Here are tools that can help you manage custom requirements for your products. You can install an app from the Wix App Market or build a custom tool tailored exactly to your needs using AI.',
        appMarketCards: [
          {
            name: 'Wix Checkout Requirements',
            description: 'Set criteria for accepting orders on your store',
            iconBg: '#3b82f6',
            rating: 2.4,
            isFree: true,
          },
        ],
      };
    }

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

  const renderAppMarketWidget = (msg: Message) => {
    if (!msg.appMarketCards || msg.appMarketCards.length === 0) return null;

    return (
      <div className="mt-3 flex flex-col gap-2.5">
        {/* App Market cards */}
        {msg.appMarketCards.map((card, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden transition-all"
            style={{
              background: '#f7f8fa',
              border: '1px solid #e5e8ef',
            }}
          >
            <div className="px-3.5 py-3 flex items-center gap-3">
              {/* App icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 relative"
                style={{ background: card.iconBg }}
              >
                <ShoppingCart size={20} color="#fff" />
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: '#ffffff', border: '1.5px solid #e5e8ef' }}
                >
                  <CheckCircle size={10} style={{ color: '#00b383' }} />
                </div>
              </div>
              {/* App info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-semibold truncate" style={{ color: '#1a1a2e' }}>
                  {card.name}
                </h4>
                <p className="text-[11px] mt-0.5 truncate" style={{ color: '#6b7280' }}>
                  {card.description}
                </p>
              </div>
            </div>
            <div
              className="px-3.5 py-2 flex items-center justify-between"
              style={{ borderTop: '1px solid #e5e8ef', background: '#ffffff' }}
            >
              <span className="text-[11px]" style={{ color: '#6b7280' }}>
                {card.isFree ? 'Free to install' : 'Paid'}
              </span>
              <div className="flex items-center gap-1">
                <Star size={12} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                <span className="text-[12px] font-semibold" style={{ color: '#1a1a2e' }}>
                  {card.rating}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Build Custom Tool with AI card */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 14px rgba(102, 126, 234, 0.3)',
          }}
        >
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                <Wand2 size={16} color="#fff" />
              </div>
              <h4 className="text-[13px] font-bold" style={{ color: '#ffffff' }}>
                Build Custom Tool with AI
              </h4>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Create a tailored solution that fits your exact needs
            </p>
          </div>
          <div className="px-4 pb-3.5 pt-1.5">
            <button
              onClick={onEnterGenerateApp}
              className="w-full py-2 rounded-lg text-[12px] font-semibold transition-all"
              style={{
                color: '#ffffff',
                background: 'rgba(255,255,255,0.18)',
                border: '1.5px solid rgba(255,255,255,0.4)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.3)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.7)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.18)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)';
              }}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Sparkles size={13} />
                Start Building
              </span>
            </button>
          </div>
        </div>
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
                  {msg.role === 'assistant' && renderAppMarketWidget(msg)}
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
            {(buildingMode?.active || buildCompleted) && visibleSteps > 0 && (
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
                    <span style={{ color: '#116dff' }}>{buildAppName}</span>...
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
                  {visibleSteps >= BUILDING_STEPS.length && buildCompleted && (
                    <p className="text-[13px] font-medium mt-3 fade-in-up" style={{ color: '#00b383' }}>
                      Your{' '}
                      <span
                        onClick={onNavigateToDashboard}
                        className="cursor-pointer"
                        style={{ color: '#116dff', textDecoration: 'underline', textUnderlineOffset: 2 }}
                        onMouseEnter={e => ((e.currentTarget as HTMLSpanElement).style.color = '#0d5fdb')}
                        onMouseLeave={e => ((e.currentTarget as HTMLSpanElement).style.color = '#116dff')}
                      >
                        dashboard
                      </span>{' '}
                      is ready!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Next Step widget */}
            {buildCompleted && visibleSteps >= BUILDING_STEPS.length && (
              <div className="fade-in-up mt-1" style={{ animationDelay: '200ms' }}>
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(160deg, #fdfcfb 0%, #f7f4f0 100%)',
                    border: '1px solid #e8e4df',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="px-4 pt-3.5 pb-2">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles size={13} style={{ color: '#116dff' }} />
                      <span className="text-[13px] font-semibold" style={{ color: '#1a1a2e' }}>
                        Next Step
                      </span>
                    </div>
                    <p className="text-[12px]" style={{ color: '#6b7280' }}>
                      Would you like to keep editing?
                    </p>
                  </div>
                  <div className="px-4 pb-3.5 pt-1.5 flex flex-col gap-2">
                    <button
                      onClick={onNavigateToDashboard}
                      className="w-full py-2 rounded-lg text-[13px] font-semibold transition-colors"
                      style={{
                        color: '#116dff',
                        background: '#ffffff',
                        border: '1.5px solid #d0dbf0',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#f0f5ff';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#116dff';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#ffffff';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#d0dbf0';
                      }}
                    >
                      Keep Editing
                    </button>
                    <p className="text-[12px]" style={{ color: '#6b7280' }}>
                      You can manage and edit this dashboard anytime from the My Creations page.
                    </p>
                    <button
                      onClick={onGoToCreations}
                      className="w-full py-2 rounded-lg text-[13px] font-semibold transition-colors"
                      style={{
                        color: '#116dff',
                        background: '#ffffff',
                        border: '1.5px solid #d0dbf0',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#f0f5ff';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#116dff';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#ffffff';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#d0dbf0';
                      }}
                    >
                      Go to My Creations
                    </button>
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
            placeholder={generateAppMode ? 'Describe your need...' : editAppMode ? `Describe changes to ${editAppMode}...` : 'Ask me anything'}
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
              {editAppMode && (
                <button
                  onClick={onExitEditApp}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
                  style={{
                    background: '#f0eeff',
                    color: '#7c6af5',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#e4dafb';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#f0eeff';
                  }}
                >
                  <Pencil size={12} />
                  Edit {editAppMode}
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
