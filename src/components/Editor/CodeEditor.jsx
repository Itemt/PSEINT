import React, { useRef, useState } from 'react';

const PSEINT_KEYWORDS_SET = new Set([
  'ALGORITMO',
  'FINALGORITMO',
  'PROCESO',
  'FINPROCESO',
  'DEFINIR',
  'COMO',
  'LEER',
  'ESCRIBIR',
  'SI',
  'ENTONCES',
  'SINO',
  'FINSI',
  'VERDADERO',
  'FALSO'
]);

const PSEINT_TYPES_SET = new Set(['ENTERO', 'REAL', 'CARACTER', 'CADENA', 'TEXTO', 'LOGICO']);

const PSEINT_ALL_SUGGESTIONS = [
  'Algoritmo',
  'FinAlgoritmo',
  'Definir',
  'Como',
  'Entero',
  'Real',
  'Caracter',
  'Logico',
  'Leer',
  'Escribir',
  'Si',
  'Entonces',
  'Sino',
  'FinSi',
  'Proceso',
  'FinProceso',
  'Verdadero',
  'Falso'
];

const DATA_TYPES = ['Entero', 'Real', 'Caracter', 'Logico'];

// Shared font family for 100% pixel-perfect alignment between backdrop and textarea
const SHARED_FONT_FAMILY = "'Consolas', 'Courier New', Courier, monospace";
const SHARED_PADDING = "10px";

// Utility to check if cursor is inside quotes ("..." or '...')
function isInsideQuotes(textBeforeCursor) {
  const lastNewline = textBeforeCursor.lastIndexOf('\n');
  const currentLineText = lastNewline >= 0 ? textBeforeCursor.substring(lastNewline + 1) : textBeforeCursor;
  
  let inDouble = false;
  let inSingle = false;

  for (let i = 0; i < currentLineText.length; i++) {
    const ch = currentLineText[i];
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
    } else if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
    }
  }

  return inDouble || inSingle;
}

// Extract clean variable names declared in code line-by-line
function getDeclaredVars(text) {
  const vars = new Set();
  const codeLines = text.split('\n');

  for (const line of codeLines) {
    const match = line.match(/^\s*Definir\s+(.+?)\s+Como/i);
    if (match && match[1]) {
      const varsList = match[1].split(',');
      for (const v of varsList) {
        const trimmed = v.trim();
        if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
          vars.add(trimmed);
        }
      }
    }
  }

  return Array.from(vars);
}

