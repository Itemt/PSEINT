import React, { useState, useRef, useEffect } from 'react';

export function Console({ 
  consoleLogs, 
  waitingForInput, 
  inputVarName, 
  onSubmitInput, 
  onRun, 
  onEvaluate,
  onStop, 
  onClear, 
  isRunning,
  evalResult
}) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const consoleBodyRef = useRef(null);

  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [waitingForInput]);

  useEffect(() => {
    if (consoleBodyRef.current) {
      consoleBodyRef.current.scrollTop = consoleBodyRef.current.scrollHeight;
    }
  }, [consoleLogs, waitingForInput, evalResult]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!waitingForInput) return;
    onSubmitInput(inputValue);
    setInputValue('');
  };

  return (
    <div className="pseint-console-panel">
      {/* Console Header Bar */}
      <div className="console-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>💻 Ventana de Ejecución y Evaluación PSeInt</span>
          {isRunning && (
            <span style={{ color: '#38bdf8', fontSize: '0.75rem' }}>● Ejecutando...</span>
          )}
          {waitingForInput && (
            <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 'bold' }}>
              ⏳ Esperando entrada ({inputVarName})...
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {!isRunning ? (
            <button 
              onClick={onRun} 
              style={{ background: '#16a34a', color: 'white', border: 'none', padding: '3px 10px', borderRadius: 4, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 'bold' }}
            >
              ▶ Ejecutar
            </button>
          ) : (
            <button 
              onClick={onStop} 
              style={{ background: '#dc2626', color: 'white', border: 'none', padding: '3px 10px', borderRadius: 4, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 'bold' }}
            >
              ⏹ Detener
            </button>
          )}

          <button 
            onClick={onEvaluate} 
            style={{ background: '#2563eb', color: 'white', border: 'none', padding: '3px 10px', borderRadius: 4, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 'bold' }}
            title="Evaluar código contra casos de prueba del desafío"
          >
            🧪 Comprobar Código
          </button>

          <button 
            onClick={onClear} 
            style={{ background: '#475569', color: 'white', border: 'none', padding: '3px 10px', borderRadius: 4, cursor: 'pointer', fontSize: '0.78rem' }}
          >
            🧹 Limpiar
          </button>
        </div>
      </div>

      {/* Console Output Body */}
      <div className="console-body" ref={consoleBodyRef}>
        {/* Automated Multi-Case Evaluation Results */}
        {evalResult && (
          <div style={{
            margin: '0 0 12px 0',
            padding: '12px 14px',
            borderRadius: 6,
            backgroundColor: evalResult.success ? '#064e3b' : '#451a03',
            border: `1px solid ${evalResult.success ? '#10b981' : '#f59e0b'}`,
            color: '#ffffff',
            fontFamily: 'sans-serif',
            fontSize: '0.85rem'
          }}>
            <div style={{ 
              fontWeight: 800, 
              fontSize: '0.95rem', 
              marginBottom: 6, 
              color: evalResult.success ? '#34d399' : '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>{evalResult.success ? '✅ ¡Desafío Superado!' : '⚠️ Evaluación del Algoritmo'}</span>
              {evalResult.totalTests && (
                <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 4 }}>
                  Pruebas pasadas: {evalResult.passedCount} / {evalResult.totalTests}
                </span>
              )}
            </div>

            <p style={{ margin: '0 0 6px 0', lineHeight: 1.4, fontWeight: 600 }}>
              {evalResult.message || evalResult.error}
            </p>

            {evalResult.details && (
              <div style={{
                marginTop: 6,
                fontSize: '0.82rem',
                color: '#fef08a',
                background: 'rgba(0,0,0,0.25)',
                padding: '6px 10px',
                borderRadius: 4,
                fontWeight: 600
              }}>
                {evalResult.details}
              </div>
            )}

            {/* Test Cases Results List */}
            {evalResult.results && evalResult.results.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, color: '#94a3b8', fontWeight: 700 }}>
                  Desglose de Casos de Prueba:
                </span>
                {evalResult.results.map((res, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: res.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    borderLeft: `3px solid ${res.passed ? '#10b981' : '#ef4444'}`,
                    padding: '4px 8px',
                    borderRadius: 3,
                    fontSize: '0.78rem',
                    fontFamily: 'monospace'
                  }}>
                    <span>
                      {res.passed ? '✓' : '✗'} Prueba {res.testIndex}: [{res.inputs ? res.inputs.join(', ') : ''}]
                    </span>
                    <span style={{ color: res.passed ? '#6ee7b7' : '#fca5a5' }}>
                      {res.passed ? 'Pasó correctamente' : `Esperaba: "${res.expected}" | Obtuvo: "${res.actual}"`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {consoleLogs.length === 0 && !waitingForInput && !evalResult && (
          <div style={{ color: '#64748b', fontStyle: 'italic' }}>
            Haz clic en "▶ Ejecutar" para probar interactiva o "🧪 Comprobar Código" para evaluar casos de prueba.
          </div>
        )}

        {consoleLogs.map((log, index) => (
          <div key={index} className={`console-line ${log.type}`}>
            {log.text}
          </div>
        ))}

        {waitingForInput && (
          <form className="console-input-row" onSubmit={handleSubmit}>
            <span className="console-prompt-symbol">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              className="console-input-field"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ingresa el valor para "${inputVarName}" y presiona Enter...`}
            />
            <button type="submit" className="console-submit-btn">
              Enviar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
