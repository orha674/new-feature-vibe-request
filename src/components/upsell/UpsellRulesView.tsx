import { useState } from 'react';
import { Plus, ChevronLeft, Search, Filter, MoreVertical, Tag, Package } from 'lucide-react';
import { useUpsellChat } from './UpsellChatContext';

interface SuggestionRule {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  description: string;
  created: string;
  modified: string;
  triggerEvent: string;
  targetProducts: string;
  customerSegment: string;
  suggestionLogic: {
    type: 'specific' | 'condition';
    value: string;
  };
}

const mockRules: SuggestionRule[] = [
  {
    id: '1',
    name: 'Summer Sale Cross-Sell',
    status: 'active',
    description: 'Suggest complementary products when customers add summer items to cart',
    created: '2024-01-15',
    modified: '2024-02-10',
    triggerEvent: 'Product added to cart',
    targetProducts: 'Summer Collection',
    customerSegment: 'All customers',
    suggestionLogic: { type: 'specific', value: 'Beach Accessories Set' },
  },
  {
    id: '2',
    name: 'VIP Checkout Upsell',
    status: 'active',
    description: 'Show premium alternatives during checkout for VIP customers',
    created: '2024-01-20',
    modified: '2024-02-12',
    triggerEvent: 'Checkout started',
    targetProducts: 'Premium Products',
    customerSegment: 'VIP Members',
    suggestionLogic: { type: 'condition', value: 'Category: Premium, Price > $100' },
  },
  {
    id: '3',
    name: 'New Customer Welcome',
    status: 'inactive',
    description: 'Display popular products to first-time visitors',
    created: '2024-02-01',
    modified: '2024-02-05',
    triggerEvent: 'Product viewed',
    targetProducts: 'Best Sellers',
    customerSegment: 'New customers',
    suggestionLogic: { type: 'condition', value: 'Tag: Bestseller, Rating > 4.5' },
  },
];

interface UpsellRulesViewProps {
  onBack: () => void;
}

