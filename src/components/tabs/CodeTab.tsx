import React, { useState, useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import css from 'highlight.js/lib/languages/css';
import { Extension, CodeFile } from '../../types';
import { Copy, Check, FileCode } from 'lucide-react';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('css', css);

export default function CodeTab({ extension }: { extension: Extension }) {
  const [selectedFile, setSelectedFile] = useState(extension.codeFiles[0]);

  useEffect(() => { setSelectedFile(extension.codeFiles[0]); }, [extension.id]);

  return (
    <div className="flex flex-col sm:flex-row h-full" style={{ minHeight: 0 }}>
      {/* Mobile dropdown */}
      {extension.codeFiles.length > 1 && (
        <div className="sm:hidden px-3 py-2 border-b shrink-0" style={{ background: '#ffffff', borderColor: '#e5e8ef' }}>
          <select
            value={selectedFile.name}
            onChange={e => { const f = extension.codeFiles.find(f => f.name === e.target.value); if (f) setSelectedFile(f); }}
            className="w-full px-2 py-1.5 rounded-lg text-xs border outline-none"
            style={{ background: '#f7f8fa', color: '#16161d', borderColor: '#e5e8ef' }}
          >
            {extension.codeFiles.map(file => <option key={file.name} value={file.name}>{file.name}</option>)}
          </select>
        </div>
      )}

      {/* Desktop file tree */}
      {extension.codeFiles.length > 1 && (
        <div className="hidden sm:flex w-48 border-r flex-col overflow-y-auto shrink-0" style={{ background: '#ffffff', borderColor: '#e5e8ef' }}>
          <p className="px-3 py-2 text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#9098a9' }}>Files</p>
          {extension.codeFiles.map(file => (
            <button
              key={file.name}
              onClick={() => setSelectedFile(file)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors"
              style={{
                background: selectedFile.name === file.name ? '#e8f1fe' : 'transparent',
                color: selectedFile.name === file.name ? '#116dff' : '#32325d',
              }}
              onMouseEnter={e => { if (selectedFile.name !== file.name) (e.currentTarget as HTMLElement).style.background = '#f7f8fa'; }}
              onMouseLeave={e => { if (selectedFile.name !== file.name) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <FileCode size={12} style={{ opacity: 0.7 }} />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Code viewer */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <CodeViewer file={selectedFile} />
      </div>
    </div>
  );
}

function CodeViewer({ file }: { file: CodeFile }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute('data-highlighted');
      hljs.highlightElement(codeRef.current);
    }
  }, [file]);

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const lines = file.content.split('\n');

  return (
    <>
      {/* File header — light */}
      <div className="flex items-center justify-between px-4 py-2 border-b shrink-0" style={{ background: '#ffffff', borderColor: '#e5e8ef' }}>
        <div className="flex items-center gap-2">
          <FileCode size={13} style={{ color: '#9098a9' }} />
          <span className="text-xs font-mono font-semibold" style={{ color: '#16161d' }}>{file.name}</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold" style={{ background: '#f0f0f5', color: '#6b7280' }}>
            {file.language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
          style={{ background: copied ? '#e6f9f4' : '#f0f0f5', color: copied ? '#00b383' : '#6b7280' }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code area — keep dark (expected for code editor) */}
      <div className="flex-1 overflow-auto" style={{ background: '#1e1e1e' }}>
        <div className="flex min-w-max">
          <div className="select-none text-right px-4 py-4 text-xs font-mono" style={{ color: '#404040', lineHeight: '1.6', userSelect: 'none', minWidth: 48 }}>
            {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <div className="flex-1 py-4 pr-8 overflow-hidden">
            <pre className="text-xs font-mono m-0" style={{ lineHeight: 1.6 }}>
              <code ref={codeRef} className={`language-${file.language}`} style={{ background: 'transparent', padding: 0 }}>
                {file.content}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
