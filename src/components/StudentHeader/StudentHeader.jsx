import React from 'react';

export function StudentHeader({ 
  selectedGrade, 
  selectedStudent, 
  currentStep, // 1 or 2
  isCompleted,
  onLogout,
  onOpenAdmin
}) {
  return (
    <div className="student-header-bar">
      <div className="student-selector-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="pseint-icon-badge">PSeInt</span>
          <strong style={{ fontSize: '0.98rem' }}>Examen de Programación — Grado {selectedGrade}</strong>
        </div>

        <div style={{
          marginLeft: 16,
          background: 'rgba(255, 255, 255, 0.18)',
          padding: '3px 12px',
          borderRadius: 6,
          fontSize: '0.88rem',
          fontWeight: 700
        }}>
          Estudiante: <span style={{ color: '#fef08a' }}>{selectedStudent}</span> (Grado {selectedGrade})
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!isCompleted ? (
          <span style={{ 
            background: '#f59e0b', 
            color: '#0f172a', 
            fontWeight: 800, 
            padding: '4px 12px', 
            borderRadius: 12, 
            fontSize: '0.82rem' 
          }}>
            Paso {currentStep} de 2: Ejercicio #{currentStep}
          </span>
        ) : (
          <span style={{ 
            background: '#10b981', 
            color: '#ffffff', 
            fontWeight: 800, 
            padding: '4px 12px', 
            borderRadius: 12, 
            fontSize: '0.82rem' 
          }}>
            ✓ Examen Completado
          </span>
        )}

        <button
          onClick={onOpenAdmin}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            fontSize: '0.78rem',
            padding: '3px 10px',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 600
          }}
          title="Abrir Panel de Administración"
        >
          🛡️ Admin
        </button>

        <button
          onClick={onLogout}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            fontSize: '0.78rem',
            padding: '3px 10px',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 600
          }}
          title="Cerrar sesión y volver a la pantalla de selección"
        >
          🚪 Salir
        </button>
      </div>
    </div>
  );
}
