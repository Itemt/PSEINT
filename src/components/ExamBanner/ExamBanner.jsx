import React from 'react';

export function ExamBanner({ 
  assignedExercises, 
  activeExamIndex, 
  onSelectExerciseTab, 
  onGenerateNewRandom 
}) {
  if (!assignedExercises || assignedExercises.length < 2) return null;

  const currentExercise = assignedExercises[activeExamIndex];

  return (
    <div style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
      <div className="exam-banner-bar">
        <div className="exam-tabs-group">
          <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1e3a8a' }}>
            📝 Examen Asignado (2 Ejercicios al Azar):
          </span>
          {assignedExercises.map((ex, idx) => (
            <button
              key={ex.id || idx}
              className={`exam-tab-btn ${activeExamIndex === idx ? 'active' : ''}`}
              onClick={() => onSelectExerciseTab(idx)}
            >
              <span>{idx === 0 ? 'Ejercitación 1' : 'Ejercitación 2'}:</span>
              <span>{ex.title}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onGenerateNewRandom}
          style={{
            background: '#ffffff',
            border: '1px solid #93c5fd',
            color: '#1d4ed8',
            fontWeight: '600',
            fontSize: '0.78rem',
            padding: '4px 10px',
            borderRadius: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
          title="Generar otros 2 ejercicios al azar del banco"
        >
          🎲 Asignar Otros 2 Ejercicios al Azar
        </button>
      </div>

      {currentExercise && (
        <div className="exam-problem-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <strong>Ejercicio #{currentExercise.number}: {currentExercise.title}</strong>
            <span style={{ fontSize: '0.78rem', color: '#475569' }}>
              Categoría: {currentExercise.category}
            </span>
          </div>
          <p style={{ margin: '4px 0', lineHeight: 1.4 }}>
            {currentExercise.description}
          </p>
          <div style={{ marginTop: 4, fontSize: '0.78rem', fontWeight: 600, color: '#1d4ed8' }}>
            📌 Variables requeridas: {currentExercise.vars}
          </div>
        </div>
      )}
    </div>
  );
}
