import React from 'react';

export function TopBar({ onNew, onOpenExercise, exercises }) {
  return (
    <div className="pseint-navbar">
      <div className="pseint-title-bar">
        <div className="pseint-brand">
          <span className="pseint-icon-badge">PSeInt</span>
          <span>Entorno de Aprendizaje de Pseudocódigo — Grado 6°</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#93c5fd' }}>
          Plataforma de Examen Vercel Edition
        </div>
      </div>

      <div className="pseint-menu-bar">
        <div className="pseint-menu-item" onClick={onNew}>
          📄 Nuevo
        </div>
        <div className="pseint-menu-item" onClick={() => alert('Opción de guardado automático activada para el examen.')}>
          💾 Guardar
        </div>
        <div className="pseint-menu-item">
          📁 Abrir Ejercicio ▼
          <select 
            onChange={(e) => {
              if (e.target.value) {
                onOpenExercise(e.target.value);
                e.target.value = '';
              }
            }}
            style={{
              opacity: 0,
              position: 'absolute',
              left: 0,
              width: '100%',
              cursor: 'pointer'
            }}
          >
            <option value="">Seleccionar Ejercicio...</option>
            {exercises.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.title}</option>
            ))}
          </select>
        </div>
        <div className="pseint-menu-item" onClick={() => alert('PSeInt Web v1.0 — Guía de Examen Grado 6°\n\nSintaxis soportada:\n- Definir [vars] Como [Tipo]\n- Leer [variable]\n- Escribir [expresión]\n- Si [condición] Entonces ... Sino ... FinSi\n- Operadores: +, -, *, /, ^, <-, =, <>, <, <=, >, >=, Y, O, NO')}>
          ❓ Ayuda Sintaxis
        </div>
      </div>
    </div>
  );
}
