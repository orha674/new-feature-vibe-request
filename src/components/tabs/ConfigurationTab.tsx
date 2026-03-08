import React, { useState } from 'react';
import { Extension, ConfigField } from '../../types';
import { Save, X, Plus } from 'lucide-react';

interface ConfigurationTabProps {
  extension: Extension;
}

export default function ConfigurationTab({ extension }: ConfigurationTabProps) {
  const [localConfig, setLocalConfig] = useState<Record<string, ConfigField['value']>>(
    Object.fromEntries(extension.configFields.map(f => [f.id, f.value]))
  );
  const [saved, setSaved] = useState(false);

  const update = (id: string, value: ConfigField['value']) => {
    setLocalConfig(prev => ({ ...prev, [id]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-sm font-bold" style={{ color: '#16161d' }}>Configuration</h3>
          <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
            Manage settings for this {extension.type} extension
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          style={{
            background: saved ? '#e6f9f4' : '#116dff',
            color: saved ? '#00b383' : '#fff',
          }}
        >
          <Save size={12} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {extension.configFields.map(field => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={localConfig[field.id]}
            onChange={val => update(field.id, val)}
          />
        ))}
      </div>
    </div>
  );
}

function FieldRenderer({ field, value, onChange }: { field: ConfigField; value: ConfigField['value']; onChange: (val: ConfigField['value']) => void }) {
  const inputBase = {
    background: '#ffffff',
    color: '#16161d',
    borderColor: '#e5e8ef',
  };

  return (
    <div className="rounded-xl p-4 border" style={{ background: '#ffffff', borderColor: '#e5e8ef' }}>
      <label className="block mb-1 text-xs font-semibold" style={{ color: '#16161d' }}>
        {field.label}
      </label>
      {field.description && (
        <p className="text-[11px] mb-2" style={{ color: '#6b7280' }}>{field.description}</p>
      )}

      {field.type === 'text' && (
        <input
          type="text"
          value={value as string}
          placeholder={field.placeholder}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
          style={inputBase}
          onFocus={e => { e.target.style.borderColor = '#116dff'; e.target.style.boxShadow = '0 0 0 3px rgba(17,109,255,0.1)'; }}
          onBlur={e => { e.target.style.borderColor = '#e5e8ef'; e.target.style.boxShadow = 'none'; }}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          value={value as string}
          placeholder={field.placeholder}
          onChange={e => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-y"
          style={inputBase}
          onFocus={e => { e.target.style.borderColor = '#116dff'; e.target.style.boxShadow = '0 0 0 3px rgba(17,109,255,0.1)'; }}
          onBlur={e => { e.target.style.borderColor = '#e5e8ef'; e.target.style.boxShadow = 'none'; }}
        />
      )}

      {field.type === 'code' && (
        <textarea
          value={value as string}
          placeholder={field.placeholder}
          onChange={e => onChange(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-y font-mono"
          style={{ background: '#1e1e1e', color: '#9cdcfe', borderColor: '#3e3e42', fontSize: 12 }}
          onFocus={e => (e.target.style.borderColor = '#116dff')}
          onBlur={e => (e.target.style.borderColor = '#3e3e42')}
        />
      )}

      {field.type === 'select' && field.options && (
        <select
          value={value as string}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm border outline-none appearance-none"
          style={inputBase}
          onFocus={e => { e.target.style.borderColor = '#116dff'; }}
          onBlur={e => { e.target.style.borderColor = '#e5e8ef'; }}
        >
          {field.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {field.type === 'toggle' && (
        <button
          onClick={() => onChange(!value)}
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: '#16161d' }}
        >
          <span
            className="relative inline-flex items-center w-10 h-5 rounded-full transition-colors"
            style={{ background: value ? '#116dff' : '#e5e8ef' }}
          >
            <span
              className="absolute w-4 h-4 rounded-full bg-white shadow transition-transform"
              style={{ transform: value ? 'translateX(22px)' : 'translateX(2px)' }}
            />
          </span>
          {value ? 'Enabled' : 'Disabled'}
        </button>
      )}

      {field.type === 'number' && (
        <input
          type="number"
          value={value as number}
          placeholder={field.placeholder}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full sm:w-32 px-3 py-2 rounded-lg text-sm border outline-none"
          style={inputBase}
          onFocus={e => { e.target.style.borderColor = '#116dff'; e.target.style.boxShadow = '0 0 0 3px rgba(17,109,255,0.1)'; }}
          onBlur={e => { e.target.style.borderColor = '#e5e8ef'; e.target.style.boxShadow = 'none'; }}
        />
      )}

      {field.type === 'tags' && (
        <TagInput value={value as string[]} onChange={vals => onChange(vals)} placeholder={field.placeholder} />
      )}
    </div>
  );
}

function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (tags: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) { onChange([...value, trimmed]); setInput(''); }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#e8f1fe', color: '#116dff' }}>
            {tag}
            <button onClick={() => onChange(value.filter(t => t !== tag))} className="hover:text-red-500"><X size={10} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          placeholder={placeholder || 'Add tag…'}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
          className="flex-1 px-3 py-1.5 rounded-lg text-sm border outline-none"
          style={{ background: '#ffffff', color: '#16161d', borderColor: '#e5e8ef' }}
          onFocus={e => { e.target.style.borderColor = '#116dff'; e.target.style.boxShadow = '0 0 0 3px rgba(17,109,255,0.1)'; }}
          onBlur={e => { e.target.style.borderColor = '#e5e8ef'; e.target.style.boxShadow = 'none'; }}
        />
        <button onClick={addTag} className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ background: '#f0f0f5', color: '#32325d' }}>
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
