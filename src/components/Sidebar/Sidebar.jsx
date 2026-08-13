import React from 'react';

export function Sidebar({ onInsertSnippet }) {
  const commands = [
    { label: 'Definir', snippet: '    Definir \n', tag: 'VAR' },
    { label: 'Leer', snippet: '    Leer \n', tag: 'IN' },
    { label: 'Escribir', snippet: '    Escribir \n', tag: 'OUT' },
    { 
      label: 'Si - Entonces', 
      snippet: '    Si  Entonces\n        \n    FinSi\n', 
      tag: 'IF' 
    },
    { 
      label: 'Si - Sino', 
      snippet: '    Si  Entonces\n        \n    Sino\n        \n    FinSi\n', 
      tag: 'IF-ELSE' 
    }
  ];

  const operators = [
    { label: '<-', value: ' <- ' },
    { label: '+', value: ' + ' },
    { label: '-', value: ' - ' },
    { label: '*', value: ' * ' },
    { label: '/', value: ' / ' },
    { label: '^', value: ' ^ ' },
    { label: '=', value: ' = ' },
    { label: '<>', value: ' <> ' },
    { label: '>', value: ' > ' },
    { label: '<', value: ' < ' },
    { label: '>=', value: ' >= ' },
    { label: '<=', value: ' <= ' },
    { label: 'Y', value: ' Y ' },
    { label: 'O', value: ' O ' },
    { label: 'NO', value: ' NO ' }
  ];

  const handleClick = (e, snippet) => {
    e.preventDefault();
    e.stopPropagation();
    onInsertSnippet(snippet);
  };

  return (
    <div className="pseint-sidebar">
      <div className="sidebar-section-title">Comandos PSeInt</div>
      <div className="sidebar-btn-grid">
        {commands.map((cmd, idx) => (
          <button 
            type="button"
            key={idx} 
            className="pseint-cmd-btn"
            onClick={(e) => handleClick(e, cmd.snippet)}
            title={`Insertar estructura ${cmd.label}`}
          >
            <span className="cmd-tag">{cmd.tag}</span>
            <span>{cmd.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-section-title">Operadores</div>
      <div className="op-grid">
        {operators.map((op, idx) => (
          <button 
            type="button"
            key={idx} 
            className="op-btn"
            onClick={(e) => handleClick(e, op.value)}
            title={`Insertar operador ${op.label}`}
          >
            {op.label}
          </button>
        ))}
      </div>

      <div className="sidebar-section-title">Tipos de Datos</div>
      <div className="sidebar-btn-grid">
        <button type="button" className="pseint-cmd-btn" onClick={(e) => handleClick(e, 'Entero')}>
          <span className="cmd-tag">123</span> Entero
        </button>
        <button type="button" className="pseint-cmd-btn" onClick={(e) => handleClick(e, 'Real')}>
          <span className="cmd-tag">3.14</span> Real
        </button>
        <button type="button" className="pseint-cmd-btn" onClick={(e) => handleClick(e, 'Caracter')}>
          <span className="cmd-tag">"abc"</span> Caracter
        </button>
        <button type="button" className="pseint-cmd-btn" onClick={(e) => handleClick(e, 'Logico')}>
          <span className="cmd-tag">V/F</span> Logico
        </button>
      </div>
    </div>
  );
}