export function UpsellRulesView({ onBack }: UpsellRulesViewProps) {
  const { hideCreatedDate } = useUpsellChat();
  const [rules, setRules] = useState<SuggestionRule[]>(mockRules);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleRuleStatus = (id: string) => {
    setRules(prev =>
      prev.map(rule =>
        rule.id === id
          ? { ...rule, status: rule.status === 'active' ? 'inactive' : 'active', modified: new Date().toISOString().split('T')[0] }
          : rule,
      ),
    );
  };

  const filteredRules = rules.filter(rule =>
    rule.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-w-0" style={{ backgroundColor: '#f7f8fa' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex-shrink-0" style={{ backgroundColor: '#ffffff', borderColor: '#e5e8ef' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-8 h-8 rounded transition-colors"
              style={{ backgroundColor: '#f7f8fa' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e5e8ef')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f7f8fa')}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: '#16161d' }} />
            </button>
            <div>
              <h1 className="text-base font-bold" style={{ color: '#16161d' }}>Product Suggestion Rules</h1>
              <p className="text-xs" style={{ color: '#6b7280' }}>Manage your automated product recommendations</p>
            </div>
          </div>
          <button
            className="flex items-center gap-2 px-4 h-9 rounded text-sm font-medium text-white"
            style={{ backgroundColor: '#116dff' }}
          >
            <Plus className="w-4 h-4" />
            <span>New Rule</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 border-b flex items-center gap-3 flex-shrink-0" style={{ backgroundColor: '#ffffff', borderColor: '#e5e8ef' }}>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6b7280' }} />
          <input
            type="text"
            placeholder="Search rules..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded text-sm outline-none"
            style={{ backgroundColor: '#f7f8fa', border: '1px solid #e5e8ef', color: '#16161d' }}
          />
        </div>
        <button
          className="flex items-center gap-2 px-3 h-9 rounded text-sm"
          style={{ backgroundColor: '#f7f8fa', border: '1px solid #e5e8ef', color: '#16161d' }}
        >
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e8ef' }}>
              <p className="text-xs" style={{ color: '#6b7280' }}>Total Rules</p>
              <p className="text-2xl mt-1" style={{ color: '#16161d' }}>{rules.length}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e8ef' }}>
              <p className="text-xs" style={{ color: '#6b7280' }}>Active Rules</p>
              <p className="text-2xl mt-1" style={{ color: '#116dff' }}>{rules.filter(r => r.status === 'active').length}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e8ef' }}>
              <p className="text-xs" style={{ color: '#6b7280' }}>Inactive Rules</p>
              <p className="text-2xl mt-1" style={{ color: '#6b7280' }}>{rules.filter(r => r.status === 'inactive').length}</p>
            </div>
          </div>

          {/* Rules Table */}
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e8ef' }}>
            <div
              className="grid gap-4 px-4 py-3 border-b"
              style={{ gridTemplateColumns: '2fr 0.8fr 1.5fr 1.3fr 1.3fr 1.5fr 1.5fr', backgroundColor: '#f7f8fa', borderColor: '#e5e8ef' }}
            >
              {['Rule Name', 'Status', 'Trigger Event', 'Target Products', 'Customer Segment', 'Suggestion Logic', 'Last Modified'].map(
                col => (
                  <div key={col}>
                    <p className="text-xs" style={{ color: '#6b7280' }}>{col}</p>
                  </div>
                ),
              )}
            </div>

            <div className="divide-y" style={{ borderColor: '#e5e8ef' }}>
              {filteredRules.map(rule => (
                <div
                  key={rule.id}
                  className="grid gap-4 px-4 py-4 transition-colors cursor-pointer"
                  style={{ gridTemplateColumns: '2fr 0.8fr 1.5fr 1.3fr 1.3fr 1.5fr 1.5fr' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f7f8fa')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div>
                    <p className="text-sm" style={{ color: '#16161d' }}>{rule.name}</p>
                    <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{rule.description}</p>
                  </div>
                  <div>
                    <button onClick={e => { e.stopPropagation(); toggleRuleStatus(rule.id); }} className="flex items-center gap-2">
                      <div
                        className="w-9 h-5 rounded-full relative transition-colors"
                        style={{ backgroundColor: rule.status === 'active' ? '#116dff' : '#e5e8ef' }}
                      >
                        <div
                          className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                          style={{ backgroundColor: '#ffffff', left: rule.status === 'active' ? 18 : 2 }}
                        />
                      </div>
                    </button>
                  </div>
                  <div><p className="text-sm" style={{ color: '#16161d' }}>{rule.triggerEvent}</p></div>
                  <div><p className="text-sm" style={{ color: '#16161d' }}>{rule.targetProducts}</p></div>
                  <div><p className="text-sm" style={{ color: '#16161d' }}>{rule.customerSegment}</p></div>
                  <div>
                    <div className="flex items-start gap-2">
                      {rule.suggestionLogic.type === 'specific' ? (
                        <Package className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#116dff' }} />
                      ) : (
                        <Tag className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#116dff' }} />
                      )}
                      <div className="flex-1">
                        <p className="text-xs" style={{ color: '#16161d' }}>{rule.suggestionLogic.value}</p>
                        <p className="text-xs" style={{ color: '#6b7280' }}>
                          {rule.suggestionLogic.type === 'specific' ? 'Specific Product' : 'Condition-Based'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ color: '#16161d' }}>{rule.modified}</p>
                      {!hideCreatedDate && (
                        <p className="text-xs" style={{ color: '#6b7280' }}>Created {rule.created}</p>
                      )}
                    </div>
                    <button
                      className="w-8 h-8 rounded flex items-center justify-center transition-colors"
                      style={{ backgroundColor: '#f7f8fa' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e5e8ef')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f7f8fa')}
                    >
                      <MoreVertical className="w-4 h-4" style={{ color: '#16161d' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredRules.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: '#6b7280' }}>No rules found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
