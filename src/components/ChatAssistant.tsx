import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import { UpsellAppCards } from './upsell/UpsellAppCards';

interface RadioOption {
  id: string;
  label: string;
}

interface Widget {
  question: string;
  options: RadioOption[];
  appName?: string;
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
  showUpsellCards?: boolean;
}

const SUGGESTIONS = [
  'Get more visitors',
  'Set up analytics',
  'Plan my first offer',
];

const BUILDING_STEPS_STOCK = [
  'Adding aggregated requests field to Out Of Stock dashboard...',
  'Generating CMS collection for the aggregation...',
  'Defining data schema...',
];

const BUILDING_STEPS_UPSELL = [
  'Analyzing frequently bought-together products...',
  'Creating bundle recommendation engine...',
  'Building upsell widget for product pages...',
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
  onStartBuilding?: (optionLabel: string, appName?: string) => void;
  onBuildComplete?: () => void;
  onNavigateToDashboard?: () => void;
  onGoToCreations?: () => void;
  onShowEmptyCreations?: () => void;
  prefillInput?: string;
  onPrefillConsumed?: () => void;
  onNavigateToUpsellBuild?: () => void;
  onNavigateToUpsellRules?: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen = true, onClose, generateAppMode, onExitGenerateApp, onEnterGenerateApp, editAppMode, onExitEditApp, buildingMode, onStartBuilding, onBuildComplete, onNavigateToDashboard, onGoToCreations, onShowEmptyCreations, prefillInput, onPrefillConsumed, onNavigateToUpsellBuild, onNavigateToUpsellRules }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [buildCompleted, setBuildCompleted] = useState(false);
  const [buildAppName, setBuildAppName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const buildingSteps = useMemo(() => {
    if (buildingMode?.appName === 'Smart Product Bundles') return BUILDING_STEPS_UPSELL;
    return BUILDING_STEPS_STOCK;
  }, [buildingMode?.appName]);
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

    // If already completed (returning to dashboard), restore final state without replaying
    if (buildingMode.completed) {
      setBuildAppName(buildingMode.appName);
      setBuildCompleted(true);
      setVisibleSteps(buildingSteps.length);
      return;
    }

    setBuildAppName(buildingMode.appName);
    setBuildCompleted(false);
    setVisibleSteps(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setVisibleSteps(step);
      if (step >= buildingSteps.length) {
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
  }, [buildingMode?.active, buildingMode?.completed, onBuildComplete]);

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

  // Prefill input from external source (e.g. suggestion card click)
  useEffect(() => {
    if (prefillInput) {
      setInput(prefillInput);
      onPrefillConsumed?.();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [prefillInput, onPrefillConsumed]);

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

    // Check for empty state trigger
    if (text.trim().toLowerCase() === 'my creations empty state') {
      setTimeout(() => {
        onShowEmptyCreations?.();
        const reply: Message = {
          id: Math.random().toString(36).slice(2),
          role: 'assistant',
          content: 'Switching to the empty state view for My Creations. You can explore the suggested tools below!',
        };
        setMessages(prev => [...prev, reply]);
        setIsTyping(false);
      }, 800);
      return;
    }

    // Simulate assistant response
    setTimeout(() => {
      const reply = getReply(text.trim());
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 1200);
  };

  const getReply = (text: string): Message => {
    const lower = text.toLowerCase();

    // Upsell / Bundle flow — show app suggestion cards
    if (lower.includes('upsell') || lower.includes('cross-sell') || lower.includes('cross sell') || lower.includes('bundle') || lower.includes('appsell') || lower.includes('app sell')) {
      return {
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: 'Here are tools to help you add smart product suggestions and upsells. Browse top-rated third-party apps below to compare features, or use AI to generate a custom capability that fits exactly how you want to control recommendations and validations.',
        showUpsellCards: true,
      };
    }

    // Analytics / out-of-stock scenario
    if (lower.includes('analytics') || lower.includes('out-of-stock') || lower.includes('out of stock') || lower.includes('stock request')) {
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
          appName: 'Back In Stock Analytics',
        },
      };
    }

    if (lower.includes('visitor') || lower.includes('traffic'))
      return {
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: "To get more visitors, I'd recommend starting with SEO basics — make sure your site title, descriptions, and content include keywords your audience searches for. You can also connect Google Search Console from your Marketing tools.",
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
                  onStartBuilding?.(option.label, msg.widget!.appName);
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
          className="relative rounded-xl overflow-visible cursor-pointer transition-all"
          style={{
            background: '#ffffff',
            border: '1.5px solid #d8d0f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
          onClick={onEnterGenerateApp}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#7c6af5';
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(124, 106, 245, 0.15)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#d8d0f0';
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
          }}
        >
          {/* Sparkles badge top-left */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              top: -10,
              left: -10,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c6af5, #9b87f5)',
              boxShadow: '0 2px 6px rgba(124, 106, 245, 0.35)',
            }}
          >
            <Sparkles size={14} color="#fff" />
          </div>
          <div className="px-3.5 py-3 flex items-center gap-3">
            {/* Text */}
            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-semibold" style={{ color: '#1a1a2e' }}>
                Build Custom Tool with AI
              </h4>
              <p className="text-[11px] mt-0.5" style={{ color: '#6b7280' }}>
                A tailored solution to match your needs
              </p>
            </div>
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
                  {msg.role === 'assistant' && msg.showUpsellCards && (
                    <div className="mt-3">
                      <UpsellAppCards onCreateWithAI={() => onStartBuilding?.('Create upsell capability with AI', 'Smart Product Bundles')} />
                    </div>
                  )}
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
                    {buildingSteps.map((step, i) => {
                      if (i >= visibleSteps) return null;
                      const isLastVisible = i === visibleSteps - 1;
                      const allDone = visibleSteps >= buildingSteps.length;
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
                  {visibleSteps >= buildingSteps.length && buildCompleted && (
                    buildAppName === 'Smart Product Bundles' ? (
                      /* ── Upsell completion widget ── */
                      <div className="mt-3 flex flex-col gap-2 fade-in-up">
                        <p className="text-[13px] font-medium" style={{ color: '#32325d' }}>
                          All done! Your Product Suggestion App is now live and ready to use.
                        </p>

                        {/* Site Widget card */}
                        <div
                          className="rounded-xl overflow-hidden"
                          style={{ background: '#f7f8fa', border: '1px solid #e5e8ef' }}
                        >
                          <div className="px-3.5 py-2.5">
                            <h4 className="text-[13px] font-semibold" style={{ color: '#1a1a2e' }}>Site Widget</h4>
                            <p className="text-[11px] mt-0.5" style={{ color: '#6b7280' }}>Display personalized suggestions to customers</p>
                          </div>
                          <div className="px-3.5 py-2" style={{ borderTop: '1px solid #e5e8ef', background: '#ffffff' }}>
                            <button
                              onClick={() => window.open(window.location.origin + '?preview=cart', '_blank')}
                              className="w-full py-1.5 rounded-lg text-[12px] font-semibold text-white transition-colors"
                              style={{ background: '#116dff' }}
                              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#0d5fdb')}
                              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#116dff')}
                            >
                              Preview cart page on your site
                            </button>
                          </div>
                        </div>

                        {/* Dashboard Page card */}
                        <div
                          className="rounded-xl overflow-hidden"
                          style={{ background: '#f7f8fa', border: '1px solid #e5e8ef' }}
                        >
                          <div className="px-3.5 py-2.5">
                            <h4 className="text-[13px] font-semibold" style={{ color: '#1a1a2e' }}>Dashboard Page</h4>
                            <p className="text-[11px] mt-0.5" style={{ color: '#6b7280' }}>Manage and configure suggestion rules</p>
                          </div>
                          <div className="px-3.5 py-2" style={{ borderTop: '1px solid #e5e8ef', background: '#ffffff' }}>
                            <button
                              onClick={onNavigateToUpsellRules}
                              className="w-full py-1.5 rounded-lg text-[12px] font-semibold text-white transition-colors"
                              style={{ background: '#116dff' }}
                              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#0d5fdb')}
                              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = '#116dff')}
                            >
                              Keep editing
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* ── Stock analytics completion widget ── */
                      <div
                        className="mt-3 rounded-xl overflow-hidden fade-in-up"
                        style={{
                          background: '#f7f8fa',
                          border: '1px solid #e5e8ef',
                        }}
                      >
                        <div className="px-3.5 py-3">
                          <p className="text-[13px] font-medium text-center" style={{ color: '#32325d' }}>
                            Your{' '}
                            <span
                              onClick={onNavigateToDashboard}
                              className="cursor-pointer"
                              style={{ color: '#00b383', textDecoration: 'underline', textUnderlineOffset: 2 }}
                              onMouseEnter={e => ((e.currentTarget as HTMLSpanElement).style.opacity = '0.8')}
                              onMouseLeave={e => ((e.currentTarget as HTMLSpanElement).style.opacity = '1')}
                            >
                              custom dashboard page
                            </span>{' '}
                            is ready!
                          </p>
                          <p className="text-[11px] text-center mt-1" style={{ color: '#6b7280' }}>
                            You can continue editing it in chat and manage it in your custom creations
                          </p>
                        </div>
                        <div
                          className="px-3.5 py-2"
                          style={{ borderTop: '1px solid #e5e8ef', background: '#ffffff' }}
                        >
                          <button
                            onClick={onGoToCreations}
                            className="w-full py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                            style={{
                              color: '#32325d',
                              background: '#ffffff',
                              border: '1.5px solid #d0d5dd',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLButtonElement).style.background = '#f7f8fa';
                              (e.currentTarget as HTMLButtonElement).style.borderColor = '#32325d';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLButtonElement).style.background = '#ffffff';
                              (e.currentTarget as HTMLButtonElement).style.borderColor = '#d0d5dd';
                            }}
                          >
                            View My Creations
                          </button>
                        </div>
                      </div>
                    )
                  )}
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