// Generate PSeInt Syntax Highlighting HTML as a SINGLE unbroken text string with \n
function getSyntaxHighlightedHtml(codeText) {
  const lines = codeText.split('\n');

  const highlightedLines = lines.map((lineText) => {
    let highlightedLine = '';
    let i = 0;
    const len = lineText.length;

    while (i < len) {
      const ch = lineText[i];

      // 1. Line Comment //
      if (ch === '/' && i + 1 < len && lineText[i + 1] === '/') {
        const commentText = lineText.substring(i);
        highlightedLine += `<span style="color: #6b7280; font-style: italic;">${escapeHtml(commentText)}</span>`;
        break;
      }

      // 2. Strings "..." or '...' (RED COLOR IN PSEINT)
      if (ch === '"' || ch === "'") {
        const quoteChar = ch;
        let strVal = quoteChar;
        i++;
        while (i < len) {
          const curr = lineText[i];
          strVal += curr;
          i++;
          if (curr === quoteChar) break;
        }
        highlightedLine += `<span style="color: #b91c1c; font-weight: 600;">${escapeHtml(strVal)}</span>`;
        continue;
      }

      // 3. Numbers
      if (/[0-9]/.test(ch)) {
        let numStr = '';
        while (i < len && /[0-9\.]/.test(lineText[i])) {
          numStr += lineText[i];
          i++;
        }
        highlightedLine += `<span style="color: #7c3aed; font-weight: 600;">${escapeHtml(numStr)}</span>`;
        continue;
      }

      // 4. Identifiers & Keywords
      if (/[a-zA-ZáéíóúÁÉÍÓÚñÑ_]/.test(ch)) {
        let idStr = '';
        while (i < len && /[a-zA-ZáéíóúÁÉÍÓÚñÑ_0-9]/.test(lineText[i])) {
          idStr += lineText[i];
          i++;
        }
        const upper = idStr.toUpperCase();
        if (PSEINT_KEYWORDS_SET.has(upper)) {
          // Blue Keywords
          highlightedLine += `<span style="color: #1d4ed8; font-weight: 800;">${escapeHtml(idStr)}</span>`;
        } else if (PSEINT_TYPES_SET.has(upper)) {
          // Teal Data Types
          highlightedLine += `<span style="color: #0d9488; font-weight: 800;">${escapeHtml(idStr)}</span>`;
        } else {
          // Identifiers / Variables
          highlightedLine += `<span style="color: #0f172a;">${escapeHtml(idStr)}</span>`;
        }
        continue;
      }

      // 5. Operators <- = + - * / > <
      if (['<', '-', '>', '=', '+', '*', '/', '^', ',', ';', '(', ')'].includes(ch)) {
        highlightedLine += `<span style="color: #475569; font-weight: 700;">${escapeHtml(ch)}</span>`;
        i++;
        continue;
      }

      // Default characters
      highlightedLine += escapeHtml(ch);
      i++;
    }

    return highlightedLine;
  });

  return highlightedLines.join('\n');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function CodeEditor({ 
  code, 
  setCode, 
  onRun, 
  onEvaluate,
  onStop, 
  isRunning, 
  textareaRef,
  history,
  setHistory,
  historyIndex,
  setHistoryIndex
}) {
  const lineNumbersRef = useRef(null);
  const highlightBackdropRef = useRef(null);

  // Zoom State
  const [fontSize, setFontSize] = useState(14); // in px

  // Autocomplete State
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [currentWordInfo, setCurrentWordInfo] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 40, left: 60 });

  // Live Indentation Suggestion State
  const [unindentedLineIndex, setUnindentedLineIndex] = useState(null);

  const lines = code.split('\n');
  const lineCount = lines.length;

  const checkLiveIndentation = (codeText) => {
    const codeLines = codeText.split('\n');
    let inBlock = false;
    let foundUnindented = null;

    for (let idx = 0; idx < codeLines.length; idx++) {
      const line = codeLines[idx];
      const trimmed = line.trim();

      if (/^(algoritmo|proceso|si|sino)\b/i.test(trimmed)) {
        inBlock = true;
        if (/^(finalgoritmo|finproceso|finsi)\b/i.test(trimmed)) {
          inBlock = false;
        }
        continue;
      }

      if (/^(finalgoritmo|finproceso|finsi)\b/i.test(trimmed)) {
        inBlock = false;
        continue;
      }

      if (inBlock && trimmed.length > 0 && !line.startsWith(' ') && !line.startsWith('\t')) {
        foundUnindented = idx + 1; // 1-indexed line number
        break;
      }
    }

    setUnindentedLineIndex(foundUnindented);
  };

  const handleTextChange = (newCode) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCode);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCode(newCode);
    checkLiveIndentation(newCode);
  };

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
    if (highlightBackdropRef.current) {
      highlightBackdropRef.current.scrollTop = e.target.scrollTop;
      highlightBackdropRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  // Calculate position & suggestions (Context Aware like PSeInt Desktop)
  const updateAutocomplete = (target) => {
    if (!target) return;
    const pos = target.selectionStart;
    const val = target.value;
    const textBeforeCursor = val.substring(0, pos);

    // CRITICAL: If inside quotes ("..." or '...'), DO NOT show suggestions!
    if (isInsideQuotes(textBeforeCursor)) {
      setSuggestions([]);
      setCurrentWordInfo(null);
      return;
    }

    const linesBefore = textBeforeCursor.split('\n');
    const currentLine = linesBefore[linesBefore.length - 1];
    const lineNumber = linesBefore.length - 1;
    const currentColumn = currentLine.length;

    const lineHeight = fontSize * 1.5;
    const topPos = Math.max(10, lineNumber * lineHeight + 35 - target.scrollTop);
    const leftPos = Math.min(Math.max(40, currentColumn * (fontSize * 0.55)), 420);

    const declaredVars = getDeclaredVars(val);

    // 1. CONTEXT: If after "Leer " or "leer " -> Prioritize declared variables
    if (/^\s*leer\s+[a-zA-Z_0-9]*$/i.test(currentLine)) {
      const matchVar = currentLine.match(/leer\s+([a-zA-Z_0-9]*)$/i);
      const typedPart = matchVar ? matchVar[1] : '';

      const matchedVars = declaredVars.filter(v => 
        v.toLowerCase().startsWith(typedPart.toLowerCase()) && v.toLowerCase() !== typedPart.toLowerCase()
      );

      if (matchedVars.length > 0) {
        setPopupPosition({ top: topPos, left: leftPos });
        setSuggestions(matchedVars);
        setSelectedSuggestionIndex(0);
        setCurrentWordInfo({ 
          word: typedPart, 
          start: pos - typedPart.length, 
          end: pos 
        });
        return;
      }
    }

    // 2. CONTEXT: If after "Como " or "como " -> Show Data Types
    if (/como\s+[a-zA-Z]*$/i.test(currentLine)) {
      const matchWord = currentLine.match(/como\s+([a-zA-Z]*)$/i);
      const typedPart = matchWord ? matchWord[1] : '';

      const exactMatch = DATA_TYPES.some(t => t.toLowerCase() === typedPart.toLowerCase());
      if (exactMatch) {
        setSuggestions([]);
        setCurrentWordInfo(null);
        return;
      }

      const matchedTypes = DATA_TYPES.filter(t => 
        t.toLowerCase().startsWith(typedPart.toLowerCase()) && t.toLowerCase() !== typedPart.toLowerCase()
      );

      if (matchedTypes.length > 0) {
        setPopupPosition({ top: topPos, left: leftPos });
        setSuggestions(matchedTypes);
        setSelectedSuggestionIndex(0);
        setCurrentWordInfo({ 
          word: typedPart, 
          start: pos - typedPart.length, 
          end: pos 
        });
        return;
      }
    }

    // 3. GENERAL WORD MATCHING (1+ chars)
    let start = pos - 1;
    while (start >= 0 && /[a-zA-ZáéíóúÁÉÍÓÚñÑ_0-9]/.test(val[start])) {
      start--;
    }
    start++;

    const word = val.substring(start, pos);

    if (word.length >= 1) {
      const combinedPool = Array.from(new Set([...declaredVars, ...PSEINT_ALL_SUGGESTIONS]));

      const exactMatch = combinedPool.some(item => item.toLowerCase() === word.toLowerCase());
      if (exactMatch) {
        setSuggestions([]);
        setCurrentWordInfo(null);
        return;
      }

      const matches = combinedPool.filter(item => 
        item.toLowerCase().startsWith(word.toLowerCase()) && item.toLowerCase() !== word.toLowerCase()
      );

      if (matches.length > 0) {
        setPopupPosition({ top: topPos, left: leftPos });
        setSuggestions(matches);
        setSelectedSuggestionIndex(0);
        setCurrentWordInfo({ word, start, end: pos });
        return;
      }
    }

    setSuggestions([]);
    setCurrentWordInfo(null);
  };

  const applySuggestion = (suggestionText) => {
    if (!currentWordInfo || !textareaRef.current) return;
    const { start, end } = currentWordInfo;
    const target = textareaRef.current;
    const val = target.value;

    let insertion = suggestionText;
    let cursorOffset = suggestionText.length;

    // PSeInt Snippet Template Expansion WITHOUT comments/instructions (clean single spaces only)
    const upperSug = suggestionText.toUpperCase();
    if (upperSug === 'SI') {
      insertion = 'Si  Entonces\n        \n    Sino\n        \n    FinSi';
      cursorOffset = 'Si '.length; // 3 chars -> puts cursor right between "Si " and "Entonces"
    } else if (upperSug === 'ALGORITMO' || upperSug === 'PROCESO') {
      insertion = 'Algoritmo \n    \nFinAlgoritmo';
      cursorOffset = 'Algoritmo '.length;
    } else if (upperSug === 'DEFINIR') {
      insertion = 'Definir ';
      cursorOffset = 'Definir '.length;
    }

    const newCode = val.substring(0, start) + insertion + val.substring(end);
    
    // Clear suggestions immediately to avoid keyup interference
    setSuggestions([]);
    setCurrentWordInfo(null);

    handleTextChange(newCode);

    const newPos = start + cursorOffset;
    target.focus();
    target.selectionStart = target.selectionEnd = newPos;

    setTimeout(() => {
      target.focus();
      target.selectionStart = target.selectionEnd = newPos;
    }, 10);
  };

  const handleKeyDown = (e) => {
    // Both Enter and Tab apply autocompletion suggestion when popup menu is open
    if ((e.key === 'Enter' || e.key === 'Tab') && suggestions.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
        e.nativeEvent.stopImmediatePropagation();
      }
      applySuggestion(suggestions[selectedSuggestionIndex]);
      return;
    }

    if (e.key === 'Enter') {
      setSuggestions([]);
      setCurrentWordInfo(null);

      // Smart Auto-Indentation on Enter
      const target = textareaRef.current;
      if (target) {
        const start = target.selectionStart;
        const val = target.value;
        const textBeforeCursor = val.substring(0, start);
        const currentLine = textBeforeCursor.split('\n').pop() || '';

        // Preserve previous line indentation, or add 4 spaces after block starters
        const indentMatch = currentLine.match(/^(\s*)/);
        let indent = indentMatch ? indentMatch[1] : '';

        if (/^(algoritmo|proceso|si|sino)\b/i.test(currentLine.trim())) {
          indent += '    ';
        }

        if (indent.length > 0) {
          e.preventDefault();
          const newCode = val.substring(0, start) + '\n' + indent + val.substring(start);
          handleTextChange(newCode);
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = start + 1 + indent.length;
          }, 0);
          return;
        }
      }
    }

    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Escape') {
        setSuggestions([]);
        setCurrentWordInfo(null);
        return;
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const target = textareaRef.current;
      if (!target) return;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      const updated = val.substring(0, start) + '    ' + val.substring(end);
      handleTextChange(updated);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleFixIndentation = () => {
    const codeLines = code.split('\n');
    let inBlock = false;
    const indented = codeLines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (/^(algoritmo|proceso)\b/i.test(trimmed)) {
        inBlock = true;
        return trimmed;
      }
      if (/^(finalgoritmo|finproceso)\b/i.test(trimmed)) {
        inBlock = false;
        return trimmed;
      }
      if (/^(finsi)\b/i.test(trimmed)) {
        return '    ' + trimmed;
      }
      if (/^(si|sino)\b/i.test(trimmed)) {
        return '    ' + trimmed;
      }
      if (inBlock) {
        return '    ' + trimmed;
      }
      return trimmed;
    });

    handleTextChange(indented.join('\n'));
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setCode(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setCode(history[nextIdx]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Código copiado al portapapeles.');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleTextChange(code + '\n' + text);
      }
    } catch {
      alert('Utiliza Ctrl+V / Cmd+V para pegar en el editor.');
    }
  };

  const handleZoomIn = () => {
    if (fontSize < 24) setFontSize(prev => prev + 2);
  };

  const handleZoomOut = () => {
    if (fontSize > 11) setFontSize(prev => prev - 2);
  };

  const handleZoomReset = () => {
    setFontSize(14);
  };

  return (
    <div className="pseint-main-area">
      {/* Editor Action Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-group">
          {!isRunning ? (
            <button className="tb-btn tb-btn-primary" onClick={onRun}>
              ▶ Ejecutar
            </button>
          ) : (
            <button className="tb-btn tb-btn-stop" onClick={onStop}>
              ⏹ Detener
            </button>
          )}

          <button className="tb-btn" onClick={onEvaluate} style={{ background: '#2563eb', color: 'white', borderColor: '#1d4ed8' }}>
            🧪 Comprobar Código
          </button>

          <div style={{ width: 1, height: 20, background: '#cbd5e1', margin: '0 4px' }} />

          <button className="tb-btn" onClick={handleUndo} disabled={historyIndex <= 0}>
            ↩ Deshacer
          </button>
          <button className="tb-btn" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
            ↪ Rehacer
          </button>

          <div style={{ width: 1, height: 20, background: '#cbd5e1', margin: '0 4px' }} />

          <button className="tb-btn" onClick={handleCopy}>
            📋 Copiar
          </button>
          <button className="tb-btn" onClick={handlePaste}>
            📌 Pegar
          </button>
        </div>

        {/* Live Indentation Warning Badge & Zoom Controls */}
        <div className="toolbar-group">
          {unindentedLineIndex ? (
            <button 
              onClick={handleFixIndentation}
              style={{
                fontSize: '0.78rem',
                color: '#b45309',
                background: '#fef3c7',
                border: '1px solid #fde68a',
                padding: '3px 10px',
                borderRadius: 5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
              title="Haz clic para indentar automáticamente con Tab"
            >
              💡 Línea {unindentedLineIndex} sin indentar — [Click para Indentar ✨]
            </button>
          ) : (
            <span style={{ fontSize: '0.76rem', color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
              ✓ Indentación correcta [Tab]
            </span>
          )}

          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginLeft: 6, marginRight: 2 }}>Zoom:</span>
          <button className="tb-btn" onClick={handleZoomOut} title="Reducir tamaño de letra">
            🔍−
          </button>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: 32, textAlign: 'center' }}>
            {fontSize}px
          </span>
          <button className="tb-btn" onClick={handleZoomIn} title="Aumentar tamaño de letra">
            🔍+
          </button>
          <button className="tb-btn" onClick={handleZoomReset} title="Restablecer tamaño">
            100%
          </button>
        </div>
      </div>

      {/* Code Editor Main Container */}
      <div className="editor-container">
        <div 
          className="line-numbers" 
          ref={lineNumbersRef}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.5 }}
        >
          {Array.from({ length: Math.max(1, lineCount) }).map((_, i) => (
            <div 
              key={i} 
              style={{ 
                color: unindentedLineIndex === (i + 1) ? '#d97706' : undefined,
                fontWeight: unindentedLineIndex === (i + 1) ? 800 : undefined 
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div className="editor-textarea-wrapper">
          {/* Backdrop Syntax Highlighting Layer as a single unbroken PRE element matching TEXTAREA */}
          <pre 
            ref={highlightBackdropRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: 0,
              border: 'none',
              padding: SHARED_PADDING,
              fontFamily: SHARED_FONT_FAMILY,
              fontSize: `${fontSize}px`,
              lineHeight: 1.5,
              letterSpacing: 'normal',
              whiteSpace: 'pre',
              overflow: 'hidden',
              pointerEvents: 'none',
              boxSizing: 'border-box',
              tabSize: 4,
              MozTabSize: 4
            }}
            dangerouslySetInnerHTML={{ __html: getSyntaxHighlightedHtml(code) + '<br/>' }}
          />

          {/* Foreground Transparent Textarea for User Input */}
          <textarea
            ref={textareaRef}
            className="code-textarea"
            value={code}
            onChange={(e) => {
              handleTextChange(e.target.value);
              updateAutocomplete(e.target);
            }}
            onKeyUp={(e) => {
              if (e.key !== 'Enter' && e.key !== 'Tab' && e.key !== 'Escape') {
                updateAutocomplete(e.target);
              }
            }}
            onClick={(e) => updateAutocomplete(e.target)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu algoritmo PSeInt aquí..."
            spellCheck="false"
            style={{ 
              fontFamily: SHARED_FONT_FAMILY,
              fontSize: `${fontSize}px`, 
              lineHeight: 1.5,
              letterSpacing: 'normal',
              padding: SHARED_PADDING,
              color: 'transparent',
              caretColor: '#000000',
              backgroundColor: 'transparent',
              zIndex: 2,
              boxSizing: 'border-box',
              tabSize: 4,
              MozTabSize: 4
            }}
          />

          {/* Autocomplete Popup Box Floating Right Over Words */}
          {suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: popupPosition.top,
              left: popupPosition.left,
              zIndex: 100,
              backgroundColor: '#ffffff',
              border: '2px solid #2563eb',
              borderRadius: 6,
              boxShadow: '0 10px 20px rgba(0,0,0,0.25)',
              minWidth: 160,
              maxHeight: 180,
              overflowY: 'auto'
            }}>
              <div style={{
                backgroundColor: '#eff6ff',
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#1d4ed8',
                borderBottom: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>💡 Variables / PSeInt</span>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Tab/Enter</span>
              </div>
              {suggestions.map((sug, idx) => (
                <div
                  key={sug}
                  onClick={() => applySuggestion(sug)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    backgroundColor: idx === selectedSuggestionIndex ? '#2563eb' : '#ffffff',
                    color: idx === selectedSuggestionIndex ? '#ffffff' : '#1e293b'
                  }}
                >
                  {sug}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
