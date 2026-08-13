import React from 'react';

export function ExamCard({ exercise, currentStep, onNextStep, onPrevStep, isLastStep }) {
  if (!exercise) return null;

  return (
    <div style={{
      backgroundColor: '#eff6ff',
      borderBottom: '2px solid #bfdbfe',
      padding: '12px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            background: '#1d4ed8',
            color: 'white',
            fontWeight: 800,
            fontSize: '0.88rem',
            padding: '4px 10px',
            borderRadius: 6
          }}>
            EJERCICIO {currentStep} DE 2
          </span>
          <h3 style={{ fontSize: '1.25rem', color: '#1e3a8a', margin: 0, fontWeight: 800 }}>
            {exercise.title}
          </h3>
        </div>

        {/* Navigation Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {currentStep > 1 && (
            <button
              onClick={onPrevStep}
              style={{
                background: '#ffffff',
                color: '#1d4ed8',
                border: '1px solid #93c5fd',
                fontWeight: 700,
                fontSize: '0.92rem',
                padding: '7px 16px',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'background 0.15s'
              }}
            >
              ⬅ Anterior Ejercicio
            </button>
          )}

          <button
            onClick={onNextStep}
            style={{
              background: isLastStep ? '#16a34a' : '#2563eb',
              color: 'white',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              padding: '8px 20px',
              borderRadius: 6,
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 0.15s'
            }}
          >
            {isLastStep ? 'Finalizar y Entregar Examen ✨' : 'Siguiente Ejercicio ➔'}
          </button>
        </div>
      </div>

      <p style={{ 
        margin: '2px 0', 
        fontSize: '1.08rem', 
        color: '#0f172a', 
        lineHeight: 1.5, 
        fontWeight: 500 
      }}>
        {exercise.description}
      </p>

      <div style={{
        fontSize: '0.92rem',
        fontWeight: 700,
        color: '#1d4ed8',
        background: '#dbeafe',
        padding: '5px 12px',
        borderRadius: 6,
        width: 'fit-content'
      }}>
        📌 Variables a declarar: {exercise.vars}
      </div>
    </div>
  );
}
